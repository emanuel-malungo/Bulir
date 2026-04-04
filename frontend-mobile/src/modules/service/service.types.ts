// ===== REQUEST TYPES =====
export interface ICreateServiceRequest {
  name: string;
  description?: string;
  price: number;
}

export interface IUpdateServiceRequest {
  id: number;
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
}

// ===== RESPONSE TYPES =====
export interface IServiceDetail {
  id: number;
  providerId: number;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
  provider?: {
    id: number;
    fullName: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceListItem {
  id: number;
  providerId: number;
  name: string;
  description?: string | null;
  price: number;
  isActive: boolean;
  provider?: {
    id: number;
    fullName: string;
  };
  createdAt: Date;
}

export interface IServiceListResponse {
  data: IServiceListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ICreateServiceResponse {
  message: string;
  service: IServiceDetail;
}

export interface IUpdateServiceResponse {
  message: string;
  service: IServiceDetail;
}

export interface IDeleteServiceResponse {
  message: string;
}

// ===== FILTER TYPES =====
export interface IServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  providerId?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
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
