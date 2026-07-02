import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  UserCheck,
  School,
  Zap,
  FileQuestion,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import {
  useEnrollments,
  useClasses,
  enrollmentStatusLabels,
  enrollmentStatusColors,
} from '../../hooks/useEnrollment';
import { enrollmentApi, type EnrollmentApiModel } from '../../lib/api';

const STATUS_TABS = [
  { value: '', label: 'Tous' },
  { value: 'pending_validation', label: 'À valider' },
  { value: 'approved', label: 'Approuvés' },
  { value: 'class_assigned', label: 'Classe attribuée' },
  { value: 'active', label: 'Actifs' },
];

export function EnrollmentManagementPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('pending_validation');
  const [selected, setSelected] = useState<EnrollmentApiModel | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data, isLoading, refetch } = useEnrollments(statusFilter || undefined);
  const { data: classesData } = useClasses();

  const handleAction = async (action: () => Promise<unknown>) => {
    setActionLoading(true);
    try {
      await action();
      await refetch();
      setSelected(null);
      setAssignModal(false);
      setRejectModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Gestion des inscriptions</h1>
          <p className="text-secondary-500 mt-1">Validation et attribution des classes — Maternelle</p>
        </div>
        <Button icon={<ClipboardList className="w-4 h-4" />} onClick={() => navigate('/enrollment/preschool')}>
          Nouvelle pré-inscription
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button key={tab.value} onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-secondary-400">Chargement...</div>
          ) : !data?.items?.length ? (
            <div className="py-16 text-center text-secondary-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucune inscription trouvée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.items.map(enrollment => (
                <div key={enrollment.uuid}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-secondary-900">
                        Élève {enrollment.student_uuid.slice(0, 8)}...
                      </p>
                      <Badge variant={enrollmentStatusColors[enrollment.status] ?? 'secondary'} size="sm">
                        {enrollmentStatusLabels[enrollment.status] ?? enrollment.status}
                      </Badge>
                      <Badge variant="secondary" size="sm">{enrollment.phase}</Badge>
                    </div>
                    <p className="text-xs text-secondary-400">
                      Soumis: {enrollment.submitted_at ? new Date(enrollment.submitted_at).toLocaleString('fr-FR') : '—'}
                      {enrollment.class_uuid && ` · Classe: ${enrollment.class_uuid.slice(0, 8)}...`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {enrollment.status === 'pending_validation' && (
                      <>
                        <Button size="sm" variant="outline" icon={<FileQuestion className="w-3 h-3" />}
                          onClick={() => handleAction(() =>
                            enrollmentApi.requestDocuments(enrollment.uuid, 'Veuillez fournir le certificat médical.')
                          )}>
                          Demander docs
                        </Button>
                        <Button size="sm" icon={<CheckCircle className="w-3 h-3" />}
                          onClick={() => handleAction(() =>
                            enrollmentApi.validateEnrollment(enrollment.uuid, 'Dossier complet')
                          )}>
                          Approuver
                        </Button>
                        <Button size="sm" variant="danger" icon={<XCircle className="w-3 h-3" />}
                          onClick={() => { setSelected(enrollment); setRejectModal(true); }}>
                          Rejeter
                        </Button>
                      </>
                    )}
                    {enrollment.status === 'approved' && (
                      <Button size="sm" icon={<School className="w-3 h-3" />}
                        onClick={() => { setSelected(enrollment); setAssignModal(true); }}>
                        Attribuer classe
                      </Button>
                    )}
                    {enrollment.status === 'class_assigned' && (
                      <Button size="sm" variant="accent" icon={<Zap className="w-3 h-3" />}
                        onClick={() => handleAction(() => enrollmentApi.activateEnrollment(enrollment.uuid))}>
                        Activer
                      </Button>
                    )}
                    {enrollment.status === 'documents_requested' && (
                      <Button size="sm" icon={<UserCheck className="w-3 h-3" />}
                        onClick={() => handleAction(() =>
                          enrollmentApi.validateEnrollment(enrollment.uuid)
                        )}>
                        Valider
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Assign class modal */}
      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Attribuer une classe">
        <ModalBody>
          <Select label="Classe" required value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            options={[
              { value: '', label: 'Sélectionner une classe' },
              ...(classesData?.items ?? []).map(c => ({
                value: c.uuid,
                label: `${c.name} (${c.level}) — ${c.available_seats} places`,
              })),
            ]} />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setAssignModal(false)}>Annuler</Button>
          <Button loading={actionLoading} disabled={!selectedClass}
            onClick={() => selected && handleAction(() =>
              enrollmentApi.assignClass(selected.uuid, selectedClass)
            )}>
            Confirmer
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject modal */}
      <Modal isOpen={rejectModal} onClose={() => setRejectModal(false)} title="Rejeter l'inscription">
        <ModalBody>
          <textarea className="w-full border border-gray-200 rounded-lg p-3 text-sm"
            rows={3} placeholder="Motif du rejet..."
            value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setRejectModal(false)}>Annuler</Button>
          <Button variant="danger" loading={actionLoading} disabled={!rejectReason}
            onClick={() => selected && handleAction(() =>
              enrollmentApi.rejectEnrollment(selected.uuid, rejectReason)
            )}>
            Rejeter
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
