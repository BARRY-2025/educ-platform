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
  student_uuid: string;
  class_uuid: string | null;
  status: string;
  phase: string;
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
    enrollmentRequest<{ items: EstablishmentApiModel[] }>('/establishments'),

  listClasses: () =>
    enrollmentRequest<{ items: ClassApiModel[] }>('/classes'),

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
};
