const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';
const ESTABLISHMENT_ID = import.meta.env.VITE_ESTABLISHMENT_ID ?? '00000000-0000-4000-8000-000000000001';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('auth-storage');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Establishment-ID': ESTABLISHMENT_ID,
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message ?? `Request failed (${response.status})`,
      response.status,
      body.errors,
    );
  }

  return body.data as T;
}
