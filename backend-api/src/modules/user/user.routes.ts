import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

// User CRUD
router.get("/", UserController.findAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);

// Password Management
router.patch("/:id/password", UserController.changePassword);

// Session Management
router.get("/:id/sessions", UserController.getSessions);
router.delete("/:id/sessions/:sessionId", UserController.revokeSession);
router.post("/:id/sessions/logout-all", UserController.revokeAllSessions);

export default router;
