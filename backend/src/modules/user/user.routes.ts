import { Router } from "express";
import { UserController } from "./user.controller.js";

const router = Router();

router.get("/", UserController.findAll);

export default router;
