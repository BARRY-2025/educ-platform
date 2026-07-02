import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardBody } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { useStudents } from '../../hooks/useStudents';
import type { Student } from '../../types';

const statusLabels: Record<string, string> = {
  actif: 'Actif',
  inactif: 'Inactif',
  diplome: 'Diplômé',
  transfere: 'Transféré',
  suspendu: 'Suspendu',
};

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'secondary' | 'primary'> = {
  actif: 'success',
  inactif: 'warning',
  diplome: 'primary',
  transfere: 'secondary',
  suspendu: 'error',
};

export function StudentsListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useStudents();
  const students = data?.items ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchQuery === '' ||
      student.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.matricule.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || student.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'nom',
      header: 'Apprenant',
      sortable: true,
      render: (_: unknown, row: Student) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${row.prenom} ${row.nom}`} size="sm" />
          <div>
            <p className="font-medium text-secondary-900">{row.prenom} {row.nom}</p>
            <p className="text-xs text-secondary-500">{row.matricule}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'sexe',
      header: 'Sexe',
      sortable: true,
      render: (value: unknown) => (
        <Badge variant={value === 'M' ? 'primary' : 'accent'} size="sm">
          {value === 'M' ? 'M' : 'F'}
        </Badge>
      ),
    },
    {
      key: 'dateNaissance',
      header: 'Date de naissance',
      sortable: true,
      render: (value: unknown) => (
        <span className="text-sm text-secondary-600">
          {new Date(value as string).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key: 'ville',
      header: 'Ville',
      sortable: true,
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (value: unknown) => (
        <Badge variant={statusVariants[value as string]} size="sm">
          {statusLabels[value as string]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Student) => (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/students/${row.id}`); }}
            className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-lg text-secondary-400 hover:text-accent-600 hover:bg-accent-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1.5 rounded-lg text-secondary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Apprenants</h1>
          <p className="text-secondary-500 mt-1">Gestion des apprenants inscrits</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
            Nouvel apprenant
          </Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, prénom ou matricule..."
                icon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'actif', label: 'Actif' },
                { value: 'inactif', label: 'Inactif' },
                { value: 'diplome', label: 'Diplômé' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-primary-600">{isLoading ? '...' : students.length}</p>
          <p className="text-sm text-secondary-500">Total</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-success-600">{students.filter(s => s.statut === 'actif').length}</p>
          <p className="text-sm text-secondary-500">Actifs</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-warning-600">{students.filter(s => s.statut === 'inactif').length}</p>
          <p className="text-sm text-secondary-500">Inactifs</p>
        </Card>
        <Card padding="sm" className="text-center p-4">
          <p className="text-2xl font-bold text-accent-600">{students.filter(s => s.sexe === 'F').length}</p>
          <p className="text-sm text-secondary-500">Filles</p>
        </Card>
      </div>

      <Card>
        <Table<Student>
          data={filteredStudents}
          columns={columns}
          keyExtractor={(row) => row.id}
          onRowClick={(row) => navigate(`/students/${row.id}`)}
          pageSize={10}
          emptyMessage="Aucun apprenant trouvé"
        />
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nouvel apprenant"
        size="lg"
      >
        <ModalBody>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nom" placeholder="Nom de famille" required />
              <Input label="Prénom" placeholder="Prénom" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date de naissance" type="date" required />
              <Input label="Lieu de naissance" placeholder="Ville" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Sexe"
                required
                options={[
                  { value: 'M', label: 'Masculin' },
                  { value: 'F', label: 'Féminin' },
                ]}
              />
              <Select
                label="Cycle"
                required
                options={[
                  { value: 'preschool', label: 'Maternelle' },
                  { value: 'primary', label: 'Primaire' },
                ]}
              />
            </div>
            <Input label="Email" type="email" placeholder="email@exemple.com" />
            <Input label="Téléphone" placeholder="+221 77 123 45 67" />
            <Input label="Adresse" placeholder="Adresse complète" />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annuler
          </Button>
          <Button onClick={() => setShowAddModal(false)}>
            Enregistrer
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
