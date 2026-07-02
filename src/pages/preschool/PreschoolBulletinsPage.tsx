import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Send, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';
import {
  useBulletins,
  useEvaluationPeriods,
  usePublishBulletin,
  bulletinStatusLabels,
  ratingLabels,
  ratingColors,
} from '../../hooks/useGrades';
import { gradesApi, type BulletinApiModel, studentsApi } from '../../lib/api';

export function PreschoolBulletinsPage() {
  const [periodFilter, setPeriodFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<BulletinApiModel | null>(null);
  const [detail, setDetail] = useState<BulletinApiModel | null>(null);
  const [directorComment, setDirectorComment] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: periods } = useEvaluationPeriods();
  const { data: bulletins, refetch } = useBulletins({
    period_uuid: periodFilter || undefined,
    status: statusFilter || undefined,
  });
  const { data: studentsData } = useQuery({
    queryKey: ['students-api', 1],
    queryFn: () => studentsApi.list(1, 100),
  });
  const publishMutation = usePublishBulletin();

  const studentMap = Object.fromEntries(
    (studentsData?.items ?? []).map(s => [s.uuid, s.full_name]),
  );
  const periodMap = Object.fromEntries(
    (periods ?? []).map(p => [p.uuid, p.name]),
  );

  const handleView = async (bulletin: BulletinApiModel) => {
    setLoading(true);
    try {
      const full = await gradesApi.getBulletin(bulletin.uuid);
      setDetail(full);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selected) return;
    try {
      await publishMutation.mutateAsync({ uuid: selected.uuid, comment: directorComment || undefined });
      setSelected(null);
      setDirectorComment('');
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Bulletins maternelle</h1>
        <p className="text-secondary-500 mt-1">Publication et consultation des bulletins trimestriels</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Trimestre"
          value={periodFilter}
          onChange={e => setPeriodFilter(e.target.value)}
          options={[
            { value: '', label: 'Tous les trimestres' },
            ...(periods?.map(p => ({ value: p.uuid, label: p.name })) ?? []),
          ]}
        />
        <Select
          label="Statut"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'Tous' },
            { value: 'draft', label: 'Brouillon' },
            { value: 'published', label: 'Publié' },
            { value: 'delivered', label: 'Remis' },
          ]}
        />
      </div>

      <Card>
        <CardBody className="p-0">
          {!bulletins?.items?.length ? (
            <div className="py-16 text-center text-secondary-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun bulletin trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bulletins.items.map(b => (
                <div key={b.uuid} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900">
                      {studentMap[b.student_uuid] ?? b.student_uuid.slice(0, 8) + '…'}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {periodMap[b.period_uuid] ?? 'Trimestre'}
                    </p>
                  </div>
                  <Badge variant={b.status === 'published' ? 'success' : b.status === 'draft' ? 'warning' : 'default'}>
                    {bulletinStatusLabels[b.status] ?? b.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" icon={<Eye className="w-4 h-4" />} onClick={() => handleView(b)}>
                      Voir
                    </Button>
                    {b.status === 'draft' && (
                      <Button size="sm" icon={<Send className="w-4 h-4" />} onClick={() => setSelected(b)}>
                        Publier
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Publish modal */}
      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Publier le bulletin">
        <ModalBody>
          <p className="text-sm text-secondary-600 mb-4">
            Le bulletin sera visible par les parents après publication.
          </p>
          <textarea
            value={directorComment}
            onChange={e => setDirectorComment(e.target.value)}
            rows={3}
            placeholder="Commentaire du directeur (optionnel)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setSelected(null)}>Annuler</Button>
          <Button onClick={handlePublish} loading={publishMutation.isPending}>Publier</Button>
        </ModalFooter>
      </Modal>

      {/* Detail modal */}
      <Modal isOpen={Boolean(detail)} onClose={() => setDetail(null)} title="Détail du bulletin">
        <ModalBody>
          {loading ? (
            <p className="text-secondary-400">Chargement...</p>
          ) : detail ? (
            <div className="space-y-4">
              {detail.teacher_comment && (
                <div>
                  <p className="text-xs font-medium text-secondary-500 uppercase">Enseignant</p>
                  <p className="text-sm text-secondary-700">{detail.teacher_comment}</p>
                </div>
              )}
              {detail.director_comment && (
                <div>
                  <p className="text-xs font-medium text-secondary-500 uppercase">Directeur</p>
                  <p className="text-sm text-secondary-700">{detail.director_comment}</p>
                </div>
              )}
              {detail.evaluations?.map(ev => (
                <div key={ev.uuid} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-secondary-600">{ev.competence_uuid.slice(0, 8)}…</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${ratingColors[ev.rating]}`}>
                    {ratingLabels[ev.rating]}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setDetail(null)}>Fermer</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
