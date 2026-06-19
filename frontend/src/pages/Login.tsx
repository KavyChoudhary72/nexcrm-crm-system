import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regRole, setRegRole] = useState<"admin" | "sales">("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (regRole === "admin") {
          await register(name, email, password, "admin", companyName, undefined);
        } else {
          await register(name, email, password, "sales", undefined, inviteCode);
        }
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 p-4 relative overflow-hidden font-sans">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-violet-600/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-500/15 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl flex flex-col relative z-10"
      >
        {/* NEXCRM Brand Logo - Click to Homepage */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center justify-center gap-2.5 mb-6 cursor-pointer group hover:opacity-85 transition-opacity"
        >
          <div className="w-8.5 h-8.5 bg-violet-600 rounded-xl flex items-center justify-center font-black text-white text-base shadow-md shadow-violet-600/20">
            N
          </div>
          <span className="font-black text-lg tracking-tight text-white">NEXCRM</span>
        </div>

        {/* Header Info */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5">
            {isLogin
              ? "Access your command panel workspace"
              : regRole === "admin"
                ? "Setup a new CRM workspace as administrator"
                : "Join an existing workspace with an invite code"}
          </p>
        </div>

        {/* Error Callout */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/25 text-red-200 text-xs p-3.5 rounded-xl mb-5 flex items-start gap-2.5 overflow-hidden text-left"
            >
              <div className="font-semibold shrink-0">Error:</div>
              <div>{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Admin vs Sales Toggle */}
                <div className="flex gap-2 p-1 bg-slate-950/40 rounded-xl border border-white/10 mb-2">
                  <button
                    type="button"
                    onClick={() => setRegRole("admin")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      regRole === "admin"
                        ? "bg-violet-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Create Workspace
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole("sales")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                      regRole === "sales"
                        ? "bg-violet-600 text-white shadow"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Join with Invite Code
                  </button>
                </div>

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

                {/* Conditional Fields based on Registration Role */}
                {regRole === "admin" ? (
                  /* Company Name field */
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 px-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corp"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  /* Invite Code field */
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 px-1">
                      Invite Code (6 characters)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. ABC123"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors uppercase"
                      />
                    </div>
                  </div>
                )}
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
      </motion.div>
    </div>
  );
};
export default Login;
