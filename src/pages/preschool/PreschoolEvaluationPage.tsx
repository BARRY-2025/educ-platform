import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Save, FileCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { studentsApi } from '../../lib/api';
import {
  useCompetences,
  useEvaluationPeriods,
  useStudentEvaluations,
  useSaveEvaluations,
  useGenerateBulletin,
  ratingLabels,
  ratingColors,
} from '../../hooks/useGrades';

type CompetenceRating = 'acquired' | 'in_progress' | 'needs_review';

const RATINGS: CompetenceRating[] = ['acquired', 'in_progress', 'needs_review'];

export function PreschoolEvaluationPage() {
  const [periodUuid, setPeriodUuid] = useState('');
  const [studentUuid, setStudentUuid] = useState('');
  const [ratings, setRatings] = useState<Record<string, CompetenceRating>>({});
  const [observations, setObservations] = useState<Record<string, string>>({});
  const [teacherComment, setTeacherComment] = useState('');
  const [message, setMessage] = useState('');

  const { data: periods } = useEvaluationPeriods();
  const { data: competences } = useCompetences();
  const { data: studentsData } = useQuery({
    queryKey: ['students-api', 1],
    queryFn: () => studentsApi.list(1, 100),
  });
  const { data: existingEvals } = useStudentEvaluations(studentUuid || undefined, periodUuid || undefined);
  const saveMutation = useSaveEvaluations();
  const generateMutation = useGenerateBulletin();

  useEffect(() => {
    if (periods?.length && !periodUuid) {
      const active = periods.find(p => p.is_active) ?? periods[0];
      setPeriodUuid(active.uuid);
    }
  }, [periods, periodUuid]);

  useEffect(() => {
    if (!existingEvals) return;
    const newRatings: Record<string, CompetenceRating> = {};
    const newObs: Record<string, string> = {};
    existingEvals.forEach(ev => {
      newRatings[ev.competence_uuid] = ev.rating;
      if (ev.observation) newObs[ev.competence_uuid] = ev.observation;
    });
    setRatings(newRatings);
    setObservations(newObs);
  }, [existingEvals]);

  const students = studentsData?.items?.filter(s => s.cycle === 'preschool') ?? studentsData?.items ?? [];

  const handleSave = async () => {
    if (!studentUuid || !periodUuid || !competences?.length) return;
    setMessage('');
    try {
      const items = competences
        .filter(c => ratings[c.uuid])
        .map(c => ({
          competence_uuid: c.uuid,
          rating: ratings[c.uuid],
          observation: observations[c.uuid],
        }));

      if (!items.length) {
        setMessage('Sélectionnez au moins une compétence.');
        return;
      }

      await saveMutation.mutateAsync({ student_uuid: studentUuid, period_uuid: periodUuid, items });
      setMessage('Évaluations enregistrées.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleGenerate = async () => {
    if (!studentUuid || !periodUuid) return;
    setMessage('');
    try {
      await generateMutation.mutateAsync({
        student_uuid: studentUuid,
        period_uuid: periodUuid,
        teacher_comment: teacherComment || undefined,
      });
      setMessage('Bulletin généré (brouillon). Le directeur peut le publier.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erreur');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Évaluation des compétences</h1>
        <p className="text-secondary-500 mt-1">Maternelle — Langage, motricité, mathématiques, vivre ensemble</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          label="Trimestre"
          value={periodUuid}
          onChange={e => setPeriodUuid(e.target.value)}
          options={periods?.map(p => ({ value: p.uuid, label: p.name })) ?? []}
        />
        <Select
          label="Élève"
          value={studentUuid}
          onChange={e => setStudentUuid(e.target.value)}
          options={[
            { value: '', label: 'Sélectionner un élève' },
            ...students.map(s => ({ value: s.uuid, label: s.full_name })),
          ]}
        />
      </div>

      {studentUuid && competences?.length ? (
        <Card>
          <CardBody className="space-y-6">
            {competences.map(comp => (
              <div key={comp.uuid} className="border-b border-gray-100 pb-5 last:border-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">{comp.code}</Badge>
                  <span className="font-medium text-secondary-900">{comp.name}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {RATINGS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRatings(prev => ({ ...prev, [comp.uuid]: r }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        ratings[comp.uuid] === r
                          ? ratingColors[r]
                          : 'bg-gray-100 text-secondary-600 hover:bg-gray-200'
                      }`}
                    >
                      {ratingLabels[r]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Observation (optionnel)"
                  value={observations[comp.uuid] ?? ''}
                  onChange={e => setObservations(prev => ({ ...prev, [comp.uuid]: e.target.value }))}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                />
              </div>
            ))}

            <div>
              <label className="text-sm font-medium text-secondary-700">Commentaire enseignant</label>
              <textarea
                value={teacherComment}
                onChange={e => setTeacherComment(e.target.value)}
                rows={3}
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Appréciation générale du trimestre..."
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                icon={<Save className="w-4 h-4" />}
                onClick={handleSave}
                loading={saveMutation.isPending}
              >
                Enregistrer les évaluations
              </Button>
              <Button
                variant="secondary"
                icon={<FileCheck className="w-4 h-4" />}
                onClick={handleGenerate}
                loading={generateMutation.isPending}
              >
                Générer le bulletin
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="py-12 text-center text-secondary-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Sélectionnez un trimestre et un élève pour commencer l'évaluation</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
