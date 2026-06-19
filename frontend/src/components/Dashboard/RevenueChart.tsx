import React from "react";
import { Line } from "react-chartjs-2";
import { MonthlyTrend } from "../../types/dashboard.types";
import { formatCurrency } from "../../utils/formatters";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: MonthlyTrend[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const chartLabels = sortedData.map((item) => `${monthNames[item.month - 1]} ${item.year.toString().slice(-2)}`);
  const chartDataValues = sortedData.map((item) => item.revenue);

  const chartData = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Data"],
    datasets: [
      {
        label: "Revenue Generated",
        data: chartDataValues.length > 0 ? chartDataValues : [0],
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.05)",
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: "rgb(37, 99, 235)",
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Revenue: ${formatCurrency(context.raw || 0)}`,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(156, 163, 175, 0.08)",
        },
        ticks: {
          callback: (value: any) => `₹${value >= 1000 ? (value / 1000).toFixed(0) + "k" : value}`,
          font: { size: 10 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-3xl shadow-sm h-80 flex flex-col justify-between">
      <div className="mb-4 text-left">
        <h4 className="font-bold text-gray-800 dark:text-white text-sm">
          Revenue Growth Trends
        </h4>
        <p className="text-xs text-gray-400">Monthly gross revenue from won pipelines.</p>
      </div>
      <div className="flex-1 relative min-h-0">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
