"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { TestResultResponse } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressChartsProps {
  results: TestResultResponse[];
}

/**
 * ProgressCharts component for visualizing test progress over time
 * Implements FR014 - Progress Over Time requirement
 */
export default function ProgressCharts({ results }: ProgressChartsProps) {
  // Sort results by date
  const sortedResults = [...results].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Group results by month for trend analysis
  const resultsByMonth = sortedResults.reduce((acc, result) => {
    const date = new Date(result.createdAt);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    
    acc[monthYear].push(result);
    return acc;
  }, {} as Record<string, TestResultResponse[]>);

  // Calculate average scores by month for line chart
  const months = Object.keys(resultsByMonth);
  const averageScores = months.map(month => {
    const monthResults = resultsByMonth[month];
    const total = monthResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / monthResults.length);
  });

  // Line chart data for score trends over time
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Average Score (%)',
        data: averageScores,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Score Trends Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  // Group results by category for pie chart
  const resultsByCategory = sortedResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, TestResultResponse[]>);

  // Calculate average scores by category for pie chart
  const categories = Object.keys(resultsByCategory);
  const categoryAverages = categories.map(category => {
    const categoryResults = resultsByCategory[category];
    const total = categoryResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / categoryResults.length);
  });

  // Pie chart data for topic-wise performance
  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Average Score',
        data: categoryAverages,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance by Category',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Score Trends Over Time</h2>
        {months.length > 1 ? (
          <Line data={lineChartData} options={lineChartOptions} />
        ) : (
          <p className="text-gray-500 text-center py-8">
            Not enough data to show trends. Take more tests over time to see your progress.
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Performance by Category</h2>
        {categories.length > 0 ? (
          <div className="max-w-md mx-auto">
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No category data available. Take tests in different categories to see your performance.
          </p>
        )}
      </div>
    </div>
  );
}