import type { Request, Response } from "express";
import { UserService } from "./user.services.js";
import { updateUserSchema, getUserByIdSchema } from "./user.schema.js";
import type { IApiError, IGetUserResponse, IUpdateUserResponse } from "./user.types.js";
import { z } from "zod";

export class UserController {
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
      const validatedId = getUserByIdSchema.parse({ id: req.params.id });

      const user = await UserService.getById(validatedId.id);

      res.status(200).json({ user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
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
      const validatedId = getUserByIdSchema.parse({ id: req.params.id });
      const validatedData = updateUserSchema.parse(req.body);

      const user = await UserService.update(validatedId.id, validatedData);

      res.status(200).json({
        message: "Usuário atualizado com sucesso",
        user,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
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
