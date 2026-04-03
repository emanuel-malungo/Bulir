import type { Request, Response } from "express";
import { ReservationService } from "./reservation.services.js";
import {
  createReservationSchema,
  updateReservationStatusSchema,
  getReservationByIdSchema,
} from "./reservation.schema.js";
import type {
  IApiError,
  ICreateReservationResponse,
  IGetReservationResponse,
  IUpdateReservationStatusResponse,
  IListReservationsResponse,
  IReservationHistoryResponse,
} from "./reservation.types.js";
import { z } from "zod";

export class ReservationController {
  static async create(
    req: Request<{}, {}, any>,
    res: Response<ICreateReservationResponse | IApiError>
  ) {
    try {
      const clientId = (req as any).userId; // Vem do middleware de auth
      
      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const validatedData = createReservationSchema.parse(req.body);
      const reservation = await ReservationService.create(clientId, validatedData);

      res.status(201).json({
        data: reservation,
        message: "Reserva criada com sucesso",
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

  static async findAll(
    req: Request<
      {},
      {},
      {},
      {
        page?: string;
        limit?: string;
        status?: string;
        serviceId?: string;
        providerId?: string;
        startDate?: string;
        endDate?: string;
      }
    >,
    res: Response<IListReservationsResponse | IApiError>
  ) {
    try {
      const clientId = (req as any).userId;
      
      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const status = req.query.status?.trim();
      const serviceId = req.query.serviceId ? Number(req.query.serviceId) : undefined;
      const providerId = req.query.providerId ? Number(req.query.providerId) : undefined;
      const startDate = req.query.startDate?.trim();
      const endDate = req.query.endDate?.trim();

      const result = await ReservationService.findAll(
        clientId,
        page,
        limit,
        status,
        serviceId,
        providerId,
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
    res: Response<IGetReservationResponse | IApiError>
  ) {
    try {
      const { id } = req.params;
      const clientId = (req as any).userId;

      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID da reserva é obrigatório" });
      }

      const validatedId = getReservationByIdSchema.parse({ id });
      const reservation = await ReservationService.getById(validatedId.id, clientId);

      res.status(200).json({ data: reservation });
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

  static async updateStatus(
    req: Request<{ id: string }, {}, { status: string }>,
    res: Response<IUpdateReservationStatusResponse | IApiError>
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const clientId = (req as any).userId;

      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório" });
      }

      const validatedData = updateReservationStatusSchema.parse({ id, status });
      const reservation = await ReservationService.updateStatus(
        validatedData.id,
        clientId,
        validatedData.status
      );

      res.status(200).json({
        data: reservation,
        message: "Status da reserva atualizado com sucesso",
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

  static async cancel(
    req: Request<{ id: string }>,
    res: Response<IUpdateReservationStatusResponse | IApiError>
  ) {
    try {
      const { id } = req.params;
      const clientId = (req as any).userId;

      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const validatedId = getReservationByIdSchema.parse({ id });
      const reservation = await ReservationService.cancel(validatedId.id, clientId);

      res.status(200).json({
        data: reservation,
        message: "Reserva cancelada com sucesso",
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

  static async getHistory(
    req: Request<{ id: string }>,
    res: Response<IReservationHistoryResponse | IApiError>
  ) {
    try {
      const { id } = req.params;
      const clientId = (req as any).userId;

      if (!clientId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const validatedId = getReservationByIdSchema.parse({ id });
      const history = await ReservationService.getHistory(validatedId.id, clientId);

      res.status(200).json({ data: history });
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

  static async findAllForProvider(
    req: Request<{}, {}, {}, { page?: string; limit?: string; status?: string }>,
    res: Response<IListReservationsResponse | IApiError>
  ) {
    try {
      const providerId = (req as any).userId;
      
      if (!providerId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const status = req.query.status?.trim();

      const result = await ReservationService.findAllForProvider(
        providerId,
        page,
        limit,
        status
      );

      res.status(200).json(result);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getProviderStats(
    req: Request,
    res: Response<any | IApiError>
  ) {
    try {
      const providerId = (req as any).userId;
      
      if (!providerId) {
        return res.status(401).json({ error: "Usuário não autenticado" });
      }

      const stats = await ReservationService.getProviderStats(providerId);

      res.status(200).json({ data: stats });
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}
