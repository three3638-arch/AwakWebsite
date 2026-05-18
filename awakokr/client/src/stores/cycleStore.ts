import { create } from 'zustand';
import { api } from '../services/api';
import { Cycle } from '../types';

interface CycleState {
  cycles: Cycle[];
  currentCycle: Cycle | null;
  loading: boolean;

  /** 活跃周期（computed） */
  activeCycles: () => Cycle[];

  fetchCycles: () => Promise<void>;
  createCycle: (data: { name: string; startDate: string; endDate: string }) => Promise<void>;
  updateCycle: (id: string, data: Partial<Cycle>) => Promise<void>;
  deleteCycle: (id: string) => Promise<void>;
  setCurrentCycle: (cycle: Cycle | null) => void;
}

export const useCycleStore = create<CycleState>((set, get) => ({
  cycles: [],
  currentCycle: null,
  loading: false,

  activeCycles: () => get().cycles.filter((c) => c.status === 'active'),

  fetchCycles: async () => {
    set({ loading: true });
    try {
      const cycles = await api.get<Cycle[]>('/api/cycles');
      // 按开始日期降序排列
      const sorted = [...cycles].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
      set({ cycles: sorted });

      // 如果没有选中周期，默认选中第一个活跃周期
      const current = get().currentCycle;
      if (!current || !sorted.find((c) => c.id === current.id)) {
        const active = sorted.filter((c) => c.status === 'active');
        set({ currentCycle: active[0] || null });
      }
    } catch (error) {
      console.error('获取周期列表失败:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createCycle: async (data) => {
    const cycle = await api.post<Cycle>('/api/cycles', data);
    const cycles = [...get().cycles, cycle].sort(
      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    set({ cycles });

    // 如果新创建的周期是活跃的且当前没有选中周期，自动选中
    if (cycle.status === 'active' && !get().currentCycle) {
      set({ currentCycle: cycle });
    }
  },

  updateCycle: async (id, data) => {
    const updated = await api.put<Cycle>(`/api/cycles/${id}`, data);
    const cycles = get().cycles.map((c) => (c.id === id ? updated : c));
    set({ cycles });

    // 如果更新的是当前选中的周期，同步更新
    if (get().currentCycle?.id === id) {
      set({ currentCycle: updated });
    }

    // 如果周期被归档且是当前选中的，切换到第一个活跃周期
    if (updated.status === 'archived' && get().currentCycle?.id === id) {
      const active = cycles.filter((c) => c.status === 'active');
      set({ currentCycle: active[0] || null });
    }
  },

  deleteCycle: async (id) => {
    await api.del(`/api/cycles/${id}`);
    const cycles = get().cycles.filter((c) => c.id !== id);
    set({ cycles });

    // 如果删除的是当前选中的周期，切换到第一个活跃周期
    if (get().currentCycle?.id === id) {
      const active = cycles.filter((c) => c.status === 'active');
      set({ currentCycle: active[0] || null });
    }
  },

  setCurrentCycle: (cycle) => {
    set({ currentCycle: cycle });
  },
}));
