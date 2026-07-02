import React, { useState } from 'react';
import { FileText, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  useBulletins,
  useEvaluationPeriods,
  useCompetences,
  ratingLabels,
  ratingColors,
  bulletinStatusLabels,
} from '../../hooks/useGrades';
import { gradesApi, type BulletinApiModel } from '../../lib/api';
import { Modal, ModalBody, ModalFooter } from '../../components/ui/Modal';

export function ParentBulletinsPage() {
  const [detail, setDetail] = useState<BulletinApiModel | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: bulletins, isLoading } = useBulletins({ status: 'published' });
  const { data: periods } = useEvaluationPeriods();
  const { data: competences } = useCompetences();

  const periodMap = Object.fromEntries((periods ?? []).map(p => [p.uuid, p.name]));
  const competenceMap = Object.fromEntries((competences ?? []).map(c => [c.uuid, c.name]));

  const published = bulletins?.items?.filter(
    b => b.status === 'published' || b.status === 'delivered',
  ) ?? [];

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Bulletins de mon enfant</h1>
        <p className="text-secondary-500 mt-1">Consultez les bulletins trimestriels publiés</p>
      </div>

      <Card>
        <CardBody className="p-0">
          {isLoading ? (
            <div className="py-16 text-center text-secondary-400">Chargement...</div>
          ) : !published.length ? (
            <div className="py-16 text-center text-secondary-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun bulletin publié pour le moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {published.map(b => (
                <div key={b.uuid} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1">
                    <p className="font-medium text-secondary-900">
                      {periodMap[b.period_uuid] ?? 'Bulletin trimestriel'}
                    </p>
                    <p className="text-sm text-secondary-500">
                      Publié le {b.published_at ? new Date(b.published_at).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </div>
                  <Badge variant="success">{bulletinStatusLabels[b.status]}</Badge>
                  <Button size="sm" icon={<Eye className="w-4 h-4" />} onClick={() => handleView(b)}>
                    Consulter
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal isOpen={Boolean(detail)} onClose={() => setDetail(null)} title="Bulletin trimestriel">
        <ModalBody>
          {loading ? (
            <p className="text-secondary-400">Chargement...</p>
          ) : detail ? (
            <div className="space-y-4">
              {detail.teacher_comment && (
                <blockquote className="border-l-4 border-primary-300 pl-4 text-sm text-secondary-700 italic">
                  {detail.teacher_comment}
                </blockquote>
              )}
              <h3 className="font-semibold text-secondary-900">Compétences évaluées</h3>
              {detail.evaluations?.map(ev => (
                <div key={ev.uuid} className="flex items-center justify-between py-2">
                  <span className="text-sm text-secondary-700">
                    {competenceMap[ev.competence_uuid] ?? ev.competence_uuid}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ratingColors[ev.rating]}`}>
                    {ratingLabels[ev.rating]}
                  </span>
                </div>
              ))}
              {detail.director_comment && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-secondary-500 mb-1">Directeur</p>
                  <p className="text-sm text-secondary-700">{detail.director_comment}</p>
                </div>
              )}
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
