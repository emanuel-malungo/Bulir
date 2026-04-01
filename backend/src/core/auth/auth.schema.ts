import { z } from "zod";
import type { IRegisterRequest } from "./auth.types.js";

export const registerSchema = z.object({
  fullName: z.string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(60, "Nome não pode exceder 60 caracteres"),
  email: z.email("Formato de email inválido"),
  nif: z.string()
    .min(9, "NIF deve ter no mínimo 9 caracteres")
    .max(12, "NIF não pode exceder 12 caracteres"),
  password: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(50, "Senha não pode exceder 50 caracteres")
    .regex(/[A-Z]/, "Senha deve conter maiúsculas")
    .regex(/[a-z]/, "Senha deve conter minúsculas")
    .regex(/[0-9]/, "Senha deve conter números")
}) satisfies z.ZodType<IRegisterRequest>;
