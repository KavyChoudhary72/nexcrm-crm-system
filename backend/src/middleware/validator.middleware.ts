import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map((err) => `${err.msg}`)
      .join(", ");
    return res.status(400).json({
      success: false,
      error: errorMsg,
    });
  }
  next();
};
