import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../hooks/useLeads";
import { LeadFilters } from "../components/Leads/LeadFilters";
import { LeadStats } from "../components/Leads/LeadStats";
import { LeadTable } from "../components/Leads/LeadTable";
import { KanbanBoard } from "../components/Leads/KanbanBoard";
import { ExportButton } from "../components/Leads/ExportButton";
import { Modal } from "../components/UI/Modal";
import { LeadForm } from "../components/Leads/LeadForm";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { Button } from "../components/UI/Button";
import { Plus, Table, Kanban, ShieldAlert, Users } from "lucide-react";
import { Lead, LeadStatus } from "../types/lead.types";

export const Leads: React.FC = () => {
  const navigate = useNavigate();
  const {
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
    createLead,
    updateLeadStatus,
  } = useLeads();

  const [viewMode, setViewMode] = useState<"Table" | "Kanban">("Kanban");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleLeadClick = (lead: Lead) => {
    navigate(`/leads/${lead._id}`);
  };

  const handleDragEnd = async (id: string, newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(id, newStatus);
    } catch (err) {
      alert("Failed to update status on server.");
    }
  };

  const handleCreateSubmit = async (formData: any) => {
    try {
      await createLead(formData);
      setIsAddModalOpen(false);
    } catch (err: any) {
      throw new Error(err.message || "Failed to create lead");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner label="Querying pipeline directories and agent logs..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left p-1">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              Sales Pipeline
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Oversee prospective deals, filter by origin, and update deal progress.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 items-center shrink-0 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex p-1 bg-gray-55 dark:bg-slate-800/60 border border-gray-150 dark:border-slate-850 rounded-xl">
            <button
              onClick={() => setViewMode("Kanban")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "Kanban"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-205"
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode("Table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "Table"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-205"
              }`}
              title="Table View"
            >
              <Table className="w-4.5 h-4.5" />
            </button>
          </div>

          <ExportButton />

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs text-red-650 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      {/* Stats Summary Panel */}
      <LeadStats leads={leads} />

      {/* Filters */}
      <LeadFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        sortField={sortField}
        onSortFieldChange={setSortField}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />

      {/* Content stage */}
      {viewMode === "Table" ? (
        <LeadTable leads={filteredLeads} onLeadClick={handleLeadClick} />
      ) : (
        <div className="overflow-x-auto min-h-[500px]">
          <KanbanBoard
            leads={filteredLeads}
            onDragEnd={handleDragEnd}
            onLeadClick={handleLeadClick}
          />
        </div>
      )}

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Pipeline Lead"
        description="Fill out the contact credentials, requirement notes, and starting budgets."
      >
        <LeadForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
