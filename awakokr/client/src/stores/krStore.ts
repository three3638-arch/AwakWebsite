import { create } from 'zustand';
import { api } from '../services/api';
import { KeyResult, KeyResultSnapshot } from '../types';

interface KrState {
  keyResults: Record<string, KeyResult[]>;  // objectiveId -> KR[]
  loading: boolean;
  fetchKeyResults: (objectiveId: string) => Promise<void>;
  createKeyResult: (data: {
    objectiveId: string;
    title: string;
    description: string;
    weight: number;
    targetValue: number;
  }) => Promise<KeyResult>;
  updateKeyResult: (
    id: string,
    objectiveId: string,
    data: Partial<KeyResult> & { changeNote?: string },
  ) => Promise<KeyResult>;
  deleteKeyResult: (id: string, objectiveId: string) => Promise<void>;
  fetchHistory: (id: string, objectiveId: string) => Promise<KeyResultSnapshot[]>;
}

export const useKrStore = create<KrState>((set, get) => ({
  keyResults: {},
  loading: false,

  fetchKeyResults: async (objectiveId: string) => {
    set({ loading: true });
    try {
      const krs = await api.get<KeyResult[]>(`/api/keyresults?objectiveId=${objectiveId}`);
      set((state) => ({
        keyResults: { ...state.keyResults, [objectiveId]: krs },
      }));
    } catch (error) {
      console.error('获取KR列表失败:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createKeyResult: async (data) => {
    const kr = await api.post<KeyResult>('/api/keyresults', data);
    const objectiveId = data.objectiveId;
    set((state) => {
      const existing = state.keyResults[objectiveId] || [];
      return {
        keyResults: {
          ...state.keyResults,
          [objectiveId]: [...existing, kr],
        },
      };
    });
    return kr;
  },

  updateKeyResult: async (id, objectiveId, data) => {
    const updated = await api.put<KeyResult>(`/api/keyresults/${id}`, data);
    set((state) => {
      const existing = state.keyResults[objectiveId] || [];
      return {
        keyResults: {
          ...state.keyResults,
          [objectiveId]: existing.map((kr) => (kr.id === id ? updated : kr)),
        },
      };
    });
    return updated;
  },

  deleteKeyResult: async (id, objectiveId) => {
    await api.del(`/api/keyresults/${id}`);
    set((state) => {
      const existing = state.keyResults[objectiveId] || [];
      return {
        keyResults: {
          ...state.keyResults,
          [objectiveId]: existing.filter((kr) => kr.id !== id),
        },
      };
    });
  },

  fetchHistory: async (id, objectiveId) => {
    // 确保KR列表已加载（用于确定KR所在objectiveId）
    if (!get().keyResults[objectiveId]) {
      await get().fetchKeyResults(objectiveId);
    }
    const history = await api.get<KeyResultSnapshot[]>(`/api/keyresults/${id}/history`);
    return history;
  },
}));
