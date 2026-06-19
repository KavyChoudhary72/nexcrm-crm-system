import React from "react";
import { LeadStatus } from "../../types/lead.types";
import { getStatusColorClass } from "../../utils/statusColors";

interface StatusBadgeProps {
  status: LeadStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border leading-none tracking-wide ${getStatusColorClass(
        status
      )}`}
    >
      {status}
    </span>
  );
};
