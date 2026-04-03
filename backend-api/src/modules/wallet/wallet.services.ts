import prisma from "../../config/prisma.js";
import type {
  IDepositResponse,
  IGetBalanceResponse,
  IWithdrawResponse,
} from "./wallet.types.js";

export class WalletService {
  /**
   * Deposita dinheiro na conta do usuário
   */
  async deposit(
    userId: number,
    amount: number
  ): Promise<IDepositResponse> {
    try {
      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Atualizar balance
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return {
        success: true,
        message: `Depósito de Kz ${amount} realizado com sucesso`,
        newBalance: Number(updatedUser.balance),
        depositAmount: amount,
      };
    } catch (error) {
      throw new Error(
        `Erro ao adicionar saldo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Obtém o balance do usuário
   */
  async getBalance(userId: number): Promise<IGetBalanceResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true, id: true },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const balance = Number(user.balance);

      return {
        balance,
        userId: user.id,
        formatted: `Kz ${balance.toFixed(2)}`,
      };
    } catch (error) {
      throw new Error(
        `Erro ao buscar saldo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Debita (retira) dinheiro da conta do usuário
   * Usado quando uma reserva é confirmada
   */
  async withdraw(
    userId: number,
    amount: number
  ): Promise<IWithdrawResponse> {
    try {
      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar se tem saldo suficiente
      const currentBalance = Number(user.balance);
      if (currentBalance < amount) {
        throw new Error(
          `Saldo insuficiente. Saldo atual: Kz ${currentBalance.toFixed(2)}, Valor necessário: Kz ${amount.toFixed(2)}`
        );
      }

      // Debitar do saldo
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      return {
        success: true,
        message: `Débito de Kz ${amount} realizado com sucesso`,
        newBalance: Number(updatedUser.balance),
        withdrawAmount: amount,
      };
    } catch (error) {
      throw new Error(
        `Erro ao debitar saldo: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    }
  }

  /**
   * Verifica se o usuário tem saldo suficiente
   */
  async hasSufficientBalance(userId: number, amount: number): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user) {
        return false;
      }

      return Number(user.balance) >= amount;
    } catch {
      return false;
    }
  }
}

export const walletService = new WalletService();
