import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lead } from "../types/lead.types";
import { Activity } from "../types/activity.types";
import { leadService } from "../services/lead.service";
import { activityService } from "../services/activity.service";
import { LeadDetails as LeadDetailsCard } from "../components/Leads/LeadDetails";
import { ActivityTimeline } from "../components/Leads/ActivityTimeline";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { Modal } from "../components/UI/Modal";
import { LeadForm } from "../components/Leads/LeadForm";
import { ArrowLeft, UserCheck } from "lucide-react";
import { Button } from "../components/UI/Button";

export const LeadDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await leadService.getLeadById(id);
      setLead(data.lead);
      setActivities(data.activities || []);
    } catch (err: any) {
      setError(err.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleAddActivity = async (type: string, content: string) => {
    if (!id) return;
    try {
      const newAct = await activityService.createActivity(id, { type, content });
      setActivities((prev) => [newAct, ...prev]);
    } catch (err: any) {
      throw new Error(err.message || "Failed to log activity");
    }
  };

  const handleEditSubmit = async (formData: any) => {
    if (!id) return;
    try {
      const updated = await leadService.updateLead(id, formData);
      setLead(updated);
      setIsEditModalOpen(false);
      // Log status update activity if status changed
      if (lead && lead.status !== updated.status) {
        await handleAddActivity("Status Change", `Pipeline stage updated to: ${updated.status}`);
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to update lead");
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      await leadService.deleteLead(id);
      navigate("/leads");
    } catch (err: any) {
      alert(err.message || "Failed to delete lead");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner label="Retrieving profile logs and pipeline details..." />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="p-6 text-left space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/leads")} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Leads
        </Button>
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl">
          <h4 className="font-extrabold text-red-650 dark:text-red-400 text-sm">Error Loading Lead Details</h4>
          <p className="text-xs text-red-600 dark:text-red-450 mt-1">{error || "Lead profile not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left p-1">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/leads")}
            className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800/60 rounded-xl border border-gray-105 dark:border-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              Lead Workspace
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Profile timeline, call journals, and quick communication actions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Details Card */}
        <div className="lg:col-span-1">
          <LeadDetailsCard
            lead={lead}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
          />
        </div>

        {/* Right Side - Activity timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Communication Timeline
            </h3>
            <ActivityTimeline
              activities={activities}
              onAddActivity={handleAddActivity}
            />
          </div>
        </div>
      </div>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Lead Information"
        description="Update profile coordinates, budgets, or stage assignments."
      >
        <LeadForm
          initialValues={lead}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
