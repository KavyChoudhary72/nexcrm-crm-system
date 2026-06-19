import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

// Retrieve aggregated CRM pipeline metrics
router.get("/stats", DashboardController.getStats);

export default router;
