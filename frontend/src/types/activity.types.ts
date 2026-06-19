import { User } from "./user.types";

export type ActivityType = "Call" | "Meeting" | "Email" | "Note" | "System" | "Status Change";

export interface Activity {
  _id: string;
  leadId: string;
  userId: string | User;
  type: ActivityType;
  content: string;
  timestamp: string;
}
