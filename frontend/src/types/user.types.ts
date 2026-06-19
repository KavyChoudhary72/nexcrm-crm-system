export type UserRole = "admin" | "sales";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyId: string;
  companyName?: string;
  inviteCode?: string;
  createdAt?: string;
}
