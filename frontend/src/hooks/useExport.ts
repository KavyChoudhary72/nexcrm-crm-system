import { useState } from "react";
import { exportService } from "../services/export.service";

export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const triggerDownload = (blob: Blob, defaultFilename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportCSV = async () => {
    setExporting(true);
    setError("");
    try {
      const blob = await exportService.exportCSV();
      triggerDownload(blob, `leads-export-${new Date().toISOString().split("T")[0]}.csv`);
    } catch (err: any) {
      setError(err.message || "Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = async () => {
    setExporting(true);
    setError("");
    try {
      const blob = await exportService.exportExcel();
      triggerDownload(blob, `leads-export-${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err: any) {
      setError(err.message || "Failed to export Excel");
    } finally {
      setExporting(false);
    }
  };

  return {
    exportCSV,
    exportExcel,
    exporting,
    error,
  };
};
