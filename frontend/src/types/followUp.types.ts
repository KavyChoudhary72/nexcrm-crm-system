import { Lead } from "./lead.types";
import { User } from "./user.types";

export type FollowUpStatus = "Pending" | "Completed";

export interface FollowUp {
  _id: string;
  leadId: string | Lead;
  userId: string | User;
  title: string;
  date: string;
  status: FollowUpStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
