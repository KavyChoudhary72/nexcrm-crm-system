import { Router } from "express";
import { AuthController } from "../controllers/auth.controll";
import { body } from "express-validator";
import { validateResult } from "../middleware/validator.middleware";
import { protect } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/roleMiddleware";

const router = Router();

// POST /signup-admin (Public Workspace Creation)
router.post(
  "/signup-admin",
  [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("companyName").notEmpty().withMessage("Company name is required").trim(),
    validateResult,
  ],
  AuthController.signupAdmin
);

// POST /signup-executive (Public Workspace Join with Invite Code)
router.post(
  "/signup-executive",
  [
    body("name").notEmpty().withMessage("Name is required").trim(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("inviteCode")
      .notEmpty()
      .withMessage("Invite code is required")
      .isLength({ min: 6, max: 6 })
      .withMessage("Invite code must be exactly 6 characters")
      .trim(),
    validateResult,
  ],
  AuthController.signupExecutive
);

// POST /login (Public Credentials Login)
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validateResult,
  ],
  AuthController.login
);

// GET /users (Team Roster - strictly Admin only)
router.get("/users", protect, checkRole(["Admin"]), AuthController.getUsers);

// DELETE /users/:id (Remove team member - strictly Admin only)
router.delete("/users/:id", protect, checkRole(["Admin"]), AuthController.deleteUser);

// PATCH /profile (Update user settings)
router.patch(
  "/profile",
  protect,
  [
    body("name").optional().trim(),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    body("avatar").optional().trim(),
    validateResult,
  ],
  AuthController.updateProfile
);

export default router;
