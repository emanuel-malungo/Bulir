
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
}

export interface IRefreshResponse {
  accessToken: string;
}

export interface ILogoutResponse {
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