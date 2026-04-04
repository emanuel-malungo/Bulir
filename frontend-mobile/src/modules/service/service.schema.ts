import { z } from 'zod';
import type {
  ICreateServiceRequest,
  IUpdateServiceRequest,
  IServiceFilters,
} from './service.types';

// ===== CREATE SERVICE =====
export const createServiceSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome não pode exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .optional(),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .min(0.01, 'Preço mínimo é 0.01'),
}) satisfies z.ZodType<ICreateServiceRequest>;

// ===== UPDATE SERVICE =====
export const updateServiceSchema = z.object({
  id: z.number().int().positive('ID inválido'),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome não pode exceder 100 caracteres')
    .optional(),
  description: z
    .string()
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .optional(),
  price: z
    .number()
    .positive('Preço deve ser positivo')
    .min(0.01, 'Preço mínimo é 0.01')
    .optional(),
  isActive: z.boolean().optional(),
}) satisfies z.ZodType<IUpdateServiceRequest>;

// ===== SERVICE FILTERS =====
export const serviceFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  providerId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}) satisfies z.ZodType<IServiceFilters>;

// ===== FORM VALIDATION =====
export const serviceFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome não pode exceder 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição não pode exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  price: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, 'Preço deve ser positivo')
    .refine((val) => val >= 0.01, 'Preço mínimo é 0.01'),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
