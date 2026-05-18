import { create } from 'zustand';
import { api } from '../services/api';
import { Todo } from '../types';

interface TodoState {
  todos: Record<string, Todo[]>; // krId -> Todo[]
  timelineTodos: Todo[]; // 时间线视图用
  loading: boolean;
  fetchTodos: (krId: string) => Promise<void>;
  createTodo: (data: {
    krId: string;
    title: string;
    description: string;
    plannedStart: string;
    plannedEnd: string;
  }) => Promise<void>;
  updateTodo: (id: string, krId: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string, krId: string) => Promise<void>;
  fetchTodosByCycle: (cycleId: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: {},
  timelineTodos: [],
  loading: false,

  fetchTodos: async (krId: string) => {
    set({ loading: true });
    try {
      const todos = await api.get<Todo[]>(`/api/todos?krId=${krId}`);
      set((state) => ({
        todos: { ...state.todos, [krId]: todos },
      }));
    } catch (error) {
      console.error('获取Todo列表失败:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  createTodo: async (data) => {
    const todo = await api.post<Todo>('/api/todos', data);
    const krId = data.krId;
    set((state) => {
      const existing = state.todos[krId] || [];
      return {
        todos: {
          ...state.todos,
          [krId]: [...existing, todo],
        },
      };
    });
  },

  updateTodo: async (id, krId, data) => {
    const updated = await api.put<Todo>(`/api/todos/${id}`, data);
    set((state) => {
      const existing = state.todos[krId] || [];
      return {
        todos: {
          ...state.todos,
          [krId]: existing.map((t) => (t.id === id ? updated : t)),
        },
      };
    });
  },

  deleteTodo: async (id, krId) => {
    await api.del(`/api/todos/${id}`);
    set((state) => {
      const existing = state.todos[krId] || [];
      return {
        todos: {
          ...state.todos,
          [krId]: existing.filter((t) => t.id !== id),
        },
      };
    });
  },

  fetchTodosByCycle: async (cycleId: string) => {
    set({ loading: true });
    try {
      const todos = await api.get<Todo[]>(`/api/todos/by-cycle/${cycleId}`);
      set({ timelineTodos: todos });
    } catch (error) {
      console.error('获取周期Todo列表失败:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
