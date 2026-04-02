import prisma from "../../config/prisma.js"
import { hashPassword, comparePassword } from "../../utils/hash.utils.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.utils.js";
import { ConflictError, ValidationError } from "../../utils/errors.js";
import { NIFService } from "../../utils/nif.utils.js";
import type { IRegisterRequest, ILoginRequest, IUser, ILoginResponse, IRegisterResponse, IRole } from "./auth.types.js";

export class AuthService {
  // REGISTER
  static async register(data: IRegisterRequest, userAgent: string = "unknown", ipAddress: string = "unknown"): Promise<IRegisterResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new ConflictError("Email já está registrado");
    }

    // Formata o NIF antes de qualquer validação
    const formattedNIF = NIFService.formatNIF(data.nif);

    const existingNif = await prisma.user.findUnique({
      where: { nif: formattedNIF }
    });

    if (existingNif) {
      throw new ConflictError("NIF já está registrado");
    }

    // Verificar se o NIF existe na API
    const biDetails = await NIFService.verifyNIF(formattedNIF);
    if (!biDetails) {
      throw new ValidationError("NIF não encontrado ou inválido");
    }

    const passwordHash = await hashPassword(data.password);

    // Verifica se o role existe
    const role = await prisma.role.findUnique({
      where: { id: data.roleId }
    });

    if (!role) {
      throw new ValidationError(`Role com ID ${data.roleId} não encontrado`);
    }

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        nif: formattedNIF,
        passwordHash,
        userRoles: {
          create: {
            roleId: data.roleId
          }
        }
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        nif: true,
        isActive: true,
        createdAt: true
      }
    });

    // Gera tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = signRefreshToken({
      userId: user.id
    });

    // Salva a sessão
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Prepara o objeto user com informações do role
    const userWithRole: IUser = {
      ...user,
      roleId: data.roleId,
      role: role.name
    };

    return {
      message: "Usuário registrado com sucesso",
      user: userWithRole,
      accessToken,
      refreshToken
    };
  }

  // LOGIN
  static async login(loginData: ILoginRequest, userAgent: string, ipAddress: string): Promise<ILoginResponse> {
    const invalidCredentialsError = new ValidationError("Credenciais inválidas");
    
    let user = await prisma.user.findUnique({
      where: { email: loginData.identifier }
    });

    if (!user) {
      const formattedNIF = NIFService.formatNIF(loginData.identifier);
      user = await prisma.user.findUnique({
        where: { nif: formattedNIF }
      });
    }

    if (!user) {
      throw invalidCredentialsError;
    }

    const isPasswordValid = await comparePassword(loginData.password, user.passwordHash);
    if (!isPasswordValid) {
      throw invalidCredentialsError;
    }

    // Gera tokens
    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = signRefreshToken({
      userId: user.id
    });

    // Salva a sessão
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent,
        ipAddress: ipAddress,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  static async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const session = await prisma.session.findUnique({
      where: { refreshToken }
    });

    if (!session || session.isRevoked) {
      throw new ValidationError("Token de refresh inválido");
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user) {
      throw new ValidationError("Usuário não encontrado");
    }

    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email
    });

    return { accessToken: newAccessToken };
  }

  static async logout(refreshToken: string): Promise<void> {
    await prisma.session.update({
      where: { refreshToken },
      data: { isRevoked: true }
    });
  }

  // GET PUBLIC ROLES (apenas para registro)
  static async getRoles(): Promise<IRole[]> {
    const roles = await prisma.role.findMany({
      where: {
        name: {
          in: ['PROVIDER', 'CLIENT']
        }
      },
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    return roles;
  }

}