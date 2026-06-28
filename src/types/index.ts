// Core Domain Types for Education Platform

// ==================== ENUMS ====================
export type UserRole = 'super_admin' | 'admin_etablissement' | 'enseignant' | 'parent' | 'apprenant';
export type EtablissementType = 'ecole' | 'universite' | 'institut' | 'centre_formation';
export type StudentStatus = 'actif' | 'inactif' | 'diplome' | 'transfere' | 'suspendu';
export type AttendanceStatus = 'present' | 'absent' | 'retard' | 'excuse';
export type PaymentStatus = 'en_attente' | 'paye' | 'partiel' | 'annule' | 'en_retard';
export type NotificationChannel = 'email' | 'sms' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';

// ==================== USER & AUTH ====================
export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  avatar?: string;
  telephone?: string;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

// ==================== ETABLISSEMENT ====================
export interface Etablissement {
  id: string;
  nom: string;
  type: EtablissementType;
  adresse: string;
  ville: string;
  region: string;
  telephone: string;
  email: string;
  logo?: string;
  code: string;
  actif: boolean;
  createdAt: string;
}

// ==================== STUDENT DOMAIN ====================
export interface Student {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  sexe: 'M' | 'F';
  email: string;
  telephone?: string;
  adresse: string;
  ville: string;
  photo?: string;
  statut: StudentStatus;
  etablissementId: string;
  dateInscription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id: string;
  studentId: string;
  nom: string;
  prenom: string;
  relation: 'pere' | 'mere' | 'tuteur' | 'autre';
  email: string;
  telephone: string;
  adresse: string;
  isPrimary: boolean;
}

export interface Document {
  id: string;
  studentId: string;
  type: 'bulletin' | 'certificat' | 'attestation' | 'diplome' | 'autre';
  nom: string;
  fichier: string;
  dateUpload: string;
}

// ==================== ENROLLMENT DOMAIN ====================
export interface Enrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  classeId: string;
  dateInscription: string;
  statut: 'actif' | 'annule' | 'termine';
}

export interface AcademicYear {
  id: string;
  nom: string;
  dateDebut: string;
  dateFin: string;
  actif: boolean;
}

export interface Trimester {
  id: string;
  academicYearId: string;
  numero: 1 | 2 | 3;
  nom: string;
  dateDebut: string;
  dateFin: string;
}

export interface Classe {
  id: string;
  nom: string;
  niveau: string;
  filiereId: string;
  etablissementId: string;
  capacite: number;
  effectif: number;
}

export interface Filiere {
  id: string;
  nom: string;
  code: string;
  description: string;
}

// ==================== ATTENDANCE DOMAIN ====================
export interface AttendanceRecord {
  id: string;
  studentId: string;
  classeId: string;
  date: string;
  heureEntree?: string;
  heureSortie?: string;
  status: AttendanceStatus;
  justification?: string;
  scanToken?: string;
  recordedBy: string;
  createdAt: string;
}

export interface ScanToken {
  id: string;
  studentId: string;
  token: string;
  type: 'qr' | 'badge';
  dateGeneration: string;
  dateExpiration: string;
  utilise: boolean;
}

// ==================== GRADE DOMAIN ====================
export interface Subject {
  id: string;
  nom: string;
  code: string;
  coefficient: number;
  classeId: string;
  enseignantId: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  trimestreId: string;
  note: number;
  noteMax: number;
  type: 'devoir' | 'examen' | 'interrogation' | 'composition';
  date: string;
  commentaire?: string;
}

export interface Competence {
  id: string;
  nom: string;
  description: string;
  matiereId: string;
  niveau: 1 | 2 | 3 | 4 | 5;
}

export interface Transcript {
  id: string;
  studentId: string;
  academicYearId: string;
  trimestreId: string;
  moyenneGenerale: number;
  rang: number;
  appreciation: string;
  dateGeneration: string;
}

// ==================== FINANCE DOMAIN ====================
export interface Invoice {
  id: string;
  numero: string;
  studentId: string;
  montantTotal: number;
  montantPaye: number;
  reste: number;
  status: PaymentStatus;
  dateEcheance: string;
  description: string;
  items: InvoiceItem[];
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  montant: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  montant: number;
  methode: 'especes' | 'cheque' | 'virement' | 'mobile_money';
  reference?: string;
  datePayment: string;
  recu?: string;
}

export interface Receipt {
  id: string;
  paymentId: string;
  numero: string;
  date: string;
  montant: number;
  studentName: string;
}

// ==================== NOTIFICATION DOMAIN ====================
export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  type: 'absence' | 'note' | 'paiement' | 'info' | 'alerte';
  channel: NotificationChannel;
  status: NotificationStatus;
  lu: boolean;
  dateEnvoi: string;
  createdAt: string;
}

// ==================== ANALYTICS DOMAIN ====================
export interface KPI {
  id: string;
  etablissementId: string;
  tauxPresence: number;
  moyenneGenerale: number;
  tauxReussite: number;
  nombreInscrits: number;
  periode: string;
}

export interface Ranking {
  id: string;
  etablissementId: string;
  rang: number;
  score: number;
  categorie: string;
  region: string;
  periode: string;
}

export interface PerformanceMetric {
  id: string;
  etablissementId: string;
  date: string;
  presence: number;
  ponctualite: number;
  performance: number;
  satisfaction: number;
}

// ==================== DASHBOARD STATS ====================
export interface DashboardStats {
  totalStudents: number;
  totalEnseignants: number;
  totalClasses: number;
  tauxPresence: number;
  moyenneGenerale: number;
  revenusMois: number;
  paiementsEnAttente: number;
  absencesJour: number;
}

// ==================== TABLE TYPES ====================
export interface TableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}
