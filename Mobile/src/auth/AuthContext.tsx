import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth';
import { setSessionEndedHandler } from '../api/client';
import { clearSession, loadSession, saveSession } from '../api/tokenStorage';
import { ApiError, type LoginResponse, type Permission, type PermissionAction } from '../api/types';

type User = Omit<LoginResponse, 'token'>;

interface AuthState {
  status: 'loading' | 'signedOut' | 'signedIn';
  user: User | null;
  permissions: Permission[];
  /** Message shown on the Login screen after a forced sign-out. */
  notice: string | null;
  signIn: (username: string, password: string, keepSignedIn: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  /** UI only; the server checks every request anyway. */
  can: (module: string, action?: PermissionAction) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthState['status']>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const reset = useCallback(async (message: string | null) => {
    await clearSession();
    setUser(null);
    setPermissions([]);
    setNotice(message);
    setStatus('signedOut');
  }, []);

  const finishSignIn = useCallback(async (session: LoginResponse) => {
    await saveSession(session);
    const perms = await authApi.getPermissions(session.userID);
    const { token: _omit, ...u } = session;
    setUser(u);
    setPermissions(perms);
    setNotice(null);
    setStatus('signedIn');
  }, []);

  // Contract rule: 401 + code "session_ended" -> clear token, back to Login.
  useEffect(() => {
    setSessionEndedHandler(() => {
      void reset('Your session has ended. Please sign in again.');
    });
    return () => setSessionEndedHandler(null);
  }, [reset]);

  // On app start: restore a saved session and refresh the token.
  useEffect(() => {
    (async () => {
      const saved = await loadSession();
      if (!saved) {
        setStatus('signedOut');
        return;
      }
      try {
        const fresh = await authApi.refresh(saved);
        await finishSignIn(fresh);
      } catch (e) {
        const offline = e instanceof ApiError && e.code === 'network_error';
        await reset(offline ? 'Server se connect nahi ho saka. Dobara sign in karein.' : null);
      }
    })();
  }, [finishSignIn, reset]);

  const signIn = useCallback(
    async (username: string, password: string, keepSignedIn: boolean) => {
      const session = await authApi.login({ username: username.trim(), password, keepSignedIn });
      await finishSignIn(session);
    },
    [finishSignIn],
  );

  const signOut = useCallback(() => reset(null), [reset]);

  const can = useCallback(
    (module: string, action: PermissionAction = 'View') =>
      permissions.some((p) => p.module === module && p.action === action && p.isAllowed),
    [permissions],
  );

  const value = useMemo(
    () => ({ status, user, permissions, notice, signIn, signOut, can }),
    [status, user, permissions, notice, signIn, signOut, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
