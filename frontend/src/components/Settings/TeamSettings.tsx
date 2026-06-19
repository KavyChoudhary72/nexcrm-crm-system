import React, { useEffect, useState } from "react";
import { User } from "../../types/user.types";
import { userService } from "../../services/user.service";
import { UserAvatar } from "../Common/UserAvatar";
import { useAuth } from "../../hooks/useAuth";
import { ShieldAlert, Loader2, Copy, Check, X, Calendar, Mail, Shield, Trash2, AlertTriangle } from "lucide-react";

export const TeamSettings: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Remove confirmation Modal State
  const [confirmRemoveUser, setConfirmRemoveUser] = useState<User | null>(null);
  const [removing, setRemoving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCopyCode = () => {
    if (currentUser?.inviteCode) {
      navigator.clipboard.writeText(currentUser.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveUser = async (id: string) => {
    setRemoving(true);
    setError("");
    try {
      await userService.removeUser(id);
      setSuccessMsg("Team member removed from workspace successfully.");
      setTimeout(() => setSuccessMsg(""), 3500);
      setConfirmRemoveUser(null);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to remove user");
    } finally {
      setRemoving(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left relative">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-base">
            Team Workspace
          </h4>
          <p className="text-xs text-gray-400 font-medium">
            Manage your sales agents, assign roles, and view team rosters.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-xs text-red-650 dark:text-red-400 font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-green-50 dark:bg-green-950/20 border border-green-150 dark:border-green-900/30 rounded-2xl text-xs text-green-650 dark:text-green-400 font-semibold">
          {successMsg}
        </div>
      )}

      {/* Admin Invite Code Card */}
      {isAdmin && currentUser?.inviteCode && (
        <div className="bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h5 className="font-bold text-violet-900 dark:text-violet-300 text-sm">
              Workspace Invitation Code
            </h5>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed max-w-md">
              Share this invite code with your Sales Executives. They can use it to register and join your company workspace <strong>{currentUser.companyName}</strong> automatically.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2.5 px-4 rounded-2xl border border-violet-500/30 shadow-inner w-full sm:w-auto justify-between sm:justify-start">
            <span className="font-mono font-black text-violet-600 dark:text-violet-400 text-lg tracking-wider select-all">
              {currentUser.inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 hover:bg-gray-150 dark:hover:bg-slate-850 rounded-xl transition-all duration-150 text-gray-500 dark:text-slate-400 hover:text-violet-600"
              title="Copy invite code"
            >
              {copied ? (
                <Check className="w-4.5 h-4.5 text-green-500" />
              ) : (
                <Copy className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Members Grid / List */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-50 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-850/10">
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th className="px-5 py-3.5 text-right text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-850/50">
              {users.map((member) => (
                <tr 
                  key={member._id} 
                  onClick={() => setSelectedUser(member)}
                  className="hover:bg-gray-50/30 dark:hover:bg-slate-850/10 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.name} avatar={member.avatar} size="sm" className="rounded-xl" />
                      <div>
                        <span className="font-bold text-sm text-gray-900 dark:text-white block group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {member.name} {member._id === currentUser?._id && " (You)"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs text-gray-500 dark:text-slate-350 font-medium">
                      {member.email}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                      member.role === "admin"
                        ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200/50"
                        : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50"
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-500 font-semibold">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      {member._id !== currentUser?._id ? (
                        <button
                          onClick={() => setConfirmRemoveUser(member)}
                          className="text-[10px] text-red-500 hover:text-red-400 font-bold px-3 py-1.5 hover:bg-red-500/10 rounded-xl transition-all uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium italic">Owner</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!isAdmin && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800/40 rounded-3xl flex gap-3 text-left">
          <ShieldAlert className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wide">
              Workspace Scope Limited
            </h5>
            <p className="text-[11px] text-gray-500 dark:text-slate-400/90 font-medium leading-relaxed">
              Workspace invite credentials and settings are restricted to the administrator. If you need to register other agents, please share the invitation code from your administrator.
            </p>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedUser(null)} 
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-650 rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Avatar */}
            <div className="relative mt-2">
              <UserAvatar name={selectedUser.name} avatar={selectedUser.avatar} size="lg" className="rounded-2xl w-18 h-18 text-xl shadow-lg" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            {/* User Meta */}
            <div className="space-y-1 w-full">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                {selectedUser.name}
              </h4>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                selectedUser.role === "admin"
                  ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200/50"
                  : "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50"
              }`}>
                {selectedUser.role === "admin" ? "Workspace Owner" : "Sales Executive"}
              </span>
            </div>

            {/* Profile Details List */}
            <div className="w-full bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-850/80 space-y-3 text-left">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="overflow-hidden">
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Email Address</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block truncate">{selectedUser.email}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Workspace Privilege</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{selectedUser.role === "admin" ? "Full Access Control" : "Assigned Pipeline Scoped"}</span>
                </div>
              </div>
              {selectedUser.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">Workspace Joined</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Remove member from workspace action */}
            {isAdmin && selectedUser._id !== currentUser?._id && (
              <button
                onClick={() => setConfirmRemoveUser(selectedUser)}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-650 dark:text-red-400 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-red-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Member from Workspace
              </button>
            )}
          </div>
        </div>
      )}

      {/* Remove Confirmation Dialog */}
      {confirmRemoveUser && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                Confirm Removal
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Are you sure you want to remove <strong>{confirmRemoveUser.name}</strong> from the workspace? All their assigned leads will become unassigned, and scheduled follow-ups will be cleared. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setConfirmRemoveUser(null)}
                disabled={removing}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-150 dark:hover:bg-slate-750 text-gray-700 dark:text-slate-200 rounded-xl py-2.5 text-xs font-bold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRemoveUser(confirmRemoveUser._id)}
                disabled={removing}
                className="flex-1 bg-red-650 hover:bg-red-550 text-white rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all disabled:opacity-50"
              >
                {removing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Remove"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TeamSettings;
