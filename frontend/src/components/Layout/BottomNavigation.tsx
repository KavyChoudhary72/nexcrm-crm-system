import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const menuOptions = [
    { label: "Dashboard", route: "/dashboard", icon: LayoutDashboard },
    { label: "Pipeline", route: "/leads", icon: Users },
    { label: "Follow-ups", route: "/followups", icon: Calendar },
    { label: "Settings", route: "/settings", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-gray-150 dark:border-slate-800/80 flex items-center justify-around px-2 py-1 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] dark:shadow-none">
      {menuOptions.map((item) => {
        const Icon = item.icon;
        const isCurrent = location.pathname === item.route;
        return (
          <Link
            key={item.route}
            to={item.route}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              isCurrent
                ? "text-blue-600 dark:text-blue-400 font-extrabold"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-350 font-bold"
            }`}
          >
            <Icon className="w-5.5 h-5.5 shrink-0" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
