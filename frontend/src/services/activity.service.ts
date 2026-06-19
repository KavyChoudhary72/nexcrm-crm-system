import apiClient from "./api.client";
import { ApiResponse } from "../types/api.types";
import { Activity } from "../types/activity.types";

export const activityService = {
  getActivities: async (leadId: string): Promise<Activity[]> => {
    const response = await apiClient.get<ApiResponse<Activity[]>>(`/activities/leads/${leadId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to fetch activities");
  },

  createActivity: async (leadId: string, activityData: { type: string; content: string }): Promise<Activity> => {
    const response = await apiClient.post<ApiResponse<Activity>>(`/activities/leads/${leadId}`, activityData);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to create activity log");
  },
};
