import { Router } from "express";
import { FollowUpController } from "../controllers/followup.controller";
import { protect } from "../middleware/auth.middleware";
import { body } from "express-validator";
import { validateResult } from "../middleware/validator.middleware";

const router = Router();

router.use(protect);

// Schedule a follow-up
router.post(
  "/",
  [
    body("leadId").isMongoId().withMessage("Provide a valid Lead ID"),
    body("title").notEmpty().withMessage("Follow-up task/requirement is required").trim(),
    body("date").isISO8601().withMessage("Provide a valid ISO8601 target date-time"),
    validateResult,
  ],
  FollowUpController.createFollowUp
);

// Get follow-up list (supports timeframe filters)
router.get("/", FollowUpController.getFollowUps);

// Complete a follow-up
router.patch(
  "/:id/complete",
  [
    body("notes").optional().trim(),
    validateResult,
  ],
  FollowUpController.completeFollowUp
);

export default router;
