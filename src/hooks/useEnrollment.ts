import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '../lib/api';

export function useAcademicYears() {
  return useQuery({
    queryKey: ['academic-years'],
    queryFn: () => enrollmentApi.listAcademicYears(),
  });
}

export function useClasses(level?: string) {
  return useQuery({
    queryKey: ['classes', level],
    queryFn: () => enrollmentApi.listClasses(level),
  });
}

export function useEnrollments(status?: string) {
  return useQuery({
    queryKey: ['enrollments', status],
    queryFn: () => enrollmentApi.listEnrollments(status),
    refetchInterval: 30000,
  });
}

export const enrollmentStatusLabels: Record<string, string> = {
  pre_registered: 'Pré-inscrit',
  pending_validation: 'En attente validation',
  documents_requested: 'Documents demandés',
  approved: 'Approuvé',
  class_assigned: 'Classe attribuée',
  active: 'Actif',
  rejected: 'Rejeté',
  cancelled: 'Annulé',
};

export const enrollmentStatusColors: Record<string, 'success' | 'warning' | 'error' | 'secondary' | 'primary' | 'accent'> = {
  pre_registered: 'secondary',
  pending_validation: 'warning',
  documents_requested: 'accent',
  approved: 'primary',
  class_assigned: 'primary',
  active: 'success',
  rejected: 'error',
  cancelled: 'secondary',
};
