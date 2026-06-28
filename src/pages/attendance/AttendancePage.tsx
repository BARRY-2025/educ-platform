import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  QrCode,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { StatCard } from '../../components/ui/StatCard';
import { students, classes, attendanceRecords } from '../../mock/data';
import type { AttendanceRecord } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function AttendancePage() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [classFilter, setClassFilter] = useState('');

  const filteredRecords = attendanceRecords.filter(r => {
    const matchesDate = r.date === dateFilter || !dateFilter;
    return matchesDate;
  });

  const stats = {
    total: filteredRecords.length,
    present: filteredRecords.filter(r => r.status === 'present').length,
    absent: filteredRecords.filter(r => r.status === 'absent').length,
    retard: filteredRecords.filter(r => r.status === 'retard').length,
  };

  const dailyData = [
    { day: 'Lun', present: 245, absent: 5, retard: 8 },
    { day: 'Mar', present: 248, absent: 3, retard: 7 },
    { day: 'Mer', present: 242, absent: 8, retard: 10 },
    { day: 'Jeu', present: 250, absent: 2, retard: 5 },
    { day: 'Ven', present: 238, absent: 10, retard: 12 },
  ];

  const columns = [
    {
      key: 'studentId',
      header: 'Apprenant',
      render: (value: unknown) => {
        const student = students.find(s => s.id === value);
        if (!student) return null;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={`${student.prenom} ${student.nom}`} size="sm" />
            <div>
              <p className="font-medium text-secondary-900">{student.prenom} {student.nom}</p>
              <p className="text-xs text-secondary-500">{student.matricule}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      render: (value: unknown) => {
        const config = {
          present: { label: 'Présent', variant: 'success' as const },
          absent: { label: 'Absent', variant: 'error' as const },
          retard: { label: 'Retard', variant: 'warning' as const },
          excuse: { label: 'Excusé', variant: 'secondary' as const },
        };
        const { label, variant } = config[value as keyof typeof config] || config.present;
        return <Badge variant={variant}>{label}</Badge>;
      },
    },
    { key: 'heureEntree', header: 'Heure entrée' },
    { key: 'heureSortie', header: 'Heure sortie' },
    { key: 'justification', header: 'Justification' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Présences</h1>
          <p className="text-secondary-500 mt-1">Gestion des présences et absences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="accent" icon={<QrCode className="w-4 h-4" />} onClick={() => navigate('/scan')}>
            Scanner QR
          </Button>
          <Button variant="primary" icon={<CalendarCheck className="w-4 h-4" />}>
            Faire l'appel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Présents"
          value={stats.present}
          subtitle={`sur ${stats.total} apprenants`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Absents"
          value={stats.absent}
          subtitle="Aujourd'hui"
          icon={<AlertCircle className="w-6 h-6" />}
          color="error"
        />
        <StatCard
          title="Retards"
          value={stats.retard}
          subtitle="Aujourd'hui"
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Taux présence"
          value={`${stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%`}
          subtitle="Aujourd'hui"
          icon={<TrendingUp className="w-6 h-6" />}
          color="primary"
        />
      </div>

      <Card>
        <CardHeader>Évolution hebdomadaire</CardHeader>
        <CardBody className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="retard" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader action={
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-40"
            />
            <Select
              options={[
                { value: '', label: 'Toutes les classes' },
                ...classes.map(c => ({ value: c.id, label: c.nom })),
              ]}
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
            />
          </div>
        }>
          Historique des présences
        </CardHeader>
        <Table<AttendanceRecord>
          data={filteredRecords.slice(0, 20)}
          columns={columns}
          keyExtractor={(row) => row.id}
          pageSize={10}
        />
      </Card>
    </div>
  );
}
