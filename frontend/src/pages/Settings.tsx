import React, { useState } from "react";
import { ProfileSettings } from "../components/Settings/ProfileSettings";
import { TeamSettings } from "../components/Settings/TeamSettings";
import { IntegrationSettings } from "../components/Settings/IntegrationSettings";
import { ThemeToggle } from "../components/Settings/ThemeToggle";
import { User, Users, Settings as SettingsIcon, SunMoon, Sliders } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "integrations" | "theme">("profile");

  const tabItems = [
    { id: "profile" as const, label: "My Profile", icon: <User className="w-4 h-4" /> },
    ...(isAdmin ? [
      { id: "team" as const, label: "Team Members", icon: <Users className="w-4 h-4" /> },
      { id: "integrations" as const, label: "Integrations & AI", icon: <Sliders className="w-4 h-4" /> }
    ] : []),
    { id: "theme" as const, label: "Theme Customization", icon: <SunMoon className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 text-left p-1">
      {/* Header Panel */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              System Settings
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Update profiles, manage team accounts, configure relays, and switch themes.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Hand Tab Selector */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-3 shadow-sm flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible custom-scrollbar">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap lg:w-full ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Hand Panels */}
        <div className="lg:col-span-3 min-h-[300px]">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "team" && isAdmin && <TeamSettings />}
          {activeTab === "integrations" && isAdmin && <IntegrationSettings />}
          {activeTab === "theme" && <ThemeToggle />}
        </div>
      </div>
    </div>
  );
};
