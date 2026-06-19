import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendType = "neutral",
  className = "",
}) => {
  return (
    <div className={`p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1 text-left">
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
            {value}
          </h3>
        </div>
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span
            className={`font-semibold ${
              trendType === "up"
                ? "text-emerald-600 dark:text-emerald-400"
                : trendType === "down"
                ? "text-red-500"
                : "text-slate-400"
            }`}
          >
            {trend}
          </span>
          <span className="text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
};
