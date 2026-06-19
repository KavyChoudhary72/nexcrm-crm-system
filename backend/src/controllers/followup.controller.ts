import { Request, Response } from "express";
import FollowUp from "../models/FollowUp.model";
import Lead from "../models/Lead.model";
import Activity from "../models/Activity.model";

export class FollowUpController {
  /**
   * Create a new Follow-up and update lead's target follow-up date.
   */
  static async createFollowUp(req: Request, res: Response) {
    try {
      const { leadId, title, date, notes } = req.body;

      // Check lead existence
      const lead = await Lead.findById(leadId);
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      if (req.user.role === "sales" && lead.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: "You do not have permission to add followups for this lead",
        });
      }

      // Create followup
      const followUp = await FollowUp.create({
        leadId,
        userId: req.user._id, // Assign to the logged-in user creating it
        title,
        date: new Date(date),
        status: "Pending",
        notes,
        companyId: req.user.companyId,
      });

      // Update lead's main followUpDate property
      lead.followUpDate = new Date(date);
      await lead.save();

      // Log a system activity
      await Activity.create({
        leadId,
        userId: req.user._id,
        type: "System",
        content: `Scheduled follow-up: "${title}" for ${new Date(date).toLocaleString()} by ${req.user.name}`,
        companyId: req.user.companyId,
      });

      res.status(201).json({
        success: true,
        data: followUp,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to create follow-up",
      });
    }
  }

  /**
   * Get all Follow-ups with filters (Pending, Completed, Overdue, Upcoming, Today, Assignee).
   */
  static async getFollowUps(req: Request, res: Response) {
    try {
      const { status, timeframe, assignedTo } = req.query;
      const query: any = { companyId: req.user.companyId };

      if (status) {
        query.status = status;
      }

      if (req.user.role === "sales") {
        query.userId = req.user._id;
      } else if (assignedTo) {
        query.userId = assignedTo;
      }

      const now = new Date();

      if (timeframe === "overdue") {
        query.status = "Pending";
        query.date = { $lt: now };
      } else if (timeframe === "upcoming") {
        query.status = "Pending";
        query.date = { $gte: now };
      } else if (timeframe === "today") {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);
        query.date = { $gte: startOfToday, $lte: endOfToday };
      }

      const followUps = await FollowUp.find(query)
        .populate("leadId", "name company email mobile status")
        .populate("userId", "name role")
        .sort({ date: 1 });

      res.json({
        success: true,
        count: followUps.length,
        data: followUps,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch follow-ups",
      });
    }
  }

  /**
   * Complete a Follow-up, update lead's follow-up state, and log output.
   */
  static async completeFollowUp(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const followUp = await FollowUp.findById(id);
      if (!followUp || followUp.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Follow-up not found",
        });
      }

      if (req.user.role === "sales" && followUp.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: "You do not have permission to complete this follow-up",
        });
      }

      followUp.status = "Completed";
      if (notes) {
        followUp.notes = notes;
      }
      await followUp.save();

      // Log timeline activity
      await Activity.create({
        leadId: followUp.leadId,
        userId: req.user._id,
        type: "Call", // Default outcome category is Call, can be Meeting/Email
        content: `Completed follow-up: "${followUp.title}". Outcome notes: ${notes || "None entered"}`,
        companyId: req.user.companyId,
      });

      // Find the next pending follow-up for this lead to maintain correct lead state
      const nextFollowUp = await FollowUp.findOne({
        leadId: followUp.leadId,
        status: "Pending",
      }).sort({ date: 1 });

      await Lead.findByIdAndUpdate(followUp.leadId, {
        followUpDate: nextFollowUp ? nextFollowUp.date : null,
      });

      res.json({
        success: true,
        data: followUp,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to complete follow-up",
      });
    }
  }
}
