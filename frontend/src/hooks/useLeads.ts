import { useState, useEffect, useCallback, useMemo } from "react";
import { Lead, LeadStatus, LeadSource } from "../types/lead.types";
import { leadService } from "../services/lead.service";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "All">("All");
  const [sortField, setSortField] = useState<keyof Lead>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // download 15 leads at a time as requested (15-20)
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await leadService.getLeads({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        source: sourceFilter === "All" ? undefined : sourceFilter,
        sortBy: sortField,
        sortOrder,
      });
      setLeads(response.data || []);
      setTotalPages(response.pages || 1);
      setTotalLeads(response.total || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter, sourceFilter, sortField, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset page to 1 on filter or search changes
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sourceFilter, sortField, sortOrder]);

  const createLead = async (leadData: Omit<Lead, "_id" | "aiScore">) => {
    try {
      const newLead = await leadService.createLead(leadData);
      setLeads((prev) => [newLead, ...prev]);
      return newLead;
    } catch (err: any) {
      throw new Error(err.message || "Failed to create lead");
    }
  };

  const updateLead = async (id: string, leadData: Partial<Lead>) => {
    try {
      const updated = await leadService.updateLead(id, leadData);
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
      return updated;
    } catch (err: any) {
      throw new Error(err.message || "Failed to update lead");
    }
  };

  const updateLeadStatus = async (id: string, status: LeadStatus) => {
    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, status } : l))
    );

    try {
      await leadService.updateLead(id, { status });
    } catch (err) {
      console.error("Failed to update status on server, reverting...", err);
      setLeads(previousLeads);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete lead");
    }
  };

  const filteredLeads = useMemo(() => {
    return leads;
  }, [leads]);

  return {
    leads,
    filteredLeads,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    fetchLeads,
    createLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    page,
    setPage,
    totalPages,
    totalLeads,
  };
};
