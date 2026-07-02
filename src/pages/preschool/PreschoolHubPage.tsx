import React from 'react';
import { Link } from 'react-router-dom';
import {
  Baby,
  ClipboardList,
  CalendarCheck,
  FileText,
  ArrowRight,
  Users,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { usePreschoolOverview } from '../../hooks/usePreschool';
import { useBulletins } from '../../hooks/useGrades';
import { enrollmentStatusLabels } from '../../hooks/useEnrollment';

const pipelineSteps = [
  { label: 'Pré-inscription', path: '/enrollment/preschool', icon: Baby, color: 'from-pink-500 to-rose-500' },
  { label: 'Validation directeur', path: '/enrollments', icon: ClipboardList, color: 'from-blue-500 to-indigo-500' },
  { label: 'Présence QR', path: '/scan', icon: CalendarCheck, color: 'from-emerald-500 to-teal-500' },
  { label: 'Évaluation compétences', path: '/preschool/evaluation', icon: FileText, color: 'from-violet-500 to-purple-500' },
  { label: 'Bulletins parents', path: '/preschool/bulletins', icon: CheckCircle, color: 'from-amber-500 to-orange-500' },
];

export function PreschoolHubPage() {
  const { data: overview, isLoading } = usePreschoolOverview();
  const { data: bulletins } = useBulletins();

  const publishedCount = bulletins?.items?.filter(b => b.status === 'published' || b.status === 'delivered').length ?? 0;
  const draftCount = bulletins?.items?.filter(b => b.status === 'draft').length ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Module Maternelle</h1>
        <p className="text-secondary-500 mt-1">
          Parcours complet : inscription → présence → évaluation → bulletin
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Élèves', value: overview?.totalStudents ?? '—', icon: Users },
          { label: 'Inscriptions actives', value: overview?.activeEnrollments ?? '—', icon: CheckCircle },
          { label: 'Présents aujourd\'hui', value: overview ? `${overview.presentToday}/${overview.attendanceTotal}` : '—', icon: CalendarCheck },
          { label: 'Bulletins publiés', value: publishedCount, icon: FileText },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary-900">
                    {isLoading ? <span className="text-secondary-300">...</span> : stat.value}
                  </p>
                  <p className="text-xs text-secondary-500">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Pipeline */}
      <Card>
        <CardBody>
          <h2 className="text-lg font-semibold text-secondary-900 mb-4">Parcours maternelle</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Link key={step.path} to={step.path}
                  className="group relative flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-secondary-700 text-center">{step.label}</span>
                  <ArrowRight className="w-4 h-4 text-primary-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {i < pipelineSteps.length - 1 && (
                    <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300">→</span>
                  )}
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Alerts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-secondary-900">Inscriptions en attente</h3>
              <Badge variant="warning">{overview?.pendingEnrollments ?? 0}</Badge>
            </div>
            {overview?.recentEnrollments?.length ? (
              <ul className="space-y-2">
                {overview.recentEnrollments.map(e => (
                  <li key={e.uuid} className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600 font-mono text-xs">{e.student_uuid.slice(0, 8)}…</span>
                    <Badge variant="default">
                      {enrollmentStatusLabels[e.status] ?? e.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-secondary-400">Aucune inscription récente</p>
            )}
            <Link to="/enrollments" className="text-sm text-primary-600 hover:underline mt-3 inline-block">
              Gérer les inscriptions →
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-violet-500" />
              <h3 className="font-semibold text-secondary-900">Bulletins</h3>
              <Badge variant="default">{draftCount} brouillon(s)</Badge>
            </div>
            <p className="text-sm text-secondary-500 mb-3">
              {publishedCount} bulletin(s) publié(s) ou remis aux parents.
            </p>
            <div className="flex gap-2">
              <Link to="/preschool/evaluation" className="text-sm text-primary-600 hover:underline">
                Évaluer les élèves →
              </Link>
              <Link to="/preschool/bulletins" className="text-sm text-primary-600 hover:underline">
                Publier les bulletins →
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
