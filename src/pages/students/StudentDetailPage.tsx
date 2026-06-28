import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  CreditCard,
  User,
  Clock,
  BookOpen,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatCard } from '../../components/ui/StatCard';
import { Table } from '../../components/ui/Table';
import {
  students,
  guardians,
  getGradesByStudent,
  getAttendanceByStudent,
  getInvoicesByStudent,
  subjects,
} from '../../mock/data';
import type { Grade, AttendanceRecord, Invoice } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const statusLabels: Record<string, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
  diplome: 'Diplômé',
  transfere: 'Transféré',
  suspendu: 'Suspendu',
};

export function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'attendance' | 'finance'>('overview');

  const student = students.find(s => s.id === id);
  const studentGuardians = guardians.filter(g => g.studentId === id);
  const studentGrades = getGradesByStudent(id || '');
  const studentAttendance = getAttendanceByStudent(id || '');
  const studentInvoices = getInvoicesByStudent(id || '');

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-secondary-500">Apprenant non trouvé</p>
        <Button onClick={() => navigate('/students')} className="mt-4">
          Retour à la liste
        </Button>
      </div>
    );
  }

  const calculateMoyenne = () => {
    if (studentGrades.length === 0) return 0;
    const sum = studentGrades.reduce((acc, g) => acc + g.note, 0);
    return (sum / studentGrades.length).toFixed(2);
  };

  const attendanceStats = {
    total: studentAttendance.length,
    present: studentAttendance.filter(a => a.status === 'present').length,
    absent: studentAttendance.filter(a => a.status === 'absent').length,
    retard: studentAttendance.filter(a => a.status === 'retard').length,
    excuse: studentAttendance.filter(a => a.status === 'excuse').length,
  };

  const attendancePercentage = attendanceStats.total > 0
    ? ((attendanceStats.present / attendanceStats.total) * 100).toFixed(1)
    : 0;

  // Radar chart data for subjects
  const subjectRadarData = subjects.slice(0, 6).map(subject => {
    const subjectGrades = studentGrades.filter(g => g.subjectId === subject.id);
    const avg = subjectGrades.length > 0
      ? subjectGrades.reduce((sum, g) => sum + g.note, 0) / subjectGrades.length
      : 0;
    return {
      subject: subject.nom.slice(0, 3),
      note: avg,
    };
  });

  // Monthly attendance trend
  const attendanceTrend = [
    { month: 'Sep', presence: 95 },
    { month: 'Oct', presence: 92 },
    { month: 'Nov', presence: 98 },
    { month: 'Dec', presence: 100 },
    { month: 'Jan', presence: 93 },
    { month: 'Fév', presence: 97 },
  ];

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'grades', label: 'Notes', icon: BookOpen },
    { id: 'attendance', label: 'Présences', icon: Calendar },
    { id: 'finance', label: 'Finance', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" icon={<ArrowLeft className="w-5 h-5" />} onClick={() => navigate('/students')}>
          Retour
        </Button>
      </div>

      {/* Student header card */}
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar name={`${student.prenom} ${student.nom}`} size="xl" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    {student.prenom} {student.nom}
                  </h1>
                  <p className="text-secondary-500 mt-1">Matricule: {student.matricule}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={student.statut === 'actif' ? 'success' : 'warning'} size="md">
                    {statusLabels[student.statut]}
                  </Badge>
                  <Button variant="outline" icon={<Edit className="w-4 h-4" />}>
                    Modifier
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="flex items-center gap-2 text-secondary-600">
                  <Calendar className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm">
                    {new Date(student.dateNaissance).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600">
                  <MapPin className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm">{student.ville}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600">
                  <Mail className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-600">
                  <Phone className="w-4 h-4 text-secondary-400" />
                  <span className="text-sm">{student.telephone}</span>
                </div>
              </div>

              {/* Guardians */}
              {studentGuardians.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm font-medium text-secondary-700 mb-3">Responsables légaux</p>
                  <div className="flex flex-wrap gap-3">
                    {studentGuardians.map(guardian => (
                      <div key={guardian.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                        <Avatar name={`${guardian.prenom} ${guardian.nom}`} size="xs" />
                        <div>
                          <p className="text-sm font-medium text-secondary-900">
                            {guardian.prenom} {guardian.nom}
                          </p>
                          <p className="text-xs text-secondary-500 capitalize">{guardian.relation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg
                transition-colors
                ${activeTab === tab.id
                  ? 'bg-white text-primary-700 border-t border-x border-gray-200 -mb-px'
                  : 'text-secondary-500 hover:text-secondary-700'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Moyenne générale"
              value={calculateMoyenne()}
              subtitle="/ 20"
              icon={<BookOpen className="w-6 h-6" />}
              color="primary"
            />
            <StatCard
              title="Taux de présence"
              value={`${attendancePercentage}%`}
              subtitle="Cette année"
              icon={<Calendar className="w-6 h-6" />}
              color="success"
            />
            <StatCard
              title="Rang"
              value="12"
              subtitle="/ 32 élèves"
              icon={<TrendingUp className="w-6 h-6" />}
              color="accent"
            />
            <StatCard
              title="Solde"
              value="125 000"
              subtitle="FCFA à payer"
              icon={<CreditCard className="w-6 h-6" />}
              color="warning"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>Évolution des présences</CardHeader>
              <CardBody className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="presence" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>Performance par matière</CardHeader>
              <CardBody className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={subjectRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 20]} />
                    <Radar name="Note" dataKey="note" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Recent activity */}
          <Card>
            <CardHeader>Activité récente</CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-gray-100">
                {studentGrades.slice(0, 5).map((grade) => {
                  const subject = subjects.find(s => s.id === grade.subjectId);
                  return (
                    <div key={grade.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${grade.note >= 10 ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900">
                          Note de {subject?.nom || 'Matière'}
                        </p>
                        <p className="text-xs text-secondary-500">{grade.date}</p>
                      </div>
                      <span className={`text-lg font-semibold ${grade.note >= 10 ? 'text-success-600' : 'text-error-600'}`}>
                        {grade.note}/20
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'grades' && (
        <Card>
          <CardHeader>
            Historique des notes
          </CardHeader>
          <Table<Grade>
            data={studentGrades}
            columns={[
              {
                key: 'subjectId',
                header: 'Matière',
                render: (value: unknown) => subjects.find(s => s.id === value)?.nom || 'Inconnu',
              },
              { key: 'type', header: 'Type', sortable: true },
              { key: 'date', header: 'Date', sortable: true },
              {
                key: 'note',
                header: 'Note',
                sortable: true,
                render: (value: unknown) => (
                  <span className={`font-semibold ${Number(value) >= 10 ? 'text-success-600' : 'text-error-600'}`}>
                    {value as number}/20
                  </span>
                ),
              },
              { key: 'commentaire', header: 'Commentaire' },
            ]}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card padding="sm" className="text-center p-4">
              <p className="text-2xl font-bold text-success-600">{attendanceStats.present}</p>
              <p className="text-sm text-secondary-500">Présents</p>
            </Card>
            <Card padding="sm" className="text-center p-4">
              <p className="text-2xl font-bold text-error-600">{attendanceStats.absent}</p>
              <p className="text-sm text-secondary-500">Absences</p>
            </Card>
            <Card padding="sm" className="text-center p-4">
              <p className="text-2xl font-bold text-warning-600">{attendanceStats.retard}</p>
              <p className="text-sm text-secondary-500">Retards</p>
            </Card>
            <Card padding="sm" className="text-center p-4">
              <p className="text-2xl font-bold text-secondary-600">{attendanceStats.excuse}</p>
              <p className="text-sm text-secondary-500">Excusés</p>
            </Card>
          </div>

          <Card>
            <CardHeader>Historique des présences</CardHeader>
            <Table<AttendanceRecord>
              data={studentAttendance.slice(0, 20)}
              columns={[
                { key: 'date', header: 'Date', sortable: true },
                {
                  key: 'status',
                  header: 'Statut',
                  render: (value: unknown) => (
                    <Badge variant={value === 'present' ? 'success' : value === 'absent' ? 'error' : value === 'retard' ? 'warning' : 'secondary'}>
                      {value === 'present' ? 'Présent' : value === 'absent' ? 'Absent' : value === 'retard' ? 'Retard' : 'Excusé'}
                    </Badge>
                  ),
                },
                { key: 'heureEntree', header: 'Heure entrée' },
                { key: 'heureSortie', header: 'Heure sortie' },
                { key: 'justification', header: 'Justification' },
              ]}
              keyExtractor={(row) => row.id}
            />
          </Card>
        </div>
      )}

      {activeTab === 'finance' && (
        <Card>
          <CardHeader>
            Factures et paiements
          </CardHeader>
          <Table<Invoice>
            data={studentInvoices}
            columns={[
              { key: 'numero', header: 'N° Facture', sortable: true },
              { key: 'dateEcheance', header: 'Échéance', sortable: true },
              {
                key: 'montantTotal',
                header: 'Montant total',
                render: (value: unknown) => `${Number(value).toLocaleString()} FCFA`,
              },
              {
                key: 'montantPaye',
                header: 'Payé',
                render: (value: unknown) => `${Number(value).toLocaleString()} FCFA`,
              },
              {
                key: 'reste',
                header: 'Reste',
                render: (value: unknown) => (
                  <span className={Number(value) > 0 ? 'text-error-600 font-medium' : 'text-success-600'}>
                    {Number(value).toLocaleString()} FCFA
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Statut',
                render: (value: unknown) => (
                  <Badge variant={value === 'paye' ? 'success' : value === 'partiel' ? 'warning' : 'error'}>
                    {value === 'paye' ? 'Payé' : value === 'partiel' ? 'Partiel' : 'En attente'}
                  </Badge>
                ),
              },
            ]}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}
    </div>
  );
}
