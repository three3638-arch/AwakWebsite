import { create } from 'zustand';
import { getToken, setToken, removeToken } from '../services/api';

interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
  team: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  initialize: () => void;
}

const USER_KEY = 'awak_okr_user';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token: string, user: AuthUser) => {
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    removeToken();
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = getToken();
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ token, user, isAuthenticated: true });
      } catch {
        removeToken();
        set({ token: null, user: null, isAuthenticated: false });
      }
    }
  },
}));
