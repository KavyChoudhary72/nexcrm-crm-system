import React from "react";
import { Info } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No leads found",
  description = "Get started by adding a new lead to the pipeline.",
  icon = <Info className="w-8 h-8 text-gray-400" />,
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-gray-900/10 min-h-[300px] ${className}`}>
      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-950 dark:text-white text-base">
        {title}
      </h3>
      <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
        {description}
      </p>
    </div>
  );
};
