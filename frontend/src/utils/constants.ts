import { LeadSource, LeadStatus } from "../types/lead.types";

export const PIPELINE_STAGES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

export const LEAD_SOURCES: LeadSource[] = [
  "Website Forms",
  "WhatsApp",
  "Facebook Ads",
  "Instagram Ads",
  "Referral Sources",
  "Other",
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
