import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User.model";

export class AuthService {
  private static JWT_SECRET =
    process.env.JWT_SECRET || "default_secret_change_this";
  private static JWT_EXPIRY = "1d";

  // Generate JWT token containing userId, role, and companyId
  static generateToken(userId: string, role: string, companyId: string): string {
    return jwt.sign(
      { id: userId, userId, role, companyId },
      this.JWT_SECRET,
      {
        expiresIn: this.JWT_EXPIRY as jwt.SignOptions["expiresIn"],
      }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Validate user credentials
  static async validateUser(
    email: string,
    password: string,
  ): Promise<IUser | null> {
    // Note: Find user by email and populate companyId
    const user = await User.findOne({ email });
    if (!user) return null;

    const isValid = await user.comparePassword(password);
    return isValid ? user : null;
  }
}
