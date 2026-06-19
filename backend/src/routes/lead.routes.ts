import { Router } from "express";
import { LeadController } from "../controllers/lead.controller";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/roleMiddleware";
import { body } from "express-validator";
import { validateResult } from "../middleware/validator.middleware";

const router = Router();

// Protect all routes with auth middleware
router.use(protect);

// Create Lead (Admin and Sales)
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Lead name is required").trim(),
    body("mobile").notEmpty().withMessage("Mobile number is required").trim(),
    body("source")
      .notEmpty()
      .withMessage("Lead source is required")
      .isIn([
        "Website Forms",
        "WhatsApp",
        "Facebook Ads",
        "Instagram Ads",
        "Referral Sources",
        "Other",
      ])
      .withMessage("Invalid lead source"),
    body("budget").optional({ values: "falsy" }).isNumeric().withMessage("Budget must be a number"),
    body("email").optional({ values: "falsy" }).isEmail().withMessage("Invalid email format").normalizeEmail(),
    validateResult,
  ],
  LeadController.createLead
);

// Get all leads (with search & filters)
router.get("/", LeadController.getLeads);

// Get single lead details
router.get("/:id", LeadController.getLeadById);

// Update lead (status, budget, assignment, requirements, etc.)
router.patch(
  "/:id",
  [
    body("email").optional({ values: "falsy" }).isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("budget").optional({ values: "falsy" }).isNumeric().withMessage("Budget must be a number"),
    body("status")
      .optional()
      .isIn([
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Won",
        "Lost",
      ])
      .withMessage("Invalid pipeline stage"),
    validateResult,
  ],
  LeadController.updateLead
);

// Delete lead - ONLY Admins are authorized
router.delete("/:id", checkRole(["Admin"]), LeadController.deleteLead);

export default router;
