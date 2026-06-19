import { Request, Response } from "express";
import Lead from "../models/Lead.model";
import Activity from "../models/Activity.model";
import FollowUp from "../models/FollowUp.model";
import { AIScoringService } from "../services/aiScoring.service";
import { WhatsAppService } from "../services/whatsapp.service";

export class LeadController {
  /**
   * Create a new Lead.
   */
  static async createLead(req: Request, res: Response) {
    try {
      const {
        name,
        company,
        email,
        mobile,
        source,
        requirement,
        budget,
        assignedTo,
        followUpDate,
        notes,
        avatar,
      } = req.body;

      const assignedToVal = req.user.role === "sales" ? req.user._id : (assignedTo || null);

      // Calculate initial deterministic Local Score instantly (non-blocking)
      const aiScore = AIScoringService.calculateLocalScore({
        budget: budget || 0,
        source: source || "Other",
        requirement: requirement || "",
        activitiesCount: 0,
      });

      // Create lead
      const lead = await Lead.create({
        name,
        company,
        email,
        mobile,
        source: source || "Other",
        requirement,
        budget: budget || 0,
        status: "New",
        assignedTo: assignedToVal,
        followUpDate,
        notes: notes ? (Array.isArray(notes) ? notes : [notes]) : [],
        aiScore,
        avatar: avatar || "",
        companyId: req.user.companyId,
      });

      // Log Lead Created Activity
      await Activity.create({
        leadId: lead._id,
        userId: req.user._id,
        type: "System",
        content: `Lead registered in the system by ${req.user.name}`,
        companyId: req.user.companyId,
      });

      // Recalculate and refine using Gemini API in the background (non-blocking)
      (async () => {
        try {
          const finalScore = await AIScoringService.calculateScore({
            budget: budget || 0,
            source: source || "Other",
            requirement: requirement || "",
            activitiesCount: 0,
          });
          await Lead.findByIdAndUpdate(lead._id, { aiScore: finalScore });
        } catch (error: any) {
          console.error(`Error in background AI score refinement: ${error.message}`);
        }
      })();

      res.status(201).json({
        success: true,
        data: lead,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create lead",
      });
    }
  }

  /**
   * Get all Leads with advanced search, filtration, and pagination.
   */
  static async getLeads(req: Request, res: Response) {
    try {
      const {
        search,
        status,
        source,
        assignedTo,
        startDate,
        endDate,
        page = 1,
        limit = 10,
      } = req.query;

      const query: any = { companyId: req.user.companyId };

      // 1. Text Search Filter (Name, Company, Email, Mobile)
      if (search) {
        const searchRegex = new RegExp(search as string, "i");
        query.$or = [
          { name: searchRegex },
          { company: searchRegex },
          { email: searchRegex },
          { mobile: searchRegex },
        ];
      }

      // 2. Exact Filters
      if (status) {
        query.status = status;
      }
      if (source) {
        query.source = source;
      }
      if (req.user.role === "sales") {
        query.assignedTo = req.user._id;
      } else if (assignedTo) {
        query.assignedTo = assignedTo;
      }

      // 3. Date Range Filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate as string);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate as string);
        }
      }

      // Sorting & Pagination
      const { sortBy = "createdAt", sortOrder = "desc" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const skipNum = (pageNum - 1) * limitNum;

      const sortQuery: any = {};
      const sortField = sortBy === "mobileNumber" ? "mobile" : sortBy === "companyName" ? "company" : sortBy;
      sortQuery[sortField as string] = sortOrder === "asc" ? 1 : -1;

      const total = await Lead.countDocuments(query);
      const leads = await Lead.find(query)
        .populate("assignedTo", "name email role avatar")
        .sort(sortQuery)
        .skip(skipNum)
        .limit(limitNum);

      res.json({
        success: true,
        count: leads.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: leads,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch leads",
      });
    }
  }

  /**
   * Get Lead Details, including activity timeline, followups, and generated WhatsApp link.
   */
  static async getLeadById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lead = await Lead.findById(id).populate("assignedTo", "name email role avatar");
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      if (req.user.role === "sales") {
        const assignedId = lead.assignedTo ? (typeof lead.assignedTo === "object" ? (lead.assignedTo as any)._id : lead.assignedTo) : null;
        if (!assignedId || assignedId.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            error: "You do not have permission to view this lead details",
          });
        }
      }

      // Fetch associated activities and follow-ups
      const activities = await Activity.find({ leadId: lead._id })
        .populate("userId", "name role")
        .sort({ timestamp: -1 });

      const followUps = await FollowUp.find({ leadId: lead._id })
        .populate("userId", "name role")
        .sort({ date: 1 });

      // Generate pre-filled WhatsApp quick communication link
      const whatsappMsg = `Hello ${lead.name}, this is ${req.user.name} from sales. Regarding your request: "${lead.requirement || "lead inquiry"}"...`;
      const whatsappLink = WhatsAppService.generateLink(lead.mobile, whatsappMsg);

      res.json({
        success: true,
        data: {
          lead,
          activities,
          followUps,
          whatsappLink,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch lead details",
      });
    }
  }

  /**
   * Update a Lead. Recalculates AI Lead Score and logs status changes.
   */
  static async updateLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const lead = await Lead.findById(id);
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      if (req.user.role === "sales") {
        const assignedId = lead.assignedTo ? lead.assignedTo.toString() : null;
        if (!assignedId || assignedId !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            error: "You do not have permission to edit this lead",
          });
        }
        // Force assignedTo to remain the logged-in Sales Executive
        updates.assignedTo = req.user._id;
      }

      const originalStatus = lead.status;
      const statusChanged = updates.status && updates.status !== originalStatus;

      // If status changes, log activity
      if (statusChanged) {
        await Activity.create({
          leadId: lead._id,
          userId: req.user._id,
          type: "Status Change",
          content: `Lead pipeline status advanced from '${originalStatus}' to '${updates.status}' by ${req.user.name}`,
          companyId: req.user.companyId,
        });
      }

      // Log note/activity if updates.notes contains new notes
      if (updates.notes && Array.isArray(updates.notes)) {
        const newNotes = updates.notes.filter(
          (note: string) => !lead.notes.includes(note)
        );
        for (const note of newNotes) {
          await Activity.create({
            leadId: lead._id,
            userId: req.user._id,
            type: "Note",
            content: `New note added: "${note}"`,
            companyId: req.user.companyId,
          });
        }
      }

      const budgetChanged = updates.budget !== undefined && Number(updates.budget) !== lead.budget;
      const sourceChanged = updates.source !== undefined && updates.source !== lead.source;
      const requirementChanged = updates.requirement !== undefined && updates.requirement !== lead.requirement;
      const activitiesChanged = statusChanged || (updates.notes && Array.isArray(updates.notes) && updates.notes.filter((note: string) => !lead.notes.includes(note)).length > 0);

      // Instantly assign the local rule-based score if any input changed, avoiding external network bottlenecks
      if (budgetChanged || sourceChanged || requirementChanged || activitiesChanged) {
        const activitiesCount = await Activity.countDocuments({ leadId: lead._id });
        updates.aiScore = AIScoringService.calculateLocalScore({
          budget: updates.budget !== undefined ? Number(updates.budget) : lead.budget,
          source: updates.source || lead.source,
          requirement: updates.requirement !== undefined ? updates.requirement : lead.requirement,
          activitiesCount,
        });
      }

      // Apply updates immediately
      const updatedLead = await Lead.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).populate("assignedTo", "name email role avatar");

      // Refine AI Score in the background asynchronously (non-blocking) if inputs changed
      if (budgetChanged || sourceChanged || requirementChanged || activitiesChanged) {
        (async () => {
          try {
            const activitiesCount = await Activity.countDocuments({ leadId: lead._id });
            const finalScore = await AIScoringService.calculateScore({
              budget: updates.budget !== undefined ? Number(updates.budget) : lead.budget,
              source: updates.source || lead.source,
              requirement: updates.requirement !== undefined ? updates.requirement : lead.requirement,
              activitiesCount,
            });
            await Lead.findByIdAndUpdate(id, { aiScore: finalScore });
          } catch (error: any) {
            console.error(`Error in background AI score update: ${error.message}`);
          }
        })();
      }

      res.json({
        success: true,
        data: updatedLead,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to update lead",
      });
    }
  }

  /**
   * Delete a Lead and clean up its Activities and Follow-ups.
   */
  static async deleteLead(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const lead = await Lead.findById(id);
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      await Lead.findByIdAndDelete(id);
      await Activity.deleteMany({ leadId: id });
      await FollowUp.deleteMany({ leadId: id });

      res.json({
        success: true,
        message: "Lead and all associated timelines/follow-ups deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete lead",
      });
    }
  }
}
