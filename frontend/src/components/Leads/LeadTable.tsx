import React from "react";
import { Lead } from "../../types/lead.types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { getStatusColorClass } from "../../utils/statusColors";
import { UserAvatar } from "../Common/UserAvatar";
import { usePagination } from "../../hooks/usePagination";
import { Pagination } from "../UI/Pagination";

interface LeadTableProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onLeadClick }) => {
  const { currentPage, totalPages, paginatedItems, goToPage } = usePagination(leads, 10);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-sm p-6 text-left flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              <th className="pb-3 pt-1 font-semibold">Lead Details</th>
              <th className="pb-3 pt-1 font-semibold">Company</th>
              <th className="pb-3 pt-1 font-semibold">Requirement</th>
              <th className="pb-3 pt-1 font-semibold">Budget</th>
              <th className="pb-3 pt-1 font-semibold">Status</th>
              <th className="pb-3 pt-1 font-semibold">AI score</th>
              <th className="pb-3 pt-1 font-semibold">Assigned executive</th>
              <th className="pb-3 pt-1 font-semibold">Date Added</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40 text-xs">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  No leads found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((lead) => {
                const assignedUser = typeof lead.assignedTo === "object" ? lead.assignedTo : null;
                const assignedUserName = assignedUser?.name;
                const assignedUserAvatar = assignedUser?.avatar;

                return (
                  <tr
                    key={lead._id}
                    onClick={() => onLeadClick(lead)}
                    className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 pr-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={lead.name} avatar={lead.avatar} size="xs" />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-xs">
                            {lead.name}
                          </div>
                          <div className="text-[10px] text-gray-450 dark:text-slate-500 font-medium mt-0.5">
                            {lead.mobileNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-3 text-slate-600 dark:text-slate-400 font-medium">
                      {lead.companyName || "N/A"}
                    </td>
                    <td className="py-3.5 pr-3 max-w-[150px] truncate text-slate-500 dark:text-slate-455 font-medium">
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
                    <td className="py-3.5 pr-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          (lead.aiScore ?? 0) >= 70
                            ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/50"
                            : "bg-red-50 dark:bg-red-950/20 text-red-500 border-red-200/50"
                        }`}
                      >
                        {lead.aiScore ?? "N/A"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-3">
                      {assignedUserName ? (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={assignedUserName} avatar={assignedUserAvatar} size="xs" />
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {assignedUserName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 text-gray-400 font-medium">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  );
};
