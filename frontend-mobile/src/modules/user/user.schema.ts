import { z } from 'zod';
import type {
  IUpdateUserRequest,
  IChangePasswordRequest,
  IUserFilters,
} from './user.types';

// ===== UPDATE USER =====
export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60, 'Nome não pode exceder 60 caracteres')
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .optional(),
  nif: z
    .string()
    .min(9, 'NIF deve ter no mínimo 9 caracteres')
    .max(14, 'NIF não pode exceder 14 caracteres')
    .optional(),
}) satisfies z.ZodType<IUpdateUserRequest>;

// ===== CHANGE PASSWORD =====
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha não pode exceder 50 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter maiúsculas')
    .regex(/[a-z]/, 'Senha deve conter minúsculas')
    .regex(/[0-9]/, 'Senha deve conter números'),
  confirmPassword: z
    .string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
}) satisfies z.ZodType<IChangePasswordRequest>;

// ===== USER FILTERS =====
export const userFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  role: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}) satisfies z.ZodType<IUserFilters>;

// ===== PROFILE FORM =====
export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60, 'Nome não pode exceder 60 caracteres'),
  email: z
    .string()
    .email('Email inválido'),
  nif: z
    .string()
    .min(9, 'NIF deve ter no mínimo 9 caracteres')
    .max(14, 'NIF não pode exceder 14 caracteres'),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

// ===== PASSWORD FORM =====
export const passwordFormSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter maiúsculas')
    .regex(/[a-z]/, 'Senha deve conter minúsculas')
    .regex(/[0-9]/, 'Senha deve conter números'),
  confirmPassword: z
    .string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

export type PasswordFormData = z.infer<typeof passwordFormSchema>;
