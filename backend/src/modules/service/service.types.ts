// ===== REQUEST TYPES =====
export interface ICreateServiceRequest {
  name: string;
  description?: string;
  price: number;
}

export interface IUpdateServiceRequest {
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
  price: any;
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
  price: any;
  isActive: boolean;
  provider?: {
    id: number;
    fullName: string;
  };
  createdAt: Date;
}

export interface ICreateServiceResponse {
  message: string;
  service: IServiceDetail;
}

export interface IGetServiceResponse {
  service: IServiceDetail;
}

export interface IUpdateServiceResponse {
  message: string;
  service: IServiceDetail;
}

export interface IListServicesResponse {
  data: IServiceListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
