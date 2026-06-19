import React from "react";
import { FollowUp } from "../../types/followUp.types";
import { FollowUpCard } from "./FollowUpCard";
import { EmptyState } from "../UI/EmptyState";
import { Calendar } from "lucide-react";

interface FollowUpListProps {
  followUps: FollowUp[];
  onComplete: (id: string, notes?: string) => Promise<void>;
  loading?: boolean;
}

export const FollowUpList: React.FC<FollowUpListProps> = ({
  followUps,
  onComplete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (followUps.length === 0) {
    return (
      <EmptyState
        title="No follow-ups scheduled"
        description="All clear! There are no pending follow-up calls or meetings."
        icon={<Calendar className="w-8 h-8 text-gray-400" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {followUps.map((fUp) => (
        <FollowUpCard key={fUp._id} followUp={fUp} onComplete={onComplete} />
      ))}
    </div>
  );
};
