import apiClient from "./api.client";
import { ApiResponse } from "../types/api.types";
import { User } from "../types/user.types";

export interface AuthResponseData extends User {
  token: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponseData> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>("/auth/login", { email, password });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Login failed");
  },

  register: async (
    name: string,
    email: string,
    password: string,
    role: string,
    companyName?: string,
    inviteCode?: string
  ): Promise<AuthResponseData> => {
    const url = role === "admin" ? "/auth/signup-admin" : "/auth/signup-executive";
    const payload = role === "admin" 
      ? { name, email, password, companyName } 
      : { name, email, password, inviteCode };

    const response = await apiClient.post<ApiResponse<AuthResponseData>>(url, payload);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Registration failed");
  },

  updateProfile: async (name: string, email: string, avatar: string): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>("/auth/profile", { name, email, avatar });
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error || "Profile update failed");
  },
};
export default authService;
