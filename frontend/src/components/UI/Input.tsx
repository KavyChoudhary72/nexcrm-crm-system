import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block px-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-gray-50 dark:bg-gray-800/40 border ${
              error ? "border-red-500" : "border-gray-200 dark:border-gray-700/80"
            } rounded-xl py-2.5 ${
              icon ? "pl-11" : "px-4"
            } pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-500 px-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
