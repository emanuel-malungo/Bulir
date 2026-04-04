import { z } from 'zod';
import {
  ReservationStatus,
  type ICreateReservationRequest,
  type IUpdateReservationStatusRequest,
  type IReservationFilters,
} from './reservation.types';

// ===== CREATE RESERVATION =====
export const createReservationSchema = z.object({
  serviceId: z.number().int().positive('ID do serviço inválido'),
  providerId: z.number().int().positive('ID do provedor inválido'),
  scheduledAt: z
    .string()
    .datetime('Data agendada deve estar em formato ISO 8601'),
}) satisfies z.ZodType<ICreateReservationRequest>;

// ===== UPDATE RESERVATION STATUS =====
export const updateReservationStatusSchema = z.object({
  status: z.nativeEnum(ReservationStatus),
}) satisfies z.ZodType<IUpdateReservationStatusRequest>;

// ===== RESERVATION FILTERS =====
export const reservationFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  status: z.nativeEnum(ReservationStatus).optional(),
  serviceId: z.number().int().positive().optional(),
  providerId: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}) satisfies z.ZodType<IReservationFilters>;

// ===== FORM VALIDATION =====
export const reservationFormSchema = z.object({
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione uma hora'),
});

export type ReservationFormData = z.infer<typeof reservationFormSchema>;

// ===== STATUS FILTER FORM =====
export const reservationStatusFilterSchema = z.object({
  status: z.union([z.nativeEnum(ReservationStatus), z.literal('')]).default(''),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ReservationStatusFilterData = z.infer<typeof reservationStatusFilterSchema>;
