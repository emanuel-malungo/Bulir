import { Router } from "express";
import { AuthController } from "./auth.controller.js";

const router = Router();

router.get("/roles", AuthController.getRoles);
router.get("/role/:roleId/permissions", AuthController.getRolePermissions);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;