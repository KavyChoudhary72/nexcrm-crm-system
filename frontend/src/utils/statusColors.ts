import { LeadStatus, LeadSource } from "../types/lead.types";

export const getStatusColorClass = (status: LeadStatus): string => {
  switch (status) {
    case "New":
      return "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/40";
    case "Contacted":
      return "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/40";
    case "Qualified":
      return "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/40";
    case "Proposal Sent":
      return "bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-900/40";
    case "Negotiation":
      return "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-200/50 dark:border-orange-900/40";
    case "Won":
      return "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/50 dark:border-green-900/40";
    case "Lost":
      return "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200/50 dark:border-red-900/40";
    default:
      return "bg-gray-50 dark:bg-gray-950/20 text-gray-600 dark:text-gray-400 border-gray-200/50 dark:border-gray-900/40";
  }
};

export const getSourceColorClass = (source: LeadSource): string => {
  switch (source) {
    case "Website Forms":
      return "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-200/30";
    case "WhatsApp":
      return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/30";
    case "Facebook Ads":
      return "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-200/30";
    case "Instagram Ads":
      return "bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 border-pink-200/30";
    case "Referral Sources":
      return "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-200/30";
    default:
      return "bg-slate-50 dark:bg-slate-950/30 text-slate-600 dark:text-slate-400 border-slate-200/30";
  }
};
