import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Lead, LeadStatus } from "../../types/lead.types";
import { formatCurrency } from "../../utils/formatters";
import { AIBadge } from "./AIBadge";
import { UserAvatar } from "../Common/UserAvatar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PIPELINE_STAGES } from "../../utils/constants";

interface KanbanCardProps {
  lead: Lead;
  index: number;
  onClick: () => void;
  onMoveStage: (id: string, newStatus: LeadStatus) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead, index, onClick, onMoveStage }) => {
  const assignedUser = typeof lead.assignedTo === "object" ? lead.assignedTo : null;
  const assignedUserName = assignedUser?.name;
  const assignedUserAvatar = assignedUser?.avatar;

  const currentIndex = PIPELINE_STAGES.indexOf(lead.status);
  const isFirstStage = currentIndex === 0;
  const isLastStage = currentIndex === PIPELINE_STAGES.length - 1;

  const handleMoveLeft = () => {
    if (!isFirstStage) {
      onMoveStage(lead._id, PIPELINE_STAGES[currentIndex - 1]);
    }
  };

  const handleMoveRight = () => {
    if (!isLastStage) {
      onMoveStage(lead._id, PIPELINE_STAGES[currentIndex + 1]);
    }
  };

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

            {/* Touch-Optimized Stage Move Controls (Min-height 48px for thumb target targets) */}
            <div className="flex gap-2.5 mt-3.5 pt-3.5 border-t border-gray-100 dark:border-slate-800/50">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveLeft();
                }}
                disabled={isFirstStage}
                className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200/60 dark:border-slate-800/60 rounded-xl disabled:opacity-20 disabled:pointer-events-none h-12 shadow-sm transition-colors"
                title="Move to Previous Stage"
              >
                <ChevronLeft className="w-5.5 h-5.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMoveRight();
                }}
                disabled={isLastStage}
                className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200/60 dark:border-slate-800/60 rounded-xl disabled:opacity-20 disabled:pointer-events-none h-12 shadow-sm transition-colors"
                title="Move to Next Stage"
              >
                <ChevronRight className="w-5.5 h-5.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
