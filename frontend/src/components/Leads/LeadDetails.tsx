import React from "react";
import { Lead } from "../../types/lead.types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getStatusColorClass, getSourceColorClass } from "../../utils/statusColors";
import { WhatsAppButton } from "../Common/WhatsAppButton";
import { EmailButton } from "../Common/EmailButton";
import { UserAvatar } from "../Common/UserAvatar";
import { Calendar, Mail, Phone, Briefcase, DollarSign, Award, Info, Trash2 } from "lucide-react";
import { Button } from "../UI/Button";
import { useAuth } from "../../hooks/useAuth";

interface LeadDetailsProps {
  lead: Lead;
  onEdit: () => void;
  onDelete: () => void;
}

export const LeadDetails: React.FC<LeadDetailsProps> = ({
  lead,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const assignedUserName = typeof lead.assignedTo === "object" ? lead.assignedTo?.name : undefined;
  const assignedUserEmail = typeof lead.assignedTo === "object" ? lead.assignedTo?.email : undefined;
  const assignedUserAvatar = typeof lead.assignedTo === "object" ? lead.assignedTo?.avatar : undefined;

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-3xl shadow-sm p-6 text-left space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <UserAvatar name={lead.name} avatar={lead.avatar} size="lg" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {lead.name}
            </h3>
            <p className="text-xs text-gray-400 font-semibold mt-1">
              {lead.companyName || "No Associated Company"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          {user?.role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="!text-red-500 !border-red-200/50 hover:!bg-red-50/50 dark:hover:!bg-red-950/10"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2.5">
        <WhatsAppButton
          mobileNumber={lead.mobileNumber}
          name={lead.name}
          requirement={lead.requirement}
          userName={user?.name}
        />
        <EmailButton
          email={lead.email}
          name={lead.name}
          requirement={lead.requirement}
        />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Core Metadata */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Lead Information</span>
          </h4>

          <div className="flex items-center gap-3 text-xs">
            <Phone className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Mobile</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{lead.mobileNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Mail className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Email</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{lead.email || "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Briefcase className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Source</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSourceColorClass(
                  lead.source
                )}`}
              >
                {lead.source}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <DollarSign className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Estimated Budget</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{formatCurrency(lead.budget)}</span>
            </div>
          </div>
        </div>

        {/* Pipeline & Assignment */}
        <div className="space-y-4">
          <h4 className="font-bold text-gray-950 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-blue-500" />
            <span>Pipeline & Assignment</span>
          </h4>

          <div className="flex items-center gap-3 text-xs">
            <Award className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Pipeline Stage</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColorClass(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Calendar className="w-4.5 h-4.5 text-gray-400 shrink-0" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Next Follow-up</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {lead.followUpDate ? formatDate(lead.followUpDate) : "No follow-up scheduled"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs border-t border-gray-50 dark:border-slate-800/60 pt-3">
            <UserAvatar name={assignedUserName || "U"} avatar={assignedUserAvatar} size="sm" />
            <div>
              <span className="text-gray-400 font-semibold uppercase text-[9px] block">Assigned Executive</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {assignedUserName || "Unassigned"}
              </span>
              {assignedUserEmail && (
                <span className="text-[10px] text-gray-400 block font-medium">{assignedUserEmail}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Requirement Notes */}
      {lead.requirement && (
        <div className="p-4 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-800 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Requirement Notes</span>
          <p className="text-xs text-gray-655 dark:text-slate-350 leading-relaxed font-medium">
            {lead.requirement}
          </p>
        </div>
      )}
    </div>
  );
};
