import {
  authClient,
  studentClient,
  enrollmentClient,
  attendanceClient,
  gradeClient,
  get,
  post,
} from './axios';

export { apiRequest, ApiError, type ApiResponse } from './api-client';

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
    get<StudentsListResponse>(studentClient, '/students', { page, per_page: perPage }),

  get: (uuid: string) =>
    get<StudentApiModel>(studentClient, `/students/${uuid}`),

  create: (payload: CreateStudentPayload) =>
    post<StudentApiModel>(studentClient, '/students', payload),
};

export const guardiansApi = {
  create: (payload: {
    firstname: string;
    lastname: string;
    relation: string;
    phone_primary: string;
    phone_secondary?: string;
    email?: string;
    address?: string;
    student_uuid?: string;
    is_primary?: boolean;
  }) => post<GuardianApiModel>(studentClient, '/guardians', payload),
};

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await authClient.post('/auth/login', {
      identifier: email,
      password,
    });

    if (response.status === 202) {
      const data = response.data as { requires_two_factor?: boolean };
      if (data?.requires_two_factor) {
        throw new Error('Authentification à deux facteurs requise. Contactez l\'administrateur.');
      }
    }

    const data = response.data as LoginApiData;
    const tokens = data.tokens ?? (data as unknown as LoginTokens);

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type ?? 'Bearer',
      user: {
        uuid: data.user_uuid ?? data.user?.uuid ?? '',
        email: data.email ?? email,
        firstname: data.firstname ?? data.user?.firstname,
        lastname: data.lastname ?? data.user?.lastname,
        full_name: data.full_name,
        roles: data.roles,
      },
    };
  },

  me: (token: string) =>
    authClient
      .get<AuthMeResponse>('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data),
};

interface LoginTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type?: string;
}

interface LoginApiData extends Partial<LoginTokens> {
  user_uuid?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  full_name?: string;
  roles?: string[];
  tokens?: LoginTokens;
  user?: { uuid: string; firstname?: string; lastname?: string };
}

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
    full_name?: string;
    roles?: string[];
  };
}

export interface AuthMeResponse {
  uuid: string;
  email: string;
  firstname: string;
  lastname: string;
  full_name: string;
  roles: string[];
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

export const enrollmentApi = {
  listEstablishments: () =>
    get<{ items: EstablishmentApiModel[]; pagination: { total: number } }>(
      enrollmentClient,
      '/establishments',
    ),

  listAcademicYears: () =>
    get<{ items: AcademicYearApiModel[] }>(enrollmentClient, '/academic-years'),

  listClasses: (level?: string) =>
    get<{ items: ClassApiModel[] }>(enrollmentClient, '/classes', level ? { level } : undefined),

  listEnrollments: (status?: string) =>
    get<{ items: EnrollmentApiModel[]; pagination: { total: number } }>(
      enrollmentClient,
      '/enrollments',
      status ? { status } : undefined,
    ),

  getEnrollment: (uuid: string) =>
    get<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}`),

  createEnrollment: (payload: {
    academic_year_uuid: string;
    student_uuid: string;
    guardian_uuid?: string;
    documents_complete?: boolean;
    registration_fee_paid?: boolean;
  }) => post<EnrollmentApiModel>(enrollmentClient, '/enrollments', payload),

  submitEnrollment: (uuid: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/submit`),

  validateEnrollment: (uuid: string, notes?: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/validate`, { notes }),

  assignClass: (uuid: string, classUuid: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/assign-class`, {
      class_uuid: classUuid,
    }),

  activateEnrollment: (uuid: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/activate`),

  rejectEnrollment: (uuid: string, reason: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/reject`, { reason }),

  requestDocuments: (uuid: string, notes: string) =>
    post<EnrollmentApiModel>(enrollmentClient, `/enrollments/${uuid}/request-documents`, { notes }),
};

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
    return get<{ items: AttendanceRecordApiModel[]; stats: Record<string, number>; date: string }>(
      attendanceClient,
      '/attendances',
      { date: d },
    );
  },

  scanArrival: (qrCode: string, terminalId = 'GATE-01') =>
    post<AttendanceRecordApiModel>(attendanceClient, '/attendances/scan/arrival', {
      qr_code: qrCode,
      terminal_id: terminalId,
    }),

  scanParentExit: (qrCode: string, terminalId = 'GATE-EXIT-01') =>
    post<ParentExitSessionApiModel>(attendanceClient, '/attendances/scan/exit/parent', {
      qr_code: qrCode,
      terminal_id: terminalId,
    }),

  scanChildExit: (qrCode: string, parentSessionToken: string, terminalId = 'GATE-EXIT-01') =>
    post<AttendanceRecordApiModel>(attendanceClient, '/attendances/scan/exit/child', {
      qr_code: qrCode,
      parent_session_token: parentSessionToken,
      terminal_id: terminalId,
    }),

  markClassPresent: (studentUuid: string, present: boolean, notes?: string) =>
    post<AttendanceRecordApiModel>(attendanceClient, '/attendances/class-check', {
      student_uuid: studentUuid,
      present,
      notes,
    }),
};

export interface EvaluationPeriodApiModel {
  uuid: string;
  establishment_uuid: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface CompetenceApiModel {
  uuid: string;
  establishment_uuid: string;
  code: string;
  name: string;
  domain: string;
}

export interface StudentEvaluationApiModel {
  uuid: string;
  student_uuid: string;
  competence_uuid: string;
  period_uuid: string;
  rating: 'acquired' | 'in_progress' | 'needs_review';
  observation: string | null;
  evaluated_by_uuid: string;
}

export interface BulletinApiModel {
  uuid: string;
  establishment_uuid: string;
  student_uuid: string;
  period_uuid: string;
  class_uuid: string | null;
  status: 'draft' | 'published' | 'delivered';
  teacher_comment: string | null;
  director_comment: string | null;
  published_at: string | null;
  delivered_at: string | null;
  evaluations?: StudentEvaluationApiModel[];
}

export const gradesApi = {
  listPeriods: () =>
    get<EvaluationPeriodApiModel[]>(gradeClient, '/evaluation-periods'),

  listCompetences: () =>
    get<CompetenceApiModel[]>(gradeClient, '/competences'),

  getEvaluations: (studentUuid: string, periodUuid: string) =>
    get<StudentEvaluationApiModel[]>(gradeClient, '/evaluations', {
      student_uuid: studentUuid,
      period_uuid: periodUuid,
    }),

  saveEvaluations: (payload: {
    student_uuid: string;
    period_uuid: string;
    class_uuid?: string;
    items: { competence_uuid: string; rating: string; observation?: string }[];
  }) => post<StudentEvaluationApiModel[]>(gradeClient, '/evaluations', payload),

  listBulletins: (params?: { period_uuid?: string; status?: string; page?: number }) =>
    get<{ items: BulletinApiModel[]; pagination: { total: number; page: number; per_page: number } }>(
      gradeClient,
      '/bulletins',
      params as Record<string, unknown> | undefined,
    ),

  getBulletin: (uuid: string) =>
    get<BulletinApiModel>(gradeClient, `/bulletins/${uuid}`),

  generateBulletin: (payload: {
    student_uuid: string;
    period_uuid: string;
    class_uuid?: string;
    teacher_comment?: string;
  }) => post<BulletinApiModel>(gradeClient, '/bulletins', payload),

  publishBulletin: (uuid: string, directorComment?: string) =>
    post<BulletinApiModel>(gradeClient, `/bulletins/${uuid}/publish`, {
      director_comment: directorComment,
    }),

  deliverBulletin: (uuid: string) =>
    post<BulletinApiModel>(gradeClient, `/bulletins/${uuid}/deliver`),
};
