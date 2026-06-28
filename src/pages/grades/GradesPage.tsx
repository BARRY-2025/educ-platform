import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Share2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { students, subjects, grades, classes, trimesters } from '../../mock/data';
import type { Grade, Student } from '../../types';
import { stat } from 'fs';
import {
  BarChart,
  Bar,
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

export function GradesPage() {
  const [classFilter, setClassFilter] = useState('cls-001');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [trimesterFilter, setTrimesterFilter] = useState('tri-001');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredGrades = grades.filter(g => {
    return true; // Simplified filter
  });

  const classStats = {
    moyenne: 12.8,
    max: 18.5,
    min: 5.5,
    count: 32,
    reussite: 87.5,
  };

  const subjectAverages = subjects.map(subject => {
    const subjectGrades = grades.filter(g => g.subjectId === subject.id);
    const avg = subjectGrades.length > 0
      ? subjectGrades.reduce((sum, g) => sum + g.note, 0) / subjectGrades.length
      : 0;
    return {
      subject: subject.code,
      moyenne: Number(avg.toFixed(2)),
    };
  });

  const columns = [
    {
      key: 'studentId',
      header: 'Apprenant',
      sortable: true,
      render: (value: unknown, row: Grade) => {
        const student = students.find(s => s.id === value);
        if (!student) return null;
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-semibold">
              {student.prenom[0]}{student.nom[0]}
            </div>
            <div>
              <p className="font-medium text-secondary-900">{student.prenom} {student.nom}</p>
              <p className="text-xs text-secondary-500">{student.matricule}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'subjectId',
      header: 'Matière',
      render: (value: unknown) => {
        const subject = subjects.find(s => s.id === value);
        return subject ? (
          <Badge variant="secondary">{subject.code}</Badge>
        ) : null;
      },
    },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'date', header: 'Date', sortable: true },
    {
      key: 'note',
      header: 'Note',
      sortable: true,
      render: (value: unknown) => (
        <span className={`font-bold text-lg ${Number(value) >= 10 ? 'text-success-600' : 'text-error-600'}`}>
          {value as number}/20
        </span>
      ),
    },
    { key: 'commentaire', header: 'Appréciation' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestion des notes</h1>
          <p className="text-secondary-500 mt-1">Saisie et consultation des notes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter bulletins
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
            Saisir des notes
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          options={classes.map(c => ({ value: c.id, label: c.nom }))}
          className="w-48"
        />
        <Select
          value={trimesterFilter}
          onChange={(e) => setTrimesterFilter(e.target.value)}
          options={trimesters.map(t => ({ value: t.id, label: t.nom }))}
          className="w-48"
        />
        <Select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          options={[{ value: '', label: 'Toutes les matières' }, ...subjects.map(s => ({ value: s.id, label: s.nom }))]}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-primary-600">{classStats.moyenne.toFixed(2)}</p>
          <p className="text-sm text-secondary-500">Moyenne classe</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-success-600">{classStats.max}</p>
          <p className="text-sm text-secondary-500">Note max</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-error-600">{classStats.min}</p>
          <p className="text-sm text-secondary-500">Note min</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-accent-600">{classStats.count}</p>
          <p className="text-sm text-secondary-500">Apprenants</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-warning-600">{classStats.reussite}%</p>
          <p className="text-sm text-secondary-500">Taux réussite</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Moyennes par matière</CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAverages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 20]} stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={12} width={50} />
                <Tooltip />
                <Bar dataKey="moyenne" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Répartition des notes</CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { range: '0-5', count: 15 },
                { range: '5-8', count: 35 },
                { range: '8-10', count: 80 },
                { range: '10-12', count: 220 },
                { range: '12-15', count: 380 },
                { range: '15-18', count: 150 },
                { range: '18-20', count: 20 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>Liste des notes</CardHeader>
        <Table<Grade>
          data={filteredGrades.slice(0, 50)}
          columns={columns}
          keyExtractor={(row) => row.id}
          pageSize={15}
        />
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Saisie de notes"
        size="lg"
      >
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Classe"
                required
                options={classes.map(c => ({ value: c.id, label: c.nom }))}
              />
              <Select
                label="Matière"
                required
                options={subjects.map(s => ({ value: s.id, label: s.nom }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Type d'évaluation"
                required
                options={[
                  { value: 'devoir', label: 'Devoir' },
                  { value: 'examen', label: 'Examen' },
                  { value: 'interrogation', label: 'Interrogation' },
                  { value: 'composition', label: 'Composition' },
                ]}
              />
              <Input label="Date" type="date" required />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-secondary-600 mb-3">
                La saisie détaillée des notes par apprenant se fera sur l'écran suivant.
              </p>
              <Button className="w-full">Continuer vers la saisie</Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
