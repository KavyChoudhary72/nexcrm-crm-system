import React from "react";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Loading database contents...",
  className = "",
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 p-8 ${className}`}>
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
    </div>
  );
};
