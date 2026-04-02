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
}

