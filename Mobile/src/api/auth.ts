import { USE_MOCK } from '../config/env';
import { request } from './client';
import { mockLogin, mockPermissions, mockRefresh } from './mock';
import type { LoginRequest, LoginResponse, Permission } from './types';

export function login(body: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(body);
  return request<LoginResponse>('/api/auth/login', { method: 'POST', body, auth: false });
}

/** POST /api/auth/refresh with Bearer -> new token, same shape as login. */
export function refresh(current: LoginResponse): Promise<LoginResponse> {
  if (USE_MOCK) return mockRefresh(current);
  return request<LoginResponse>('/api/auth/refresh', { method: 'POST' });
}

/** GET /api/auth/ping -> 204, keeps the session alive. */
export function ping(): Promise<void> {
  if (USE_MOCK) return Promise.resolve();
  return request<void>('/api/auth/ping');
}

export function getPermissions(userID: number): Promise<Permission[]> {
  if (USE_MOCK) return mockPermissions(userID);
  return request<Permission[]>(`/api/permissions/user/${userID}`);
}
