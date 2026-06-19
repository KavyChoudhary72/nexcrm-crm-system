import React from "react";
import { LogOut, Sun, Moon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDarkMode } from "../../hooks/useDarkMode";
import { UserAvatar } from "../Common/UserAvatar";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800/60 flex items-center justify-between px-8 z-10 shrink-0">
      <h2 className="font-bold text-gray-800 dark:text-white text-base tracking-tight">
        Command Terminal Workspace
      </h2>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          title="Toggle Theme"
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 border-l border-gray-100 dark:border-slate-800/80 pl-4">
          <UserAvatar name={user?.name} avatar={user?.avatar} size="sm" />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">
              {user?.name || "System Executive"}
            </p>
            <p className="text-[10px] text-gray-400 font-semibold leading-normal capitalize">
              {user?.role || "Agent"}
            </p>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10 rounded-xl transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
