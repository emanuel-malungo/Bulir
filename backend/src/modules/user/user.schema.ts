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

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Senha atual é obrigatória"),
  newPassword: z.string()
    .min(8, "Nova senha deve ter no mínimo 8 caracteres")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número")
    .regex(/[!@#$%^&*]/, "Deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: "Nova senha não pode ser igual à senha atual",
    path: ["newPassword"],
  }
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

export const sessionIdSchema = z.object({
  id: z.coerce.number()
    .int("ID da sessão deve ser um número inteiro")
    .positive("ID da sessão deve ser positivo")
});
