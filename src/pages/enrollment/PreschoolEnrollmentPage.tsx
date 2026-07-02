import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Baby,
  Users,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  School,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAcademicYears } from '../../hooks/useEnrollment';
import { studentsApi, guardiansApi, enrollmentApi } from '../../lib/api';

const STEPS = [
  { id: 1, label: 'Enfant', icon: Baby },
  { id: 2, label: 'Tuteur', icon: Users },
  { id: 3, label: 'Documents', icon: FileText },
  { id: 4, label: 'Confirmation', icon: CheckCircle },
];

interface ChildForm {
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  blood_group: string;
  matricule: string;
}

interface GuardianForm {
  firstname: string;
  lastname: string;
  relation: string;
  phone_primary: string;
  email: string;
  address: string;
}

export function PreschoolEnrollmentPage() {
  const navigate = useNavigate();
  const { data: yearsData } = useAcademicYears();
  const activeYear = yearsData?.items?.find(y => y.is_active) ?? yearsData?.items?.[0];

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [child, setChild] = useState<ChildForm>({
    firstname: '',
    lastname: '',
    date_of_birth: '',
    gender: 'female',
    blood_group: '',
    matricule: `MAT-${Date.now().toString().slice(-6)}`,
  });

  const [guardian, setGuardian] = useState<GuardianForm>({
    firstname: '',
    lastname: '',
    relation: 'mother',
    phone_primary: '',
    email: '',
    address: '',
  });

  const [documentsComplete, setDocumentsComplete] = useState(false);
  const [feePaid, setFeePaid] = useState(false);

  const canNext = () => {
    if (step === 1) return child.firstname && child.lastname && child.date_of_birth;
    if (step === 2) return guardian.firstname && guardian.lastname && guardian.phone_primary;
    if (step === 3) return documentsComplete;
    return true;
  };

  const handleSubmit = async () => {
    if (!activeYear) {
      setError('Aucune année académique active trouvée.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const student = await studentsApi.create({
        matricule: child.matricule,
        firstname: child.firstname,
        lastname: child.lastname,
        date_of_birth: child.date_of_birth,
        gender: child.gender,
        cycle: 'preschool',
        blood_group: child.blood_group || undefined,
        status: 'pre_registered',
      });

      await guardiansApi.create({
        firstname: guardian.firstname,
        lastname: guardian.lastname,
        relation: guardian.relation,
        phone_primary: guardian.phone_primary,
        email: guardian.email || undefined,
        address: guardian.address || undefined,
        student_uuid: student.uuid,
        is_primary: true,
      });

      const enrollment = await enrollmentApi.createEnrollment({
        academic_year_uuid: activeYear.uuid,
        student_uuid: student.uuid,
        documents_complete: documentsComplete,
        registration_fee_paid: feePaid,
      });

      await enrollmentApi.submitEnrollment(enrollment.uuid);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la pré-inscription');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center animate-fade-in">
        <Card className="border-2 border-success-200">
          <CardBody className="py-12">
            <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Pré-inscription envoyée !</h2>
            <p className="text-secondary-500 mb-6">
              Le dossier de <strong>{child.firstname} {child.lastname}</strong> a été soumis à la direction pour validation.
              Vous recevrez une confirmation par SMS/email.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => navigate('/enrollments')}>
                Suivre les inscriptions
              </Button>
              <Button onClick={() => { setSuccess(false); setStep(1); }}>
                Nouvelle inscription
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-3">
          <School className="w-4 h-4" />
          Inscription Maternelle — Phase 1
        </div>
        <h1 className="text-2xl font-bold text-secondary-900">Pré-inscription enfant</h1>
        <p className="text-secondary-500 mt-1">
          Année {activeYear?.name ?? '...'} — {activeYear ? `${activeYear.start_date} → ${activeYear.end_date}` : ''}
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                active ? 'bg-primary-100 text-primary-700' : done ? 'text-success-600' : 'text-secondary-400'
              }`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-secondary-300" />}
            </React.Fragment>
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-error-50 text-error-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Card>
        <CardBody className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Informations de l'enfant</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" required value={child.firstname}
                  onChange={e => setChild({ ...child, firstname: e.target.value })} />
                <Input label="Nom" required value={child.lastname}
                  onChange={e => setChild({ ...child, lastname: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date de naissance" type="date" required value={child.date_of_birth}
                  onChange={e => setChild({ ...child, date_of_birth: e.target.value })} />
                <Select label="Sexe" required value={child.gender}
                  onChange={e => setChild({ ...child, gender: e.target.value as 'male' | 'female' })}
                  options={[{ value: 'female', label: 'Fille' }, { value: 'male', label: 'Garçon' }]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Groupe sanguin" placeholder="Ex: O+" value={child.blood_group}
                  onChange={e => setChild({ ...child, blood_group: e.target.value })} />
                <Input label="Matricule" value={child.matricule}
                  onChange={e => setChild({ ...child, matricule: e.target.value })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Tuteur légal</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" required value={guardian.firstname}
                  onChange={e => setGuardian({ ...guardian, firstname: e.target.value })} />
                <Input label="Nom" required value={guardian.lastname}
                  onChange={e => setGuardian({ ...guardian, lastname: e.target.value })} />
              </div>
              <Select label="Relation" required value={guardian.relation}
                onChange={e => setGuardian({ ...guardian, relation: e.target.value })}
                options={[
                  { value: 'mother', label: 'Mère' },
                  { value: 'father', label: 'Père' },
                  { value: 'guardian', label: 'Tuteur légal' },
                  { value: 'grandparent', label: 'Grand-parent' },
                  { value: 'other', label: 'Autre' },
                ]} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Téléphone principal" required placeholder="+221 77 000 00 00"
                  value={guardian.phone_primary}
                  onChange={e => setGuardian({ ...guardian, phone_primary: e.target.value })} />
                <Input label="Email" type="email" value={guardian.email}
                  onChange={e => setGuardian({ ...guardian, email: e.target.value })} />
              </div>
              <Input label="Adresse" value={guardian.address}
                onChange={e => setGuardian({ ...guardian, address: e.target.value })} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Documents & frais</h2>
              <p className="text-sm text-secondary-500 mb-4">Cochez les éléments fournis avec le dossier :</p>
              {[
                { label: 'Acte de naissance', checked: documentsComplete, onChange: setDocumentsComplete },
                { label: 'Carnet de vaccination', checked: documentsComplete, onChange: setDocumentsComplete },
                { label: 'Certificat médical', checked: documentsComplete, onChange: setDocumentsComplete },
              ].map(doc => (
                <label key={doc.label} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={doc.checked} onChange={e => doc.onChange(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm text-secondary-700">{doc.label}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer mt-4">
                <input type="checkbox" checked={feePaid} onChange={e => setFeePaid(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded" />
                <div>
                  <span className="text-sm font-medium text-secondary-700">Frais de dossier versés</span>
                  <p className="text-xs text-secondary-400">25 000 FCFA (si applicable)</p>
                </div>
              </label>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Récapitulatif</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-secondary-400 uppercase tracking-wide mb-1">Enfant</p>
                  <p className="font-medium">{child.firstname} {child.lastname}</p>
                  <p className="text-sm text-secondary-500">Né(e) le {child.date_of_birth} — {child.matricule}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-secondary-400 uppercase tracking-wide mb-1">Tuteur</p>
                  <p className="font-medium">{guardian.firstname} {guardian.lastname}</p>
                  <p className="text-sm text-secondary-500">{guardian.phone_primary}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant={documentsComplete ? 'success' : 'error'}>
                    {documentsComplete ? 'Documents OK' : 'Documents incomplets'}
                  </Badge>
                  <Badge variant={feePaid ? 'success' : 'warning'}>
                    {feePaid ? 'Frais payés' : 'Frais en attente'}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setStep(s => s - 1)} disabled={step === 1}
              icon={<ChevronLeft className="w-4 h-4" />}>
              Précédent
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                Suivant
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading} disabled={!canNext()}>
                Soumettre la pré-inscription
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
