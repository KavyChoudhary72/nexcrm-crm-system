import apiClient from "./api.client";
import { ApiResponse } from "../types/api.types";
import { DashboardStats } from "../types/dashboard.types";

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to fetch dashboard metrics");
  },
};
