import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

router.get("/", UserController.findAll);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.update);

export default router;
