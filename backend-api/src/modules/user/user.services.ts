import prisma from "../../config/prisma.js";
import { comparePassword, hashPassword } from "../../utils/hash.utils.js";

export class UserService {
  /**
   * Helper: Converte balance de Decimal para número
   */
  private static normalizeUser(user: any) {
    if (!user) return user;
    return {
      ...user,
      balance: user.balance ? Number(user.balance) : 0,
    };
  }

  /**
   * Helper: Normaliza array de usuários
   */
  private static normalizeUsers(users: any[]) {
    return users.map(user => this.normalizeUser(user));
  }

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
      data: this.normalizeUsers(users),
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

    return this.normalizeUser(user);
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

    return this.normalizeUser(updatedUser);
  }

  static async changePassword(id: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, passwordHash: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Senha atual incorreta");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });

    // Revoga todas as sessões do usuário após mudança de senha (segurança)
    await prisma.session.updateMany({
      where: { userId: id },
      data: { isRevoked: true },
    });

    return;
  }

  static async getSessions(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const sessions = await prisma.session.findMany({
      where: { userId: id, isRevoked: false },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        deviceId: true,
        isRevoked: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      sessions,
      total: sessions.length,
    };
  }

  static async revokeSession(userId: number, sessionId: number) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { userId: true, isRevoked: true },
    });

    if (!session) {
      throw new Error("Sessão não encontrada");
    }

    if (session.userId !== userId) {
      throw new Error("Não autorizado a revogar esta sessão");
    }

    if (session.isRevoked) {
      throw new Error("Sessão já foi revogada");
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });

    return;
  }

  static async revokeAllSessions(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const result = await prisma.session.updateMany({
      where: { userId: id, isRevoked: false },
      data: { isRevoked: true },
    });

    return result.count;
  }
}

