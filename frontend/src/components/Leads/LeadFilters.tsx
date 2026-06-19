import React from "react";
import { SearchBar } from "../UI/SearchBar";
import { Select } from "../UI/Select";
import { LeadStatus, LeadSource } from "../../types/lead.types";
import { PIPELINE_STAGES, LEAD_SOURCES } from "../../utils/constants";
import { Filter } from "lucide-react";

interface LeadFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: LeadStatus | "All";
  onStatusChange: (val: LeadStatus | "All") => void;
  sourceFilter: LeadSource | "All";
  onSourceChange: (val: LeadSource | "All") => void;
  sortField: string;
  onSortFieldChange: (val: any) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (val: "asc" | "desc") => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}) => {
  const statusOptions = [{ value: "All", label: "All Statuses" }].concat(
    PIPELINE_STAGES.map((s) => ({ value: s, label: s }))
  );

  const sourceOptions = [{ value: "All", label: "All Sources" }].concat(
    LEAD_SOURCES.map((s) => ({ value: s, label: s }))
  );

  const sortFieldOptions = [
    { value: "createdAt", label: "Date Added" },
    { value: "name", label: "Name" },
    { value: "budget", label: "Budget" },
    { value: "aiScore", label: "AI Score" },
  ];

  const sortOrderOptions = [
    { value: "desc", label: "Descending" },
    { value: "asc", label: "Ascending" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm">
      <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search leads, companies..."
          className="flex-1"
        />

        <div className="flex gap-2.5 flex-1 sm:flex-initial">
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            options={statusOptions}
            icon={<Filter className="w-4 h-4" />}
            className="!py-2 text-xs !bg-transparent shrink-0"
          />

          <Select
            value={sourceFilter}
            onChange={(e) => onSourceChange(e.target.value as any)}
            options={sourceOptions}
            icon={<Filter className="w-4 h-4" />}
            className="!py-2 text-xs !bg-transparent shrink-0"
          />
        </div>
      </div>

      <div className="flex gap-2.5 items-center border-t md:border-t-0 border-gray-50 dark:border-slate-800 pt-3 md:pt-0">
        <span className="text-xs font-semibold text-gray-400 shrink-0">Sort By:</span>
        <Select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as any)}
          options={sortFieldOptions}
          className="!py-2 text-xs !bg-transparent"
        />
        <Select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as any)}
          options={sortOrderOptions}
          className="!py-2 text-xs !bg-transparent"
        />
      </div>
    </div>
  );
};
