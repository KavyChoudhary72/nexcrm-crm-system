import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-screen overflow-hidden bg-gray-50 dark:bg-slate-950 transition-colors duration-250">
      <div className="flex flex-1 overflow-hidden relative flex-col md:flex-row">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Command Workspace */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header toolbar */}
          <Header />

          {/* Content Stages */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-8 custom-scrollbar relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
