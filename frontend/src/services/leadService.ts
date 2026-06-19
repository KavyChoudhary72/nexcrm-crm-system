import api from "./api";
import type { Lead, LeadSource, LeadStatus } from "../types/crm";

export interface BackendLead {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  mobile: string;
  source: string;
  requirement?: string;
  budget?: number;
  status: LeadStatus;
  assignedTo?: any;
  followUpDate?: string;
  notes?: string[];
  aiScore?: number;
}

export const mapLeadFromBackend = (blead: BackendLead): Lead => {
  return {
    _id: blead._id,
    name: blead.name,
    companyName: blead.company || "",
    email: blead.email || "",
    mobileNumber: blead.mobile || "",
    source: (blead.source || "Other") as LeadSource,
    requirement: blead.requirement || "",
    budget: blead.budget || 0,
    status: blead.status,
    assignedTo: blead.assignedTo || null,
    followUpDate: blead.followUpDate,
    notes: blead.notes || [],
    aiScore: blead.aiScore,
  };
};

export const mapLeadToBackend = (flead: Partial<Lead>) => {
  return {
    name: flead.name,
    company: flead.companyName,
    email: flead.email,
    mobile: flead.mobileNumber,
    source: flead.source,
    requirement: flead.requirement,
    budget: flead.budget,
    status: flead.status,
    assignedTo: flead.assignedTo,
    followUpDate: flead.followUpDate,
    notes: flead.notes,
  };
};

export const leadService = {
  getLeads: async (): Promise<Lead[]> => {
    const response = await api.get("/leads?limit=1000");
    if (response.data && response.data.success) {
      return (response.data.data || []).map(mapLeadFromBackend);
    }
    throw new Error(response.data.error || "Failed to fetch leads");
  },

  createLead: async (leadData: Omit<Lead, "_id" | "aiScore">): Promise<Lead> => {
    const backendData = mapLeadToBackend(leadData);
    const response = await api.post("/leads", backendData);
    if (response.data && response.data.success) {
      return mapLeadFromBackend(response.data.data);
    }
    throw new Error(response.data.error || "Failed to create lead");
  },

  updateLeadStatus: async (leadId: string, status: LeadStatus): Promise<Lead> => {
    const response = await api.patch(`/leads/${leadId}`, { status });
    if (response.data && response.data.success) {
      return mapLeadFromBackend(response.data.data);
    }
    throw new Error(response.data.error || "Failed to update lead status");
  },

  deleteLead: async (leadId: string): Promise<void> => {
    const response = await api.delete(`/leads/${leadId}`);
    if (response.data && !response.data.success) {
      throw new Error(response.data.error || "Failed to delete lead");
    }
  }
};
