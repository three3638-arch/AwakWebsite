import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { readJSON, writeJSON } from '../services/storage';
import { Cycle, Objective } from '../types';

const router = Router();

const CYCLES_FILE = path.join(config.dataDir, 'cycles', 'cycles.json');
const OBJECTIVES_FILE = path.join(config.dataDir, 'objectives', 'objectives.json');

/** 管理员权限校验中间件 */
function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: '权限不足：仅管理员可执行此操作' });
    return;
  }
  next();
}

// ─── GET /api/cycles ─ 获取周期列表 ────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    const cycles = await readJSON<Cycle[]>(CYCLES_FILE);
    const { status } = req.query;

    let result = cycles;
    if (status && typeof status === 'string') {
      result = cycles.filter((c) => c.status === status);
    }

    res.json(result);
  } catch (error) {
    console.error('获取周期列表失败:', error);
    res.status(500).json({ error: '获取周期列表失败' });
  }
});

// ─── GET /api/cycles/:id ─ 获取单个周期 ────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cycles = await readJSON<Cycle[]>(CYCLES_FILE);
    const cycle = cycles.find((c) => c.id === req.params.id);

    if (!cycle) {
      res.status(404).json({ error: '周期不存在' });
      return;
    }

    res.json(cycle);
  } catch (error) {
    console.error('获取周期详情失败:', error);
    res.status(500).json({ error: '获取周期详情失败' });
  }
});

// ─── POST /api/cycles ─ 创建周期（仅管理员）───────
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      res.status(400).json({ error: '缺少必填字段：name, startDate, endDate' });
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      res.status(400).json({ error: '结束日期必须晚于开始日期' });
      return;
    }

    const cycles = await readJSON<Cycle[]>(CYCLES_FILE);

    const newCycle: Cycle = {
      id: uuidv4(),
      name,
      startDate,
      endDate,
      status: 'active',
      createdBy: req.user!.userId,
    };

    cycles.push(newCycle);
    await writeJSON(CYCLES_FILE, cycles);

    res.status(201).json(newCycle);
  } catch (error) {
    console.error('创建周期失败:', error);
    res.status(500).json({ error: '创建周期失败' });
  }
});

// ─── PUT /api/cycles/:id ─ 更新周期（仅管理员）────
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, status } = req.body;

    const cycles = await readJSON<Cycle[]>(CYCLES_FILE);
    const index = cycles.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ error: '周期不存在' });
      return;
    }

    // 如果同时更新了起止日期，校验日期逻辑
    const updatedStart = startDate || cycles[index].startDate;
    const updatedEnd = endDate || cycles[index].endDate;
    if (new Date(updatedEnd) <= new Date(updatedStart)) {
      res.status(400).json({ error: '结束日期必须晚于开始日期' });
      return;
    }

    // 如果状态值不合法
    if (status && status !== 'active' && status !== 'archived') {
      res.status(400).json({ error: '无效的状态值，仅支持 active 或 archived' });
      return;
    }

    cycles[index] = {
      ...cycles[index],
      ...(name !== undefined && { name }),
      ...(startDate !== undefined && { startDate }),
      ...(endDate !== undefined && { endDate }),
      ...(status !== undefined && { status }),
    };

    await writeJSON(CYCLES_FILE, cycles);

    res.json(cycles[index]);
  } catch (error) {
    console.error('更新周期失败:', error);
    res.status(500).json({ error: '更新周期失败' });
  }
});

// ─── DELETE /api/cycles/:id ─ 删除周期（仅管理员，仅空周期）──
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cycles = await readJSON<Cycle[]>(CYCLES_FILE);
    const index = cycles.findIndex((c) => c.id === id);

    if (index === -1) {
      res.status(404).json({ error: '周期不存在' });
      return;
    }

    // 检查是否有关联的 Objective
    const objectives = await readJSON<Objective[]>(OBJECTIVES_FILE);
    const hasObjectives = objectives.some((o) => o.cycleId === id);

    if (hasObjectives) {
      res.status(400).json({ error: '该周期下存在关联目标，无法删除' });
      return;
    }

    cycles.splice(index, 1);
    await writeJSON(CYCLES_FILE, cycles);

    res.json({ message: '周期已删除' });
  } catch (error) {
    console.error('删除周期失败:', error);
    res.status(500).json({ error: '删除周期失败' });
  }
});

export default router;

// 挂载方式：app.use('/api/cycles', authenticate, cycleRoutes);
