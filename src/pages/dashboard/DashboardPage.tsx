import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BookOpen,
} from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { dashboardStats, students, attendanceRecords, invoices, etablissements } from '../../mock/data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Chart data
const attendanceData = [
  { month: 'Sep', presence: 94 },
  { month: 'Oct', presence: 92 },
  { month: 'Nov', presence: 95 },
  { month: 'Dec', presence: 91 },
  { month: 'Jan', presence: 96 },
  { month: 'Fév', presence: 94 },
];

const gradesDistribution = [
  { range: '0-5', count: 15 },
  { range: '5-8', count: 45 },
  { range: '8-10', count: 120 },
  { range: '10-12', count: 280 },
  { range: '12-15', count: 520 },
  { range: '15-18', count: 250 },
  { range: '18-20', count: 20 },
];

const paymentStatus = [
  { name: 'Payé', value: 850, color: '#10b981' },
  { name: 'Partiel', value: 280, color: '#f59e0b' },
  { name: 'En attente', values: 120, color: '#ef4444' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const recentStudents = students.slice(0, 5);
  const recentAbsences = attendanceRecords
    .filter(a => a.status === 'absent' || a.status === 'retard')
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tableau de bord</h1>
          <p className="text-secondary-500 mt-1">Vue d'ensemble de votre établissement</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
            <option>Année scolaire 2024-2025</option>
            <option>Année scolaire 2023-2024</option>
          </select>
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500">
            <option>Tous les établissements</option>
            {etablissements.map(e => (
              <option key={e.id}>{e.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Apprenants inscrits"
          value={dashboardStats.totalStudents.toLocaleString()}
          subtitle="Actuellement"
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 5.2, label: 'vs mois dernier' }}
          color="primary"
        />
        <StatCard
          title="Enseignants"
          value={dashboardStats.totalEnseignants}
          subtitle="Actifs"
          icon={<GraduationCap className="w-6 h-6" />}
          trend={{ value: 2.1, label: 'vs mois dernier' }}
          color="accent"
        />
        <StatCard
          title="Taux de présence"
          value={`${dashboardStats.tauxPresence}%`}
          subtitle="Moyenne mensuelle"
          icon={<CalendarCheck className="w-6 h-6" />}
          trend={{ value: -1.5, label: 'vs mois dernier' }}
          color="success"
        />
        <StatCard
          title="Moyenne générale"
          value={dashboardStats.moyenneGenerale.toFixed(2)}
          subtitle="/ 20"
          icon={<BookOpen className="w-6 h-6" />}
          trend={{ value: 0.8, label: 'vs mois dernier' }}
          color="warning"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance chart */}
        <Card className="lg:col-span-2">
          <CardHeader action={
            <Badge variant="success" dot>Tendances</Badge>
          }>
            Évolution du taux de présence
          </CardHeader>
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis domain={[80, 100]} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line
                  type="monotone"
                  dataKey="presence"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Payment stats */}
        <Card>
          <CardHeader>Revenus du mois</CardHeader>
          <CardBody>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-secondary-900">
                {formatCurrency(dashboardStats.revenusMois)}
              </p>
              <p className="text-sm text-secondary-500 mt-1">
                {dashboardStats.paiementsEnAttente} paiements en attente
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">Payé</span>
                  <span className="font-medium text-success-600">85%</span>
                </div>
                <ProgressBar value={85} color="success" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">Partiel</span>
                  <span className="font-medium text-warning-600">10%</span>
                </div>
                <ProgressBar value={10} color="warning" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary-600">En attente</span>
                  <span className="font-medium text-error-600">5%</span>
                </div>
                <ProgressBar value={5} color="error" size="sm" />
              </div>
            </div>

            <button
              onClick={() => navigate('/finance')}
              className="w-full mt-6 py-2.5 text-center text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Voir les détails →
            </button>
          </CardBody>
        </Card>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grades distribution */}
        <Card>
          <CardHeader>Distribution des notes</CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradesDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Recent students */}
        <Card>
          <CardHeader action={
            <button onClick={() => navigate('/students')} className="text-sm text-primary-600 hover:text-primary-700">
              Voir tout
            </button>
          }>
            Inscriptions récentes
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/students/${student.id}`)}
                >
                  <Avatar name={`${student.prenom} ${student.nom}`} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {student.prenom} {student.nom}
                    </p>
                    <p className="text-xs text-secondary-500">{student.matricule}</p>
                  </div>
                  <Badge variant="success" size="sm">Nouveau</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent absences */}
        <Card>
          <CardHeader action={
            <Badge variant="error">{dashboardStats.absencesJour} aujourd'hui</Badge>
          }>
            Absences récentes
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentAbsences.map((record) => {
                const student = students.find(s => s.id === record.studentId);
                if (!student) return null;

                return (
                  <div key={record.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                    <Avatar name={`${student.prenom} ${student.nom}`} size="xs" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {student.prenom} {student.nom}
                      </p>
                      <p className="text-xs text-secondary-500">{record.date}</p>
                    </div>
                    <Badge variant={record.status === 'absent' ? 'error' : 'warning'} size="sm">
                      {record.status === 'absent' ? 'Absent' : 'Retard'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Classes overview */}
      <Card>
        <CardHeader action={
          <button onClick={() => navigate('/students')} className="text-sm text-primary-600 hover:text-primary-700">
            Gérer les classes
          </button>
        }>
          Aperçu des classes
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Classe</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Effectif</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Capacité</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Remplissage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Moyenne</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { nom: 'Terminale S1', niveau: 'Terminale', effectif: 32, capacite: 35, moyenne: 13.2 },
                  { nom: 'Terminale S2', niveau: 'Terminale', effectif: 30, capacite: 35, moyenne: 12.8 },
                  { nom: 'Première S', niveau: 'Première', effectif: 38, capacite: 40, moyenne: 12.5 },
                  { nom: 'Seconde S', niveau: 'Seconde', effectif: 42, capacite: 45, moyenne: 11.9 },
                  { nom: 'Première L', niveau: 'Première', effectif: 28, capacite: 30, moyenne: 12.1 },
                ].map((classe, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900">{classe.nom}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{classe.niveau}</td>
                    <td className="px-6 py-4 text-sm text-secondary-900">{classe.effectif}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{classe.capacite}</td>
                    <td className="px-6 py-4">
                      <ProgressBar
                        value={(classe.effectif / classe.capacite) * 100}
                        color={(classe.effectif / classe.capacite) * 100 > 95 ? 'error' : 'primary'}
                        size="sm"
                        className="w-24"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${classe.moyenne >= 12 ? 'text-success-600' : classe.moyenne >= 10 ? 'text-warning-600' : 'text-error-600'}`}>
                        {classe.moyenne.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
