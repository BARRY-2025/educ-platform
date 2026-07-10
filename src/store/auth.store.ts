import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { authApi } from '../lib/api';
import { mapApiRolesToUserRole, splitFullName } from '../lib/mapAuthRole';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

function buildUserFromAuth(
  profile: {
    uuid: string;
    email: string;
    firstname?: string;
    lastname?: string;
    full_name?: string;
    roles?: string[];
  },
): User {
  const prenom = profile.firstname ?? splitFullName(profile.full_name ?? '').prenom;
  const nom = profile.lastname ?? splitFullName(profile.full_name ?? '').nom;

  return {
    id: profile.uuid,
    email: profile.email,
    nom,
    prenom,
    role: mapApiRolesToUserRole(profile.roles ?? []),
    actif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authApi.login(email, password);

        let profile = response.user;
        if (profile?.uuid) {
          try {
            const me = await authApi.me(response.access_token);
            profile = { ...profile, ...me, roles: me.roles };
          } catch {
            // Profil minimal depuis la réponse login
          }
        }

        if (!profile?.uuid) {
          throw new Error('Réponse d\'authentification invalide');
        }

        set({
          token: response.access_token,
          refreshToken: response.refresh_token,
          user: buildUserFromAuth(profile),
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
