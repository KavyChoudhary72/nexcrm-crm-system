import React from "react";
import { DollarSign, Users, Award, Calendar } from "lucide-react";
import { DashboardStats as StatsType } from "../../types/dashboard.types";
import { StatCard } from "./StatCard";
import { formatCurrency } from "../../utils/formatters";

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const { metrics } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue Generated"
        value={formatCurrency(metrics.revenueGenerated)}
        icon={<DollarSign className="w-5 h-5" />}
        trend="+14.2%"
        trendType="up"
      />
      <StatCard
        title="Total Leads Tracked"
        value={metrics.totalLeads}
        icon={<Users className="w-5 h-5" />}
        trend="+8.1%"
        trendType="up"
      />
      <StatCard
        title="New Lead Pipeline"
        value={metrics.newLeads}
        icon={<Calendar className="w-5 h-5" />}
        trend="-2.4%"
        trendType="down"
      />
      <StatCard
        title="Deals Won"
        value={metrics.wonLeads}
        icon={<Award className="w-5 h-5" />}
        trend="+18.5%"
        trendType="up"
      />
    </div>
  );
};
