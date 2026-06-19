import React, { useState } from "react";
import { useFollowUps } from "../hooks/useFollowUps";
import { useLeads } from "../hooks/useLeads";
import { ReminderWidget } from "../components/FollowUps/ReminderWidget";
import { FollowUpList } from "../components/FollowUps/FollowUpList";
import { FollowUpCalendar } from "../components/FollowUps/FollowUpCalendar";
import { FollowUpForm } from "../components/FollowUps/FollowUpForm";
import { Modal } from "../components/UI/Modal";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { Button } from "../components/UI/Button";
import { Calendar as CalendarIcon, List, Plus, Clock } from "lucide-react";

export const FollowUps: React.FC = () => {
  const { followUps, loading, error, createFollowUp, completeFollowUp } = useFollowUps();
  const { leads, loading: loadingLeads } = useLeads();

  const [viewMode, setViewMode] = useState<"List" | "Calendar">("Calendar");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleComplete = async (id: string, notes?: string) => {
    try {
      await completeFollowUp(id, notes);
    } catch (err: any) {
      alert(err.message || "Failed to complete follow-up");
    }
  };

  const handleCreateSubmit = async (data: { leadId: string; title: string; date: string; notes?: string }) => {
    try {
      await createFollowUp(data);
      setIsAddModalOpen(false);
    } catch (err: any) {
      throw new Error(err.message || "Failed to schedule follow-up");
    }
  };

  if (loading || loadingLeads) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner label="Formatting calendars and timeline journals..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left p-1">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              Follow-ups Workspace
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Check scheduled client calls, log outcomes, and monitor calendars.
            </p>
          </div>
        </div>

        <div className="flex gap-2.5 items-center shrink-0 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex p-1 bg-gray-55 dark:bg-slate-800/60 border border-gray-150 dark:border-slate-850 rounded-xl">
            <button
              onClick={() => setViewMode("Calendar")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "Calendar"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-205"
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setViewMode("List")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "List"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-205"
              }`}
              title="List View"
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs text-red-650 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      {/* Overdue/Pending summary notifications */}
      <ReminderWidget
        followUps={followUps}
        onComplete={handleComplete}
      />

      {/* Main Workspace Stage */}
      {viewMode === "Calendar" ? (
        <FollowUpCalendar
          followUps={followUps}
          onComplete={handleComplete}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-base">
              All Follow-ups Agenda
            </h4>
            <p className="text-xs text-gray-400 font-medium">
              List of scheduled meetings and phone calls.
            </p>
          </div>
          <FollowUpList
            followUps={followUps}
            onComplete={handleComplete}
          />
        </div>
      )}

      {/* Add FollowUp Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Follow-up Session"
        description="Pick a pipeline client, configure times, and specify follow-up instructions."
      >
        <FollowUpForm
          leads={leads}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
