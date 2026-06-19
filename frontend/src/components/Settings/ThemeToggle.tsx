import React from "react";
import { useDarkMode } from "../../hooks/useDarkMode";
import { Sun, Moon, Sparkles } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm text-left space-y-4">
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-base">
          Theme Customization
        </h4>
        <p className="text-xs text-gray-400 font-medium">
          Choose between light and dark modes to customize your workspace appearance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Light Option */}
        <div
          onClick={() => {
            if (isDarkMode) toggleDarkMode();
          }}
          className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center ${
            !isDarkMode
              ? "border-blue-500 bg-blue-50/10 dark:bg-blue-950/5 text-blue-600"
              : "border-gray-100 dark:border-slate-800 hover:border-gray-250 dark:hover:border-slate-700 text-gray-500"
          }`}
        >
          <div className={`p-3 rounded-2xl ${!isDarkMode ? "bg-blue-50 text-blue-600" : "bg-gray-50 dark:bg-slate-800 text-gray-400"}`}>
            <Sun className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">Light Mode</span>
        </div>

        {/* Dark Option */}
        <div
          onClick={() => {
            if (!isDarkMode) toggleDarkMode();
          }}
          className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center ${
            isDarkMode
              ? "border-blue-500 bg-blue-50/10 dark:bg-blue-950/5 text-blue-400"
              : "border-gray-100 dark:border-slate-800 hover:border-gray-205 dark:hover:border-slate-700 text-gray-500"
          }`}
        >
          <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-blue-950/40 text-blue-400" : "bg-gray-50 dark:bg-slate-800 text-gray-400"}`}>
            <Moon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold">Dark Mode</span>
        </div>
      </div>

      <div className="p-3.5 bg-gray-50/50 dark:bg-slate-800/10 border border-gray-100 dark:border-slate-800/40 rounded-2xl flex gap-2.5 items-center">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
        <p className="text-[10.5px] text-gray-500 dark:text-slate-400 font-medium leading-tight">
          The dashboard graphs, pipeline cards, and layout elements automatically adapt to your theme selection.
        </p>
      </div>
    </div>
  );
};
