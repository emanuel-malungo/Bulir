import prisma from "../../config/prisma.js"
import { hashPassword } from "../../utils/hash.utils.js";
import { ConflictError, ValidationError } from "../../utils/errors.js";
import { NIFService } from "../../utils/nif.utils.js";
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

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        nif: formattedNIF,
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