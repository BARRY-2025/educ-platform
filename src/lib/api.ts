import { apiRequest } from './api-client';

export interface StudentApiModel {
  uuid: string;
  establishment_uuid: string;
  matricule: string;
  firstname: string;
  lastname: string;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  cycle: string;
  status: string;
  blood_group?: string | null;
  photo_url?: string | null;
  national_id?: string | null;
}

export interface StudentsListResponse {
  items: StudentApiModel[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
  };
}

export interface CreateStudentPayload {
  matricule: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  cycle: 'preschool' | 'primary' | 'middle_school' | 'high_school' | 'university' | 'training_center';
  blood_group?: string;
  photo_url?: string;
  national_id?: string;
  status?: string;
}

export const studentsApi = {
  list: (page = 1, perPage = 20) =>
    apiRequest<StudentsListResponse>(`/students?page=${page}&per_page=${perPage}`),

  get: (uuid: string) =>
    apiRequest<StudentApiModel>(`/students/${uuid}`),

  create: (payload: CreateStudentPayload) =>
    apiRequest<StudentApiModel>('/students', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

const STUDENT_API = import.meta.env.VITE_STUDENT_API_URL ?? import.meta.env.VITE_API_URL ?? 'http://localhost:8001/api/v1';

export const guardiansApi = {
  create: async (payload: {
    firstname: string;
    lastname: string;
    relation: string;
    phone_primary: string;
    phone_secondary?: string;
    email?: string;
    address?: string;
    student_uuid?: string;
    is_primary?: boolean;
  }) => {
    const token = localStorage.getItem('auth-storage');
    let bearer: string | null = null;
    try { bearer = token ? JSON.parse(token)?.state?.token : null; } catch { /* ignore */ }
    const establishmentId = import.meta.env.VITE_ESTABLISHMENT_ID ?? '';
    const response = await fetch(`${STUDENT_API}/guardians`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Establishment-ID': establishmentId,
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    const body = await response.json();
    if (!response.ok || body.success === false) throw new Error(body.message ?? 'Erreur création tuteur');
    return body.data as GuardianApiModel;
  },
};

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ identifier: email, password }),
    });

    const body = await response.json();

    if (!response.ok || body.success === false) {
      throw new Error(body.message ?? 'Échec de connexion');
    }

    return body.data;
  },
};

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user?: {
    uuid: string;
    email: string;
    firstname?: string;
    lastname?: string;
  };
}

export interface EstablishmentApiModel {
  uuid: string;
  name: string;
  code: string;
  type: string;
  city: string;
  region: string;
}

export interface ClassApiModel {
  uuid: string;
  code: string;
  name: string;
  level: 'PS' | 'MS' | 'GS';
  max_capacity: number;
  current_enrollment: number;
  available_seats: number;
}

export interface EnrollmentApiModel {
  uuid: string;
  establishment_uuid: string;
  academic_year_uuid: string;
  student_uuid: string;
  class_uuid: string | null;
  guardian_uuid: string | null;
  status: string;
  phase: string;
  documents_complete: boolean;
  registration_fee_paid: boolean;
  director_notes: string | null;
  rejection_reason: string | null;
  submitted_at: string | null;
  validated_at: string | null;
  activated_at: string | null;
}

export interface AcademicYearApiModel {
  uuid: string;
  establishment_uuid: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface GuardianApiModel {
  uuid: string;
  firstname: string;
  lastname: string;
  full_name: string;
  relation: string;
  phone_primary: string;
  qr_badge_code: string | null;
}

const ENROLLMENT_API = import.meta.env.VITE_ENROLLMENT_API_URL ?? 'http://localhost:8002/api/v1';

async function enrollmentRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth-storage');
  let bearer: string | null = null;
  try {
    bearer = token ? JSON.parse(token)?.state?.token : null;
  } catch { /* ignore */ }

  const establishmentId = import.meta.env.VITE_ESTABLISHMENT_ID ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Establishment-ID': establishmentId,
    ...(options.headers as Record<string, string> | undefined),
  };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const response = await fetch(`${ENROLLMENT_API}${path}`, { ...options, headers });
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }
  return body.data as T;
}

export const enrollmentApi = {
  listEstablishments: () =>
    enrollmentRequest<{ items: EstablishmentApiModel[]; pagination: { total: number } }>('/establishments'),

  listAcademicYears: () =>
    enrollmentRequest<{ items: AcademicYearApiModel[] }>('/academic-years'),

  listClasses: (level?: string) =>
    enrollmentRequest<{ items: ClassApiModel[] }>(`/classes${level ? `?level=${level}` : ''}`),

  listEnrollments: (status?: string) =>
    enrollmentRequest<{ items: EnrollmentApiModel[]; pagination: { total: number } }>(
      `/enrollments${status ? `?status=${status}` : ''}`,
    ),

  getEnrollment: (uuid: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}`),

  createEnrollment: (payload: {
    academic_year_uuid: string;
    student_uuid: string;
    guardian_uuid?: string;
    documents_complete?: boolean;
    registration_fee_paid?: boolean;
  }) =>
    enrollmentRequest<EnrollmentApiModel>('/enrollments', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitEnrollment: (uuid: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/submit`, { method: 'POST' }),

  validateEnrollment: (uuid: string, notes?: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/validate`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),

  assignClass: (uuid: string, classUuid: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/assign-class`, {
      method: 'POST',
      body: JSON.stringify({ class_uuid: classUuid }),
    }),

  activateEnrollment: (uuid: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/activate`, { method: 'POST' }),

  rejectEnrollment: (uuid: string, reason: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  requestDocuments: (uuid: string, notes: string) =>
    enrollmentRequest<EnrollmentApiModel>(`/enrollments/${uuid}/request-documents`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    }),
};

const ATTENDANCE_API = import.meta.env.VITE_ATTENDANCE_API_URL ?? 'http://localhost:8003/api/v1';

async function attendanceRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth-storage');
  let bearer: string | null = null;
  try { bearer = token ? JSON.parse(token)?.state?.token : null; } catch { /* ignore */ }

  const establishmentId = import.meta.env.VITE_ESTABLISHMENT_ID ?? '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Establishment-ID': establishmentId,
    ...(options.headers as Record<string, string> | undefined),
  };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const response = await fetch(`${ATTENDANCE_API}${path}`, { ...options, headers });
  const body = await response.json();
  if (!response.ok || body.success === false) {
    throw new Error(body.message ?? `Request failed (${response.status})`);
  }
  return body.data as T;
}

export interface AttendanceRecordApiModel {
  uuid: string;
  student_uuid: string;
  status: string;
  gate_arrival_time: string | null;
  class_check_time: string | null;
  exit_time: string | null;
  date: string;
}

export interface ParentExitSessionApiModel {
  session_token: string;
  guardian_uuid: string;
  expires_at: string;
  student_uuids: string[];
}

export const attendanceApi = {
  list: (date?: string) => {
    const d = date ?? new Date().toISOString().split('T')[0];
    return attendanceRequest<{ items: AttendanceRecordApiModel[]; stats: Record<string, number>; date: string }>(
      `/attendances?date=${d}`,
    );
  },

  scanArrival: (qrCode: string, terminalId = 'GATE-01') =>
    attendanceRequest<AttendanceRecordApiModel>('/attendances/scan/arrival', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode, terminal_id: terminalId }),
    }),

  scanParentExit: (qrCode: string, terminalId = 'GATE-EXIT-01') =>
    attendanceRequest<ParentExitSessionApiModel>('/attendances/scan/exit/parent', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode, terminal_id: terminalId }),
    }),

  scanChildExit: (qrCode: string, parentSessionToken: string, terminalId = 'GATE-EXIT-01') =>
    attendanceRequest<AttendanceRecordApiModel>('/attendances/scan/exit/child', {
      method: 'POST',
      body: JSON.stringify({ qr_code: qrCode, parent_session_token: parentSessionToken, terminal_id: terminalId }),
    }),

  markClassPresent: (studentUuid: string, present: boolean, notes?: string) =>
    attendanceRequest<AttendanceRecordApiModel>('/attendances/class-check', {
      method: 'POST',
      body: JSON.stringify({ student_uuid: studentUuid, present, notes }),
    }),
};
