import { Request, Response } from "express";
import User from "../models/User.model";
import Company from "../models/Company.model";
import Lead from "../models/Lead.model";
import FollowUp from "../models/FollowUp.model";
import { AuthService } from "../services/auth.service";

// Helper to generate a unique 6-character alphanumeric invite code
async function generateUniqueInviteCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  let isUnique = false;

  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existing = await Company.findOne({ inviteCode: code });
    if (!existing) {
      isUnique = true;
    }
  }
  return code;
}

export class AuthController {
  // POST /api/auth/signup-admin
  static async signupAdmin(req: Request, res: Response) {
    try {
      const { name, email, password, companyName } = req.body;

      if (!companyName || !companyName.trim()) {
        return res.status(400).json({
          success: false,
          error: "Company name is required",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User already exists with this email",
        });
      }

      // Generate a unique 6-character invite code
      const inviteCode = await generateUniqueInviteCode();

      // Create new Company
      const company = await Company.create({
        companyName: companyName.trim(),
        inviteCode,
      });

      // Create User with role 'Admin' and companyId
      const user = await User.create({
        name,
        email,
        password, // Password hashed automatically by User schema pre-save hook
        role: "Admin",
        companyId: company._id,
      });

      // Generate JWT Token
      const token = AuthService.generateToken(
        user._id.toString(),
        user.role,
        company._id.toString()
      );

      // Return user data (mapping 'Admin' to 'admin' for frontend compatibility)
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: "admin",
          companyId: company._id,
          companyName: company.companyName,
          inviteCode: company.inviteCode,
          avatar: user.avatar || "",
          token,
        },
      });
    } catch (error: any) {
      console.error("Signup Admin error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  // POST /api/auth/signup-executive
  static async signupExecutive(req: Request, res: Response) {
    try {
      const { name, email, password, inviteCode } = req.body;

      if (!inviteCode || !inviteCode.trim()) {
        return res.status(400).json({
          success: false,
          error: "Invite code is required",
        });
      }

      // Validate the invite code against the Company collection (case-insensitive check)
      const company = await Company.findOne({
        inviteCode: inviteCode.trim().toUpperCase(),
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          error: "Invalid invite code. Workspace not found.",
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User already exists with this email",
        });
      }

      // Create User with role 'Sales Executive' and companyId
      const user = await User.create({
        name,
        email,
        password,
        role: "Sales Executive",
        companyId: company._id,
      });

      // Generate JWT Token
      const token = AuthService.generateToken(
        user._id.toString(),
        user.role,
        company._id.toString()
      );

      // Return user data (mapping 'Sales Executive' to 'sales' for frontend compatibility)
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: "sales",
          companyId: company._id,
          companyName: company.companyName,
          inviteCode: company.inviteCode,
          avatar: user.avatar || "",
          token,
        },
      });
    } catch (error: any) {
      console.error("Signup Executive error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate user credentials
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found",
        });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: "Wrong password",
        });
      }

      // Fetch company details to supply to frontend
      const company = await Company.findById(user.companyId);
      if (!company) {
        return res.status(404).json({
          success: false,
          error: "Company workspace not found for this user",
        });
      }

      // Generate JWT Token
      const token = AuthService.generateToken(
        user._id.toString(),
        user.role,
        user.companyId.toString()
      );

      // Map roles
      const roleMapped = user.role === "Admin" ? "admin" : "sales";

      // Return user data
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: roleMapped,
          companyId: user.companyId,
          companyName: company.companyName,
          inviteCode: company.inviteCode,
          avatar: user.avatar || "",
          token,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  // GET /api/auth/users (for team management / assignment dropdowns)
  static async getUsers(req: Request, res: Response) {
    try {
      // Find all users belonging to the company of the logged-in user
      const users = await User.find({ companyId: req.user.companyId })
        .select("-password")
        .sort({ name: 1 });

      // Map roles to lowercase format for frontend
      const mappedUsers = users.map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role === "Admin" ? "admin" : "sales",
        avatar: user.avatar || "",
        companyId: user.companyId,
        createdAt: user.createdAt,
      }));

      res.json({
        success: true,
        data: mappedUsers,
      });
    } catch (error: any) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Internal server error",
      });
    }
  }

  // DELETE /api/auth/users/:id (Remove member from workspace)
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const targetUser = await User.findById(id);

      if (!targetUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Check if target user belongs to the same company
      if (targetUser.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(403).json({
          success: false,
          error: "You can only remove members from your own workspace",
        });
      }

      // Prevent admin from removing themselves
      if (targetUser._id.toString() === req.user.userId) {
        return res.status(400).json({
          success: false,
          error: "You cannot remove yourself from the workspace",
        });
      }

      // Delete user
      await User.findByIdAndDelete(id);

      // Reassign leads assigned to this user to unassigned (assignedTo: null)
      await Lead.updateMany({ assignedTo: id }, { $unset: { assignedTo: 1 } });

      // Clean up followups assigned to this user
      await FollowUp.deleteMany({ userId: id });

      res.json({
        success: true,
        message: "Team member removed from workspace successfully",
      });
    } catch (error: any) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to remove team member",
      });
    }
  }

  // PATCH /api/auth/profile
  static async updateProfile(req: Request, res: Response) {
    try {
      const { name, email, avatar } = req.body;
      const userId = req.user.userId;

      if (email && email !== req.user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            error: "Email is already taken by another user",
          });
        }
      }

      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (avatar !== undefined) updates.avatar = avatar;

      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const company = await Company.findById(updatedUser.companyId);

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role === "Admin" ? "admin" : "sales",
          companyId: updatedUser.companyId,
          companyName: company ? company.companyName : "",
          inviteCode: company ? company.inviteCode : "",
          avatar: updatedUser.avatar || "",
        },
      });
    } catch (error: any) {
      console.error("Update profile error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update profile",
      });
    }
  }
}
