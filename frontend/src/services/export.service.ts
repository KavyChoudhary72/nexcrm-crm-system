import apiClient from "./api.client";

export const exportService = {
  exportCSV: async (): Promise<Blob> => {
    const response = await apiClient.get("/export/csv", {
      responseType: "blob",
    });
    return response.data;
  },

  exportExcel: async (): Promise<Blob> => {
    const response = await apiClient.get("/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },
};
