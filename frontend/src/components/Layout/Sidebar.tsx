import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuOptions = [
    { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
    { label: "Leads Pipeline", route: "/leads", icon: Users },
    { label: "Follow-ups", route: "/followups", icon: Calendar },
    { label: "Settings", route: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col justify-between p-4 z-20 border-r border-slate-800/40 shrink-0">
      <div>
        {/* Brand Header */}
        <Link
          to="/"
          className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-850 dark:border-slate-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-purple-500 rounded-lg flex items-center justify-center font-extrabold text-lg shadow-md shadow-violet-500/10">
            N
          </div>
          <span className="font-extrabold text-lg tracking-tight">NEXCRM</span>
        </Link>

        {/* Navigation links */}
        <nav className="space-y-1">
          {menuOptions.map((item) => {
            const Icon = item.icon;
            const isCurrent = location.pathname === item.route;
            return (
              <Link
                key={item.route}
                to={item.route}
                className="relative block group"
              >
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium z-10 relative transition-colors duration-200 ${
                    isCurrent
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {isCurrent && (
                  <motion.div
                    layoutId="sidebarActiveIndicator"
                    className="absolute inset-0 bg-violet-600 dark:bg-violet-600/20 dark:border dark:border-violet-500/30 rounded-xl z-0"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Version */}
      <div className="pt-4 border-t border-slate-850 dark:border-slate-900 flex items-center gap-2.5 px-2">
        <ShieldCheck className="w-4.5 h-4.5 text-violet-400" />
        <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
          {user?.role || "Agent"} Mode
        </div>
      </div>
    </aside>
  );
};
