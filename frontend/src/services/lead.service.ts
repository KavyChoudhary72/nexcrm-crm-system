import apiClient from "./api.client";
import { Lead } from "../types/lead.types";
import { ApiResponse, PaginatedResponse } from "../types/api.types";

export const mapLeadFromBackendLocal = (blead: any): Lead => {
  return {
    _id: blead._id,
    name: blead.name,
    companyName: blead.company || "",
    email: blead.email || "",
    mobileNumber: blead.mobile || "",
    source: blead.source || "Other",
    requirement: blead.requirement || "",
    budget: blead.budget || 0,
    status: blead.status,
    assignedTo: blead.assignedTo || null,
    followUpDate: blead.followUpDate,
    notes: blead.notes || [],
    aiScore: blead.aiScore,
    avatar: blead.avatar || "",
    createdAt: blead.createdAt,
    updatedAt: blead.updatedAt,
  };
};

export const mapLeadToBackendLocal = (flead: Partial<Lead>) => {
  return {
    name: flead.name,
    company: flead.companyName,
    email: flead.email,
    mobile: flead.mobileNumber,
    source: flead.source,
    requirement: flead.requirement,
    budget: flead.budget,
    status: flead.status,
    assignedTo: flead.assignedTo === "" ? null : typeof flead.assignedTo === "object" ? flead.assignedTo?._id : flead.assignedTo,
    followUpDate: flead.followUpDate,
    notes: flead.notes,
    avatar: flead.avatar,
  };
};

export const leadService = {
  getLeads: async (params?: Record<string, any>): Promise<PaginatedResponse<Lead>> => {
    const response = await apiClient.get<PaginatedResponse<any>>("/leads", {
      params: { limit: 1000, ...params },
    });
    if (response.data && response.data.success) {
      return {
        ...response.data,
        data: (response.data.data || []).map(mapLeadFromBackendLocal),
      } as PaginatedResponse<Lead>;
    }
    throw new Error(response.data?.error || "Failed to fetch leads");
  },

  getLeadById: async (id: string): Promise<{ lead: Lead; activities: any[]; followUps: any[]; whatsappLink?: string }> => {
    const response = await apiClient.get<ApiResponse<any>>(`/leads/${id}`);
    if (response.data && response.data.success && response.data.data) {
      const { lead, activities, followUps, whatsappLink } = response.data.data;
      return {
        lead: mapLeadFromBackendLocal(lead),
        activities: activities || [],
        followUps: followUps || [],
        whatsappLink,
      };
    }
    throw new Error(response.data?.error || "Failed to fetch lead details");
  },

  createLead: async (leadData: Omit<Lead, "_id" | "aiScore">): Promise<Lead> => {
    const backendData = mapLeadToBackendLocal(leadData);
    const response = await apiClient.post<ApiResponse<any>>("/leads", backendData);
    if (response.data && response.data.success && response.data.data) {
      return mapLeadFromBackendLocal(response.data.data);
    }
    throw new Error(response.data?.error || "Failed to create lead");
  },

  updateLead: async (id: string, leadData: Partial<Lead>): Promise<Lead> => {
    const backendData = mapLeadToBackendLocal(leadData);
    const response = await apiClient.patch<ApiResponse<any>>(`/leads/${id}`, backendData);
    if (response.data && response.data.success && response.data.data) {
      return mapLeadFromBackendLocal(response.data.data);
    }
    throw new Error(response.data?.error || "Failed to update lead");
  },

  deleteLead: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/leads/${id}`);
    if (response.data && !response.data.success) {
      throw new Error(response.data.error || "Failed to delete lead");
    }
  },
};
