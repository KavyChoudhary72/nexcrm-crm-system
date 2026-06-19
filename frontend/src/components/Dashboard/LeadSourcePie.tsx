import React from "react";
import { Doughnut } from "react-chartjs-2";
import { SourceBreakdown } from "../../types/dashboard.types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LeadSourcePieProps {
  data: SourceBreakdown[];
}

export const LeadSourcePie: React.FC<LeadSourcePieProps> = ({ data }) => {
  const chartLabels = data.map((item) => item._id || "Other");
  const chartValues = data.map((item) => item.count);

  const colors = [
    "rgba(37, 99, 235, 0.85)",  // Website Forms - Blue
    "rgba(16, 185, 129, 0.85)", // WhatsApp - Green
    "rgba(99, 102, 241, 0.85)", // Facebook Ads - Indigo
    "rgba(236, 72, 153, 0.85)", // Instagram Ads - Pink
    "rgba(139, 92, 246, 0.85)", // Referral Sources - Violet
    "rgba(107, 114, 128, 0.85)", // Other - Gray
  ];

  const borderColors = [
    "rgb(37, 99, 235)",
    "rgb(16, 185, 129)",
    "rgb(99, 102, 241)",
    "rgb(236, 72, 153)",
    "rgb(139, 92, 246)",
    "rgb(107, 114, 128)",
  ];

  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        data: chartValues.length > 0 ? chartValues : [1],
        backgroundColor: chartValues.length > 0 ? colors.slice(0, chartValues.length) : ["rgba(156, 163, 175, 0.1)"],
        borderColor: chartValues.length > 0 ? borderColors.slice(0, chartValues.length) : ["rgb(156, 163, 175)"],
        borderWidth: 1.5,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 10,
          font: { size: 10 },
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-sm h-80 flex flex-col justify-between">
      <div className="mb-2 text-left">
        <h4 className="font-bold text-gray-800 dark:text-white text-sm">
          Lead Origin Distribution
        </h4>
        <p className="text-xs text-gray-400">Total pipeline breakdown by lead source.</p>
      </div>
      <div className="flex-1 relative min-h-0 py-2">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};
