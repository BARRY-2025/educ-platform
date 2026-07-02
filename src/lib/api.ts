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
