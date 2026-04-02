import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(3, 'Email ou NIF inválido')
    .email('Formato de email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha não pode exceder 50 caracteres'),
  recaptchaToken: z.string()
    .min(1, 'reCAPTCHA é obrigatório'),
});

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60, 'Nome não pode exceder 60 caracteres'),
  email: z.string()
    .email('Formato de email inválido'),
  nif: z.string()
    .min(9, 'NIF deve ter no mínimo 9 caracteres')
    .max(14, 'NIF não pode exceder 14 caracteres'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(50, 'Senha não pode exceder 50 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter maiúsculas')
    .regex(/[a-z]/, 'Senha deve conter minúsculas')
    .regex(/[0-9]/, 'Senha deve conter números'),
  confirmPassword: z.string()
    .min(8, 'Confirmação de senha é obrigatória'),
  roleId: z.coerce.number()
    .int('Role ID deve ser um número inteiro')
    .positive('Role ID deve ser positivo'),
  recaptchaToken: z.string()
    .min(1, 'reCAPTCHA é obrigatório'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem',
  path: ['confirmPassword'],
});

export const refreshSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token é obrigatório'),
});

export const logoutSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token é obrigatório'),
});

// ===== INFERRED TYPES =====
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
