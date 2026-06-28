import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { users } from '../mock/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      loginAsRole: (role: UserRole) => {
        const user = users.find(u => u.role === role);
        if (user) {
          set({ user, isAuthenticated: true });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
