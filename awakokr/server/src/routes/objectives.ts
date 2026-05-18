import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { Objective, KeyResult, Todo, Cycle } from '../types';

const router = Router();

// ─── 工具函数 ────────────────────────────────────

/** 获取指定周期的 objectives 文件路径 */
function getObjectivesFile(cycleId: string): string {
  return path.join(config.dataDir, 'objectives', cycleId, 'objectives.json');
}

/** 获取指定 O 下的 KR 文件路径 */
function getKeyResultsFile(objectiveId: string): string {
  return path.join(config.dataDir, 'keyresults', objectiveId, 'current.json');
}

/** 获取指定 KR 下的 Todo 文件路径 */
function getTodosFile(krId: string): string {
  return path.join(config.dataDir, 'todos', krId, 'todos.json');
}

/** 计算单个 O 的完成度（0~1） */
async function calculateCompletion(objectiveId: string): Promise<number> {
  try {
    const krs = await readJSON<KeyResult[]>(getKeyResultsFile(objectiveId));
    if (!krs || krs.length === 0) return 0;

    let totalWeight = 0;
    let weightedSum = 0;

    for (const kr of krs) {
      if (kr.score !== null) {
        weightedSum += kr.score * kr.weight;
        totalWeight += kr.weight;
      } else {
        // KR 没有 score，使用 Todo 进度汇总
        const todos = await readJSON<Todo[]>(getTodosFile(kr.id));
        if (todos && todos.length > 0) {
          const avgProgress = todos.reduce((sum, t) => sum + t.progress, 0) / todos.length;
          // progress 是 0~100，转为 0~1 作为 score 等价
          weightedSum += (avgProgress / 100) * kr.weight;
        }
        totalWeight += kr.weight;
      }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  } catch {
    return 0;
  }
}

/** 读取所有周期目录下的 objectives，合并返回 */
async function readAllObjectives(): Promise<Objective[]> {
  const cyclesFile = path.join(config.dataDir, 'cycles', 'cycles.json');
  const cycles = await readJSON<Cycle[]>(cyclesFile);

  let allObjectives: Objective[] = [];
  for (const cycle of cycles) {
    const objectives = await readJSON<Objective[]>(getObjectivesFile(cycle.id));
    allObjectives = allObjectives.concat(objectives);
  }
  return allObjectives;
}

/** 根据 id 在所有周期目录中查找 O */
async function findObjectiveById(id: string): Promise<{ objective: Objective; cycleId: string } | null> {
  const cyclesFile = path.join(config.dataDir, 'cycles', 'cycles.json');
  const cycles = await readJSON<Cycle[]>(cyclesFile);

  for (const cycle of cycles) {
    const objectives = await readJSON<Objective[]>(getObjectivesFile(cycle.id));
    const found = objectives.find((o) => o.id === id);
    if (found) return { objective: found, cycleId: cycle.id };
  }
  return null;
}

/** 带完成度的 O 返回结构 */
interface ObjectiveWithCompletion extends Objective {
  completion: number;
}

// ─── GET /api/objectives ─ 获取目标列表 ──────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const { cycleId, createdBy } = req.query;

    let objectives: Objective[];

    if (cycleId && typeof cycleId === 'string') {
      objectives = await readJSON<Objective[]>(getObjectivesFile(cycleId));
    } else {
      objectives = await readAllObjectives();
    }

    if (createdBy && typeof createdBy === 'string') {
      objectives = objectives.filter((o) => o.createdBy === createdBy);
    }

    // 为每个 O 计算完成度
    const result: ObjectiveWithCompletion[] = await Promise.all(
      objectives.map(async (o) => ({
        ...o,
        completion: await calculateCompletion(o.id),
      })),
    );

    res.json(result);
  } catch (error) {
    console.error('获取目标列表失败:', error);
    res.status(500).json({ error: '获取目标列表失败' });
  }
});

// ─── GET /api/objectives/:id ─ 获取单个目标 ──────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const found = await findObjectiveById(req.params.id);
    if (!found) {
      res.status(404).json({ error: '目标不存在' });
      return;
    }

    const completion = await calculateCompletion(found.objective.id);

    const result: ObjectiveWithCompletion = {
      ...found.objective,
      completion,
    };

    res.json(result);
  } catch (error) {
    console.error('获取目标详情失败:', error);
    res.status(500).json({ error: '获取目标详情失败' });
  }
});

// ─── POST /api/objectives ─ 创建目标 ─────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cycleId, title, description, parentObjectiveId } = req.body;

    if (!cycleId || !title) {
      res.status(400).json({ error: '缺少必填字段：cycleId, title' });
      return;
    }

    // 校验 parentObjectiveId 存在性
    if (parentObjectiveId) {
      const parentFound = await findObjectiveById(parentObjectiveId);
      if (!parentFound) {
        res.status(400).json({ error: '父级目标不存在' });
        return;
      }
      // 父级 O 必须在同一周期
      if (parentFound.objective.cycleId !== cycleId) {
        res.status(400).json({ error: '父级目标必须属于同一周期' });
        return;
      }
    }

    const now = new Date().toISOString();
    const newObjective: Objective = {
      id: uuidv4(),
      cycleId,
      title,
      description: description || '',
      parentObjectiveId: parentObjectiveId || null,
      createdBy: req.user!.userId,
      createdAt: now,
      updatedAt: now,
    };

    const objectives = await readJSON<Objective[]>(getObjectivesFile(cycleId));
    objectives.push(newObjective);
    await writeJSON(getObjectivesFile(cycleId), objectives);

    const result: ObjectiveWithCompletion = {
      ...newObjective,
      completion: 0,
    };

    res.status(201).json(result);
  } catch (error) {
    console.error('创建目标失败:', error);
    res.status(500).json({ error: '创建目标失败' });
  }
});

// ─── PUT /api/objectives/:id ─ 更新目标（仅创建者或管理员）──
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const found = await findObjectiveById(id);

    if (!found) {
      res.status(404).json({ error: '目标不存在' });
      return;
    }

    // 将资源对象挂载到 res.locals 供权限中间件使用
    res.locals.resource = found.objective;

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== found.objective.createdBy) {
      res.status(403).json({ error: '权限不足：仅目标创建者或管理员可编辑' });
      return;
    }

    const { title, description, parentObjectiveId } = req.body;
    const objectives = await readJSON<Objective[]>(getObjectivesFile(found.cycleId));
    const index = objectives.findIndex((o) => o.id === id);

    if (index === -1) {
      res.status(404).json({ error: '目标不存在' });
      return;
    }

    // 校验 parentObjectiveId 存在性
    if (parentObjectiveId !== undefined && parentObjectiveId !== null) {
      const parentFound = await findObjectiveById(parentObjectiveId);
      if (!parentFound) {
        res.status(400).json({ error: '父级目标不存在' });
        return;
      }
      if (parentFound.objective.cycleId !== found.cycleId) {
        res.status(400).json({ error: '父级目标必须属于同一周期' });
        return;
      }
      // 不能将自己设为自己的子O
      if (parentObjectiveId === id) {
        res.status(400).json({ error: '不能将自己设为父级目标' });
        return;
      }
    }

    objectives[index] = {
      ...objectives[index],
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(parentObjectiveId !== undefined && { parentObjectiveId: parentObjectiveId || null }),
      updatedAt: new Date().toISOString(),
    };

    await writeJSON(getObjectivesFile(found.cycleId), objectives);

    const completion = await calculateCompletion(id);
    const result: ObjectiveWithCompletion = {
      ...objectives[index],
      completion,
    };

    res.json(result);
  } catch (error) {
    console.error('更新目标失败:', error);
    res.status(500).json({ error: '更新目标失败' });
  }
});

// ─── DELETE /api/objectives/:id ─ 删除目标（仅创建者或管理员）──
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const found = await findObjectiveById(id);

    if (!found) {
      res.status(404).json({ error: '目标不存在' });
      return;
    }

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== found.objective.createdBy) {
      res.status(403).json({ error: '权限不足：仅目标创建者或管理员可删除' });
      return;
    }

    // 校验：有子 O 关联的不能删除
    const allObjectives = await readJSON<Objective[]>(getObjectivesFile(found.cycleId));
    const hasChildren = allObjectives.some((o) => o.parentObjectiveId === id);
    if (hasChildren) {
      res.status(400).json({ error: '该目标下存在子目标，无法删除' });
      return;
    }

    // 校验：有 KR 的不能删除
    const krFile = getKeyResultsFile(id);
    if (fs.existsSync(krFile)) {
      const krs = await readJSON<KeyResult[]>(krFile);
      if (krs && krs.length > 0) {
        res.status(400).json({ error: '该目标下存在关键结果，无法删除' });
        return;
      }
    }

    const objectives = allObjectives.filter((o) => o.id !== id);
    await writeJSON(getObjectivesFile(found.cycleId), objectives);

    res.json({ message: '目标已删除' });
  } catch (error) {
    console.error('删除目标失败:', error);
    res.status(500).json({ error: '删除目标失败' });
  }
});

export default router;

// 挂载方式：app.use('/api/objectives', authenticate, objectiveRoutes);
