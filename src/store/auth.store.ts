import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { authApi } from '../lib/api';
import { users } from '../mock/data';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login(email, password);
          const mockUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

          set({
            token: response.access_token,
            user: mockUser ?? {
              id: response.user?.uuid ?? 'unknown',
              email,
              nom: response.user?.lastname ?? 'Utilisateur',
              prenom: response.user?.firstname ?? '',
              role: 'admin_etablissement',
              actif: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            isAuthenticated: true,
          });

          return true;
        } catch {
          const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (user) {
            set({ user, token: 'mock-token', isAuthenticated: true });
            return true;
          }
          return false;
        }
      },

      loginAsRole: (role: UserRole) => {
        const user = users.find(u => u.role === role);
        if (user) {
          set({ user, token: 'mock-token', isAuthenticated: true });
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
