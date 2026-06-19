import apiClient from "./api.client";
import { ApiResponse } from "../types/api.types";
import { User } from "../types/user.types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>("/auth/users");
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Failed to fetch users");
  },

  removeUser: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<any>>(`/auth/users/${id}`);
    if (response.data && response.data.success) {
      return;
    }
    throw new Error(response.data?.error || "Failed to remove team member");
  },
};
export default userService;
