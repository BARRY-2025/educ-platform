import type {
  User,
  Student,
  Guardian,
  Etablissement,
  AcademicYear,
  Trimester,
  Classe,
  Filiere,
  Subject,
  AttendanceRecord,
  Grade,
  Invoice,
  Payment,
  Notification,
  KPI,
  Ranking,
  DashboardStats,
  ScanToken,
} from '../types';

// ==================== USERS ====================
export const users: User[] = [
  {
    id: 'usr-001',
    email: 'admin@education.gouv',
    nom: 'Moussa',
    prenom: 'Amadou',
    role: 'super_admin',
    telephone: '+221 77 123 45 67',
    actif: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-02-20T15:30:00Z',
  },
  {
    id: 'usr-002',
    email: 'principal@lyceekennedy.sn',
    nom: 'Diallo',
    prenom: 'Fatou',
    role: 'admin_etablissement',
    telephone: '+221 78 234 56 78',
    actif: true,
    createdAt: '2023-03-01T08:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
  {
    id: 'usr-003',
    email: 'prof.ndiaye@lyceekennedy.sn',
    nom: 'Ndiaye',
    prenom: 'Ibrahima',
    role: 'enseignant',
    telephone: '+221 76 345 67 89',
    actif: true,
    createdAt: '2023-09-01T09:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
  },
  {
    id: 'usr-004',
    email: 'parent.ba@gmail.com',
    nom: 'Ba',
    prenom: 'Mouhamadou',
    role: 'parent',
    telephone: '+221 77 456 78 90',
    actif: true,
    createdAt: '2023-09-05T14:00:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
  },
  {
    id: 'usr-005',
    email: 'etudiant@lyceekennedy.sn',
    nom: 'Fall',
    prenom: 'Aminata',
    role: 'apprenant',
    telephone: '+221 78 567 89 01',
    actif: true,
    createdAt: '2023-09-03T10:00:00Z',
    updatedAt: '2024-02-18T16:00:00Z',
  },
];

// ==================== ETABLISSEMENTS ====================
export const etablissements: Etablissement[] = [
  {
    id: 'etb-001',
    nom: 'Lycée John F. Kennedy',
    type: 'ecole',
    adresse: 'Avenue Cheikh Anta Diop, Dakar',
    ville: 'Dakar',
    region: 'Dakar',
    telephone: '+221 33 824 00 00',
    email: 'contact@lyceekennedy.sn',
    code: 'LJK-001',
    actif: true,
    createdAt: '1970-09-01',
  },
  {
    id: 'etb-002',
    nom: 'Université Cheikh Anta Diop',
    type: 'universite',
    adresse: 'Campus UCAD, Dakar',
    ville: 'Dakar',
    region: 'Dakar',
    telephone: '+221 33 825 00 00',
    email: 'contact@ucad.sn',
    code: 'UCAD-001',
    actif: true,
    createdAt: '1957-02-24',
  },
  {
    id: 'etb-003',
    nom: 'Institut Supérieur de Technologie',
    type: 'institut',
    adresse: 'Zone Industrielle, Thiès',
    ville: 'Thiès',
    region: 'Thiès',
    telephone: '+221 33 951 00 00',
    email: 'contact@ist-thies.sn',
    code: 'IST-001',
    actif: true,
    createdAt: '1995-06-15',
  },
  {
    id: 'etb-004',
    nom: 'Centre de Formation Professionnelle',
    type: 'centre_formation',
    adresse: 'Quartier HLM, Saint-Louis',
    ville: 'Saint-Louis',
    region: 'Saint-Louis',
    telephone: '+221 33 961 00 00',
    email: 'contact@cfp-sl.sn',
    code: 'CFP-001',
    actif: true,
    createdAt: '2005-01-01',
  },
];

// ==================== FILIERES ====================
export const filieres: Filiere[] = [
  { id: 'fil-001', nom: 'Sciences Mathématiques', code: 'SM', description: 'Filière scientifique axée sur les mathématiques' },
  { id: 'fil-002', nom: 'Sciences Expérimentales', code: 'SE', description: 'Filière scientifique axée sur la biologie et la physique' },
  { id: 'fil-003', nom: 'Lettres Modernes', code: 'LM', description: 'Filière littéraire' },
  { id: 'fil-004', nom: 'Sciences Économiques', code: 'ECO', description: 'Filière économique et sociale' },
  { id: 'fil-005', nom: 'Informatique', code: 'INFO', description: 'Filière technologies de l\'information' },
];

// ==================== ACADEMIC YEARS ====================
export const academicYears: AcademicYear[] = [
  {
    id: 'ay-2024',
    nom: 'Année scolaire 2024-2025',
    dateDebut: '2024-09-01',
    dateFin: '2025-06-30',
    actif: true,
  },
  {
    id: 'ay-2023',
    nom: 'Année scolaire 2023-2024',
    dateDebut: '2023-09-01',
    dateFin: '2024-06-30',
    actif: false,
  },
];

// ==================== TRIMESTERS ====================
export const trimesters: Trimester[] = [
  {
    id: 'tri-001',
    academicYearId: 'ay-2024',
    numero: 1,
    nom: '1er Trimestre',
    dateDebut: '2024-09-01',
    dateFin: '2024-12-15',
  },
  {
    id: 'tri-002',
    academicYearId: 'ay-2024',
    numero: 2,
    nom: '2ème Trimestre',
    dateDebut: '2025-01-05',
    dateFin: '2025-03-31',
  },
  {
    id: 'tri-003',
    academicYearId: 'ay-2024',
    numero: 3,
    nom: '3ème Trimestre',
    dateDebut: '2025-04-01',
    dateFin: '2025-06-30',
  },
];

// ==================== CLASSES ====================
export const classes: Classe[] = [
  { id: 'cls-001', nom: 'Terminale S1', niveau: 'Terminale', filiereId: 'fil-001', etablissementId: 'etb-001', capacite: 35, effectif: 32 },
  { id: 'cls-002', nom: 'Terminale S2', niveau: 'Terminale', filiereId: 'fil-002', etablissementId: 'etb-001', capacite: 35, effectif: 30 },
  { id: 'cls-003', nom: 'Première S', niveau: 'Première', filiereId: 'fil-001', etablissementId: 'etb-001', capacite: 40, effectif: 38 },
  { id: 'cls-004', nom: 'Seconde S', niveau: 'Seconde', filiereId: 'fil-001', etablissementId: 'etb-001', capacite: 45, effectif: 42 },
  { id: 'cls-005', nom: 'Première L', niveau: 'Première', filiereId: 'fil-003', etablissementId: 'etb-001', capacite: 30, effectif: 28 },
];

// ==================== STUDENTS ====================
const generateMatricule = (index: number) => `MAT-2024-${String(index).padStart(5, '0')}`;

const prenomsM = ['Amadou', 'Ibrahima', 'Mouhammadou', 'Cheikh', 'Oumar', 'Abdoulaye', 'Modou', 'Pape', 'Serigne', 'Moustapha', 'Alioune', 'Babacar', 'Souleymane', 'Malick', 'Mamadou'];
const prenomsF = ['Fatou', 'Aminata', 'Mariama', 'Khady', 'Awa', 'Coumba', 'Ndèye', 'Dieynaba', 'Sokhna', 'Astou', 'Rokhaya', 'Fatimata', 'Mame', 'Seynabou', 'Mareme'];
const noms = ['Ndiaye', 'Diallo', 'Fall', 'Ba', 'Sow', 'Diop', 'Mbaye', 'Seck', 'Diedhiou', 'Gueye', 'Sarr', 'Ka', 'Cisse', 'Thiam', 'SY', 'Wade', 'Niang', 'Gay', 'Dione', 'Toure'];
const villes = ['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Tambacounda', 'Diourbel', 'Louga'];

export const students: Student[] = Array.from({ length: 25 }, (_, i) => {
  const Sexe = i % 2 === 0 ? 'M' : 'F';
  const prenom = Sexe === 'M' ? prenomsM[i % prenomsM.length] : prenomsF[i % prenomsF.length];
  const nom = noms[i % noms.length];
  const statuts: Array<'actif' | 'inactif' | 'diplome' | 'transfere' | 'suspendu'> = ['actif', 'actif', 'actif', 'actif', 'inactif'];

  return {
    id: `stu-${String(i + 1).padStart(3, '0')}`,
    matricule: generateMatricule(i + 1),
    nom,
    prenom,
    dateNaissance: `${2005 + Math.floor(i / 10)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    lieuNaissance: villes[i % villes.length],
    sexe: Sexe,
    email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@edu.sn`,
    telephone: Sexe === 'M' ? `+221 77 ${String(100 + i)} 00 ${String(10 + i).padStart(2, '0')}` : `+221 78 ${String(200 + i)} 00 ${String(10 + i).padStart(2, '0')}`,
    adresse: `${i + 10} Rue ${i + 5}`,
    ville: villes[i % villes.length],
    statut: statuts[i % statuts.length],
    etablissementId: 'etb-001',
    dateInscription: '2024-09-01',
    createdAt: '2024-08-15T10:00:00Z',
    updatedAt: '2024-10-20T15:00:00Z',
  };
});

// ==================== GUARDIANS ====================
export const guardians: Guardian[] = students.slice(0, 15).map((student, i) => ({
  id: `grd-${String(i + 1).padStart(3, '0')}`,
  studentId: student.id,
  nom: student.nom,
  prenom: i % 2 === 0 ? 'Mouhamadou' : 'Fatimata',
  relation: i % 3 === 0 ? 'pere' : i % 3 === 1 ? 'mere' : 'tuteur',
  email: `parent.${student.nom.toLowerCase()}@gmail.com`,
  telephone: `+221 77 ${String(300 + i)} 00 ${String(20 + i).padStart(2, '0')}`,
  adresse: student.adresse,
  isPrimary: true,
}));

// ==================== SUBJECTS ====================
export const subjects: Subject[] = [
  { id: 'sub-001', nom: 'Mathématiques', code: 'MATH', coefficient: 5, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-002', nom: 'Physique-Chimie', code: 'PC', coefficient: 4, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-003', nom: 'Sciences de la Vie et de la Terre', code: 'SVT', coefficient: 3, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-004', nom: 'Français', code: 'FR', coefficient: 3, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-005', nom: 'Anglais', code: 'ANG', coefficient: 2, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-006', nom: 'Histoire-Géographie', code: 'HG', coefficient: 2, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-007', nom: 'Philosophie', code: 'PHILO', coefficient: 2, classeId: 'cls-001', enseignantId: 'usr-003' },
  { id: 'sub-008', nom: 'Informatique', code: 'INFO', coefficient: 2, classeId: 'cls-001', enseignantId: 'usr-003' },
];

// ==================== ATTENDANCE ====================
const today = new Date();
const startDate = new Date('2024-09-01');

export const attendanceRecords: AttendanceRecord[] = [];
students.slice(0, 15).forEach((student, studentIdx) => {
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      const statuses: Array<'present' | 'absent' | 'retard' | 'excuse'> = ['present', 'present', 'present', 'present', 'present', 'retard', 'absent', 'excuse'];
      const statusRandom = Math.random();
      let status: 'present' | 'absent' | 'retard' | 'excuse';
      if (statusRandom < 0.85) status = 'present';
      else if (statusRandom < 0.92) status = 'retard';
      else if (statusRandom < 0.97) status = 'absent';
      else status = 'excuse';

      attendanceRecords.push({
        id: `att-${attendanceRecords.length + 1}`,
        studentId: student.id,
        classeId: 'cls-001',
        date: d.toISOString().split('T')[0],
        heureEntree: status !== 'absent' ? `07:${String(30 + (studentIdx % 30)).padStart(2, '0')}:00` : undefined,
        heureSortie: status !== 'absent' ? '14:30:00' : undefined,
        status,
        justification: status === 'absent' || status === 'excuse' ? 'Certificat médical' : undefined,
        recordedBy: 'usr-003',
        createdAt: d.toISOString(),
      });
    }
  }
});

// ==================== GRADES ====================
export const grades: Grade[] = [];
students.slice(0, 15).forEach((student) => {
  subjects.forEach((subject) => {
    for (let seq = 1; seq <= 3; seq++) {
      const baseNote = 10 + Math.random() * 10;
      grades.push({
        id: `grd-${grades.length + 1}`,
        studentId: student.id,
        subjectId: subject.id,
        trimestreId: 'tri-001',
        note: Math.round(baseNote * 2) / 2,
        noteMax: 20,
        type: seq === 3 ? 'composition' : 'devoir',
        date: `2024-${String(9 + Math.floor(seq / 2)).padStart(2, '0')}-${String(seq * 5).padStart(2, '0')}`,
        commentaire: baseNote >= 12 ? 'Bon travail' : baseNote >= 8 ? 'Peut mieux faire' : 'Effort à fournir',
      });
    }
  });
});

// ==================== INVOICES ====================
const invoiceItems = [
  { description: 'Frais de scolarité', montant: 250000 },
  { description: 'Frais d\'inscription', montant: 50000 },
  { description: 'Frais de bibliothèque', montant: 15000 },
  { description: 'Frais de laboratoire', montant: 30000 },
  { description: 'Assurance scolaire', montant: 10000 },
];

export const invoices: Invoice[] = students.slice(0, 15).map((student, i) => {
  const items = invoiceItems.map((item, j) => ({
    id: `itm-${i}-${j}`,
    invoiceId: `inv-${String(i + 1).padStart(3, '0')}`,
    ...item,
  }));

  const total = items.reduce((sum, item) => sum + item.montant, 0);
  const paidRatio = i % 5 === 0 ? 1 : i % 3 === 0 ? 0 : i % 2 === 0 ? 0.5 : 0.75;
  const paid = Math.round(total * paidRatio);

  const statuses: Array<'en_attente' | 'paye' | 'partiel' | 'annule' | 'en_retard'> = ['en_attente', 'paye', 'partiel', 'en_retard'];

  return {
    id: `inv-${String(i + 1).padStart(3, '0')}`,
    numero: `FAC-2024-${String(i + 1).padStart(5, '0')}`,
    studentId: student.id,
    montantTotal: total,
    montantPaye: paid,
    reste: total - paid,
    status: paid === total ? 'paye' : paid === 0 ? 'en_attente' : 'partiel',
    dateEcheance: '2024-10-15',
    description: 'Frais de scolarité - 1er Trimestre 2024-2025',
    items,
    createdAt: '2024-09-01T08:00:00Z',
  };
});

// ==================== PAYMENTS ====================
export const payments: Payment[] = invoices
  .filter((inv) => inv.montantPaye > 0)
  .map((invoice, i) => ({
    id: `pay-${String(i + 1).padStart(3, '0')}`,
    invoiceId: invoice.id,
    montant: invoice.montantPaye,
    methode: (['especes', 'cheque', 'virement', 'mobile_money'] as const)[i % 4],
    reference: `REF-${Date.now()}-${i}`,
    datePayment: invoice.createdAt,
    recu: `REC-2024-${String(i + 1).padStart(5, '0')}`,
  }));

// ==================== NOTIFICATIONS ====================
export const notifications: Notification[] = [
  {
    id: 'not-001',
    userId: 'usr-004',
    titre: 'Absence détectée',
    message: 'Votre enfant Amadou Ndiaye a été marqué absent aujourd\'hui.',
    type: 'absence',
    channel: 'sms',
    status: 'delivered',
    lu: false,
    dateEnvoi: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'not-002',
    userId: 'usr-004',
    titre: 'Nouvelle note publiée',
    message: 'Une nouvelle note de Mathématiques a été publiée pour Fatou Diallo.',
    type: 'note',
    channel: 'email',
    status: 'sent',
    lu: false,
    dateEnvoi: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'not-003',
    userId: 'usr-004',
    titre: 'Rappel de paiement',
    message: 'Le paiement de 125 000 FCFA est en retard. Veuillez régulariser.',
    type: 'paiement',
    channel: 'push',
    status: 'delivered',
    lu: true,
    dateEnvoi: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'not-004',
    userId: 'usr-005',
    titre: 'Bulletin disponible',
    message: 'Le bulletin du 1er trimestre est disponible en téléchargement.',
    type: 'info',
    channel: 'email',
    status: 'delivered',
    lu: true,
    dateEnvoi: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'not-005',
    userId: 'usr-003',
    titre: 'Alerte sécurité',
    message: 'Tentative de connexion suspecte détectée sur votre compte.',
    type: 'alerte',
    channel: 'email',
    status: 'delivered',
    lu: false,
    dateEnvoi: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ==================== SCAN TOKENS ====================
export const scanTokens: ScanToken[] = students.slice(0, 10).map((student, i) => ({
  id: `sct-${String(i + 1).padStart(3, '0')}`,
  studentId: student.id,
  token: `QR-${student.matricule}-${Date.now()}`,
  type: i % 2 === 0 ? 'qr' : 'badge',
  dateGeneration: new Date().toISOString(),
  dateExpiration: new Date(Date.now() + 86400000).toISOString(),
  utilise: false,
}));

// ==================== KPIs ====================
export const kpis: KPI[] = [
  { id: 'kpi-001', etablissementId: 'etb-001', tauxPresence: 94.5, moyenneGenerale: 12.8, tauxReussite: 87.2, nombreInscrits: 1250, periode: '2024-Q1' },
  { id: 'kpi-002', etablissementId: 'etb-002', tauxPresence: 89.3, moyenneGenerale: 11.2, tauxReussite: 78.5, nombreInscrits: 45000, periode: '2024-Q1' },
  { id: 'kpi-003', etablissementId: 'etb-003', tauxPresence: 91.7, moyenneGenerale: 13.1, tauxReussite: 82.3, nombreInscrits: 850, periode: '2024-Q1' },
  { id: 'kpi-004', etablissementId: 'etb-004', tauxPresence: 88.2, moyenneGenerale: 11.9, tauxReussite: 75.8, nombreInscrits: 320, periode: '2024-Q1' },
];

// ==================== RANKINGS ====================
export const rankings: Ranking[] = [
  { id: 'rnk-001', etablissementId: 'etb-001', rang: 1, score: 95.2, categorie: 'lycee', region: 'Dakar', periode: '2024' },
  { id: 'rnk-002', etablissementId: 'etb-002', rang: 1, score: 92.1, categorie: 'universite', region: 'Dakar', periode: '2024' },
  { id: 'rnk-003', etablissementId: 'etb-003', rang: 2, score: 88.5, categorie: 'institut', region: 'Thiès', periode: '2024' },
  { id: 'rnk-004', etablissementId: 'etb-004', rang: 3, score: 82.3, categorie: 'centre_formation', region: 'Saint-Louis', periode: '2024' },
];

// ==================== DASHBOARD STATS ====================
export const dashboardStats: DashboardStats = {
  totalStudents: 1250,
  totalEnseignants: 85,
  totalClasses: 42,
  tauxPresence: 94.5,
  moyenneGenerale: 12.8,
  revenusMois: 45750000,
  paiementsEnAttente: 125,
  absencesJour: 23,
};

// ==================== HELPERS ====================
export const getStudentById = (id: string) => students.find(s => s.id === id);
export const getStudentByName = (nom: string) => students.find(s => s.nom === nom);
export const getClasseById = (id: string) => classes.find(c => c.id === id);
export const getSubjectById = (id: string) => subjects.find(s => s.id === id);
export const getEtablissementById = (id: string) => etablissements.find(e => e.id === id);
export const getGradesByStudent = (studentId: string) => grades.filter(g => g.studentId === studentId);
export const getAttendanceByStudent = (studentId: string) => attendanceRecords.filter(a => a.studentId === studentId);
export const getInvoicesByStudent = (studentId: string) => invoices.filter(i => i.studentId === studentId);
export const getNotificationsByUser = (userId: string) => notifications.filter(n => n.userId === userId);
