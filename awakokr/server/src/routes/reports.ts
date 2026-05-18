import { Router, Request, Response } from 'express';
import path from 'path';
import { config } from '../config';
import { readJSON } from '../services/storage';
import { Objective, KeyResult, Todo, Cycle } from '../types';

const router = Router();

// ─── 工具函数 ────────────────────────────────────

function getObjectivesFile(cycleId: string): string {
  return path.join(config.dataDir, 'objectives', cycleId, 'objectives.json');
}

function getKeyResultsFile(objectiveId: string): string {
  return path.join(config.dataDir, 'keyresults', objectiveId, 'current.json');
}

function getTodosFile(krId: string): string {
  return path.join(config.dataDir, 'todos', krId, 'todos.json');
}

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

// ─── 简报返回结构类型 ──────────────────────────────

interface RiskItem {
  type: 'overdue' | 'behind_schedule' | 'no_progress';
  description: string;
  relatedItem: { type: 'kr' | 'todo'; id: string; title: string };
}

interface TimelineEvent {
  date: string;
  event: string;
}

interface KrReportItem {
  id: string;
  title: string;
  weight: number;
  targetValue: number;
  currentValue: number;
  score: number | null;
  todoProgress: number;
  totalTodos: number;
  completedTodos: number;
  overdueTodos: number;
}

interface ObjectiveReport {
  objective: {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    completion: number;
  };
  summary: {
    totalKRs: number;
    completedKRs: number;
    averageScore: number | null;
    overallProgress: number;
  };
  keyResults: KrReportItem[];
  risks: RiskItem[];
  timeline: TimelineEvent[];
  generatedAt: string;
}

// ─── GET /api/reports/objective/:id ─ 生成 O 简报 ──────
router.get('/objective/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 查找 O
    const found = await findObjectiveById(id);
    if (!found) {
      res.status(404).json({ error: '目标不存在' });
      return;
    }

    const { objective, cycleId } = found;

    // 读取周期信息（用于判断 behind_schedule）
    const cyclesFile = path.join(config.dataDir, 'cycles', 'cycles.json');
    const cycles = await readJSON<Cycle[]>(cyclesFile);
    const cycle = cycles.find((c) => c.id === cycleId);

    // 读取 KR 列表
    const krs = await readJSON<KeyResult[]>(getKeyResultsFile(objective.id));

    // 风险和时间线收集
    const risks: RiskItem[] = [];
    const timeline: TimelineEvent[] = [];

    // 今天的 ISO 日期字符串（只取日期部分）
    const today = new Date().toISOString().slice(0, 10);

    // 周期已过时间比例（0~1）
    let cycleElapsedRatio = 1;
    if (cycle) {
      const start = new Date(cycle.startDate).getTime();
      const end = new Date(cycle.endDate).getTime();
      const now = Date.now();
      if (now <= start) cycleElapsedRatio = 0;
      else if (now >= end) cycleElapsedRatio = 1;
      else cycleElapsedRatio = (now - start) / (end - start);
    }

    // KR 进度百分比（0~100）
    function krProgress(kr: KeyResult): number {
      if (kr.targetValue === 0) return 0;
      return Math.min(100, Math.round((kr.currentValue / kr.targetValue) * 100));
    }

    // 处理每个 KR
    const krReports: KrReportItem[] = [];

    for (const kr of krs) {
      const todos = await readJSON<Todo[]>(getTodosFile(kr.id));

      const totalTodos = todos.length;
      const completedTodos = todos.filter((t) => t.status === 'completed').length;
      const overdueTodos = todos.filter((t) => t.plannedEnd.slice(0, 10) < today && t.status !== 'completed').length;

      const todoProgress = totalTodos > 0
        ? Math.round(todos.reduce((sum, t) => sum + t.progress, 0) / totalTodos)
        : 0;

      const progress = krProgress(kr);

      krReports.push({
        id: kr.id,
        title: kr.title,
        weight: kr.weight,
        targetValue: kr.targetValue,
        currentValue: kr.currentValue,
        score: kr.score,
        todoProgress,
        totalTodos,
        completedTodos,
        overdueTodos,
      });

      // ── 风险判断 ──

      // overdue: Todo 的 plannedEnd < 今天 且 status != completed
      for (const todo of todos) {
        if (todo.plannedEnd.slice(0, 10) < today && todo.status !== 'completed') {
          risks.push({
            type: 'overdue',
            description: `待办「${todo.title}」已逾期（计划结束：${todo.plannedEnd.slice(0, 10)}）`,
            relatedItem: { type: 'todo', id: todo.id, title: todo.title },
          });
        }
      }

      // behind_schedule: KR 的进度 < 预期进度
      const expectedProgress = Math.round(cycleElapsedRatio * 100);
      if (progress < expectedProgress && kr.score === null) {
        risks.push({
          type: 'behind_schedule',
          description: `KR「${kr.title}」进度落后（当前 ${progress}%，预期 ${expectedProgress}%）`,
          relatedItem: { type: 'kr', id: kr.id, title: kr.title },
        });
      }

      // no_progress: KR 无 Todo 且 currentValue=0
      if (totalTodos === 0 && kr.currentValue === 0 && kr.score === null) {
        risks.push({
          type: 'no_progress',
          description: `KR「${kr.title}」无待办事项且无进展`,
          relatedItem: { type: 'kr', id: kr.id, title: kr.title },
        });
      }

      // ── 时间线事件 ──

      // KR 完成评分
      if (kr.score !== null) {
        timeline.push({
          date: kr.updatedAt.slice(0, 10),
          event: `KR「${kr.title}」完成评分：${kr.score}`,
        });
      }

      // Todo 逾期
      for (const todo of todos) {
        if (todo.plannedEnd.slice(0, 10) < today && todo.status !== 'completed') {
          timeline.push({
            date: todo.plannedEnd.slice(0, 10),
            event: `Todo「${todo.title}」逾期`,
          });
        }
        // Todo 完成
        if (todo.status === 'completed' && todo.actualEnd) {
          timeline.push({
            date: todo.actualEnd.slice(0, 10),
            event: `Todo「${todo.title}」完成`,
          });
        }
      }
    }

    // 时间线按日期排序
    timeline.sort((a, b) => a.date.localeCompare(b.date));

    // ── 汇总统计 ──
    const totalKRs = krs.length;
    const completedKRs = krs.filter((kr) => kr.score !== null).length;

    const scoredKRs = krs.filter((kr) => kr.score !== null);
    const averageScore = scoredKRs.length > 0
      ? Math.round((scoredKRs.reduce((sum, kr) => sum + (kr.score || 0), 0) / scoredKRs.length) * 100) / 100
      : null;

    // 整体完成率：加权平均
    let overallProgress = 0;
    if (totalKRs > 0) {
      let totalWeight = 0;
      let weightedProgress = 0;
      for (const kr of krs) {
        weightedProgress += krProgress(kr) * kr.weight;
        totalWeight += kr.weight;
      }
      overallProgress = totalWeight > 0 ? Math.round(weightedProgress / totalWeight) : 0;
    }

    // O 完成度（加权得分）
    let completion = 0;
    if (totalKRs > 0) {
      let totalWeight = 0;
      let weightedScore = 0;
      for (const kr of krs) {
        if (kr.score !== null) {
          weightedScore += kr.score * kr.weight;
        } else {
          // 用进度做近似
          weightedScore += (krProgress(kr) / 100) * kr.weight;
        }
        totalWeight += kr.weight;
      }
      completion = totalWeight > 0 ? Math.round((weightedScore / totalWeight) * 100) / 100 : 0;
    }

    const report: ObjectiveReport = {
      objective: {
        id: objective.id,
        title: objective.title,
        description: objective.description,
        createdBy: objective.createdBy,
        completion,
      },
      summary: {
        totalKRs,
        completedKRs,
        averageScore,
        overallProgress,
      },
      keyResults: krReports,
      risks,
      timeline,
      generatedAt: new Date().toISOString(),
    };

    res.json(report);
  } catch (error) {
    console.error('生成简报失败:', error);
    res.status(500).json({ error: '生成简报失败' });
  }
});

export default router;
