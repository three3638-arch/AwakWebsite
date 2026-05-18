export interface User {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
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

/** JWT Payload 结构 */
export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

/** 扩展 Express Request 类型，附加认证用户信息 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
