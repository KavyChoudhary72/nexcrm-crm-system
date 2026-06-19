import React, { useState } from "react";
import { Lead } from "../../types/lead.types";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Select } from "../UI/Select";
import { DatePicker } from "../UI/DatePicker";

interface FollowUpFormProps {
  leads: Lead[];
  defaultLeadId?: string;
  onSubmit: (data: { leadId: string; title: string; date: string; notes?: string }) => Promise<void>;
  onCancel: () => void;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({
  leads,
  defaultLeadId = "",
  onSubmit,
  onCancel,
}) => {
  const [leadId, setLeadId] = useState(defaultLeadId);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      setError("Please select a lead");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (!date) {
      setError("Please pick a date and time");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ leadId, title, date, notes });
      setTitle("");
      setDate("");
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Failed to schedule follow-up");
    } finally {
      setSubmitting(false);
    }
  };

  const leadOptions = [
    { value: "", label: "Select a lead..." },
    ...leads.map((l) => ({ value: l._id, label: `${l.name} (${l.companyName || "No Company"})` })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs text-red-650 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      {!defaultLeadId && (
        <Select
          label="Lead"
          value={leadId}
          onChange={(e) => setLeadId(e.target.value)}
          options={leadOptions}
          required
        />
      )}

      <Input
        label="Title / Objective"
        placeholder="e.g. Discuss proposal draft, Intro Call"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <DatePicker
        label="Date & Time"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block px-1">
          Notes / Instructions
        </label>
        <textarea
          placeholder="Write details or agenda of follow-up call..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Schedule
        </Button>
      </div>
    </form>
  );
};
