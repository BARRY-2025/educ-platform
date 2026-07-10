import { useQuery } from '@tanstack/react-query';
import { studentsApi, type StudentApiModel } from '../lib/api';
import type { Student } from '../types';
import { students as mockStudents } from '../mock/data';

const statusMap: Record<string, Student['statut']> = {
  active: 'actif',
  pre_registered: 'actif',
  suspended: 'suspendu',
  withdrawn: 'transfere',
};

function mapApiStudent(api: StudentApiModel): Student {
  return {
    id: api.uuid,
    matricule: api.matricule,
    nom: api.lastname,
    prenom: api.firstname,
    dateNaissance: api.date_of_birth,
    lieuNaissance: '',
    sexe: api.gender === 'male' ? 'M' : 'F',
    email: '',
    adresse: '',
    ville: '',
    photo: api.photo_url ?? undefined,
    statut: statusMap[api.status] ?? 'actif',
    etablissementId: api.establishment_uuid,
    dateInscription: api.date_of_birth,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function useStudents(page = 1) {
  return useQuery({
    queryKey: ['students', page],
    queryFn: async () => {
      try {
        const response = await studentsApi.list(page);
        return {
          items: response.items.map(mapApiStudent),
          total: response.pagination.total,
        };
      } catch {
        return {
          items: mockStudents,
          total: mockStudents.length,
        };
      }
    },
  });
}
