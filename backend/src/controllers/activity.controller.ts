import { Request, Response } from "express";
import Activity from "../models/Activity.model";
import Lead from "../models/Lead.model";
import { AIScoringService } from "../services/aiScoring.service";

export class ActivityController {
  /**
   * Log a manual timeline activity (Call, Meeting, Email, Note) and update AI score.
   */
  static async addActivityNote(req: Request, res: Response) {
    try {
      const { id } = req.params; // Lead ID
      const { type, content } = req.body;

      const lead = await Lead.findById(id);
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      // Create activity log
      const activity = await Activity.create({
        leadId: lead._id,
        userId: req.user._id,
        type,
        content,
        companyId: req.user.companyId,
      });

      // Recalculate local score instantly and update lead
      const activitiesCount = await Activity.countDocuments({ leadId: lead._id });
      const localScore = AIScoringService.calculateLocalScore({
        budget: lead.budget,
        source: lead.source,
        requirement: lead.requirement,
        activitiesCount,
      });

      lead.aiScore = localScore;
      await lead.save();

      // Refine AI Lead Score based on updated activities count in the background (non-blocking)
      (async () => {
        try {
          const finalScore = await AIScoringService.calculateScore({
            budget: lead.budget,
            source: lead.source,
            requirement: lead.requirement,
            activitiesCount,
          });
          await Lead.findByIdAndUpdate(lead._id, { aiScore: finalScore });
        } catch (error: any) {
          console.error(`Error in background AI score update on activity add: ${error.message}`);
        }
      })();

      res.status(201).json({
        success: true,
        data: activity,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to log activity",
      });
    }
  }

  /**
   * Retrieve all activity history for a specific lead.
   */
  static async getLeadActivities(req: Request, res: Response) {
    try {
      const { id } = req.params; // Lead ID

      const lead = await Lead.findById(id);
      if (!lead || lead.companyId.toString() !== req.user.companyId.toString()) {
        return res.status(404).json({
          success: false,
          error: "Lead not found",
        });
      }

      const activities = await Activity.find({ leadId: id })
        .populate("userId", "name role")
        .sort({ timestamp: -1 });

      res.json({
        success: true,
        count: activities.length,
        data: activities,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to fetch activities",
      });
    }
  }
}
