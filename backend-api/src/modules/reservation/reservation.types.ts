export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
}

export interface IReservation {
  id: number;
  clientId: number;
  serviceId: number;
  providerId: number;
  status: ReservationStatus;
  scheduledAt: string;
  serviceName: string;
  servicePrice: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReservationRequest {
  serviceId: number;
  providerId: number;
  scheduledAt: string;
}

export interface ICreateReservationResponse {
  data: IReservation;
  message: string;
}

export interface IGetReservationResponse {
  data: IReservation;
}

export interface IUpdateReservationStatusResponse {
  data: IReservation;
  message: string;
}

export interface IListReservationsResponse {
  data: IReservation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IReservationHistoryResponse {
  data: Array<{
    id: number;
    reservationId: number;
    status: ReservationStatus;
    changedAt: string;
  }>;
}

export interface IApiError {
  error?: string;
  errors?: any[];
}
