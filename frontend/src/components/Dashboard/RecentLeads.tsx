import React from "react";
import { useNavigate } from "react-router-dom";
import { Lead } from "../../types/lead.types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getStatusColorClass } from "../../utils/statusColors";
import { UserAvatar } from "../Common/UserAvatar";

interface RecentLeadsProps {
  leads: Lead[];
}

export const RecentLeads: React.FC<RecentLeadsProps> = ({ leads }) => {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-sm text-left flex flex-col">
      <div className="mb-4">
        <h4 className="font-bold text-gray-800 dark:text-white text-sm">
          Recently Added Leads
        </h4>
        <p className="text-xs text-gray-400">Newly registered active pipeline leads.</p>
      </div>

      {/* Mobile-friendly stacked card list (visible on small devices, hidden on desktop) */}
      <div className="md:hidden space-y-3 mt-1">
        {leads.length === 0 ? (
          <p className="py-6 text-center text-xs text-gray-400">No recent leads found.</p>
        ) : (
          leads.map((lead) => (
            <div
              key={lead._id}
              onClick={() => navigate(`/leads`)}
              className="p-4 bg-slate-50/50 dark:bg-slate-850/10 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 active:bg-slate-100 dark:active:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl flex flex-col gap-2 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <UserAvatar name={lead.name} avatar={lead.avatar} size="xs" />
                  <div>
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs">{lead.name}</h5>
                    <p className="text-[10px] text-gray-400 font-semibold">{lead.companyName || "No Company"}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusColorClass(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-[10px] pt-2.5 border-t border-gray-150/40 dark:border-slate-800/60">
                <span className="font-extrabold text-slate-855 dark:text-slate-200">
                  {formatCurrency(lead.budget)}
                </span>
                <span className="text-gray-400 font-medium">
                  {formatDate(lead.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view (hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <th className="pb-3 pt-1 font-semibold">Lead Info</th>
              <th className="pb-3 pt-1 font-semibold">Requirement</th>
              <th className="pb-3 pt-1 font-semibold">Budget</th>
              <th className="pb-3 pt-1 font-semibold">Status</th>
              <th className="pb-3 pt-1 font-semibold">Created Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40 text-xs">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No recent leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => navigate(`/leads`)}
                  className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={lead.name} avatar={lead.avatar} size="xs" />
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-xs">
                          {lead.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {lead.companyName || "No Company"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-3 max-w-[150px] truncate text-slate-500 dark:text-slate-400 font-medium">
                    {lead.requirement || "General Inquiry"}
                  </td>
                  <td className="py-3.5 pr-3 text-slate-700 dark:text-slate-300 font-bold">
                    {formatCurrency(lead.budget)}
                  </td>
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColorClass(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-400 font-medium">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
