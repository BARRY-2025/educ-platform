import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const ESTABLISHMENT_ID =
  import.meta.env.VITE_ESTABLISHMENT_ID ?? '00000000-0000-4000-8000-000000000001';

export function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.refreshToken ?? null;
  } catch {
    return null;
  }
}

interface ClientOptions {
  withAuth?: boolean;
  withEstablishment?: boolean;
}

function attachInterceptors(client: AxiosInstance, options: ClientOptions = {}): AxiosInstance {
  const { withAuth = true, withEstablishment = true } = options;

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (withAuth) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (withEstablishment) {
      config.headers['X-Establishment-ID'] = ESTABLISHMENT_ID;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => {
      const body = response.data as ApiResponse<unknown> | undefined;

      if (body && typeof body === 'object' && 'success' in body && body.success === false) {
        return Promise.reject(
          new ApiError(body.message ?? 'Request failed', response.status, body.errors),
        );
      }

      if (body && typeof body === 'object' && 'data' in body) {
        response.data = body.data;
      }

      return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
      const status = error.response?.status ?? 500;
      const message =
        error.response?.data?.message ??
        error.message ??
        `Request failed (${status})`;

      return Promise.reject(
        new ApiError(message, status, error.response?.data?.errors),
      );
    },
  );

  return client;
}

export function createApiClient(baseURL: string, options?: ClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return attachInterceptors(client, options);
}

export const authClient = createApiClient(
  import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8000/api/v1',
  { withEstablishment: false },
);

export const studentClient = createApiClient(
  import.meta.env.VITE_STUDENT_API_URL ??
    import.meta.env.VITE_API_URL ??
    'http://localhost:8001/api/v1',
);

export const enrollmentClient = createApiClient(
  import.meta.env.VITE_ENROLLMENT_API_URL ?? 'http://localhost:8002/api/v1',
);

export const attendanceClient = createApiClient(
  import.meta.env.VITE_ATTENDANCE_API_URL ?? 'http://localhost:8003/api/v1',
);

export const gradeClient = createApiClient(
  import.meta.env.VITE_GRADE_API_URL ?? 'http://localhost:8004/api/v1',
);

/** Requête typée — décompresse automatiquement `data` de l'enveloppe API Laravel */
export async function request<T>(
  client: AxiosInstance,
  config: AxiosRequestConfig,
): Promise<T> {
  const response = await client.request<T>(config);
  return response.data;
}

export async function get<T>(client: AxiosInstance, url: string, params?: Record<string, unknown>): Promise<T> {
  return request<T>(client, { method: 'GET', url, params });
}

export async function post<T>(client: AxiosInstance, url: string, data?: unknown): Promise<T> {
  return request<T>(client, { method: 'POST', url, data });
}

export async function put<T>(client: AxiosInstance, url: string, data?: unknown): Promise<T> {
  return request<T>(client, { method: 'PUT', url, data });
}

export async function del<T>(client: AxiosInstance, url: string): Promise<T> {
  return request<T>(client, { method: 'DELETE', url });
}
