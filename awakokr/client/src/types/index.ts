export interface User {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'member';
  team: string;
  createdAt: string;
}

export interface Cycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'archived';
  createdBy: string;
}

export interface Objective {
  id: string;
  cycleId: string;
  title: string;
  description: string;
  parentObjectiveId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  weight: number;
  targetValue: number;
  currentValue: number;
  score: number | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface KeyResultSnapshot {
  version: number;
  data: KeyResult;
  modifiedAt: string;
  modifiedBy: string;
  changeNote: string;
}

export interface ObjectiveWithCompletion extends Objective {
  completion: number;
}

export interface ObjectiveTreeNode {
  objective: ObjectiveWithCompletion;
  children: ObjectiveTreeNode[];
}

export interface Todo {
  id: string;
  krId: string;
  title: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  plannedStart: string;
  plannedEnd: string;
  actualEnd: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── 简报相关类型 ───────────────────────────────

export interface ReportRisk {
  type: 'overdue' | 'behind_schedule' | 'no_progress';
  description: string;
  relatedItem: { type: 'kr' | 'todo'; id: string; title: string };
}

export interface ReportTimelineEvent {
  date: string;
  event: string;
}

export interface ReportKrItem {
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

export interface ObjectiveReport {
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
  keyResults: ReportKrItem[];
  risks: ReportRisk[];
  timeline: ReportTimelineEvent[];
  generatedAt: string;
}
