import { create } from 'zustand';
import { api } from '../services/api';
import { Objective, ObjectiveWithCompletion, ObjectiveTreeNode } from '../types';

interface ObjectiveState {
  objectives: ObjectiveWithCompletion[];
  loading: boolean;
  fetchObjectives: (cycleId?: string) => Promise<void>;
  createObjective: (data: {
    cycleId: string;
    title: string;
    description: string;
    parentObjectiveId?: string;
  }) => Promise<void>;
  updateObjective: (id: string, data: Partial<Objective>) => Promise<void>;
  deleteObjective: (id: string) => Promise<void>;
  getObjectiveTree: (cycleId: string) => ObjectiveTreeNode[];
}

export const useObjectiveStore = create<ObjectiveState>((set, get) => ({
  objectives: [],
  loading: false,

  fetchObjectives: async (cycleId?: string) => {
    set({ loading: true });
    try {
      const query = cycleId ? `?cycleId=${cycleId}` : '';
      const objectives = await api.get<ObjectiveWithCompletion[]>(`/api/objectives${query}`);
      set({ objectives });
    } catch (error) {
      console.error('获取目标列表失败:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createObjective: async (data) => {
    const objective = await api.post<ObjectiveWithCompletion>('/api/objectives', data);
    set((state) => ({ objectives: [...state.objectives, objective] }));
  },

  updateObjective: async (id, data) => {
    const updated = await api.put<ObjectiveWithCompletion>(`/api/objectives/${id}`, data);
    set((state) => ({
      objectives: state.objectives.map((o) => (o.id === id ? updated : o)),
    }));
  },

  deleteObjective: async (id) => {
    await api.del(`/api/objectives/${id}`);
    set((state) => ({
      objectives: state.objectives.filter((o) => o.id !== id),
    }));
  },

  getObjectiveTree: (cycleId: string) => {
    const objectives = get().objectives.filter((o) => o.cycleId === cycleId);

    // 建立 id → 节点映射
    const nodeMap = new Map<string, ObjectiveTreeNode>();
    for (const obj of objectives) {
      nodeMap.set(obj.id, { objective: obj, children: [] });
    }

    // 组装树
    const roots: ObjectiveTreeNode[] = [];
    for (const obj of objectives) {
      const node = nodeMap.get(obj.id)!;
      if (obj.parentObjectiveId && nodeMap.has(obj.parentObjectiveId)) {
        nodeMap.get(obj.parentObjectiveId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  },
}));
