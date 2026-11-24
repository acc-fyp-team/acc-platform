import * as SecureStore from 'expo-secure-store';
import type { LoginResponse } from './types';

const TOKEN_KEY = 'acc_token';
const USER_KEY = 'acc_user';

let memoryToken: string | null = null;

export async function saveSession(session: LoginResponse): Promise<void> {
  memoryToken = session.token;
  await SecureStore.setItemAsync(TOKEN_KEY, session.token);
  const { token: _omit, ...user } = session;
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function loadSession(): Promise<LoginResponse | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const user = await SecureStore.getItemAsync(USER_KEY);
  if (!token || !user) return null;
  memoryToken = token;
  try {
    return { token, ...JSON.parse(user) } as LoginResponse;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  memoryToken = null;
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export function getToken(): string | null {
  return memoryToken;
}
