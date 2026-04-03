import { z } from "zod";

export const createReservationSchema = z.object({
  serviceId: z.number().int().positive("ID do serviço é inválido"),
  providerId: z.number().int().positive("ID do provedor é inválido"),
  scheduledAt: z.string().datetime("Data/hora da reserva inválida"),
});

export const updateReservationStatusSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]),
});

export const getReservationByIdSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
});

export const listReservationsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]).optional(),
  serviceId: z.string().optional(),
  providerId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
