import { useQuery } from '@tanstack/react-query';
import { attendanceApi } from '../lib/api';

export function useAttendances(date?: string) {
  return useQuery({
    queryKey: ['attendances', date],
    queryFn: () => attendanceApi.list(date),
    refetchInterval: 15000,
  });
}

export const attendanceStatusLabels: Record<string, string> = {
  arrived_gate: 'Arrivé portail',
  late: 'Retard',
  absent: 'Absent',
  present: 'Présent classe',
  excused: 'Excusé',
  exit_authorized: 'Sortie autorisée',
  left: 'Sorti',
};

export const attendanceStatusColors: Record<string, 'success' | 'warning' | 'error' | 'secondary' | 'primary' | 'accent'> = {
  arrived_gate: 'primary',
  late: 'warning',
  absent: 'error',
  present: 'success',
  excused: 'secondary',
  exit_authorized: 'accent',
  left: 'success',
};
