import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Lead, LeadStatus } from "../../types/lead.types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  stage: LeadStatus;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  leads,
  onLeadClick,
}) => {
  return (
    <div className="w-72 bg-gray-100/70 dark:bg-gray-900/30 border border-gray-200/40 dark:border-slate-800/80 p-4 rounded-3xl flex flex-col max-h-full shrink-0">
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
          {stage}
        </span>
        <span className="text-xs font-bold bg-gray-200 dark:bg-slate-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-slate-400">
          {leads.length}
        </span>
      </div>

      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[480px] rounded-2xl transition-colors duration-250 pb-20 ${
              snapshot.isDraggingOver ? "bg-blue-50/10 dark:bg-blue-950/5" : ""
            }`}
          >
            {leads.map((lead, index) => (
              <KanbanCard
                key={lead._id}
                lead={lead}
                index={index}
                onClick={() => onLeadClick(lead)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
