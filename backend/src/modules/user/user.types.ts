// ===== REQUEST TYPES =====
export interface IGetUserByIdRequest {
  id: number;
}

export interface IUpdateUserRequest {
  fullName?: string;
  email?: string;
  nif?: string;
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
  balance: number;
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
