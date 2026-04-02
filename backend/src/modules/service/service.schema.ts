import { z } from "zod";

export const createServiceSchema = z.object({
  name: z.string()
    .min(3, "Nome do serviço deve ter no mínimo 3 caracteres")
    .max(100, "Nome do serviço não pode exceder 100 caracteres"),
  description: z.string()
    .max(500, "Descrição não pode exceder 500 caracteres")
    .optional(),
  price: z.number()
    .positive("Preço deve ser um valor positivo")
    .min(0.01, "Preço mínimo é 0.01"),
});

export const updateServiceSchema = z.object({
  name: z.string()
    .min(3, "Nome do serviço deve ter no mínimo 3 caracteres")
    .max(100, "Nome do serviço não pode exceder 100 caracteres")
    .optional(),
  description: z.string()
    .max(500, "Descrição não pode exceder 500 caracteres")
    .optional(),
  price: z.number()
    .positive("Preço deve ser um valor positivo")
    .min(0.01, "Preço mínimo é 0.01")
    .optional(),
  isActive: z.boolean()
    .optional(),
}).refine(
  (data) => Object.values(data).some(val => val !== undefined),
  { message: "Pelo menos um campo deve ser fornecido para atualização" }
);

export const getServiceByIdSchema = z.object({
  id: z.coerce.number()
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser positivo")
});

export const serviceProviderIdSchema = z.object({
  providerId: z.coerce.number()
    .int("ID do provedor deve ser um número inteiro")
    .positive("ID do provedor deve ser positivo")
});
