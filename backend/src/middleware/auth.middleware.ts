import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import User from "../models/User.model";
import mongoose from "mongoose";

// Extend Express Request interface to include custom user property
export interface ILoggedUser {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  email: string;
  role: "admin" | "sales";
  dbRole: "Admin" | "Sales Executive";
  companyId: mongoose.Types.ObjectId;
  avatar?: string;
  createdAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: ILoggedUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Not authorized, token missing",
    });
  }

  try {
    // Verify token
    const decoded = AuthService.verifyToken(token);
    if (!decoded || (!decoded.id && !decoded.userId)) {
      return res.status(401).json({
        success: false,
        error: "Not authorized, token invalid",
      });
    }

    const userId = decoded.id || decoded.userId;

    // Check if user still exists
    const userDoc = await User.findById(userId).select("-password");
    if (!userDoc) {
      return res.status(401).json({
        success: false,
        error: "The user belonging to this token no longer exists",
      });
    }

    // Map role for controller / frontend backward compatibility
    const role: "admin" | "sales" = userDoc.role === "Admin" ? "admin" : "sales";

    // Grant access
    req.user = {
      _id: userDoc._id as mongoose.Types.ObjectId,
      userId: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role,
      dbRole: userDoc.role,
      companyId: userDoc.companyId,
      avatar: userDoc.avatar,
      createdAt: userDoc.createdAt,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Not authorized to access this route",
    });
  }
};

export const restrictTo = (...roles: ("admin" | "sales")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
