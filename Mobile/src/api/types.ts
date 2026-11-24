// Shapes from the AA-01 / AA-02 contract (Hamid, 22 Nov 2026).

export interface LoginRequest {
  username: string;
  password: string;
  keepSignedIn: boolean;
}

/** Login and refresh both return this shape. */
export interface LoginResponse {
  token: string;
  userID: number;
  username: string;
  fullName: string;
  /** Dynamic string: Admin, Manager, SiteEngineer, ... Do not hide screens by role. */
  role: string;
  profilePicture: string | null;
}

export type PermissionAction = 'View' | 'Add' | 'Edit' | 'Delete' | 'Manage';

export interface Permission {
  module: string;
  action: PermissionAction;
  isAllowed: boolean;
  requiresApproval: boolean;
}

/** Every API error: { message, code?, field? } */
export interface ApiErrorBody {
  message: string;
  code?: string;
  field?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  field?: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.code;
    this.field = body.field;
  }
}
