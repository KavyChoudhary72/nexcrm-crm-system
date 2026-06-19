import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import axios from "axios";

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "sales">("sales");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://nexcrm-backend-ontv.onrender.com/api";
    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const payload = isLogin
      ? { email, password }
      : { name, email, password, role };

    try {
      const response = await axios.post(`${baseUrl}${endpoint}`, payload);
      if (response.data && response.data.success) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        onLoginSuccess(userData);
      } else {
        setError(response.data.error || "Authentication failed");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Could not connect to the backend server. Please verify it is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-indigo-500/15 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl flex flex-col relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            {isLogin
              ? "Access your command panel workspace"
              : "Register a new CRM executive profile"}
          </p>
        </div>

        {/* Error Callout */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/25 text-red-200 text-xs p-3.5 rounded-xl mb-5 flex items-start gap-2.5 overflow-hidden"
            >
              <div className="font-semibold shrink-0">Error:</div>
              <div>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Name field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 px-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Role dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 px-1">
                    System Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    >
                      <option value="sales" className="bg-slate-900 text-white">
                        Sales Executive
                      </option>
                      <option value="admin" className="bg-slate-900 text-white">
                        Admin Executive
                      </option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 px-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@crm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 px-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? "Sign In" : "Sign Up"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6 text-xs text-slate-400">
          <span>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-blue-400 hover:text-blue-300 font-semibold ml-1.5 transition-colors focus:outline-none"
          >
            {isLogin ? "Register now" : "Log in"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-center">
            <p className="text-[11px] text-slate-400">
              Demo Admin: <span className="text-blue-300 font-mono">admin@crm.com</span> / <span className="text-blue-300 font-mono">admin123</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
