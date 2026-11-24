import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env';
import { getToken } from './tokenStorage';
import { ApiError, type ApiErrorBody } from './types';

type SessionEndedHandler = () => void;
let onSessionEnded: SessionEndedHandler | null = null;

/** AuthContext registers this: clear token and go to Login. */
export function setSessionEndedHandler(handler: SessionEndedHandler | null) {
  onSessionEnded = handler;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** false for the login call itself. */
  auth?: boolean;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = opts;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(0, {
      message: 'Server se connect nahi ho saka. Internet / Wi-Fi check karein.',
      code: 'network_error',
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const errBody: ApiErrorBody =
      data && typeof data === 'object' && 'message' in data
        ? (data as ApiErrorBody)
        : { message: `Request failed (${res.status})` };
    const err = new ApiError(res.status, errBody);

    // Contract rule: any 401 with code "session_ended" -> sign out.
    if (res.status === 401 && err.code === 'session_ended' && onSessionEnded) {
      onSessionEnded();
    }
    throw err;
  }

  return data as T;
}
