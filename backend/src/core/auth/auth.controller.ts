import type { Request, Response } from "express";
import { AuthService } from "./auth.services.js";
import { registerSchema } from "./auth.schema.js";
import type { IRegisterResponse, IApiError } from "./auth.types.js";
import { ConflictError } from "../../utils/errors.js";
import { z } from "zod";

export class AuthController {
  static async register(req: Request, res: Response<IRegisterResponse | IApiError>) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.register(validatedData);
      res.status(201).json({ message: "Usuário registrado com sucesso", user });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          errors: err.issues
        });
      }
      if (err instanceof ConflictError) {
        return res.status(409).json({ error: err.message });
      }
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}