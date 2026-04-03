import { Router } from "express";
import { ReservationController } from "./reservation.controller.js";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";

const router = Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todas as reservas do usuário autenticado
router.get("/", ReservationController.findAll);

// Obter reserva por ID
router.get("/:id", ReservationController.getById);

// Criar nova reserva
router.post("/", ReservationController.create);

// Atualizar status da reserva
router.patch("/:id/status", ReservationController.updateStatus);

// Cancelar reserva
router.delete("/:id", ReservationController.cancel);

// Obter histórico da reserva
router.get("/:id/history", ReservationController.getHistory);

export default router;
