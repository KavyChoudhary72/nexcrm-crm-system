import { useState, useEffect, useCallback } from "react";
import { DashboardStats } from "../types/dashboard.types";
import { Lead } from "../types/lead.types";
import { dashboardService } from "../services/dashboard.service";
import { leadService } from "../services/lead.service";

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, leadsResponse] = await Promise.all([
        dashboardService.getStats(),
        leadService.getLeads({ limit: 5, sort: "createdAt", order: "desc" })
      ]);
      setStats(statsData);
      setRecentLeads(leadsResponse.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    recentLeads,
    loading,
    error,
    refreshDashboard: fetchStats,
  };
};
