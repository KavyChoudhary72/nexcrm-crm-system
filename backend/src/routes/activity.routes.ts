import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { protect } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validateResult } from "../middleware/validator.middleware";

const router = Router();

router.use(protect);

// Log manual activity (Call, Meeting, Email, Note) against a lead
router.post(
  "/leads/:id",
  [
    body("type")
      .notEmpty()
      .withMessage("Activity type is required")
      .isIn(["Call", "Meeting", "Email", "Note"])
      .withMessage("Type must be 'Call', 'Meeting', 'Email', or 'Note'"),
    body("content").notEmpty().withMessage("Activity content is required").trim(),
    validateResult,
  ],
  ActivityController.addActivityNote
);

// Get activity logs for a lead
router.get("/leads/:id", ActivityController.getLeadActivities);

export default router;
