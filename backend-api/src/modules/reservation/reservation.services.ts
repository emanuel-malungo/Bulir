import prisma from "../../config/prisma.js";
import { walletService } from "../wallet/wallet.services.js";
import type {
  ICreateReservationRequest,
  IReservation,
} from "./reservation.types.js";

export class ReservationService {
  static async create(
    clientId: number,
    data: ICreateReservationRequest
  ): Promise<IReservation> {
    // Validar se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    if (!service.isActive) {
      throw new Error("Serviço não está disponível");
    }

    // Validar se o provedor existe
    const provider = await prisma.user.findUnique({
      where: { id: data.providerId },
    });

    if (!provider) {
      throw new Error("Provedor não encontrado");
    }

    // Validar data agendada (não pode ser no passado)
    const scheduledDate = new Date(data.scheduledAt);
    if (scheduledDate < new Date()) {
      throw new Error("Data agendada não pode ser no passado");
    }

    // Verificar saldo suficiente
    const hasSufficientBalance = await walletService.hasSufficientBalance(
      clientId,
      Number(service.price)
    );

    if (!hasSufficientBalance) {
      throw new Error(
        `Saldo insuficiente. Preço do serviço: Kz ${Number(service.price).toFixed(2)}`
      );
    }

    // Debitar o saldo do cliente
    await walletService.withdraw(clientId, Number(service.price));

    // Criar reserva
    const reservation = await prisma.reservation.create({
      data: {
        clientId,
        serviceId: data.serviceId,
        providerId: data.providerId,
        scheduledAt: scheduledDate,
        serviceName: service.name,
        servicePrice: service.price,
        status: "PENDING",
      },
    });

    // Criar entrada no histórico
    await prisma.reservationHistory.create({
      data: {
        reservationId: reservation.id,
        status: "PENDING",
      },
    });

    return this.formatReservation(reservation);
  }

  static async findAll(
    clientId: number,
    page: number = 1,
    limit: number = 10,
    status?: string,
    serviceId?: number,
    providerId?: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    data: IReservation[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const where: any = { clientId };

    if (status && ["PENDING", "CONFIRMED", "CANCELED"].includes(status)) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (providerId) {
      where.providerId = providerId;
    }

    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) {
        where.scheduledAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.scheduledAt.lte = new Date(endDate);
      }
    }

    const total = await prisma.reservation.count({ where });
    const skip = (page - 1) * limit;

    const reservations = await prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledAt: "desc" },
    });

    return {
      data: reservations.map((r: any) => this.formatReservation(r)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number, clientId: number): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    if (reservation.clientId !== clientId) {
      throw new Error("Você não tem permissão para acessar esta reserva");
    }

    return this.formatReservation(reservation);
  }

  static async updateStatus(
    id: number,
    clientId: number,
    newStatus: string
  ): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    if (reservation.clientId !== clientId) {
      throw new Error("Você não tem permissão para modificar esta reserva");
    }

    if (!["PENDING", "CONFIRMED", "CANCELED"].includes(newStatus)) {
      throw new Error("Status inválido");
    }

    // Atualizar status
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: newStatus as any },
    });

    // Criar entrada no histórico
    await prisma.reservationHistory.create({
      data: {
        reservationId: id,
        status: newStatus as any,
      },
    });

    return this.formatReservation(updated);
  }

  static async cancel(id: number, clientId: number): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    if (reservation.clientId !== clientId) {
      throw new Error("Você não tem permissão para cancelar esta reserva");
    }

    if (reservation.status === "CANCELED") {
      throw new Error("Reserva já foi cancelada");
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELED" },
    });

    // Criar entrada no histórico
    await prisma.reservationHistory.create({
      data: {
        reservationId: id,
        status: "CANCELED",
      },
    });

    return this.formatReservation(updated);
  }

  static async getHistory(id: number, clientId: number): Promise<any[]> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    if (reservation.clientId !== clientId) {
      throw new Error("Você não tem permissão para acessar o histórico desta reserva");
    }

    const history = await prisma.reservationHistory.findMany({
      where: { reservationId: id },
      orderBy: { changedAt: "desc" },
    });

    return history;
  }

  static async findAllForProvider(
    providerId: number,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{
    data: IReservation[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const where: any = { providerId };

    if (status && ["PENDING", "CONFIRMED", "CANCELED"].includes(status)) {
      where.status = status;
    }

    const total = await prisma.reservation.count({ where });
    const skip = (page - 1) * limit;

    const reservations = await prisma.reservation.findMany({
      where,
      skip,
      take: limit,
      orderBy: { scheduledAt: "desc" },
    });

    return {
      data: reservations.map((r: any) => this.formatReservation(r)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProviderStats(providerId: number): Promise<{ totalReservations: number; monthlyEarnings: number }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalReservations = await prisma.reservation.count({
      where: { providerId }
    });

    const monthlyConfirmed = await prisma.reservation.findMany({
      where: {
        providerId,
        status: "CONFIRMED",
        createdAt: {
          gte: firstDayOfMonth
        }
      },
      select: {
        servicePrice: true
      }
    });

    const monthlyEarnings = monthlyConfirmed.reduce((sum, res) => sum + Number(res.servicePrice), 0);

    return {
      totalReservations,
      monthlyEarnings
    };
  }

  private static formatReservation(reservation: any): IReservation {
    return {
      id: reservation.id,
      clientId: reservation.clientId,
      serviceId: reservation.serviceId,
      providerId: reservation.providerId,
      status: reservation.status,
      scheduledAt: reservation.scheduledAt.toISOString(),
      serviceName: reservation.serviceName,
      servicePrice: reservation.servicePrice.toString(),
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
    };
  }
}
