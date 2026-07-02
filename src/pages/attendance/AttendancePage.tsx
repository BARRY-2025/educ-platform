import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  QrCode,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { useAttendances, attendanceStatusLabels, attendanceStatusColors } from '../../hooks/useAttendance';
import type { AttendanceRecordApiModel } from '../../lib/api';

export function AttendancePage() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const { data, isLoading } = useAttendances(dateFilter);

  const stats = data?.stats ?? { total: 0, present: 0, absent: 0, late: 0, arrived_gate: 0, left: 0 };
  const records = data?.items ?? [];

  const columns = [
    {
      key: 'student_uuid',
      header: 'Élève',
      render: (value: unknown) => (
        <span className="font-mono text-sm text-secondary-700">{(value as string).slice(0, 12)}...</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (value: unknown) => (
        <Badge variant={attendanceStatusColors[value as string] ?? 'secondary'}>
          {attendanceStatusLabels[value as string] ?? (value as string)}
        </Badge>
      ),
    },
    {
      key: 'gate_arrival_time',
      header: 'Arrivée portail',
      render: (v: unknown) => v ? new Date(v as string).toLocaleTimeString('fr-FR') : '—',
    },
    {
      key: 'class_check_time',
      header: 'Pointage classe',
      render: (v: unknown) => v ? new Date(v as string).toLocaleTimeString('fr-FR') : '—',
    },
    {
      key: 'exit_time',
      header: 'Sortie',
      render: (v: unknown) => v ? new Date(v as string).toLocaleTimeString('fr-FR') : '—',
    },
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
          value={stats.present ?? 0}
          subtitle={`sur ${stats.total ?? 0} enregistrements`}
          icon={<CheckCircle className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Absents"
          value={stats.absent ?? 0}
          subtitle="Aujourd'hui"
          icon={<AlertCircle className="w-6 h-6" />}
          color="error"
        />
        <StatCard
          title="Retards"
          value={stats.late ?? 0}
          subtitle="Aujourd'hui"
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Taux présence"
          value={`${stats.total > 0 ? (((stats.present ?? 0) / stats.total) * 100).toFixed(1) : 0}%`}
          subtitle="Aujourd'hui"
          icon={<TrendingUp className="w-6 h-6" />}
          color="primary"
        />
      </div>

      <Card>
        <CardHeader action={
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
        }>
          Historique des présences — {dateFilter}
        </CardHeader>
        {isLoading ? (
          <CardBody><p className="text-center text-secondary-400 py-8">Chargement...</p></CardBody>
        ) : (
          <Table<AttendanceRecordApiModel>
            data={records}
            columns={columns}
            keyExtractor={(row) => row.uuid}
            pageSize={10}
            emptyMessage="Aucune présence enregistrée"
          />
        )}
      </Card>
    </div>
  );
}
