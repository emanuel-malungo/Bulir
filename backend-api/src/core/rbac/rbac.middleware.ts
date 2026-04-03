import type { Request, Response, NextFunction } from "express";
import { RoleService } from "../../modules/roles/roles.services.js";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRoles?: string[];
    }
  }
}

/**
 * Middleware para verificar se o usuário tem uma permissão específica
 * @param permissionName Nome da permissão a verificar
 */
export function requirePermission(permissionName: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const hasPermission = await RoleService.hasPermission(userId, permissionName);

      if (!hasPermission) {
        return res.status(403).json({
          error: "Você não tem permissão para acessar este recurso",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Erro ao verificar permissões" });
    }
  };
}

/**
 * Middleware para verificar se o usuário tem um papel específico
 * @param roleNames Nomes dos papéis permitidos
 */
export function requireRole(...roleNames: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const userRoles = await RoleService.getRolesByUser(userId);
      const userRoleNames = userRoles.map((role: any) => role.name);

      const hasRole = roleNames.some((roleName) => userRoleNames.includes(roleName));

      if (!hasRole) {
        return res.status(403).json({
          error: `Você precisa ter um dos seguintes papéis: ${roleNames.join(", ")}`,
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Erro ao verificar papéis" });
    }
  };
}

/**
 * Middleware para verificar se o usuário é ADMIN
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole("ADMIN")(req, res, next);
}

/**
 * Middleware para verificar se o usuário é PROVEDOR
 */
export function requireProvider(req: Request, res: Response, next: NextFunction) {
  return requireRole("PROVEDOR")(req, res, next);
}

/**
 * Middleware para verificar se o usuário é CLIENTE
 */
export function requireClient(req: Request, res: Response, next: NextFunction) {
  return requireRole("CLIENTE")(req, res, next);
}
