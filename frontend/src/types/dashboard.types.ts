export interface CoreMetrics {
  totalLeads: number;
  newLeads: number;
  wonLeads: number;
  lostLeads: number;
  revenueGenerated: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  conversions: number;
  revenue: number;
}

export interface SourceBreakdown {
  _id: string; // Source name
  count: number;
}

export interface DashboardStats {
  metrics: CoreMetrics;
  pipelineStats: Record<string, number>;
  sourceBreakdown: SourceBreakdown[];
  monthlyConversions: MonthlyTrend[];
}
