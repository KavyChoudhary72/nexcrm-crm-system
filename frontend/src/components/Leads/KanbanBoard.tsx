import React, { useMemo } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { LayoutGroup } from "framer-motion";
import { Lead, LeadStatus } from "../../types/lead.types";
import { PIPELINE_STAGES } from "../../utils/constants";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  leads: Lead[];
  onDragEnd: (id: string, newStatus: LeadStatus) => void;
  onLeadClick: (lead: Lead) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onDragEnd,
  onLeadClick,
}) => {
  const pipeline = useMemo(() => {
    const columns: Record<LeadStatus, Lead[]> = {
      New: [],
      Contacted: [],
      Qualified: [],
      "Proposal Sent": [],
      Negotiation: [],
      Won: [],
      Lost: [],
    };
    leads.forEach((lead) => {
      if (columns[lead.status]) {
        columns[lead.status].push(lead);
      }
    });
    return columns;
  }, [leads]);

  const handleDragResolution = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const arrivalKey = destination.droppableId as LeadStatus;
    onDragEnd(draggableId, arrivalKey);
  };

  return (
    <LayoutGroup>
      <DragDropContext onDragEnd={handleDragResolution}>
        <div className="flex gap-4 overflow-x-auto pb-4 items-start custom-scrollbar">
          {PIPELINE_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              leads={pipeline[stage]}
              onLeadClick={onLeadClick}
              onMoveStage={onDragEnd}
            />
          ))}
        </div>
      </DragDropContext>
    </LayoutGroup>
  );
};
