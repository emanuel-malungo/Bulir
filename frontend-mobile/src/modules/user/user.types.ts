// ===== REQUEST TYPES =====
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

export interface IUserFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  role?: string;
  startDate?: string;
  endDate?: string;
}

// ===== RESPONSE TYPES =====
export interface IUserDetail {
  id: number;
  fullName: string;
  email: string;
  nif: string;
  balance?: number;
  isActive: boolean;
  roleId?: number;
  role?: string;
  permissions?: string[];
  userRoles?: Array<{
    role: {
      id?: number;
      name: string;
    };
    roleId: number;
    userId: number;
  }>;
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

export interface IUserListResponse {
  data: IUserListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ISessionsResponse {
  sessions: ISessionDetail[];
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
