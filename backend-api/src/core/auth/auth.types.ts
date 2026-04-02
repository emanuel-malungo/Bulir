
// ===== REQUEST TYPES =====
export interface IRegisterRequest {
  fullName: string;
  email: string;
  nif: string;
  password: string;
  roleId: number;
}

// ===== RESPONSE TYPES =====
export interface IUser {
  id: number;
  fullName: string;
  email: string;
  nif: string;
  isActive: boolean;
  createdAt: Date;
  roleId?: number;
  role?: string;
  permissions?: string[];
}

export interface ILoginRequest {
  identifier: string; // email ou nif
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IRegisterResponse {
  message: string;
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshResponse {
  accessToken: string;
}

export interface ILogoutResponse {
  message: string;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
}

export interface IRolesResponse {
  roles: IRole[];
}

export interface IPermission {
  id: number;
  name: string;
  description: string;
}

export interface IRolePermissionsResponse {
  roleId: number;
  role: string;
  permissions: IPermission[];
}

// ===== ERROR TYPES =====
export interface IApiError {
  error?: string;
  errors?: Array<{
    code: string;
    message: string;
    path: PropertyKey[];
  }>;
}