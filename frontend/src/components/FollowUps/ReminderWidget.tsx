import React from "react";
import { FollowUp } from "../../types/followUp.types";
import { AlertCircle, Calendar, CheckCircle, Bell } from "lucide-react";
import { formatDateTime } from "../../utils/formatters";
import { Button } from "../UI/Button";

interface ReminderWidgetProps {
  followUps: FollowUp[];
  onComplete: (id: string, notes?: string) => Promise<void>;
  className?: string;
}

export const ReminderWidget: React.FC<ReminderWidgetProps> = ({
  followUps,
  onComplete,
  className = "",
}) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const pending = followUps.filter((f) => f.status === "Pending");

  const overdue = pending.filter((f) => new Date(f.date) < now && new Date(f.date) < todayStart);
  
  const today = pending.filter((f) => {
    const fDate = new Date(f.date);
    return fDate >= todayStart && fDate <= todayEnd;
  });

  if (overdue.length === 0 && today.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {overdue.length > 0 && (
        <div className="p-4 bg-red-50/60 dark:bg-red-950/10 border border-red-100 dark:border-red-950/35 rounded-3xl flex gap-3 text-left">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h5 className="text-xs font-bold text-red-750 dark:text-red-400 uppercase tracking-wide">
              {overdue.length} Overdue Follow-up{overdue.length > 1 ? "s" : ""}
            </h5>
            <p className="text-xs text-red-650 dark:text-red-450/90 font-medium">
              You have outstanding follow-ups that require immediate attention.
            </p>
            <div className="mt-2 divide-y divide-red-200/30 dark:divide-red-900/10 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {overdue.map((f) => {
                const leadName = typeof f.leadId === "object" ? f.leadId?.name : "Unknown Lead";
                return (
                  <div key={f._id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-red-900 dark:text-red-300 block truncate">
                        {f.title}
                      </span>
                      <span className="text-[10px] text-red-600/80 dark:text-red-400/80 font-semibold">
                        Lead: {leadName} • {formatDateTime(f.date)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComplete(f._id, "Completed via quick actions")}
                      className="!px-2.5 !py-1 text-[10px] hover:bg-red-100 dark:hover:bg-red-950/20 text-red-700 dark:text-red-450 border border-red-200/50 dark:border-red-900/30 rounded-lg shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Done
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {today.length > 0 && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950/30 rounded-3xl flex gap-3 text-left">
          <Bell className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h5 className="text-xs font-bold text-amber-750 dark:text-amber-400 uppercase tracking-wide">
              {today.length} Scheduled for Today
            </h5>
            <p className="text-xs text-amber-650 dark:text-amber-450/90 font-medium">
              Don't forget to follow up with these contacts today.
            </p>
            <div className="mt-2 divide-y divide-amber-200/30 dark:divide-amber-900/10 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              {today.map((f) => {
                const leadName = typeof f.leadId === "object" ? f.leadId?.name : "Unknown Lead";
                return (
                  <div key={f._id} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-amber-900 dark:text-amber-300 block truncate">
                        {f.title}
                      </span>
                      <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-semibold">
                        Lead: {leadName} • {formatDateTime(f.date)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComplete(f._id, "Completed via quick actions")}
                      className="!px-2.5 !py-1 text-[10px] hover:bg-amber-100 dark:hover:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/20 rounded-lg shrink-0"
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" />
                      Done
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
