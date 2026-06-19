import { Request, Response } from "express";
import Lead from "../models/Lead.model";

export class DashboardController {
  /**
   * Retrieves dashboard statistics and analytics datasets.
   */
  static async getStats(req: Request, res: Response) {
    try {
      const isSales = req.user.role === "sales";
      const filter: any = { companyId: req.user.companyId };
      if (isSales) {
        filter.assignedTo = req.user._id;
      }

      // 1. Core Metrics Counts
      const totalLeads = await Lead.countDocuments(filter);
      const newLeads = await Lead.countDocuments({ ...filter, status: "New" });
      const wonLeads = await Lead.countDocuments({ ...filter, status: "Won" });
      const lostLeads = await Lead.countDocuments({ ...filter, status: "Lost" });

      // 2. Revenue Generated (Sum of budgets for Won leads)
      let revenueMatch: any = { status: "Won", companyId: req.user.companyId };
      if (isSales) {
        revenueMatch.assignedTo = req.user._id;
      }
      const revenueResult = await Lead.aggregate([
        { $match: revenueMatch },
        { $group: { _id: null, totalRevenue: { $sum: "$budget" } } },
      ]);
      const revenueGenerated = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

      // 3. Stage Breakdown (for Kanban Pipeline analytics)
      const pipelineBreakdown = await Lead.aggregate([
        { $match: filter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      
      const stages = [
        "New",
        "Contacted",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Won",
        "Lost",
      ];
      
      const pipelineStats: Record<string, number> = {};
      stages.forEach((stage) => {
        pipelineStats[stage] = 0;
      });
      pipelineBreakdown.forEach((item) => {
        if (stages.includes(item._id)) {
          pipelineStats[item._id] = item.count;
        }
      });

      // 4. Source Breakdown (for distribution charts)
      const sourceBreakdown = await Lead.aggregate([
        { $match: filter },
        { $group: { _id: "$source", count: { $sum: 1 } } },
      ]);

      // 5. Monthly Conversions & Revenue Trends (Last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
      twelveMonthsAgo.setDate(1);
      twelveMonthsAgo.setHours(0, 0, 0, 0);

      const monthlyConversionsFilter: any = {
        status: "Won",
        updatedAt: { $gte: twelveMonthsAgo },
        companyId: req.user.companyId,
      };
      if (isSales) {
        monthlyConversionsFilter.assignedTo = req.user._id;
      }

      const monthlyConversions = await Lead.aggregate([
        { $match: monthlyConversionsFilter },
        {
          $group: {
            _id: {
              year: { $year: "$updatedAt" },
              month: { $month: "$updatedAt" },
            },
            conversions: { $sum: 1 },
            revenue: { $sum: "$budget" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      res.json({
        success: true,
        data: {
          metrics: {
            totalLeads,
            newLeads,
            wonLeads,
            lostLeads,
            revenueGenerated,
          },
          pipelineStats,
          sourceBreakdown,
          monthlyConversions: monthlyConversions.map((item) => ({
            year: item._id.year,
            month: item._id.month,
            conversions: item.conversions,
            revenue: item.revenue,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to compile dashboard metrics",
      });
    }
  }
}
