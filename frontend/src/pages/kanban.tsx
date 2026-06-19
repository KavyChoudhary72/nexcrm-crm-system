import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import type { Lead, LeadStatus, LeadSource } from "../types/crm";
import { SmoothButton } from "../components/shared/MotionCore";
import { leadService } from "../services/leadService";

const PIPELINE_STAGES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

export const Kanban: React.FC = () => {
  const [pipeline, setPipeline] = useState<Record<LeadStatus, Lead[]>>({
    New: [],
    Contacted: [],
    Qualified: [],
    "Proposal Sent": [],
    Negotiation: [],
    Won: [],
    Lost: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadMobile, setNewLeadMobile] = useState("");
  const [newLeadSource, setNewLeadSource] = useState<LeadSource>("Website Forms");
  const [newLeadRequirement, setNewLeadRequirement] = useState("");
  const [newLeadBudget, setNewLeadBudget] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const leads = await leadService.getLeads();
      const newPipeline: Record<LeadStatus, Lead[]> = {
        New: [],
        Contacted: [],
        Qualified: [],
        "Proposal Sent": [],
        Negotiation: [],
        Won: [],
        Lost: [],
      };
      leads.forEach((lead) => {
        if (newPipeline[lead.status]) {
          newPipeline[lead.status].push(lead);
        } else {
          newPipeline["New"].push(lead);
        }
      });
      setPipeline(newPipeline);
    } catch (err: any) {
      console.error("Failed to fetch leads:", err);
      setError(err.message || "Failed to load leads from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleDragResolution = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const departureKey = source.droppableId as LeadStatus;
    const arrivalKey = destination.droppableId as LeadStatus;

    const departureList = [...pipeline[departureKey]];
    const arrivalList =
      departureKey === arrivalKey ? departureList : [...pipeline[arrivalKey]];

    const [displacedItem] = departureList.splice(source.index, 1);
    displacedItem.status = arrivalKey;
    arrivalList.splice(destination.index, 0, displacedItem);

    // Optimistically update the UI pipeline state
    setPipeline({
      ...pipeline,
      [departureKey]: departureList,
      [arrivalKey]: arrivalList,
    });

    try {
      await leadService.updateLeadStatus(displacedItem._id, arrivalKey);
    } catch (err) {
      console.error("Failed to update status on backend, reverting:", err);
      loadLeads(); // Reload state on error to ensure sync
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadMobile) {
      setFormError("Lead Name and Mobile Number are required.");
      return;
    }
    setFormLoading(true);
    setFormError("");

    try {
      const created = await leadService.createLead({
        name: newLeadName,
        companyName: newLeadCompany,
        email: newLeadEmail,
        mobileNumber: newLeadMobile,
        source: newLeadSource,
        requirement: newLeadRequirement,
        budget: newLeadBudget ? parseFloat(newLeadBudget) : 0,
        status: "New",
        notes: [],
      });

      // Update local pipeline
      setPipeline((prev) => ({
        ...prev,
        New: [created, ...prev.New],
      }));

      // Reset state and close modal
      setIsModalOpen(false);
      setNewLeadName("");
      setNewLeadCompany("");
      setNewLeadEmail("");
      setNewLeadMobile("");
      setNewLeadSource("Website Forms");
      setNewLeadRequirement("");
      setNewLeadBudget("");
    } catch (err: any) {
      console.error("Failed to create lead:", err);
      setFormError(err.message || "Failed to create lead.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Leads Pipeline
          </h1>
          <p className="text-sm text-gray-500">
            Drag and move workspace cards to update tracking pipelines.
          </p>
        </div>
        <SmoothButton>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/10 border border-blue-500/20 transition-all"
          >
            Create Lead File
          </button>
        </SmoothButton>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={loadLeads}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Loading leads...</span>
        </div>
      ) : (
        <LayoutGroup>
          <DragDropContext onDragEnd={handleDragResolution}>
            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start custom-scrollbar">
              {PIPELINE_STAGES.map((stage) => (
                <div
                  key={stage}
                  className="w-72 bg-gray-100/80 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800 p-4 rounded-2xl flex flex-col max-h-full shrink-0"
                >
                  <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {stage}
                    </span>
                    <span className="text-xs font-bold bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                      {pipeline[stage]?.length || 0}
                    </span>
                  </div>

                  <Droppable droppableId={stage}>
                    {(provided, dropSnapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[450px] rounded-xl transition-colors duration-200 ${
                          dropSnapshot.isDraggingOver
                            ? "bg-blue-50/20 dark:bg-blue-950/10"
                            : ""
                        }`}
                      >
                        {pipeline[stage]?.map((lead, pos) => (
                          <Draggable
                            key={lead._id}
                            draggableId={lead._id}
                            index={pos}
                          >
                            {(provided, dragSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <motion.div
                                  layoutId={`card-shell-${lead._id}`}
                                  className={`p-4 bg-white dark:bg-gray-800 rounded-xl border transition-shadow ${
                                    dragSnapshot.isDragging
                                      ? "shadow-xl border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/5"
                                      : "shadow-sm border-gray-100 dark:border-gray-700/60"
                                  }`}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 32,
                                  }}
                                >
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">
                                    {lead.name}
                                  </h4>
                                  {lead.companyName && (
                                    <p className="text-xs text-gray-400 font-medium mb-3">
                                      {lead.companyName}
                                    </p>
                                  )}

                                  <div className="flex justify-between items-center mt-3">
                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-[10px] font-semibold">
                                      {lead.source}
                                    </span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        (lead.aiScore ?? 0) >= 70
                                          ? "bg-green-50 dark:bg-green-950/30 text-green-600"
                                          : "bg-red-50 dark:bg-red-950/30 text-red-500"
                                      }`}
                                    >
                                      AI Rank: {lead.aiScore ?? "Pending"}
                                    </span>
                                  </div>
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </LayoutGroup>
      )}

      {/* Creation Modal Slide Over */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Create Lead File
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Enter details to register a new lead in the pipeline.
              </p>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateLead} className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Lead Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company/organization"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@company.com"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +123456789"
                      value={newLeadMobile}
                      onChange={(e) => setNewLeadMobile(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Source */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Lead Source
                    </label>
                    <select
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value as LeadSource)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="Website Forms">Website Forms</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Instagram Ads">Instagram Ads</option>
                      <option value="Referral Sources">Referral Sources</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Estimated Budget (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={newLeadBudget}
                      onChange={(e) => setNewLeadBudget(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Requirement */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requirement Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific details and cloud/integration requirements..."
                    value={newLeadRequirement}
                    onChange={(e) => setNewLeadRequirement(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/80 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/10 transition-colors"
                  >
                    {formLoading && (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    <span>Save Lead</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
