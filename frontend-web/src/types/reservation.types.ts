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
  servicePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateReservationRequest {
  serviceId: number;
  providerId: number;
  scheduledAt: string;
}
