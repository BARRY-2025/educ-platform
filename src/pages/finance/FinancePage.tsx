import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import { invoices, students, payments } from '../../mock/data';
import type { Invoice } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const statusLabels: Record<string, string> = {
  paye: 'Payé',
  partiel: 'Partiel',
  en_attente: 'En attente',
  en_retard: 'En retard',
};

const statusVariants: Record<string, 'success' | 'warning' | 'error' | 'secondary'> = {
  paye: 'success',
  partiel: 'warning',
  en_attente: 'secondary',
  en_retard: 'error',
};

export function FinancePage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter(inv => {
    const student = students.find(s => s.id === inv.studentId);
    const matchesSearch = searchQuery === '' ||
      student?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.numero.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === '' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalFacture = invoices.reduce((sum, inv) => sum + inv.montantTotal, 0);
  const totalPaye = invoices.reduce((sum, inv) => sum + inv.montantPaye, 0);
  const totalEnAttente = invoices.reduce((sum, inv) => sum + inv.reste, 0);

  const monthlyRevenue = [
    { month: 'Sep', revenus: 45000000 },
    { month: 'Oct', revenus: 48000000 },
    { month: 'Nov', revenus: 52000000 },
    { month: 'Dec', revenus: 38000000 },
    { month: 'Jan', revenus: 55000000 },
    { month: 'Fév', revenus: 45750000 },
  ];

  const paymentDistribution = [
    { name: 'Payé', value: 850, color: '#10b981' },
    { name: 'Partiel', value: 280, color: '#f59e0b' },
    { name: 'En attente', value: 120, color: '#ef4444' },
  ];

  const columns = [
    {
      key: 'numero',
      header: 'N° Facture',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-mono text-sm text-primary-600">{value as string}</span>
      ),
    },
    {
      key: 'studentId',
      header: 'Apprenant',
      render: (value: unknown) => {
        const student = students.find(s => s.id === value);
        if (!student) return null;
        return (
          <div>
            <p className="font-medium text-secondary-900">{student.prenom} {student.nom}</p>
            <p className="text-xs text-secondary-500">{student.matricule}</p>
          </div>
        );
      },
    },
    {
      key: 'montantTotal',
      header: 'Montant',
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold">{Number(value).toLocaleString()} FCFA</span>
      ),
    },
    {
      key: 'montantPaye',
      header: 'Payé',
      render: (value: unknown) => (
        <span className="text-success-600 font-medium">{Number(value).toLocaleString()} FCFA</span>
      ),
    },
    {
      key: 'reste',
      header: 'Reste',
      render: (value: unknown) => (
        <span className={Number(value) > 0 ? 'text-error-600 font-semibold' : 'text-success-600'}>
          {Number(value).toLocaleString()} FCFA
        </span>
      ),
    },
    {
      key: 'dateEcheance',
      header: 'Échéance',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (value: unknown) => (
        <Badge variant={statusVariants[value as string]}>{statusLabels[value as string]}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Invoice) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInvoice(row);
              setShowPaymentModal(true);
            }}
          >
            Encaisser
          </Button>
          <Button size="sm" variant="ghost">
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Finance</h1>
          <p className="text-secondary-500 mt-1">Gestion des factures et paiements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Rapport
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Nouvelle facture
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total facturé"
          value={`${(totalFacture / 1000000).toFixed(1)}M`}
          subtitle="FCFA"
          icon={<DollarSign className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Total encaissé"
          value={`${(totalPaye / 1000000).toFixed(1)}M`}
          subtitle="FCFA"
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="En attente"
          value={`${(totalEnAttente / 1000000).toFixed(1)}M`}
          subtitle="FCFA"
          icon={<Clock className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Taux recouvrement"
          value={`${((totalPaye / totalFacture) * 100).toFixed(1)}%`}
          subtitle="Ce mois"
          icon={<CreditCard className="w-6 h-6" />}
          color="accent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>Évolution des revenus</CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip formatter={(v: number) => `${v.toLocaleString()} FCFA`} />
                <Line type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Répartition</CardHeader>
          <CardBody className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {paymentDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-secondary-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader action={
          <div className="flex items-center gap-3">
            <Input
              placeholder="Rechercher..."
              icon={<></>}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            <Select
              options={[
                { value: '', label: 'Tous les statuts' },
                { value: 'paye', label: 'Payé' },
                { value: 'partiel', label: 'Partiel' },
                { value: 'en_attente', label: 'En attente' },
                { value: 'en_retard', label: 'En retard' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        }>
          Factures
        </CardHeader>
        <Table<Invoice>
          data={filteredInvoices}
          columns={columns}
          keyExtractor={(row) => row.id}
          pageSize={10}
        />
      </Card>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
        title="Encaisser un paiement"
      >
        <ModalBody>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-secondary-600">Facture: {selectedInvoice.numero}</p>
                <p className="text-lg font-semibold text-secondary-900 mt-1">
                  Reste à payer: {selectedInvoice.reste.toLocaleString()} FCFA
                </p>
              </div>
              <Input
                label="Montant à encaisser"
                type="number"
                placeholder="Entrez le montant"
              />
              <Select
                label="Mode de paiement"
                options={[
                  { value: 'especes', label: 'Espèces' },
                  { value: 'cheque', label: 'Chèque' },
                  { value: 'virement', label: 'Virement bancaire' },
                  { value: 'mobile_money', label: 'Mobile Money' },
                ]}
              />
              <Input label="Référence (optionnel)" placeholder="N° chèque, réf. transaction..." />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Annuler
          </Button>
          <Button icon={<CheckCircle className="w-4 h-4" />}>
            Encaisser
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
