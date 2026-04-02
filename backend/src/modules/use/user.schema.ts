import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(60, "Nome não pode exceder 60 caracteres")
    .optional(),
  email: z.email("Formato de email inválido")
    .optional(),
  nif: z.string()
    .min(9, "NIF deve ter no mínimo 9 caracteres")
    .max(14, "NIF não pode exceder 14 caracteres")
    .optional(),
}).refine(
  (data) => Object.values(data).some(val => val !== undefined),
  { message: "Pelo menos um campo deve ser fornecido para atualização" }
);

export const deleteUserSchema = z.object({
  id: z.coerce.number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser positivo")
});

export const getUserByIdSchema = z.object({
  id: z.coerce.number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser positivo")
});
