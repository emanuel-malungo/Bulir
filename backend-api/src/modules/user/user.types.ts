// ===== REQUEST TYPES =====
export interface IGetUserByIdRequest {
  id: number;
}

export interface IUpdateUserRequest {
  fullName?: string;
  email?: string;
  nif?: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IDeleteUserRequest {
  id: number;
}

// ===== RESPONSE TYPES =====
export interface IUserDetail {
  id: number;
  fullName: string;
  email: string;
  nif: string;
  balance: any;
  isActive: boolean;
  roleId?: number;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserListItem {
  id: number;
  fullName: string;
  email: string;
  nif: string;
  role?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ISessionDetail {
  id: number;
  userAgent?: string | null;
  ipAddress?: string | null;
  deviceId?: string | null;
  isRevoked: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface ISessionsResponse {
  sessions: ISessionDetail[];
  total: number;
}

export interface IListUsersResponse {
  users: IUserListItem[];
  total: number;
}

export interface IGetUserResponse {
  user: IUserDetail;
}

export interface IUpdateUserResponse {
  message: string;
  user: IUserDetail;
}

export interface IChangePasswordResponse {
  message: string;
}

export interface ILogoutSessionResponse {
  message: string;
}

export interface ILogoutAllSessionsResponse {
  message: string;
  sessionsTerminated: number;
}

export interface IDeleteUserResponse {
  message: string;
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
