import React, { useState, useEffect } from "react";
import { Lead, LeadSource, LeadStatus } from "../../types/lead.types";
import { User } from "../../types/user.types";
import { userService } from "../../services/user.service";
import { LEAD_SOURCES, PIPELINE_STAGES } from "../../utils/constants";
import { Input } from "../UI/Input";
import { Select } from "../UI/Select";
import { Button } from "../UI/Button";
import { useAuth } from "../../hooks/useAuth";
import { UserAvatar } from "../Common/UserAvatar";

interface LeadFormProps {
  initialValues?: Lead;
  onSubmit: (values: any) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Lead",
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [name, setName] = useState(initialValues?.name || "");
  const [companyName, setCompanyName] = useState(initialValues?.companyName || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [mobileNumber, setMobileNumber] = useState(initialValues?.mobileNumber || "");
  const [source, setSource] = useState<LeadSource>(initialValues?.source || "Website Forms");
  const [requirement, setRequirement] = useState(initialValues?.requirement || "");
  const [budget, setBudget] = useState(initialValues?.budget?.toString() || "");
  const [status, setStatus] = useState<LeadStatus>(initialValues?.status || "New");
  const [assignedTo, setAssignedTo] = useState<string>(() => {
    if (!initialValues?.assignedTo) return "";
    return typeof initialValues.assignedTo === "object"
      ? initialValues.assignedTo._id
      : initialValues.assignedTo;
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState(initialValues?.avatar || "");

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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setLoadingUsers(false);
        return;
      }
      setLoadingUsers(true);
      try {
        const list = await userService.getUsers();
        setUsers(list);
      } catch (err) {
        console.error("Failed to load users for assignment:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobileNumber) {
      setError("Name and Mobile Number are required");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        name,
        companyName,
        email,
        mobileNumber,
        source,
        requirement,
        budget: budget ? parseFloat(budget) : 0,
        status,
        assignedTo: isAdmin ? (assignedTo || null) : (user?._id || null),
        avatar,
      };
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || "Failed to submit lead");
    } finally {
      setSubmitting(false);
    }
  };

  const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: s }));
  const statusOptions = PIPELINE_STAGES.map((s) => ({ value: s, label: s }));
  const userOptions = [{ value: "", label: "Unassigned" }].concat(
    users.map((u) => ({ value: u._id, label: `${u.name} (${u.role})` }))
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-left">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-slate-800/60">
        <UserAvatar name={name || "Lead"} avatar={avatar} size="lg" className="w-16 h-16 rounded-2xl" />
        <div className="space-y-1 text-left">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
            Lead Avatar Picture
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-violet-55 dark:file:bg-violet-950/20 file:text-violet-600 dark:file:text-violet-400 file:cursor-pointer hover:file:opacity-90"
          />
        </div>
      </div>

      <Input
        label="Lead Name *"
        placeholder="Enter lead name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <Input
        label="Company Name"
        placeholder="Enter organization"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mobile Number *"
          placeholder="Phone number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Lead Source"
          value={source}
          onChange={(e) => setSource(e.target.value as LeadSource)}
          options={sourceOptions}
        />
        <Input
          label="Est. Budget (₹)"
          type="number"
          placeholder="Budget amount"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Pipeline Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          options={statusOptions}
        />
        {isAdmin && (
          <Select
            label="Assigned Executive"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            options={userOptions}
            disabled={loadingUsers}
          />
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block px-1">
          Requirement Notes
        </label>
        <textarea
          rows={3}
          placeholder="Provide specific notes and cloud configurations..."
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-800">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
