import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gradesApi } from '../lib/api';

export const ratingLabels: Record<string, string> = {
  acquired: 'Acquis',
  in_progress: 'En cours',
  needs_review: 'À revoir',
};

export const ratingColors: Record<string, string> = {
  acquired: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  needs_review: 'bg-red-100 text-red-700',
};

export const bulletinStatusLabels: Record<string, string> = {
  draft: 'Brouillon',
  published: 'Publié',
  delivered: 'Remis',
};

export function useEvaluationPeriods() {
  return useQuery({
    queryKey: ['evaluation-periods'],
    queryFn: () => gradesApi.listPeriods(),
  });
}

export function useCompetences() {
  return useQuery({
    queryKey: ['competences'],
    queryFn: () => gradesApi.listCompetences(),
  });
}

export function useStudentEvaluations(studentUuid?: string, periodUuid?: string) {
  return useQuery({
    queryKey: ['evaluations', studentUuid, periodUuid],
    queryFn: () => gradesApi.getEvaluations(studentUuid!, periodUuid!),
    enabled: Boolean(studentUuid && periodUuid),
  });
}

export function useBulletins(params?: { period_uuid?: string; status?: string }) {
  return useQuery({
    queryKey: ['bulletins', params],
    queryFn: () => gradesApi.listBulletins(params),
  });
}

export function useSaveEvaluations() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradesApi.saveEvaluations,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.student_uuid, variables.period_uuid],
      });
    },
  });
}

export function useGenerateBulletin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradesApi.generateBulletin,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bulletins'] }),
  });
}

export function usePublishBulletin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, comment }: { uuid: string; comment?: string }) =>
      gradesApi.publishBulletin(uuid, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bulletins'] }),
  });
}
