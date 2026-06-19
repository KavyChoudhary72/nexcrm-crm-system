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

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await leadService.getLeads();
      setLeads(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

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
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(search.toLowerCase()) ||
          lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
          lead.email.toLowerCase().includes(search.toLowerCase()) ||
          lead.mobileNumber.toLowerCase().includes(search.toLowerCase()) ||
          lead.requirement.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
        const matchesSource = sourceFilter === "All" || lead.source === sourceFilter;

        return matchesSearch && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? "";
        let valB = b[sortField] ?? "";

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [leads, search, statusFilter, sourceFilter, sortField, sortOrder]);

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
  };
};
