import { Router } from "express";
import { ExportController } from "../controllers/export.controller";
import { protect } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/roleMiddleware";

const router = Router();

router.use(protect);
router.use(checkRole(["Admin"]));

// Downloads (Admin Only)
router.get("/csv", ExportController.exportCSV);
router.get("/excel", ExportController.exportExcel);

export default router;
