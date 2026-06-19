import { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: ("Admin" | "Sales Executive")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.dbRole)) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
