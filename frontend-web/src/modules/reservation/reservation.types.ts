// ===== ENUMS =====
export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

// ===== REQUEST TYPES =====
export interface ICreateReservationRequest {
  serviceId: number;
  providerId: number;
  scheduledAt: string; // ISO 8601 datetime
}

export interface IUpdateReservationStatusRequest {
  status: ReservationStatus;
}

// ===== RESPONSE TYPES =====
export interface IReservation {
  id: number;
  clientId: number;
  serviceId: number;
  providerId: number;
  status: ReservationStatus;
  scheduledAt: string;
  serviceName: string;
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface IReservationHistory {
  id: number;
  reservationId: number;
  status: ReservationStatus;
  changedAt: string;
}

export interface ICreateReservationResponse {
  message: string;
  data: IReservation;
}

export interface IGetReservationResponse {
  data: IReservation;
}

export interface IUpdateReservationStatusResponse {
  message: string;
  data: IReservation;
}

export interface IReservationListResponse {
  data: IReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IReservationHistoryResponse {
  data: IReservationHistory[];
}

export interface ICancelReservationResponse {
  message: string;
}

// ===== FILTER TYPES =====
export interface IReservationFilters {
  page?: number;
  limit?: number;
  status?: ReservationStatus;
  serviceId?: number;
  providerId?: number;
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
