import type { Request, Response } from "express";
import { AuthService } from "./auth.services.js";
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from "./auth.schema.js";
import type { IRegisterResponse, ILoginResponse, IRefreshResponse, ILogoutResponse, IApiError, IRolesResponse, IRolePermissionsResponse } from "./auth.types.js";
import { ConflictError, ValidationError } from "../../utils/errors.js";
import { z } from "zod";

export class AuthController {
  static async register(req: Request, res: Response<IRegisterResponse | IApiError>) {
    try {
      if (!req.body) {
        throw new ValidationError("Dados inválidos");
      }
      const validatedData = registerSchema.parse(req.body);
      
      const userAgent = req.get("user-agent") || "unknown";
      const ipAddress = req.ip || "unknown";
      
      const result = await AuthService.register(validatedData, userAgent, ipAddress);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }
      if (err instanceof ConflictError) {
        return res.status(409).json({ error: err.message });
      }
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          errors: err.issues
        });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async login(req: Request, res: Response<ILoginResponse | IApiError>) {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      const userAgent = req.get("user-agent") || "unknown";
      const ipAddress = req.ip || "unknown";
      
      const result = await AuthService.login(validatedData, userAgent, ipAddress);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(401).json({ error: err.message });
      }
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          errors: err.issues
        });
      }
      if (err instanceof Error) {
        return res.status(401).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async refresh(req: Request, res: Response<IRefreshResponse | IApiError>) {
    try {
      const validatedData = refreshSchema.parse(req.body);
      const result = await AuthService.refresh(validatedData.refreshToken);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(401).json({ error: err.message });
      }
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          errors: err.issues
        });
      }
      if (err instanceof Error) {
        return res.status(401).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async logout(req: Request, res: Response<ILogoutResponse | IApiError>) {
    try {
      const validatedData = logoutSchema.parse(req.body);
      await AuthService.logout(validatedData.refreshToken);
      res.status(200).json({ message: "Logout realizado com sucesso" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          errors: err.issues
        });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getRoles(_req: Request, res: Response<IRolesResponse | IApiError>) {
    try {
      const roles = await AuthService.getRoles();
      res.status(200).json({ roles });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getRolePermissions(req: Request, res: Response<IRolePermissionsResponse | IApiError>) {
    try {
      const { roleId } = req.params;

      if (!roleId || Array.isArray(roleId)) {
        return res.status(400).json({ error: "Role ID é obrigatório e deve ser um número" });
      }

      const roleIdNum = parseInt(roleId as string, 10);

      if (isNaN(roleIdNum)) {
        return res.status(400).json({ error: "Role ID deve ser um número" });
      }

      const result = await AuthService.getPermissionsByRole(roleIdNum);
      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}