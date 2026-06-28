import React from 'react';
import {
  Users,
  GraduationCap,
  MapPin,
  CalendarCheck,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function PublicStatisticsPage() {
  const nationalStats = {
    totalStudents: 2850000,
    totalEtablissements: 4521,
    totalEnseignants: 85000,
    tauxPresence: 91.5,
    moyenneNationale: 11.8,
    tauxReussite: 78.2,
  };

  const statsByRegion = [
    { region: 'Dakar', etablissements: 850, eleves: 850000, moyenne: 13.2 },
    { region: 'Thiès', etablissements: 420, eleves: 380000, moyenne: 12.5 },
    { region: 'Saint-Louis', etablissements: 380, eleves: 320000, moyenne: 12.8 },
    { region: 'Kaolack', etablissements: 350, eleves: 290000, moyenne: 11.5 },
    { region: 'Ziguinchor', etablissements: 180, eleves: 150000, moyenne: 11.2 },
    { region: 'Autres', etablissements: 2341, eleves: 860000, moyenne: 11.4 },
  ];

  const typeDistribution = [
    { name: 'Écoles primaires', value: 2800, color: '#10b981' },
    { name: 'Collèges', value: 950, color: '#3b82f6' },
    { name: 'Lycées', value: 420, color: '#f59e0b' },
    { name: 'Universités', value: 18, color: '#8b5cf6' },
    { name: 'Autres', value: 333, color: '#94a3b8' },
  ];

  const evolutionData = [
    { year: '2018', eleves: 2.1, reussite: 68 },
    { year: '2019', eleves: 2.3, reussite: 70 },
    { year: '2020', eleves: 2.4, reussite: 68 },
    { year: '2021', eleves: 2.5, reussite: 72 },
    { year: '2022', eleves: 2.6, reussite: 74 },
    { year: '2023', eleves: 2.75, reussite: 76 },
    { year: '2024', eleves: 2.85, reussite: 78.2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-900">Statistiques nationales</h1>
          <p className="mt-3 text-lg text-secondary-500">
            Données officielles du système éducatif sénégalais
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <Card className="text-center">
            <CardBody className="py-6">
              <Users className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">2.85M</p>
              <p className="text-sm text-secondary-500">Apprenants</p>
            </CardBody>
          </Card>
          <Card className="text-center">
            <CardBody className="py-6">
              <GraduationCap className="w-8 h-8 mx-auto text-accent-500 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">4 521</p>
              <p className="text-sm text-secondary-500">Établissements</p>
            </CardBody>
          </Card>
          <Card className="text-center">
            <CardBody className="py-6">
              <Users className="w-8 h-8 mx-auto text-warning-500 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">85 000</p>
              <p className="text-sm text-secondary-500">Enseignants</p>
            </CardBody>
          </Card>
          <Card className="text-center">
            <CardBody className="py-6">
              <CalendarCheck className="w-8 h-8 mx-auto text-success-500 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">91.5%</p>
              <p className="text-sm text-secondary-500">Taux présence</p>
            </CardBody>
          </Card>
          <Card className="text-center">
            <CardBody className="py-6">
              <BarChart3 className="w-8 h-8 mx-auto text-error-500 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">11.8</p>
              <p className="text-sm text-secondary-500">Moyenne /20</p>
            </CardBody>
          </Card>
          <Card className="text-center">
            <CardBody className="py-6">
              <TrendingUp className="w-8 h-8 mx-auto text-primary-600 mb-2" />
              <p className="text-2xl font-bold text-secondary-900">78.2%</p>
              <p className="text-sm text-secondary-500">Taux réussite</p>
            </CardBody>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Évolution annuelle</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" domain={[60, 100]} stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="eleves" stroke="#3b82f6" strokeWidth={3} name="Élèves (M)" />
                    <Line yAxisId="right" type="monotone" dataKey="reussite" stroke="#10b981" strokeWidth={3} name="Réussite %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Répartition par type</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {typeDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Regional stats */}
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Statistiques par région</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-secondary-500 uppercase">Région</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-secondary-500 uppercase">Établissements</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-secondary-500 uppercase">Apprenants</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-secondary-500 uppercase">Moyenne</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-secondary-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statsByRegion.map((region) => (
                    <tr key={region.region} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-secondary-400" />
                          <span className="font-medium text-secondary-900">{region.region}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-secondary-700">{region.etablissements.toLocaleString()}</td>
                      <td className="px-4 py-4 text-right text-secondary-700">{(region.eleves / 1000).toFixed(0)}K</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-semibold ${region.moyenne >= 12 ? 'text-success-600' : 'text-warning-600'}`}>
                          {region.moyenne.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${region.moyenne >= 12.5 ? 'bg-success-500' : region.moyenne >= 11.5 ? 'bg-primary-500' : 'bg-warning-500'}`}
                            style={{ width: `${(region.moyenne / 20) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-secondary-400 mt-8">
          Données mises à jour le 11 Juin 2024 - Sources: Ministère de l'Éducation Nationale du Sénégal
        </p>
      </div>
    </div>
  );
}
