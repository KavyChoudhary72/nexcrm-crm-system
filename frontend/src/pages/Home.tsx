import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../hooks/useDarkMode";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Brain, Calendar, Clock, Download, ShieldCheck, 
  Sun, Moon, ArrowRight, CheckCircle2, MessageSquare, Mail, Star
} from "lucide-react";

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pipeline" | "ai" | "calendar" | "timeline" | "exporter" | "security">("pipeline");

  const tabs = [
    { id: "pipeline" as const, label: "Pipeline Board" },
    { id: "ai" as const, label: "AI Lead Scoring" },
    { id: "calendar" as const, label: "Calendar Workspace" },
    { id: "timeline" as const, label: "Timeline Logs" },
    { id: "exporter" as const, label: "Data Exporter" },
    { id: "security" as const, label: "Role Permissions" },
  ];

  const tabContent = {
    pipeline: {
      title: "Interactive Kanban Pipeline",
      description: "Manage prospective customers from inquiry to conversion. Easily drag and drop leads through organized stages: New → Contacted → Qualified → Proposal Sent → Negotiation → Won → Lost.",
      exploreText: "Explore Pipelines",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-[260px] bg-slate-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl p-3 space-y-3 shadow-md">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-850">
              <span className="text-[10px] uppercase font-bold text-violet-600 dark:text-violet-400">Leads Board</span>
              <span className="text-[9px] text-gray-400 font-semibold">Stage: Qualified</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl space-y-2 text-left">
              <div className="text-xs font-bold text-slate-800 dark:text-white">Enterprise CRM Deal</div>
              <div className="text-[9px] text-gray-400">Acme Corporation</div>
              <div className="flex justify-between items-center pt-1.5 border-t border-gray-50 dark:border-slate-850">
                <span className="text-xs font-black text-violet-600">$15,000</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold">AI: 88</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    ai: {
      title: "Gemini AI Lead Scoring",
      description: "Auto-scan customer profiles instantly. NEXCRM runs client budgets, origins, and specific requirement notes through Gemini 2.5 Flash to generate an intent probability grade from 1 to 100.",
      exploreText: "Explore AI Scoring",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="relative flex items-center justify-center w-36 h-36 border-4 border-violet-100 dark:border-violet-950/40 rounded-full">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="absolute inset-0 border-4 border-transparent border-t-violet-600 rounded-full"
            />
            <div className="text-center space-y-0.5">
              <span className="text-3xl font-black text-violet-600 dark:text-violet-400">88</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">AI SCORE</span>
            </div>
          </div>
        </div>
      )
    },
    calendar: {
      title: "Follow-up Calendar & Banners",
      description: "Never miss an engagement. NEXCRM checks dates relative to current times to trigger overdue alerts and lists today's pending follow-ups. Schedule calls directly on our interactive month grid calendar.",
      exploreText: "Explore Calendar",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-[260px] bg-slate-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md">
            <div className="flex gap-2 p-2 bg-red-50/60 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-xl text-left">
              <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold text-red-750 uppercase">Overdue Task</span>
                <p className="text-[10px] text-red-650 font-medium">Follow up with Acme Corp</p>
              </div>
            </div>
            <div className="flex gap-2 p-2 bg-amber-50/60 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950/20 rounded-xl text-left">
              <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] font-bold text-amber-700 uppercase">Today's Call</span>
                <p className="text-[10px] text-amber-650 font-medium">Proposal review at 4 PM</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    timeline: {
      title: "Chronological Activity Timelines",
      description: "Keep a complete journal of client communications. Log phone calls, emails, and meetings. View automated pipeline audits, status logs, and updates in a vertical timeline block.",
      exploreText: "Explore Timelines",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4 text-left">
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-800 pl-1">
            <div className="flex gap-3 items-center relative pl-1">
              <div className="w-4.5 h-4.5 rounded-full bg-violet-600 border border-white flex items-center justify-center shrink-0 z-10" />
              <div className="text-[10px]">
                <span className="font-bold text-slate-800 dark:text-white block">Status Updated</span>
                <span className="text-gray-400">Advanced to Qualified by Admin</span>
              </div>
            </div>
            <div className="flex gap-3 items-center relative pl-1">
              <div className="w-4.5 h-4.5 rounded-full bg-slate-200 dark:bg-slate-700 border border-white flex items-center justify-center shrink-0 z-10" />
              <div className="text-[10px]">
                <span className="font-bold text-slate-800 dark:text-white block">Call Logged</span>
                <span className="text-gray-400">Client requested pricing review</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    exporter: {
      title: "CSV & Excel Spreadsheet Exporters",
      description: "Generate spreadsheet sheets in one click. Instantly export your pipeline contacts, estimated budgets, and customer requirement archives into formatted CSV and Excel sheets.",
      exploreText: "Explore Exporter",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 rounded-2xl flex flex-col items-center justify-center space-y-2 shadow-sm">
            <Download className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-pulse" />
            <span className="text-xs font-bold text-violet-750 dark:text-violet-400">leads-export.xlsx</span>
            <span className="text-[9px] text-gray-400 font-semibold">100% Download Ready</span>
          </div>
        </div>
      )
    },
    security: {
      title: "Role-Based Team Permissions",
      description: "Organize agent coordinates. Differentiate permissions between Administrators and Sales Executives. Secure layouts, log activities dynamically, and manage assignments from dropdown menus.",
      exploreText: "Explore Security",
      illustration: (
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-[260px] bg-slate-50 dark:bg-slate-800/40 border border-gray-150 dark:border-slate-800 rounded-2xl p-3.5 space-y-3.5 shadow-md text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-600 text-white font-extrabold flex items-center justify-center text-xs">A</div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">John Doe</span>
                <span className="text-[9px] font-bold text-violet-600 uppercase">Administrator</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-100 dark:border-slate-850 pt-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white font-extrabold flex items-center justify-center text-xs">S</div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-white block">Jane Smith</span>
                <span className="text-[9px] font-bold text-indigo-500 uppercase">Sales Executive</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  const explorePaths = {
    pipeline: "/leads",
    ai: "/leads",
    calendar: "/followups",
    timeline: "/leads",
    exporter: "/leads",
    security: "/settings",
  };

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate(explorePaths[activeTab]);
    } else {
      navigate("/login");
    }
  };

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Header / Navbar */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <header className="border border-gray-100 dark:border-slate-850 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-md px-6 h-16 flex items-center justify-between sticky top-5 z-50">
          <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8.5 h-8.5 bg-violet-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-violet-600/10">
              N
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">NEXCRM</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-gray-500 dark:text-slate-400">
            <a href="#features" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a>
            <a href="#stack" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Technology</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center justify-center font-bold px-4 py-2 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md active:scale-[0.98] transition-all"
              >
                Go to Workspace
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="hidden sm:block text-xs font-bold text-gray-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center font-bold px-4 py-2.5 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md active:scale-[0.98] transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative py-28 px-6 overflow-hidden">
        {/* Glowing concentric rings */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20 dark:opacity-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="w-full h-full border border-dashed border-violet-500 rounded-full flex items-center justify-center"
          >
            <div className="w-[80%] h-[80%] border border-dashed border-violet-400 rounded-full flex items-center justify-center">
              <div className="w-[60%] h-[60%] border border-dashed border-violet-300 rounded-full" />
            </div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 border border-violet-200/50 uppercase tracking-wider">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            AI-Powered Lead Management CRM
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Smarter Way to Manage <br />
            <span className="text-violet-600">Your Business</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-semibold">
            Orchestrate leads from website forms, WhatsApp, Facebook and Instagram Ads in one consolidated, secure dashboard.
          </p>

          <div className="flex justify-center pt-4">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/15 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2"
              >
                Go to Workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/15 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2"
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Dynamic Tab Features Section */}
      <section id="features" className="py-20 border-t border-gray-50 dark:border-slate-900 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Everything You Need To Grow Your Business
            </h2>
          </div>

          {/* Horizontal Tab Selector */}
          <div className="flex justify-start md:justify-center overflow-x-auto pb-2 custom-scrollbar">
            <div className="flex bg-gray-50 dark:bg-slate-900/60 p-1 rounded-2xl border border-gray-150 dark:border-slate-850 shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all relative ${
                    activeTab === tab.id
                      ? "text-violet-600 dark:text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-slate-205"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="homepageActiveTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl z-[-1] shadow-sm border border-gray-100 dark:border-slate-750"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Card Box */}
          <div className="border border-gray-100 dark:border-slate-800/80 rounded-[32px] p-6 bg-white dark:bg-slate-900/40 shadow-xl text-left flex flex-col md:flex-row items-center gap-10 min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex-1 space-y-5"
              >
                <h3 className="text-2xl font-black text-slate-950 dark:text-white leading-tight">
                  {tabContent[activeTab].title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {tabContent[activeTab].description}
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handlePrimaryAction}
                    className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-md text-xs active:scale-[0.98] transition-all"
                  >
                    {isAuthenticated ? "Open Workspace" : "Try for Free"}
                  </button>
                  <button
                    onClick={handleExplore}
                    className="px-5 py-2.5 bg-transparent hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs active:scale-[0.98] transition-all"
                  >
                    {tabContent[activeTab].exploreText}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + "-ill"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full md:w-[320px] h-64 bg-gray-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800/80 rounded-2xl flex items-center justify-center shadow-inner shrink-0"
              >
                {tabContent[activeTab].illustration}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Grow with NEXCRM Section */}
      <section className="py-24 bg-slate-50/50 dark:bg-slate-900/10 border-t border-gray-100 dark:border-slate-900 px-6 relative overflow-hidden text-left">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text Column */}
          <div className="lg:w-[35%] text-left space-y-4 shrink-0">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
              Grow <br />
              <span className="text-violet-600 dark:text-violet-400">with NEXCRM</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-semibold leading-relaxed">
              Empower your sales pipeline with structured coordinates, automatic AI intent scoring, and clean CSV/Excel downloads to boost conversion velocity.
            </p>
            {/* Curved SVG Arrow pointing to arches */}
            <div className="hidden lg:block pt-4 pl-6">
              <svg className="w-16 h-16 text-violet-500/40 dark:text-violet-400/30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20 C 50 20, 50 80, 80 80" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
                <path d="M70 70 L 80 80 L 70 90" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Right Arches Column */}
          <div className="flex-1 w-full flex items-end justify-center gap-4 sm:gap-6 min-h-[360px] sm:min-h-[420px] pt-8">
            
            {/* Arch 1 - 27% */}
            <motion.div
              initial={{ y: 150, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-[28%] sm:w-[130px] h-[220px] sm:h-[260px] rounded-t-full bg-gradient-to-b from-violet-500/20 to-violet-500/5 dark:from-violet-500/30 dark:to-violet-500/5 border border-violet-500/25 p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-lg backdrop-blur-sm"
            >
              <div className="space-y-1 sm:space-y-2 mt-4">
                <span className="text-3xl sm:text-4xl font-black text-violet-600 dark:text-violet-400 block">27%</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 block leading-tight">Increased Productivity</span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-slate-450 block font-semibold leading-normal">Do more in less time</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </motion.div>

            {/* Arch 2 - 50% */}
            <motion.div
              initial={{ y: 180, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-[28%] sm:w-[130px] h-[280px] sm:h-[330px] rounded-t-full bg-gradient-to-b from-indigo-500/20 to-indigo-500/5 dark:from-indigo-500/30 dark:to-indigo-500/5 border border-indigo-500/25 p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-lg backdrop-blur-sm"
            >
              <div className="space-y-1 sm:space-y-2 mt-4">
                <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 block">50%</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 block leading-tight">Faster Setup Setup</span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-slate-450 block font-semibold leading-normal">Get started in no time</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.div>

            {/* Arch 3 - 71% */}
            <motion.div
              initial={{ y: 210, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-[28%] sm:w-[130px] h-[340px] sm:h-[400px] rounded-t-full bg-gradient-to-b from-purple-500/20 to-purple-500/5 dark:from-purple-500/30 dark:to-purple-500/5 border border-purple-500/25 p-4 sm:p-5 flex flex-col justify-between items-center text-center shadow-lg backdrop-blur-sm"
            >
              <div className="space-y-1 sm:space-y-2 mt-4">
                <span className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 block">71%</span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-850 dark:text-slate-200 block leading-tight">Saved on Fees</span>
                <span className="text-[8px] sm:text-[9px] text-gray-400 dark:text-slate-450 block font-semibold leading-normal">Big savings for lifetime</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Wave Section Banner (Engineered for Sales Success) */}
      <section id="stack" className="relative pt-24 pb-20 bg-slate-950 text-white overflow-hidden">
        {/* Wave Border Mask */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-white dark:bg-slate-950 pointer-events-none">
          <svg className="absolute top-0 w-full h-10 fill-slate-950" viewBox="0 0 1440 40" preserveAspectRatio="none">
            <path d="M0,0 C240,30 480,40 720,40 C960,40 1200,30 1440,0 L1440,40 L0,40 Z"></path>
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 space-y-12 relative z-10 text-center">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Engineered for Modern Sales Teams
            </h2>
            <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
              Built with a high-performance stack for security, speed, and intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-900/50 border border-slate-800/60 rounded-2xl space-y-3 shadow-md hover:border-violet-500/35 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Secure Authentication</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                NEXCRM keeps credentials locked using salted bcrypt encryption hashes and delivers secure workspace authentication via standard JSON Web Tokens (JWT).
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800/60 rounded-2xl space-y-3 shadow-md hover:border-violet-500/35 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Google Gemini 2.5 Flash</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Scan budgets, channels, and client requirements instantly. NEXCRM sends requirements to the Gemini API to analyze intent and produce ratings.
              </p>
            </div>

            <div className="p-6 bg-slate-900/50 border border-slate-800/60 rounded-2xl space-y-3 shadow-md hover:border-violet-500/35 transition-all">
              <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-sm font-bold text-white">MongoDB Atlas Storage</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                All records, activities, details, and schedules are synced instantly in the cloud database to ensure maximum safety and consistency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Call to Action */}
      <footer className="py-16 px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">Start Managing Leads Smarter Today</h2>
          <p className="text-xs text-gray-400 font-semibold">No setup fees. Optimized pipelines. Instant AI score scans.</p>
        </div>

        <div className="pt-2">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all text-xs inline-flex items-center gap-1.5"
            >
              Go to Workspace
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all text-xs inline-flex items-center gap-1.5"
            >
              Get Started for Free
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-slate-900 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
          <span>&copy; {new Date().getFullYear()} NEXCRM. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-violet-600 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-violet-600 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
