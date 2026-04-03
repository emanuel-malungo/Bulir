import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do papel é obrigatório")
    .max(50, "Nome muito longo"),
  description: z.string().optional(),
});

export const updateRoleSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
  name: z
    .string()
    .min(1, "Nome do papel é obrigatório")
    .max(50, "Nome muito longo")
    .optional(),
  description: z.string().optional(),
});

export const getRoleByIdSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
});

export const assignPermissionSchema = z.object({
  roleId: z.number().int().positive("ID do papel é inválido"),
  permissionId: z.number().int().positive("ID da permissão é inválido"),
});

export const removePermissionSchema = z.object({
  roleId: z.number().int().positive("ID do papel é inválido"),
  permissionId: z.number().int().positive("ID da permissão é inválido"),
});

export const createPermissionSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da permissão é obrigatório")
    .max(50, "Nome muito longo"),
  description: z.string().optional(),
});

export const updatePermissionSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
  name: z
    .string()
    .min(1, "Nome da permissão é obrigatório")
    .max(50, "Nome muito longo")
    .optional(),
  description: z.string().optional(),
});

export const getPermissionByIdSchema = z.object({
  id: z.string().transform(Number).pipe(z.number().int().positive()),
});
