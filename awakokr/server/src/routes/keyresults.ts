import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { KeyResult, KeyResultSnapshot, Todo } from '../types';

const router = Router();

// ─── 工具函数 ────────────────────────────────────

/** 获取指定 O 下的 KR 当前数据文件路径 */
function getCurrentFile(objectiveId: string): string {
  return path.join(config.dataDir, 'keyresults', objectiveId, 'current.json');
}

/** 获取指定 O 下的 KR 历史文件路径 */
function getHistoryFile(objectiveId: string): string {
  return path.join(config.dataDir, 'keyresults', objectiveId, 'history.json');
}

/** 获取指定 KR 下的 Todo 文件路径 */
function getTodosFile(krId: string): string {
  return path.join(config.dataDir, 'todos', krId, 'todos.json');
}

/** 在 current.json 数组中查找 KR */
function findKrById(krs: KeyResult[], id: string): KeyResult | undefined {
  return krs.find((kr) => kr.id === id);
}

// ─── GET /api/keyresults ─ 获取 KR 列表（按 objectiveId 筛选）──
router.get('/', async (req: Request, res: Response) => {
  try {
    const { objectiveId } = req.query;

    if (!objectiveId || typeof objectiveId !== 'string') {
      res.status(400).json({ error: '缺少必填查询参数：objectiveId' });
      return;
    }

    const krs = await readJSON<KeyResult[]>(getCurrentFile(objectiveId));
    res.json(krs);
  } catch (error) {
    console.error('获取KR列表失败:', error);
    res.status(500).json({ error: '获取KR列表失败' });
  }
});

// ─── GET /api/keyresults/:id ─ 获取单个 KR ──────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 需要遍历所有 objectiveId 目录来查找 KR
    const keyresultsDir = path.join(config.dataDir, 'keyresults');
    if (!fs.existsSync(keyresultsDir)) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    const objectiveDirs = fs.readdirSync(keyresultsDir);
    for (const objId of objectiveDirs) {
      const currentPath = getCurrentFile(objId);
      if (!fs.existsSync(currentPath)) continue;

      const krs = await readJSON<KeyResult[]>(currentPath);
      const kr = findKrById(krs, id);
      if (kr) {
        res.json(kr);
        return;
      }
    }

    res.status(404).json({ error: 'KR 不存在' });
  } catch (error) {
    console.error('获取KR详情失败:', error);
    res.status(500).json({ error: '获取KR详情失败' });
  }
});

// ─── POST /api/keyresults ─ 创建 KR ─────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { objectiveId, title, description, weight, targetValue } = req.body;

    if (!objectiveId || !title || weight === undefined || targetValue === undefined) {
      res.status(400).json({ error: '缺少必填字段：objectiveId, title, weight, targetValue' });
      return;
    }

    const now = new Date().toISOString();
    const newKr: KeyResult = {
      id: uuidv4(),
      objectiveId,
      title,
      description: description || '',
      weight: Number(weight),
      targetValue: Number(targetValue),
      currentValue: 0,
      score: null,
      version: 1,
      createdBy: req.user!.userId,
      createdAt: now,
      updatedAt: now,
    };

    const krs = await readJSON<KeyResult[]>(getCurrentFile(objectiveId));
    krs.push(newKr);
    await writeJSON(getCurrentFile(objectiveId), krs);

    // 计算权重总和提示
    const totalWeight = krs.reduce((sum, kr) => sum + kr.weight, 0);

    res.status(201).json({ ...newKr, _weightWarning: totalWeight !== 100 ? `当前O下KR权重总和为 ${totalWeight}%，建议调整为100%` : undefined });
  } catch (error) {
    console.error('创建KR失败:', error);
    res.status(500).json({ error: '创建KR失败' });
  }
});

// ─── PUT /api/keyresults/:id ─ 更新 KR（自动保存历史版本）──
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 查找 KR 所在的 objectiveId
    const keyresultsDir = path.join(config.dataDir, 'keyresults');
    if (!fs.existsSync(keyresultsDir)) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    const objectiveDirs = fs.readdirSync(keyresultsDir);
    let foundObjId: string | null = null;
    let foundKr: KeyResult | undefined;

    for (const objId of objectiveDirs) {
      const currentPath = getCurrentFile(objId);
      if (!fs.existsSync(currentPath)) continue;

      const krs = await readJSON<KeyResult[]>(currentPath);
      const kr = findKrById(krs, id);
      if (kr) {
        foundObjId = objId;
        foundKr = kr;
        break;
      }
    }

    if (!foundObjId || !foundKr) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== foundKr.createdBy) {
      res.status(403).json({ error: '权限不足：仅KR创建者或管理员可编辑' });
      return;
    }

    // 1. 保存历史快照（修改前的数据）
    const { changeNote, ...updateFields } = req.body;
    const snapshot: KeyResultSnapshot = {
      version: foundKr.version,
      data: { ...foundKr },
      modifiedAt: new Date().toISOString(),
      modifiedBy: user.userId,
      changeNote: changeNote || '',
    };

    const historyPath = getHistoryFile(foundObjId);
    const history = await readJSON<KeyResultSnapshot[]>(historyPath);
    history.push(snapshot);
    await writeJSON(historyPath, history);

    // 2. 更新 KR 字段
    const krs = await readJSON<KeyResult[]>(getCurrentFile(foundObjId));
    const index = krs.findIndex((kr) => kr.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    krs[index] = {
      ...krs[index],
      ...(updateFields.title !== undefined && { title: updateFields.title }),
      ...(updateFields.description !== undefined && { description: updateFields.description }),
      ...(updateFields.weight !== undefined && { weight: Number(updateFields.weight) }),
      ...(updateFields.targetValue !== undefined && { targetValue: Number(updateFields.targetValue) }),
      ...(updateFields.currentValue !== undefined && { currentValue: Number(updateFields.currentValue) }),
      ...(updateFields.score !== undefined && { score: updateFields.score === null ? null : Number(updateFields.score) }),
      version: krs[index].version + 1,
      updatedAt: new Date().toISOString(),
    };

    await writeJSON(getCurrentFile(foundObjId), krs);

    // 计算权重总和提示
    const totalWeight = krs.reduce((sum, kr) => sum + kr.weight, 0);

    res.json({ ...krs[index], _weightWarning: totalWeight !== 100 ? `当前O下KR权重总和为 ${totalWeight}%，建议调整为100%` : undefined });
  } catch (error) {
    console.error('更新KR失败:', error);
    res.status(500).json({ error: '更新KR失败' });
  }
});

// ─── DELETE /api/keyresults/:id ─ 删除 KR（仅创建者或管理员）──
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 查找 KR 所在的 objectiveId
    const keyresultsDir = path.join(config.dataDir, 'keyresults');
    if (!fs.existsSync(keyresultsDir)) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    const objectiveDirs = fs.readdirSync(keyresultsDir);
    let foundObjId: string | null = null;
    let foundKr: KeyResult | undefined;

    for (const objId of objectiveDirs) {
      const currentPath = getCurrentFile(objId);
      if (!fs.existsSync(currentPath)) continue;

      const krs = await readJSON<KeyResult[]>(currentPath);
      const kr = findKrById(krs, id);
      if (kr) {
        foundObjId = objId;
        foundKr = kr;
        break;
      }
    }

    if (!foundObjId || !foundKr) {
      res.status(404).json({ error: 'KR 不存在' });
      return;
    }

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== foundKr.createdBy) {
      res.status(403).json({ error: '权限不足：仅KR创建者或管理员可删除' });
      return;
    }

    // 校验：有 Todo 的 KR 不能删除
    const todosPath = getTodosFile(id);
    if (fs.existsSync(todosPath)) {
      const todos = await readJSON<Todo[]>(todosPath);
      if (todos && todos.length > 0) {
        res.status(400).json({ error: '该KR下存在待办事项，无法删除' });
        return;
      }
    }

    const krs = await readJSON<KeyResult[]>(getCurrentFile(foundObjId));
    const filtered = krs.filter((kr) => kr.id !== id);
    await writeJSON(getCurrentFile(foundObjId), filtered);

    res.json({ message: 'KR 已删除' });
  } catch (error) {
    console.error('删除KR失败:', error);
    res.status(500).json({ error: '删除KR失败' });
  }
});

// ─── GET /api/keyresults/:id/history ─ 获取 KR 历史版本 ──────
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 查找 KR 所在的 objectiveId
    const keyresultsDir = path.join(config.dataDir, 'keyresults');
    if (!fs.existsSync(keyresultsDir)) {
      res.json([]);
      return;
    }

    const objectiveDirs = fs.readdirSync(keyresultsDir);
    let foundObjId: string | null = null;

    for (const objId of objectiveDirs) {
      const currentPath = getCurrentFile(objId);
      if (!fs.existsSync(currentPath)) continue;

      const krs = await readJSON<KeyResult[]>(currentPath);
      if (findKrById(krs, id)) {
        foundObjId = objId;
        break;
      }
    }

    if (!foundObjId) {
      res.json([]);
      return;
    }

    const historyPath = getHistoryFile(foundObjId);
    const history = await readJSON<KeyResultSnapshot[]>(historyPath);

    // 只返回该 KR 的历史
    const krHistory = history.filter((snap) => snap.data.id === id);

    res.json(krHistory);
  } catch (error) {
    console.error('获取KR历史失败:', error);
    res.status(500).json({ error: '获取KR历史失败' });
  }
});

export default router;

// 挂载方式：app.use('/api/keyresults', authenticate, keyResultRoutes);
