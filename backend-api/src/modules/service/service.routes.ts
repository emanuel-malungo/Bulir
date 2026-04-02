import { Router } from "express";
import { ServiceController } from "./service.controller.js";

const router = Router();

// List all services
router.get("/", ServiceController.findAll);

// Get services by provider
router.get("/provider/:providerId", ServiceController.getByProviderId);

// Get service detail
router.get("/:id", ServiceController.getById);

// Create service (by provider)
router.post("/provider/:providerId", ServiceController.create);

// Update service (by provider)
router.put("/:id/provider/:providerId", ServiceController.update);

export default router;
