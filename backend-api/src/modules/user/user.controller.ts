import type { Request, Response } from "express";
import { UserService } from "./user.services.js";
import {
  updateUserSchema,
  getUserByIdSchema,
  changePasswordSchema,
  sessionIdSchema,
} from "./user.schema.js";
import type {
  IApiError,
  IGetUserResponse,
  IUpdateUserResponse,
  IChangePasswordResponse,
  ISessionsResponse,
  ILogoutSessionResponse,
  ILogoutAllSessionsResponse,
} from "./user.types.js";
import { z } from "zod";

export class UserController {
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });
      const user = await UserService.getById(userId);
      res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) return res.status(404).json({ error: err.message });
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });
      const validatedData = updateUserSchema.parse(req.body);
      const user = await UserService.update(userId, validatedData);
      res.status(200).json({ message: "Perfil atualizado com sucesso", user });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: "Dados inválidos", errors: err.issues });
      if (err instanceof Error) return res.status(404).json({ error: err.message });
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async changePasswordMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });
      const validatedData = changePasswordSchema.parse(req.body);
      await UserService.changePassword(userId, validatedData.currentPassword, validatedData.newPassword);
      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ error: "Dados inválidos", errors: err.issues });
      if (err instanceof Error) return res.status(400).json({ error: err.message });
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSessionsMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ error: "Usuário não autenticado" });
      const sessions = await UserService.getSessions(userId);
      res.status(200).json(sessions);
    } catch (err) {
      if (err instanceof Error) return res.status(404).json({ error: err.message });
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async findAll(
    req: Request<
      {},
      {},
      {},
      {
        page?: string;
        limit?: string;
        search?: string;
        isActive?: string;
        role?: string;
        startDate?: string;
        endDate?: string;
      }
    >,
    res: Response<any | IApiError>
  ) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const search = req.query.search?.trim();
      const isActive = req.query.isActive
        ? req.query.isActive === "true"
        : undefined;
      const role = req.query.role?.trim();
      const startDate = req.query.startDate?.trim();
      const endDate = req.query.endDate?.trim();

      const result = await UserService.findAll(
        page,
        limit,
        search,
        isActive,
        role,
        startDate,
        endDate
      );

      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getById(
    req: Request<{ id: string }>,
    res: Response<IGetUserResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const validatedId = getUserByIdSchema.parse({ id });

      const user = await UserService.getById(validatedId.id);

      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "ID deve ser um número inteiro positivo",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async update(
    req: Request<{ id: string }, {}, any>,
    res: Response<IUpdateUserResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const validatedId = getUserByIdSchema.parse({ id });
      const validatedData = updateUserSchema.parse(req.body);

      const user = await UserService.update(validatedId.id, validatedData);

      res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async changePassword(
    req: Request<{ id: string }, {}, any>,
    res: Response<IChangePasswordResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const validatedId = getUserByIdSchema.parse({ id });
      const validatedData = changePasswordSchema.parse(req.body);

      await UserService.changePassword(
        validatedId.id,
        validatedData.currentPassword,
        validatedData.newPassword
      );

      res.status(200).json({
        message: "Senha alterada com sucesso. Você foi desconectado de todos os dispositivos.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Dados de senha inválidos",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        const statusCode = err.message.includes("não encontrado")
          ? 404
          : err.message.includes("incorreta")
          ? 401
          : 400;
        return res.status(statusCode).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSessions(
    req: Request<{ id: string }>,
    res: Response<ISessionsResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const validatedId = getUserByIdSchema.parse({ id });
      const sessions = await UserService.getSessions(validatedId.id);

      res.status(200).json(sessions);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "ID inválido",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async revokeSession(
    req: Request<{ id: string; sessionId: string }>,
    res: Response<ILogoutSessionResponse | IApiError>
  ) {
    try {
      const { id, sessionId } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      if (!sessionId || sessionId.trim() === "") {
        return res.status(400).json({ error: "ID da sessão é obrigatório" });
      }

      const validatedUserId = getUserByIdSchema.parse({ id });
      const validatedSessionId = sessionIdSchema.parse({ id: sessionId });

      await UserService.revokeSession(
        validatedUserId.id,
        validatedSessionId.id
      );

      res.status(200).json({
        message: "Sessão encerrada com sucesso",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "IDs inválidos",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        const statusCode = err.message.includes("não encontrada")
          ? 404
          : err.message.includes("Não autorizado")
          ? 403
          : 400;
        return res.status(statusCode).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async revokeAllSessions(
    req: Request<{ id: string }>,
    res: Response<ILogoutAllSessionsResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do usuário é obrigatório" });
      }

      const validatedId = getUserByIdSchema.parse({ id });
      const sessionsTerminated = await UserService.revokeAllSessions(
        validatedId.id
      );

      res.status(200).json({
        message: "Todas as sessões foram encerradas com sucesso",
        sessionsTerminated,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "ID inválido",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
