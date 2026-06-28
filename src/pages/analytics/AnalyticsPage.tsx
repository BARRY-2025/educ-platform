import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  GraduationCap,
  CalendarCheck,
  MapPin,
  Download,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { kpis, etablissements, rankings } from '../../mock/data';
import type { KPI, Ranking } from '../../types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export function AnalyticsPage() {
  const [periodFilter, setPeriodFilter] = useState('2024');
  const [regionFilter, setRegionFilter] = useState('');

  const nationalStats = {
    totalStudents: 2850000,
    totalEtablissements: 4521,
    tauxPresence: 91.5,
    moyenneNationale: 11.8,
    tauxReussite: 78.2,
  };

  const performanceByRegion = [
    { region: 'Dakar', moyenne: 13.2, presence: 95, reussite: 85 },
    { region: 'Thiès', moyenne: 12.5, presence: 93, reussite: 82 },
    { region: 'Saint-Louis', moyenne: 12.8, presence: 94, reussite: 83 },
    { region: 'Kaolack', moyenne: 11.5, presence: 89, reussite: 75 },
    { region: 'Ziguinchor', moyenne: 11.2, presence: 88, reussite: 73 },
    { region: 'Diourbel', moyenne: 11.8, presence: 90, reussite: 77 },
  ];

  const evolutionData = [
    { year: '2020', moyenne: 10.8, reussite: 72 },
    { year: '2021', moyenne: 11.2, reussite: 74 },
    { year: '2022', moyenne: 11.4, reussite: 76 },
    { year: '2023', moyenne: 11.6, reussite: 77 },
    { year: '2024', moyenne: 11.8, reussite: 78.2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-500 mt-1">Statistiques nationales et performances</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            options={[
              { value: '2024', label: 'Année 2024-2025' },
              { value: '2023', label: 'Année 2023-2024' },
            ]}
            className="w-48"
          />
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Apprenants (National)"
          value="2.85M"
          subtitle="Inscrits"
          icon={<Users className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Établissements"
          value="4 521"
          subtitle="Actifs"
          icon={<GraduationCap className="w-6 h-6" />}
          color="accent"
        />
        <StatCard
          title="Taux présence"
          value={`${nationalStats.tauxPresence}%`}
          subtitle="Moyenne nationale"
          icon={<CalendarCheck className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Moyenne nationale"
          value={nationalStats.moyenneNationale.toFixed(1)}
          subtitle="/ 20"
          icon={<BarChart3 className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Taux réussite"
          value={`${nationalStats.tauxReussite}%`}
          subtitle="Bac 2024"
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Évolution nationale</CardHeader>
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} domain={[60, 100]} />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="moyenne" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Line yAxisId="right" type="monotone" dataKey="reussite" stroke="#10b981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Performance par région</CardHeader>
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceByRegion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[65, 100]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="region" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="reussite" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>KPIs par établissement</CardHeader>
        <Table<KPI>
          data={kpis}
          columns={[
            {
              key: 'etablissementId',
              header: 'Établissement',
              render: (value: unknown) => {
                const etb = etablissements.find(e => e.id === value);
                return etb?.nom || 'Inconnu';
              },
            },
            {
              key: 'nombreInscrits',
              header: 'Inscrits',
              sortable: true,
              render: (value: unknown) => Number(value).toLocaleString(),
            },
            {
              key: 'tauxPresence',
              header: 'Présence',
              sortable: true,
              render: (value: unknown) => (
                <span className={Number(value) >= 90 ? 'text-success-600 font-medium' : 'text-warning-600'}>
                  {value as number}%
                </span>
              ),
            },
            {
              key: 'moyenneGenerale',
              header: 'Moyenne',
              sortable: true,
              render: (value: unknown) => (
                <span className={Number(value) >= 12 ? 'text-success-600 font-medium' : Number(value) >= 10 ? 'text-warning-600' : 'text-error-600'}>
                  {(value as number).toFixed(2)}
                </span>
              ),
            },
            {
              key: 'tauxReussite',
              header: 'Réussite',
              sortable: true,
              render: (value: unknown) => (
                <span className={Number(value) >= 80 ? 'text-success-600 font-medium' : 'text-warning-600'}>
                  {value as number}%
                </span>
              ),
            },
          ]}
          keyExtractor={(row) => row.id}
        />
      </Card>
    </div>
  );
}
