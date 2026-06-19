import React from "react";

interface AIBadgeProps {
  score?: number;
}

export const AIBadge: React.FC<AIBadgeProps> = ({ score }) => {
  if (score === undefined || score === null) {
    return (
      <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-full text-[10px] font-bold border border-gray-150 dark:border-gray-700">
        AI: N/A
      </span>
    );
  }

  const isHigh = score >= 70;
  const isMedium = score >= 40 && score < 70;

  const colorClass = isHigh
    ? "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200/50"
    : isMedium
    ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50"
    : "bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border-red-200/50";

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border leading-none shrink-0 ${colorClass}`}
    >
      AI Score: {score}
    </span>
  );
};
