import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authMiddleware } from "../../core/middleware/auth.middleware.js";

const router = Router();

// Get current user (MUST be before /:id)
router.get("/me", authMiddleware, UserController.getMe);
router.put("/me", authMiddleware, UserController.updateMe);
router.patch("/me/password", authMiddleware, UserController.changePasswordMe);
router.get("/me/sessions", authMiddleware, UserController.getSessionsMe);

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
