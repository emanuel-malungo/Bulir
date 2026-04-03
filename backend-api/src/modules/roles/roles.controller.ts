import type { Request, Response } from "express";
import { RoleService } from "./roles.services.js";
import {
  createRoleSchema,
  updateRoleSchema,
  getRoleByIdSchema,
  assignPermissionSchema,
  removePermissionSchema,
  createPermissionSchema,
  updatePermissionSchema,
  getPermissionByIdSchema,
} from "./roles.schema.js";
import type {
  IApiError,
  ICreateRoleRequest,
  ICreateRoleResponse,
  IListRolesResponse,
  IGetRoleResponse,
  IUpdateRoleResponse,
  IDeleteRoleResponse,
  ICreatePermissionRequest,
  ICreatePermissionResponse,
  IListPermissionsResponse,
  IAssignPermissionResponse,
} from "./roles.types.js";
import { z } from "zod";

export class RoleController {
  // ===== ROLES =====

  static async createRole(
    req: Request<{}, {}, any>,
    res: Response<ICreateRoleResponse | IApiError>
  ) {
    try {
      const validatedData = createRoleSchema.parse(req.body);
      const role = await RoleService.createRole({
        name: validatedData.name,
        description: validatedData.description || "",
      });

      res.status(201).json({
        data: role,
        message: "Papel criado com sucesso",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllRoles(
    _req: Request,
    res: Response<IListRolesResponse | IApiError>
  ) {
    try {
      const roles = await RoleService.getAllRoles();
      res.status(200).json({ data: roles });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getRoleById(
    req: Request<{ id: string }>,
    res: Response<IGetRoleResponse | IApiError>
  ) {
    try {
      const validatedId = getRoleByIdSchema.parse({ id: req.params.id });
      const role = await RoleService.getRoleById(validatedId.id);

      res.status(200).json({ data: role });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateRole(
    req: Request<{ id: string }, {}, any>,
    res: Response<IUpdateRoleResponse | IApiError>
  ) {
    try {
      const validatedData = updateRoleSchema.parse({
        id: req.params.id,
        ...req.body,
      });

      const updateData: Partial<ICreateRoleRequest> = {};
      if (validatedData.name) updateData.name = validatedData.name;
      if (validatedData.description) updateData.description = validatedData.description;

      const role = await RoleService.updateRole(validatedData.id, updateData);

      res.status(200).json({
        data: role,
        message: "Papel atualizado com sucesso",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteRole(
    req: Request<{ id: string }>,
    res: Response<IDeleteRoleResponse | IApiError>
  ) {
    try {
      const validatedId = getRoleByIdSchema.parse({ id: req.params.id });
      await RoleService.deleteRole(validatedId.id);

      res.status(200).json({ message: "Papel deletado com sucesso" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // ===== PERMISSIONS =====

  static async createPermission(
    req: Request<{}, {}, any>,
    res: Response<ICreatePermissionResponse | IApiError>
  ) {
    try {
      const validatedData = createPermissionSchema.parse(req.body);
      const permission = await RoleService.createPermission({
        name: validatedData.name,
        description: validatedData.description || "",
      });

      res.status(201).json({
        data: permission,
        message: "Permissão criada com sucesso",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllPermissions(
    _req: Request,
    res: Response<IListPermissionsResponse | IApiError>
  ) {
    try {
      const permissions = await RoleService.getAllPermissions();
      res.status(200).json({ data: permissions });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getPermissionById(
    req: Request<{ id: string }>,
    res: Response<any | IApiError>
  ) {
    try {
      const validatedId = getPermissionByIdSchema.parse({ id: req.params.id });
      const permission = await RoleService.getPermissionById(validatedId.id);

      res.status(200).json({ data: permission });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updatePermission(
    req: Request<{ id: string }, {}, any>,
    res: Response<any | IApiError>
  ) {
    try {
      const validatedData = updatePermissionSchema.parse({
        id: req.params.id,
        ...req.body,
      });

      const updateData: Partial<ICreatePermissionRequest> = {};
      if (validatedData.name) updateData.name = validatedData.name;
      if (validatedData.description) updateData.description = validatedData.description;

      const permission = await RoleService.updatePermission(validatedData.id, updateData);

      res.status(200).json({
        data: permission,
        message: "Permissão atualizada com sucesso",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deletePermission(
    req: Request<{ id: string }>,
    res: Response<any | IApiError>
  ) {
    try {
      const validatedId = getPermissionByIdSchema.parse({ id: req.params.id });
      await RoleService.deletePermission(validatedId.id);

      res.status(200).json({ message: "Permissão deletada com sucesso" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // ===== ROLE PERMISSIONS =====

  static async assignPermissionToRole(
    req: Request<{}, {}, any>,
    res: Response<IAssignPermissionResponse | IApiError>
  ) {
    try {
      const validatedData = assignPermissionSchema.parse(req.body);
      await RoleService.assignPermissionToRole(
        validatedData.roleId,
        validatedData.permissionId
      );

      res.status(201).json({
        message: "Permissão atribuída ao papel com sucesso",
        data: {
          roleId: validatedData.roleId,
          permissionId: validatedData.permissionId,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async removePermissionFromRole(
    req: Request<{}, {}, any>,
    res: Response<IAssignPermissionResponse | IApiError>
  ) {
    try {
      const validatedData = removePermissionSchema.parse(req.body);
      await RoleService.removePermissionFromRole(
        validatedData.roleId,
        validatedData.permissionId
      );

      res.status(200).json({
        message: "Permissão removida do papel com sucesso",
        data: {
          roleId: validatedData.roleId,
          permissionId: validatedData.permissionId,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getPermissionsByRole(
    req: Request<{ id: string }>,
    res: Response<IListPermissionsResponse | IApiError>
  ) {
    try {
      const validatedId = getRoleByIdSchema.parse({ id: req.params.id });
      const permissions = await RoleService.getPermissionsByRole(validatedId.id);

      res.status(200).json({ data: permissions });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ errors: err.issues });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // ===== USER ROLES =====

  static async assignRoleToUser(
    req: Request<{}, {}, { userId: number; roleId: number }>,
    res: Response<IAssignPermissionResponse | IApiError>
  ) {
    try {
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        return res
          .status(400)
          .json({ error: "userId e roleId são obrigatórios" });
      }

      await RoleService.assignRoleToUser(userId, roleId);

      res.status(201).json({
        message: "Papel atribuído ao usuário com sucesso",
        data: { roleId, permissionId: userId },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async removeRoleFromUser(
    req: Request<{}, {}, { userId: number; roleId: number }>,
    res: Response<IAssignPermissionResponse | IApiError>
  ) {
    try {
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        return res
          .status(400)
          .json({ error: "userId e roleId são obrigatórios" });
      }

      await RoleService.removeRoleFromUser(userId, roleId);

      res.status(200).json({
        message: "Papel removido do usuário com sucesso",
        data: { roleId, permissionId: userId },
      });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getRolesByUser(
    req: Request<{ id: string }>,
    res: Response<IListRolesResponse | IApiError>
  ) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "ID do usuário inválido" });
      }

      const roles = await RoleService.getRolesByUser(userId);

      res.status(200).json({ data: roles });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
