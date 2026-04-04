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
    const where: any = {};

    // Se providerId foi especificado E é o usuário autenticado, listar como provedor
    // Caso contrário, listar como cliente (padrão)
    if (providerId && providerId === clientId) {
      where.providerId = clientId;
    } else {
      where.clientId = clientId;
    }

    if (status && ["PENDING", "CONFIRMED", "CANCELED"].includes(status)) {
      where.status = status;
    }

    if (serviceId) {
      where.serviceId = serviceId;
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
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
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

  static async getById(id: number, userId: number): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Cliente ou provider podem ver a reserva
    if (reservation.clientId !== userId && reservation.providerId !== userId) {
      throw new Error("Você não tem permissão para acessar esta reserva");
    }

    return this.formatReservation(reservation);
  }

  static async updateStatus(
    id: number,
    userId: number,
    newStatus: string
  ): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Se mudando para CONFIRMED, deve ser o provider
    if (newStatus === "CONFIRMED") {
      if (reservation.providerId !== userId) {
        throw new Error("Apenas o provider pode confirmar a reserva");
      }
      if (reservation.status !== "PENDING") {
        throw new Error("Apenas reservas pendentes podem ser confirmadas");
      }
    }
    // Se cancelando, pode ser cliente ou provider
    else if (newStatus === "CANCELED") {
      if (reservation.clientId !== userId && reservation.providerId !== userId) {
        throw new Error("Você não tem permissão para modificar esta reserva");
      }
      if (reservation.status === "CANCELED") {
        throw new Error("Reserva já foi cancelada");
      }
    }
    // Status inválido
    else if (!["PENDING", "CONFIRMED", "CANCELED"].includes(newStatus)) {
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

  static async cancel(id: number, userId: number): Promise<IReservation> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Cliente ou provider podem cancelar
    if (reservation.clientId !== userId && reservation.providerId !== userId) {
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

  static async getHistory(id: number, userId: number): Promise<any[]> {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new Error("Reserva não encontrada");
    }

    // Cliente ou provider podem ver o histórico
    if (reservation.clientId !== userId && reservation.providerId !== userId) {
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
      include: {
        client: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        }
      }
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
      client: reservation.client ? {
        id: reservation.client.id,
        fullName: reservation.client.fullName,
        email: reservation.client.email
      } : undefined
    };
  }
}
