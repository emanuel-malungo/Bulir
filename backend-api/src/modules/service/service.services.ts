import prisma from "../../config/prisma.js";

export class ServiceService {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    providerId?: number,
    isActive?: boolean,
    startDate?: string,
    endDate?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = { AND: [], deletedAt: null };

    if (search) {
      where.AND.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (providerId) {
      where.AND.push({ providerId });
    }

    if (isActive !== undefined) {
      where.AND.push({ isActive });
    }

    if (startDate || endDate) {
      where.AND.push({
        createdAt: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          providerId: true,
          name: true,
          description: true,
          price: true,
          isActive: true,
          createdAt: true,
          provider: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.service.count({ where }),
    ]);

    return {
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        providerId: true,
        name: true,
        description: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    return service;
  }

  static async create(providerId: number, data: { name: string; description?: string | undefined; price: number }) {
    // Verificar se o provedor existe
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
      select: { id: true },
    });

    if (!provider) {
      throw new Error("Provedor (usuário) não encontrado");
    }

    const service = await prisma.service.create({
      data: {
        providerId,
        name: data.name,
        description: data.description || null,
        price: data.price,
      },
      select: {
        id: true,
        providerId: true,
        name: true,
        description: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return service;
  }

  static async update(id: number, providerId: number, data?: { name?: string | undefined; description?: string | undefined; price?: number | undefined; isActive?: boolean | undefined }) {
    const service = await prisma.service.findFirst({
      where: { id, deletedAt: null },
      select: { providerId: true },
    });

    if (!service) {
      throw new Error("Serviço não encontrado");
    }

    // Validar se o usuário é o proprietário
    if (service.providerId !== providerId) {
      throw new Error("Não autorizado a editar este serviço");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Nenhum campo fornecido para atualização");
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: data as any,
      select: {
        id: true,
        providerId: true,
        name: true,
        description: true,
        price: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return updatedService;
  }

  static async getByProviderId(providerId: number, page: number = 1, limit: number = 10) {
    // Verificar se o provedor existe
    const provider = await prisma.user.findUnique({
      where: { id: providerId },
      select: { id: true },
    });

    if (!provider) {
      throw new Error("Provedor não encontrado");
    }

    const skip = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where: { providerId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          providerId: true,
          name: true,
          description: true,
          price: true,
          isActive: true,
          createdAt: true,
          provider: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      }),
      prisma.service.count({ where: { providerId, deletedAt: null } }),
    ]);

    return {
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
