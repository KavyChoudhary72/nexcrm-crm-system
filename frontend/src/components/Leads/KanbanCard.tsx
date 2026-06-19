import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Lead } from "../../types/lead.types";
import { formatCurrency } from "../../utils/formatters";
import { AIBadge } from "./AIBadge";
import { UserAvatar } from "../Common/UserAvatar";

interface KanbanCardProps {
  lead: Lead;
  index: number;
  onClick: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, index, onClick }) => {
  const assignedUser = typeof lead.assignedTo === "object" ? lead.assignedTo : null;
  const assignedUserName = assignedUser?.name;
  const assignedUserAvatar = assignedUser?.avatar;

  return (
    <Draggable draggableId={lead._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          onClick={onClick}
          className="outline-none"
        >
          <div
            className={`p-4 bg-white dark:bg-slate-900 border rounded-2xl cursor-pointer hover:shadow-md text-left ${
              snapshot.isDragging
                ? "shadow-xl border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/5 scale-[1.01]"
                : "shadow-sm border-gray-100 dark:border-slate-800/80 transition-all"
            }`}
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex items-center gap-2 overflow-hidden min-w-0">
                <UserAvatar name={lead.name} avatar={lead.avatar} size="xs" className="w-5 h-5 text-[8px] flex-shrink-0" />
                <h4 className="font-bold text-xs text-gray-900 dark:text-white tracking-tight leading-snug line-clamp-2">
                  {lead.name}
                </h4>
              </div>
              <AIBadge score={lead.aiScore} />
            </div>

            <p className="text-[10px] text-gray-400 font-semibold truncate">
              {lead.companyName || "No Company"}
            </p>

            {lead.requirement && (
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium mt-2 line-clamp-2 leading-relaxed">
                {lead.requirement}
              </p>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 dark:border-slate-800/40">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {formatCurrency(lead.budget)}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 rounded text-[9px] font-bold border border-gray-100 dark:border-slate-800/40 uppercase">
                  {lead.source}
                </span>
                {assignedUserName && (
                  <UserAvatar name={assignedUserName} avatar={assignedUserAvatar} size="xs" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
