import prisma from "../../config/prisma.js";

export class UserService {
  static async findAll(
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean,
    role?: string,
    startDate?: string,
    endDate?: string
  ) {
    const skip = (page - 1) * limit;
    const where: any = { AND: [] };

    if (search) {
      where.AND.push({
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (isActive !== undefined) {
      where.AND.push({ isActive });
    }

    if (role) {
      where.AND.push({
        userRoles: {
          some: {
            role: {
              name: role,
            },
          },
        },
      });
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

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          nif: true,
          balance: true,
          isActive: true,
          createdAt: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        nif: true,
        balance: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user;
  }

  static async update(id: number, data?: { fullName?: string | undefined; email?: string | undefined; nif?: string | undefined }) {
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      throw new Error("Usuário não encontrado");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("Nenhum campo fornecido para atualização");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: data as any,
      select: {
        id: true,
        fullName: true,
        email: true,
        nif: true,
        balance: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    return updatedUser;
  }
}

