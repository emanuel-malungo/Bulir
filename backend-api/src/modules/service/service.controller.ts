import type { Request, Response } from "express";
import { ServiceService } from "./service.services.js";
import {
  createServiceSchema,
  updateServiceSchema,
  getServiceByIdSchema,
  serviceProviderIdSchema,
} from "./service.schema.js";
import type {
  IApiError,
  ICreateServiceResponse,
  IGetServiceResponse,
  IUpdateServiceResponse,
  IListServicesResponse,
} from "./service.types.js";
import { z } from "zod";

export class ServiceController {
  static async findAll(
    req: Request<
      {},
      {},
      {},
      {
        page?: string;
        limit?: string;
        search?: string;
        providerId?: string;
        isActive?: string;
        startDate?: string;
        endDate?: string;
      }
    >,
    res: Response<IListServicesResponse | IApiError>
  ) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
      const search = req.query.search?.trim();
      const providerId = req.query.providerId
        ? Number(req.query.providerId)
        : undefined;
      const isActive = req.query.isActive
        ? req.query.isActive === "true"
        : undefined;
      const startDate = req.query.startDate?.trim();
      const endDate = req.query.endDate?.trim();

      const result = await ServiceService.findAll(
        page,
        limit,
        search,
        providerId,
        isActive,
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
    res: Response<IGetServiceResponse | IApiError>
  ) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do serviço é obrigatório" });
      }

      const validatedId = getServiceByIdSchema.parse({ id });
      const service = await ServiceService.getById(validatedId.id);

      res.status(200).json({ service });
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

  static async create(
    req: Request<{ providerId: string }, {}, any>,
    res: Response<ICreateServiceResponse | IApiError>
  ) {
    try {
      const { providerId } = req.params;

      if (!providerId || providerId.trim() === "") {
        return res
          .status(400)
          .json({ error: "ID do provedor é obrigatório" });
      }

      const validatedProviderId = serviceProviderIdSchema.parse({ providerId });
      const validatedData = createServiceSchema.parse(req.body);

      const service = await ServiceService.create(
        validatedProviderId.providerId,
        validatedData
      );

      res.status(201).json({
        message: "Serviço criado com sucesso",
        service,
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

  static async update(
    req: Request<{ id: string; providerId: string }, {}, any>,
    res: Response<IUpdateServiceResponse | IApiError>
  ) {
    try {
      const { id, providerId } = req.params;

      if (!id || id.trim() === "") {
        return res.status(400).json({ error: "ID do serviço é obrigatório" });
      }

      if (!providerId || providerId.trim() === "") {
        return res
          .status(400)
          .json({ error: "ID do provedor é obrigatório" });
      }

      const validatedId = getServiceByIdSchema.parse({ id });
      const validatedProviderId = serviceProviderIdSchema.parse({ providerId });
      const validatedData = updateServiceSchema.parse(req.body);

      const service = await ServiceService.update(
        validatedId.id,
        validatedProviderId.providerId,
        validatedData
      );

      res.status(200).json({
        message: "Serviço atualizado com sucesso",
        service,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          errors: err.issues,
        });
      }
      if (err instanceof Error) {
        const statusCode = err.message.includes("Não autorizado")
          ? 403
          : err.message.includes("não encontrado")
          ? 404
          : 400;
        return res.status(statusCode).json({ error: err.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getByProviderId(
    req: Request<{ providerId: string }, {}, {}, { page?: string; limit?: string }>,
    res: Response<IListServicesResponse | IApiError>
  ) {
    try {
      const { providerId } = req.params;

      if (!providerId || providerId.trim() === "") {
        return res
          .status(400)
          .json({ error: "ID do provedor é obrigatório" });
      }

      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));

      const validatedProviderId = serviceProviderIdSchema.parse({ providerId });

      const result = await ServiceService.getByProviderId(
        validatedProviderId.providerId,
        page,
        limit
      );

      res.status(200).json(result);
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
