import React, { useState } from "react";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { Select } from "../UI/Select";
import { MessageSquare, Mail, Brain, ShieldCheck, HelpCircle } from "lucide-react";

export const IntegrationSettings: React.FC = () => {
  const [waKey, setWaKey] = useState("api_wa_live_7d8d21c3fa6");
  const [waEnabled, setWaEnabled] = useState(true);
  const [smtpServer, setSmtpServer] = useState("smtp.postmarkapp.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [emailEnabled, setEmailEnabled] = useState(false);
  
  const [aiThreshold, setAiThreshold] = useState("70");
  const [aiModel, setAiModel] = useState("gemini-2.5-flash");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left">
      {/* WhatsApp Section */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            <div>
              <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                WhatsApp Cloud API
              </h5>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Direct Client Engagement
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={waEnabled}
              onChange={(e) => setWaEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {waEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="WhatsApp Business Token"
              type="password"
              value={waKey}
              onChange={(e) => setWaKey(e.target.value)}
              placeholder="e.g. EAAG..."
            />
            <Input
              label="Sender Phone Number ID"
              placeholder="e.g. 106981292025110"
              defaultValue="106981292025110"
            />
          </div>
        )}
      </div>

      {/* Email Integration */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                Mail SMTP Relay
              </h5>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Outbound reminders & newsletters
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {emailEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="SMTP Server"
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
            />
            <Input
              label="SMTP Port"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
            />
            <Input
              label="Sender Address"
              placeholder="crm@company.com"
              defaultValue="crm@company.com"
            />
          </div>
        )}
      </div>

      {/* AI Lead Engine */}
      <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-gray-50 dark:border-slate-850 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            <div>
              <h5 className="font-bold text-gray-900 dark:text-white text-sm">
                AI Agent Pipeline
              </h5>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                Automatic Lead Scoring & Profiling
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50">
            Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Generative Model Engine"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            options={[
              { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Default)" },
              { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Precision)" },
              { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
            ]}
          />
          <Input
            label="Hot Lead Score Threshold (%)"
            type="number"
            min="1"
            max="100"
            value={aiThreshold}
            onChange={(e) => setAiThreshold(e.target.value)}
            icon={<HelpCircle className="w-4 h-4 text-gray-400" />}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs text-green-500 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
        </div>
        <Button type="submit" loading={saving}>
          Save Integration Config
        </Button>
      </div>
    </form>
  );
};
