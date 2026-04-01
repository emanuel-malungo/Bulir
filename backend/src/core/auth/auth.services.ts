import prisma from "../../config/prisma.js"
import { hashPassword } from "../../utils/hash.utils.js";
import { ConflictError } from "../../utils/errors.js";
import type { IRegisterRequest, IUser } from "./auth.types.js";

export class AuthService {
  // REGISTER
  static async register(data: IRegisterRequest): Promise<IUser> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new ConflictError("Email já está registrado");
    }

    const existingNif = await prisma.user.findUnique({
      where: { nif: data.nif }
    });

    if (existingNif) {
      throw new ConflictError("NIF já está registrado");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        nif: data.nif,
        passwordHash
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

    return user;
  }
}