import type { Request, Response } from "express";
import { AuthService } from "./auth.services.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
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
      
      // Set HttpOnly Cookie with refreshToken (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', (result as any).refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: maxAge,
        path: '/'
      });
      
      // Set Access Token in Authorization header for the response
      res.set('Authorization', `Bearer ${(result as any).accessToken}`);
      
      // Return response WITH accessToken
      const { refreshToken, ...responseWithToken } = result as any;
      res.status(201).json(responseWithToken);
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
      
      // Set HttpOnly Cookie with refreshToken (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000;
      res.cookie('refreshToken', (result as any).refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: maxAge,
        path: '/'
      });
      
      // Set Access Token in Authorization header for the response
      res.set('Authorization', `Bearer ${(result as any).accessToken}`);
      
      // Return response WITH accessToken
      const { refreshToken, ...responseWithToken } = result as any;
      res.status(200).json(responseWithToken);
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
      const refreshToken = req.cookies['refreshToken'];
      
      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token não fornecido" });
      }
      
      const result = await AuthService.refresh(refreshToken);
      
      // Set Access Token in Authorization header for the response
      res.set('Authorization', `Bearer ${result.accessToken}`);
      
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
      const refreshToken = req.cookies['refreshToken'];
      
      if (!refreshToken) {
        return res.status(400).json({ error: "Nenhuma sessão ativa" });
      }
      
      await AuthService.logout(refreshToken);
      
      // Clear HttpOnly Cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        path: '/'
      });
      
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