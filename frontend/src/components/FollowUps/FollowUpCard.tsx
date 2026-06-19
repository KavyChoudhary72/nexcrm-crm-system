import React, { useState } from "react";
import { FollowUp } from "../../types/followUp.types";
import { formatDateTime } from "../../utils/formatters";
import { Button } from "../UI/Button";
import { Check, Calendar, Phone, AlertCircle } from "lucide-react";

interface FollowUpCardProps {
  followUp: FollowUp;
  onComplete: (id: string, notes?: string) => Promise<void>;
}

export const FollowUpCard: React.FC<FollowUpCardProps> = ({
  followUp,
  onComplete,
}) => {
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [outcomeNotes, setOutcomeNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOverdue =
    followUp.status === "Pending" && new Date(followUp.date) < new Date();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onComplete(followUp._id, outcomeNotes);
      setShowNotesForm(false);
      setOutcomeNotes("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const leadName =
    typeof followUp.leadId === "object" ? followUp.leadId?.name : "Unknown Lead";
  const leadCompany =
    typeof followUp.leadId === "object" ? followUp.leadId?.companyName : undefined;
  const leadPhone =
    typeof followUp.leadId === "object" ? followUp.leadId?.mobileNumber : undefined;

  return (
    <div className={`p-5 bg-white dark:bg-slate-900 border rounded-3xl shadow-sm text-left transition-all hover:shadow-md ${
      isOverdue
        ? "border-red-250 dark:border-red-950/40 bg-red-50/5 dark:bg-red-950/5"
        : "border-gray-100 dark:border-slate-800/80"
    }`}>
      <div className="flex justify-between items-start gap-3">
        <div className="space-y-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
            followUp.status === "Completed"
              ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/50"
              : isOverdue
              ? "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200/50"
              : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50"
          }`}>
            {isOverdue && <AlertCircle className="w-3 h-3" />}
            {followUp.status === "Completed" ? "Completed" : isOverdue ? "Overdue" : "Pending"}
          </span>

          <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug pt-1">
            {followUp.title}
          </h4>

          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold pt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDateTime(followUp.date)}</span>
          </div>
        </div>

        {followUp.status === "Pending" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotesForm(!showNotesForm)}
            className="!p-2 hover:!bg-emerald-50 dark:hover:!bg-emerald-950/20 hover:!text-emerald-500 rounded-xl"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 dark:border-slate-800/40 flex justify-between items-center text-xs">
        <div>
          <span className="text-[9px] text-gray-400 font-bold uppercase block">Contact Lead</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{leadName}</span>
          {leadCompany && (
            <span className="text-[10px] text-gray-400 font-medium block">{leadCompany}</span>
          )}
        </div>
        {leadPhone && (
          <a
            href={`tel:${leadPhone}`}
            className="p-2 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-gray-500 hover:text-blue-500 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>

      {followUp.notes && followUp.status === "Completed" && (
        <div className="mt-3 p-3 bg-gray-50/50 dark:bg-gray-950/20 border border-gray-150 dark:border-slate-850 rounded-2xl text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
          <span className="font-bold text-gray-400 uppercase text-[8px] block mb-0.5">Outcome Notes</span>
          {followUp.notes}
        </div>
      )}

      {showNotesForm && (
        <form onSubmit={handleComplete} className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/60 space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase">Outcome / Notes</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Call completed, proposal sent..."
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowNotesForm(false)} className="text-xs">
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting} className="text-xs">
              Complete Task
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
