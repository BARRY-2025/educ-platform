import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '../lib/api';
import { studentsApi } from '../lib/api';
import { attendanceApi } from '../lib/api';
import { gradesApi } from '../lib/api';

export function usePreschoolOverview() {
  return useQuery({
    queryKey: ['preschool-overview'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const [enrollments, students, attendances, classes, bulletins] = await Promise.all([
        enrollmentApi.listEnrollments().catch(() => ({ items: [], pagination: { total: 0 } })),
        studentsApi.list(1, 100).catch(() => ({ items: [], pagination: { total: 0 } })),
        attendanceApi.list(today).catch(() => ({ items: [], stats: { total: 0, present: 0 } })),
        enrollmentApi.listClasses('PS').catch(() => ({ items: [] })),
        gradesApi.listBulletins().catch(() => ({ items: [], pagination: { total: 0 } })),
      ]);

      const activeEnrollments = enrollments.items.filter(e => e.status === 'active').length;
      const pendingEnrollments = enrollments.items.filter(e =>
        ['pending_validation', 'pre_registered', 'documents_requested'].includes(e.status)
      ).length;

      return {
        totalStudents: students.pagination?.total ?? students.items.length,
        activeEnrollments,
        pendingEnrollments,
        presentToday: attendances.stats?.present ?? attendances.stats?.arrived_gate ?? 0,
        attendanceTotal: attendances.stats?.total ?? 0,
        classes: classes.items ?? [],
        recentEnrollments: enrollments.items.slice(0, 5),
        publishedBulletins: bulletins.items?.filter(
          (b: { status: string }) => b.status === 'published' || b.status === 'delivered',
        ).length ?? 0,
        draftBulletins: bulletins.items?.filter((b: { status: string }) => b.status === 'draft').length ?? 0,
      };
    },
    refetchInterval: 60000,
  });
}
