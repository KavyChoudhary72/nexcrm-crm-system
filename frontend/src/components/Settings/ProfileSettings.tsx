import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../Common/UserAvatar";
import { Shield, Mail, Calendar, Key, Save, ShieldCheck } from "lucide-react";
import { authService } from "../../services/auth.service";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";

export const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and Email are required");
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const updatedUser = await authService.updateProfile(name, email, avatar);
      updateUser({
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm text-left space-y-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-50 dark:border-slate-850 pb-6">
        <label className="relative group cursor-pointer shrink-0 block">
          <UserAvatar name={name || user.name} avatar={avatar} size="lg" className="w-20 h-20 text-xl font-bold rounded-3xl" />
          <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
            Change
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="flex-1 space-y-4 w-full">
          <div>
            <h4 className="font-extrabold text-gray-900 dark:text-white text-lg leading-snug">
              {user.name}
            </h4>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 border border-violet-200/50 uppercase">
              <Shield className="w-3.5 h-3.5" />
              {user.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Input
              label="Full Name *"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold pt-1">
            <Calendar className="w-4 h-4" />
            <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "June 2026"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h5 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
          Security & Password
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block px-1">
              Current Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••"
              className="w-full bg-gray-55 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block px-1">
              New Password
            </label>
            <input
              type="password"
              disabled
              placeholder="••••••••"
              className="w-full bg-gray-55 dark:bg-gray-800/20 border border-gray-150 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="p-3.5 bg-violet-50/50 dark:bg-violet-950/5 border border-violet-100/50 dark:border-violet-900/10 rounded-2xl flex gap-3 items-start">
          <Key className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-violet-650 dark:text-violet-400/90 font-medium leading-relaxed">
            Password updates are locked in the local staging profile. Contact your system administrator if you require a password reset.
          </p>
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800/60">
        <div>
          {success && (
            <span className="inline-flex items-center gap-1.5 text-xs text-green-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Profile changes saved successfully!
            </span>
          )}
          {error && (
            <span className="inline-flex items-center gap-1.5 text-xs text-red-500 font-semibold">
              Error: {error}
            </span>
          )}
        </div>
        <Button type="submit" loading={saving} className="rounded-xl flex items-center gap-1.5 shadow-md">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};
