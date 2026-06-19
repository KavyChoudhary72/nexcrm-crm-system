import React from "react";
import { Lead } from "../../types/lead.types";
import { formatCurrency } from "../../utils/formatters";

interface LeadStatsProps {
  leads: Lead[];
}

export const LeadStats: React.FC<LeadStatsProps> = ({ leads }) => {
  const totalCount = leads.length;
  const wonCount = leads.filter((l) => l.status === "Won").length;
  const lostCount = leads.filter((l) => l.status === "Lost").length;
  const conversionRate = totalCount
    ? ((wonCount / (totalCount - leads.filter((l) => l.status === "New").length || 1)) * 100).toFixed(0)
    : "0";

  const totalBudget = leads.reduce((sum, lead) => sum + (lead.budget || 0), 0);
  const avgBudget = totalCount ? Math.round(totalBudget / totalCount) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4.5 bg-gray-50/50 dark:bg-gray-900/10 border border-gray-150 dark:border-gray-800 rounded-2xl text-left">
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400">Total Pipeline</p>
        <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{totalCount} Leads</p>
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400">Deals Won / Lost</p>
        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
          {wonCount} <span className="text-gray-400 font-semibold text-xs">/ {lostCount}</span>
        </p>
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400">Avg Est. Value</p>
        <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{formatCurrency(avgBudget)}</p>
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400">Conversion rate</p>
        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-0.5">{conversionRate}%</p>
      </div>
    </div>
  );
};
