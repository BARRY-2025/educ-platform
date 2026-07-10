import type { UserRole } from '../types';

const ROLE_MAP: Record<string, UserRole> = {
  'super-admin': 'super_admin',
  super_admin: 'super_admin',
  admin: 'admin_etablissement',
  'admin-etablissement': 'admin_etablissement',
  manager: 'enseignant',
  enseignant: 'enseignant',
  teacher: 'enseignant',
  parent: 'parent',
  user: 'parent',
  apprenant: 'apprenant',
  student: 'apprenant',
  guest: 'apprenant',
};

export function mapApiRolesToUserRole(roles: string[]): UserRole {
  for (const role of roles) {
    const normalized = role.toLowerCase().trim();
    if (ROLE_MAP[normalized]) {
      return ROLE_MAP[normalized];
    }
  }

  return 'parent';
}

export function splitFullName(fullName: string): { prenom: string; nom: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) {
    return { prenom: parts[0] ?? '', nom: '' };
  }

  return {
    prenom: parts[0],
    nom: parts.slice(1).join(' '),
  };
}
