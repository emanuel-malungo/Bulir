import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().positive("Quantidade deve ser maior que 0"),
});

export const getBalanceSchema = z.object({
  userId: z.number().int().positive(),
});

export type IDepositRequest = z.infer<typeof depositSchema>;
