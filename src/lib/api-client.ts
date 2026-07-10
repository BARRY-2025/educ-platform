export { ApiError, type ApiResponse } from './axios';
export {
  authClient,
  studentClient,
  enrollmentClient,
  attendanceClient,
  gradeClient,
  get,
  post,
  put,
  del,
  request,
  getAuthToken,
  getRefreshToken,
} from './axios';

import { studentClient } from './axios';

/** Client student-service (rétrocompatibilité) */
export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const response = await studentClient.request<T>({
    url: path,
    method,
    ...(options.body !== undefined ? { data: options.body } : {}),
  });
  return response.data;
}
