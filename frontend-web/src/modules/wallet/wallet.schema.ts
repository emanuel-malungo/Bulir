import { z } from 'zod';
import {
  TransactionType,
  TransactionStatus,
  type ILoadBalanceRequest,
  type IReceivePaymentRequest,
  type ITransactionFilters,
} from './wallet.types';

// ===== LOAD BALANCE =====
export const loadBalanceSchema = z.object({
  amount: z
    .number()
    .positive('Valor deve ser maior que zero')
    .refine(
      (val) => val % 0.01 === 0,
      'Valor deve ter no máximo 2 casas decimais'
    ),
  paymentMethod: z
    .enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX'] as const)
    .optional(),
}) satisfies z.ZodType<ILoadBalanceRequest>;

// ===== RECEIVE PAYMENT =====
export const receivePaymentSchema = z.object({
  amount: z
    .number()
    .positive('Valor deve ser maior que zero'),
  description: z
    .string()
    .min(3, 'Descrição mínimo 3 caracteres')
    .max(255, 'Descrição máximo 255 caracteres'),
}) satisfies z.ZodType<IReceivePaymentRequest>;

// ===== TRANSACTION FILTERS =====
export const transactionFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  type: z.nativeEnum(TransactionType).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  relatedType: z.string().optional(),
}) satisfies z.ZodType<ITransactionFilters>;

// ===== FORM VALIDATION =====
export const loadBalanceFormSchema = z.object({
  amount: z
    .number()
    .positive('Valor deve ser maior que zero')
    .or(
      z
        .string()
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val > 0, 'Valor inválido')
    ),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX']).default('PIX'),
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

export type LoadBalanceFormData = z.infer<typeof loadBalanceFormSchema>;

// ===== WITHDRAWAL FORM =====
export const withdrawalFormSchema = z.object({
  amount: z
    .number()
    .positive('Valor deve ser maior que zero'),
  bankAccount: z
    .string()
    .min(1, 'Selecione uma conta bancária'),
  pixKey: z.string().optional(),
});

export type WithdrawalFormData = z.infer<typeof withdrawalFormSchema>;
