import React, { useState } from "react";
import { Activity } from "../../types/activity.types";
import { formatDateTime } from "../../utils/formatters";
import { Select } from "../UI/Select";
import { Button } from "../UI/Button";
import { MessageSquare, Phone, Mail, Award, Calendar, AlertCircle } from "lucide-react";

interface ActivityTimelineProps {
  activities: Activity[];
  onAddActivity: (type: string, content: string) => Promise<void>;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onAddActivity,
}) => {
  const [type, setType] = useState("Note");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      await onAddActivity(type, content);
      setContent("");
    } catch (err: any) {
      setError(err.message || "Failed to log activity");
    } finally {
      setSubmitting(false);
    }
  };

  const getActivityIcon = (actType: string) => {
    switch (actType) {
      case "Call":
        return <Phone className="w-4.5 h-4.5 text-blue-500" />;
      case "Meeting":
        return <Calendar className="w-4.5 h-4.5 text-amber-500" />;
      case "Email":
        return <Mail className="w-4.5 h-4.5 text-cyan-500" />;
      case "Status Change":
        return <Award className="w-4.5 h-4.5 text-purple-500" />;
      case "System":
        return <AlertCircle className="w-4.5 h-4.5 text-slate-400" />;
      default:
        return <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Logger Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-800 rounded-2xl space-y-3">
        <div className="flex gap-3 items-center">
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400">Log Action:</span>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: "Note", label: "General Note" },
              { value: "Call", label: "Phone Call Log" },
              { value: "Meeting", label: "Meeting Log" },
              { value: "Email", label: "Email Sent" },
            ]}
            className="!py-1 !px-3 text-xs w-36"
          />
        </div>
        <textarea
          rows={2}
          required
          placeholder="Describe outcome details..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl px-3.5 py-3 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />

        {/* Quick Outcome Badges (Two-Tap Logging) */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block px-1">
            Quick-Select Outcome (Two-Tap Logging)
          </span>
          <div className="flex flex-wrap gap-2 px-1">
            {[
              { label: "📞 Left Voicemail", text: "Called client. Left a voicemail request." },
              { label: "🤝 Connected", text: "Connected with client. Had a productive conversation." },
              { label: "⏳ Busy", text: "Called client. Number was busy/engaged." },
              { label: "🔕 No Answer", text: "Called client. Ringing but no answer." },
              { label: "🛑 Not Interested", text: "Client stated they are not interested at this moment." },
            ].map((note) => (
              <button
                key={note.label}
                type="button"
                onClick={() => {
                  setType("Call");
                  setContent(note.text);
                }}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 dark:active:bg-slate-750 text-gray-600 dark:text-slate-300 border border-gray-200/60 dark:border-slate-800 rounded-xl text-[10px] font-bold transition-all min-h-[40px] cursor-pointer"
              >
                {note.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[10px] text-red-500">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={submitting} className="text-xs !px-4 !py-3">
            Log Action
          </Button>
        </div>
      </form>

      {/* Timeline logs */}
      <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100 dark:before:bg-slate-800 pl-1">
        {activities.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4 pl-8">No activities logged yet.</p>
        ) : (
          activities.map((act) => {
            const userName = typeof act.userId === "object" ? act.userId?.name : "System Agent";
            return (
              <div key={act._id} className="flex gap-4 relative">
                {/* Node icon */}
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center shrink-0 z-10 shadow-sm">
                  {getActivityIcon(act.type)}
                </div>
                {/* Log bubble */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm text-left">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-gray-900 dark:text-white text-xs">{userName}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{formatDateTime(act.timestamp)}</span>
                  </div>
                  <p className="text-xs text-gray-655 dark:text-slate-350 leading-relaxed font-medium mt-1.5">{act.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
