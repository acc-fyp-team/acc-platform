// Fake responses so the sign-in screen can be built and tested before the
// real API is reachable. Turn off with USE_MOCK = false in src/config/env.ts.
//
// Test usernames (any password except where noted):
//   demo      / demo123  -> success (Manager)
//   admin     / admin123 -> success (Admin)
//   inactive             -> 403 inactive account
//   locked               -> 429 too many attempts
//   anything else        -> 401 wrong username or password

import { ApiError, type LoginRequest, type LoginResponse, type Permission } from './types';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const USERS: Record<string, { password: string; user: LoginResponse }> = {
  demo: {
    password: 'demo123',
    user: {
      token: 'mock-token-demo',
      userID: 3,
      username: 'demo',
      fullName: 'Rehan Ishaque',
      role: 'Manager',
      profilePicture: null,
    },
  },
  admin: {
    password: 'admin123',
    user: {
      token: 'mock-token-admin',
      userID: 1,
      username: 'admin',
      fullName: 'Hamid Idrees',
      role: 'Admin',
      profilePicture: null,
    },
  },
};

export async function mockLogin(body: LoginRequest): Promise<LoginResponse> {
  await wait(700);
  const name = body.username.trim().toLowerCase();
  if (name === 'inactive') throw new ApiError(403, { message: 'Your account is inactive. Contact your admin.' });
  if (name === 'locked') throw new ApiError(429, { message: 'Too many attempts. Please try again later.' });
  const entry = USERS[name];
  if (!entry || entry.password !== body.password) {
    throw new ApiError(401, { message: 'Invalid username or password.' });
  }
  return entry.user;
}

const ALL_MODULES = ['Projects', 'Clients', 'Employees', 'Materials', 'Attendance', 'Salaries', 'Billing', 'Verification'];

export async function mockPermissions(userID: number): Promise<Permission[]> {
  await wait(300);
  // Manager (id 3): no Salaries / Billing view, to show permission-based hiding.
  const hidden = userID === 3 ? ['Salaries', 'Billing'] : [];
  return ALL_MODULES.map((module) => ({
    module,
    action: 'View' as const,
    isAllowed: !hidden.includes(module),
    requiresApproval: false,
  }));
}

export async function mockRefresh(current: LoginResponse): Promise<LoginResponse> {
  await wait(200);
  return current;
}
