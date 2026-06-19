import { User } from "./user.types";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Negotiation"
  | "Won"
  | "Lost";

export type LeadSource =
  | "Website Forms"
  | "WhatsApp"
  | "Facebook Ads"
  | "Instagram Ads"
  | "Referral Sources"
  | "Other";

export interface Lead {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  mobileNumber: string;
  source: LeadSource;
  requirement: string;
  budget: number;
  status: LeadStatus;
  assignedTo?: string | User | null;
  followUpDate?: string;
  notes: string[];
  aiScore?: number;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
