import { create } from 'zustand';
import { api } from '../services/api';
import type { User } from '../types/index';

export interface CreateUserData {
  username: string;
  displayName: string;
  password: string;
  role: 'admin' | 'member';
  team: string;
}

export interface UpdateUserData {
  displayName?: string;
  role?: 'admin' | 'member';
  team?: string;
  password?: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<void>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await api.get<User[]>('/api/users');
      set({ users });
    } finally {
      set({ loading: false });
    }
  },

  createUser: async (data: CreateUserData) => {
    await api.post<User>('/api/users', data);
    await get().fetchUsers();
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    await api.put<User>(`/api/users/${id}`, data);
    await get().fetchUsers();
  },

  deleteUser: async (id: string) => {
    await api.del(`/api/users/${id}`);
    await get().fetchUsers();
  },
}));
