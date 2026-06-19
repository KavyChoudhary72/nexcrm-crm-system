import apiClient from "./api.client";
import { ApiResponse } from "../types/api.types";
import { FollowUp } from "../types/followUp.types";

export const followUpService = {
  getFollowUps: async (params?: Record<string, any>): Promise<FollowUp[]> => {
    const response = await apiClient.get<ApiResponse<FollowUp[]>>("/followups", { params });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to fetch follow-ups");
  },

  createFollowUp: async (followUpData: { leadId: string; title: string; date: string; notes?: string }): Promise<FollowUp> => {
    const response = await apiClient.post<ApiResponse<FollowUp>>("/followups", followUpData);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to schedule follow-up");
  },

  completeFollowUp: async (id: string, notes?: string): Promise<FollowUp> => {
    const response = await apiClient.patch<ApiResponse<FollowUp>>(`/followups/${id}/complete`, { notes });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to complete follow-up");
  },
};
