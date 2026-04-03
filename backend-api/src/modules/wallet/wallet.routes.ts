import { Router } from "express";
import { walletController } from "./wallet.controller.js";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";

const router = Router();

/**
 * Rotas de Wallet (Saldo/Balance)
 */

// Depositar dinheiro
router.post(
  "/deposit",
  authMiddleware,
  (req, res) => walletController.deposit(req, res)
);

// Consultar saldo
router.get(
  "/balance",
  authMiddleware,
  (req, res) => walletController.getBalance(req, res)
);

export default router;
