import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { Todo, KeyResult, Objective } from '../types';

const router = Router();

// ─── 工具函数 ────────────────────────────────────

/** 获取指定 KR 下的 Todo 文件路径 */
function getTodosFile(krId: string): string {
  return path.join(config.dataDir, 'todos', krId, 'todos.json');
}

/** 获取指定 O 下的 KR 当前数据文件路径 */
function getCurrentFile(objectiveId: string): string {
  return path.join(config.dataDir, 'keyresults', objectiveId, 'current.json');
}

/** 遍历所有 objectiveId 目录查找 KR */
async function findKrById(krId: string): Promise<{ kr: KeyResult; objectiveId: string } | null> {
  const keyresultsDir = path.join(config.dataDir, 'keyresults');
  if (!fs.existsSync(keyresultsDir)) return null;

  const objectiveDirs = fs.readdirSync(keyresultsDir);
  for (const objId of objectiveDirs) {
    const currentPath = getCurrentFile(objId);
    if (!fs.existsSync(currentPath)) continue;

    const krs = await readJSON<KeyResult[]>(currentPath);
    const kr = krs.find((k) => k.id === krId);
    if (kr) return { kr, objectiveId: objId };
  }
  return null;
}

/** KR 进度汇总：读取某 KR 下所有 Todo，计算平均进度，写入 KR 的 currentValue */
async function recalculateKrProgress(krId: string): Promise<void> {
  const found = await findKrById(krId);
  if (!found) return;

  const todos = await readJSON<Todo[]>(getTodosFile(krId));
  let avgProgress = 0;
  if (todos && todos.length > 0) {
    avgProgress = Math.round(todos.reduce((sum, t) => sum + t.progress, 0) / todos.length);
  }

  // 读取 KR 列表并更新 currentValue
  const krs = await readJSON<KeyResult[]>(getCurrentFile(found.objectiveId));
  const index = krs.findIndex((k) => k.id === krId);
  if (index !== -1) {
    krs[index].currentValue = avgProgress;
    krs[index].updatedAt = new Date().toISOString();
    await writeJSON(getCurrentFile(found.objectiveId), krs);
  }
}

// ─── GET /api/todos ─ 获取 Todo 列表（按 krId 筛选，必传）──
router.get('/', async (req: Request, res: Response) => {
  try {
    const { krId } = req.query;

    if (!krId || typeof krId !== 'string') {
      res.status(400).json({ error: '缺少必填查询参数：krId' });
      return;
    }

    const todos = await readJSON<Todo[]>(getTodosFile(krId));
    res.json(todos);
  } catch (error) {
    console.error('获取Todo列表失败:', error);
    res.status(500).json({ error: '获取Todo列表失败' });
  }
});

// ─── GET /api/todos/by-cycle/:cycleId ─ 获取周期下所有 Todo ──────
router.get('/by-cycle/:cycleId', async (req: Request, res: Response) => {
  try {
    const { cycleId } = req.params;

    // 读取周期下的所有 Objective
    const objectivesFile = path.join(config.dataDir, 'objectives', cycleId, 'objectives.json');
    const objectives = await readJSON<Objective[]>(objectivesFile);

    const allTodos: Todo[] = [];

    for (const obj of objectives) {
      // 读取每个 O 下的所有 KR
      const krFile = getCurrentFile(obj.id);
      if (!fs.existsSync(krFile)) continue;
      const krs = await readJSON<KeyResult[]>(krFile);

      for (const kr of krs) {
        const todos = await readJSON<Todo[]>(getTodosFile(kr.id));
        allTodos.push(...todos);
      }
    }

    res.json(allTodos);
  } catch (error) {
    console.error('获取周期Todo列表失败:', error);
    res.status(500).json({ error: '获取周期Todo列表失败' });
  }
});

// ─── GET /api/todos/by-user/:userId ─ 获取用户创建的所有 Todo ──────
router.get('/by-user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const todosDir = path.join(config.dataDir, 'todos');
    if (!fs.existsSync(todosDir)) {
      res.json([]);
      return;
    }

    const krDirs = fs.readdirSync(todosDir);
    const allTodos: Todo[] = [];

    for (const krId of krDirs) {
      const todosFile = getTodosFile(krId);
      if (!fs.existsSync(todosFile)) continue;
      const todos = await readJSON<Todo[]>(todosFile);
      allTodos.push(...todos.filter((t) => t.createdBy === userId));
    }

    res.json(allTodos);
  } catch (error) {
    console.error('获取用户Todo列表失败:', error);
    res.status(500).json({ error: '获取用户Todo列表失败' });
  }
});

// ─── GET /api/todos/:id ─ 获取单个 Todo ──────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 遍历所有 krId 目录查找 Todo
    const todosDir = path.join(config.dataDir, 'todos');
    if (!fs.existsSync(todosDir)) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }

    const krDirs = fs.readdirSync(todosDir);
    for (const krId of krDirs) {
      const todosFile = getTodosFile(krId);
      if (!fs.existsSync(todosFile)) continue;
      const todos = await readJSON<Todo[]>(todosFile);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        res.json(todo);
        return;
      }
    }

    res.status(404).json({ error: 'Todo 不存在' });
  } catch (error) {
    console.error('获取Todo详情失败:', error);
    res.status(500).json({ error: '获取Todo详情失败' });
  }
});

// ─── POST /api/todos ─ 创建 Todo ─────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    const { krId, title, description, plannedStart, plannedEnd } = req.body;

    if (!krId || !title || !plannedStart || !plannedEnd) {
      res.status(400).json({ error: '缺少必填字段：krId, title, plannedStart, plannedEnd' });
      return;
    }

    // 校验 KR 存在
    const found = await findKrById(krId);
    if (!found) {
      res.status(400).json({ error: 'KR 不存在' });
      return;
    }

    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: uuidv4(),
      krId,
      title,
      description: description || '',
      status: 'not_started',
      progress: 0,
      plannedStart,
      plannedEnd,
      actualEnd: null,
      createdBy: req.user!.userId,
      createdAt: now,
      updatedAt: now,
    };

    const todos = await readJSON<Todo[]>(getTodosFile(krId));
    todos.push(newTodo);
    await writeJSON(getTodosFile(krId), todos);

    // 触发 KR 进度汇总
    await recalculateKrProgress(krId);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('创建Todo失败:', error);
    res.status(500).json({ error: '创建Todo失败' });
  }
});

// ─── PUT /api/todos/:id ─ 更新 Todo ─────────────
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 遍历查找 Todo
    const todosDir = path.join(config.dataDir, 'todos');
    if (!fs.existsSync(todosDir)) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }

    const krDirs = fs.readdirSync(todosDir);
    let foundKrId: string | null = null;
    let foundTodo: Todo | undefined;

    for (const krId of krDirs) {
      const todosFile = getTodosFile(krId);
      if (!fs.existsSync(todosFile)) continue;
      const todos = await readJSON<Todo[]>(todosFile);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        foundKrId = krId;
        foundTodo = todo;
        break;
      }
    }

    if (!foundKrId || !foundTodo) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== foundTodo.createdBy) {
      res.status(403).json({ error: '权限不足：仅创建者或管理员可编辑' });
      return;
    }

    const { title, description, status, progress, plannedStart, plannedEnd, actualEnd } = req.body;

    // 当 status 改为 'completed' 时自动设置 progress=100 和 actualEnd
    const updatedStatus = status !== undefined ? status : foundTodo.status;
    const shouldAutoComplete = updatedStatus === 'completed' && foundTodo.status !== 'completed';

    const now = new Date().toISOString();

    const updatedTodo: Todo = {
      ...foundTodo,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status: updatedStatus }),
      ...(progress !== undefined && { progress: Number(progress) }),
      ...(plannedStart !== undefined && { plannedStart }),
      ...(plannedEnd !== undefined && { plannedEnd }),
      ...(actualEnd !== undefined && { actualEnd }),
      updatedAt: now,
    };

    // 自动完成逻辑
    if (shouldAutoComplete) {
      updatedTodo.progress = 100;
      updatedTodo.actualEnd = now;
    }

    // 写入文件
    const todos = await readJSON<Todo[]>(getTodosFile(foundKrId));
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }
    todos[index] = updatedTodo;
    await writeJSON(getTodosFile(foundKrId), todos);

    // 触发 KR 进度汇总
    await recalculateKrProgress(foundKrId);

    res.json(updatedTodo);
  } catch (error) {
    console.error('更新Todo失败:', error);
    res.status(500).json({ error: '更新Todo失败' });
  }
});

// ─── DELETE /api/todos/:id ─ 删除 Todo ─────────────
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 遍历查找 Todo
    const todosDir = path.join(config.dataDir, 'todos');
    if (!fs.existsSync(todosDir)) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }

    const krDirs = fs.readdirSync(todosDir);
    let foundKrId: string | null = null;
    let foundTodo: Todo | undefined;

    for (const krId of krDirs) {
      const todosFile = getTodosFile(krId);
      if (!fs.existsSync(todosFile)) continue;
      const todos = await readJSON<Todo[]>(todosFile);
      const todo = todos.find((t) => t.id === id);
      if (todo) {
        foundKrId = krId;
        foundTodo = todo;
        break;
      }
    }

    if (!foundKrId || !foundTodo) {
      res.status(404).json({ error: 'Todo 不存在' });
      return;
    }

    // 权限校验：创建者或管理员
    const user = req.user!;
    if (user.role !== 'admin' && user.userId !== foundTodo.createdBy) {
      res.status(403).json({ error: '权限不足：仅创建者或管理员可删除' });
      return;
    }

    const todos = await readJSON<Todo[]>(getTodosFile(foundKrId));
    const filtered = todos.filter((t) => t.id !== id);
    await writeJSON(getTodosFile(foundKrId), filtered);

    // 触发 KR 进度汇总
    await recalculateKrProgress(foundKrId);

    res.json({ message: 'Todo 已删除' });
  } catch (error) {
    console.error('删除Todo失败:', error);
    res.status(500).json({ error: '删除Todo失败' });
  }
});

export default router;

// 挂载方式：app.use('/api/todos', authenticate, todoRoutes);
