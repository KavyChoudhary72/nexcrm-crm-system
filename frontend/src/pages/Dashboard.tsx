import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { DashboardStats } from "../components/Dashboard/DashboardStats";
import { RevenueChart } from "../components/Dashboard/RevenueChart";
import { LeadSourcePie } from "../components/Dashboard/LeadSourcePie";
import { RecentLeads } from "../components/Dashboard/RecentLeads";
import { LoadingSpinner } from "../components/UI/LoadingSpinner";
import { RefreshCcw, LayoutDashboard } from "lucide-react";
import { Button } from "../components/UI/Button";

export const Dashboard: React.FC = () => {
  const { stats, recentLeads, loading, error, refreshDashboard } = useDashboard();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner label="Compiling live metrics and trends..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-left">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl space-y-3">
          <h4 className="font-extrabold text-red-650 dark:text-red-400 text-sm">Failed to Load Dashboard</h4>
          <p className="text-xs text-red-600 dark:text-red-450">{error}</p>
          <Button size="sm" variant="outline" onClick={refreshDashboard} className="mt-2 text-xs">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left p-1">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
              {user?.companyName ? `${user.companyName} Dashboard` : "Executive Dashboard"}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              Real-time sales pipelines, target metrics, and growth trajectories.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshDashboard}
          className="rounded-xl flex items-center gap-1.5 self-start sm:self-auto min-h-[40px]"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Sync
        </Button>
      </div>

      {stats && (
        <>
          {/* Key Metrics cards */}
          <DashboardStats stats={stats} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart data={stats.monthlyConversions || []} />
            </div>
            <div>
              <LeadSourcePie data={stats.sourceBreakdown || []} />
            </div>
          </div>

          {/* Recent Leads */}
          <RecentLeads leads={recentLeads || []} />
        </>
      )}
    </div>
  );
};
