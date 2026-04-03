import type { Request, Response } from "express";
import { walletService } from "./wallet.services.js";
import { depositSchema } from "./wallet.schema.js";
import type {
  IApiError,
} from "./wallet.types.js";

export class WalletController {
  /**
   * Depositar dinheiro na conta
   * POST /api/wallet/deposit
   */
  async deposit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { amount } = depositSchema.parse(req.body);

      const response = await walletService.deposit(userId, amount);

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao processar depósito";

      const response: IApiError = {
        error: "DEPOSIT_ERROR",
        message: errorMessage,
        statusCode: 400,
      };

      res.status(400).json(response);
    }
  }

  /**
   * Consultar saldo
   * GET /api/wallet/balance
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;

      const response = await walletService.getBalance(userId);

      res.status(200).json({
        data: response,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao buscar saldo";

      const response: IApiError = {
        error: "BALANCE_FETCH_ERROR",
        message: errorMessage,
        statusCode: 400,
      };

      res.status(400).json(response);
    }
  }
}

export const walletController = new WalletController();
