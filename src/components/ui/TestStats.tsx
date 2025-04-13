"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TestResultResponse } from "@/types";
import { color } from "chart.js/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestStatsProps {
  results: TestResultResponse[];
}

export default function TestStats({ results }: TestStatsProps) {
  const lastFiveTests = results.slice(0, 5).reverse();

  const chartData = {
    labels: lastFiveTests.map((result, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: "Score (%)",
        data: lastFiveTests.map((result) => result.score),
        backgroundColor: "rgba(45, 212, 191, 0.9)",
        borderRadius: 12,
        maxBarThickness: 70,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Recent Test Performance",
        color: "#fff",
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        display: true, 
        ticks: {
          color: "#e5e7eb",
        },
        grid: {
          display: false, 
        },
      },
    },
  };

  const calculateAverageScore = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(total / results.length);
  };

  const calculateTotalTestsTime = () => {
    return results.reduce((sum, result) => sum + result.timeTaken, 0);
  };
  
  function formatCategoryWithSpaces(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/6 p-4 rounded-2xl shadow">
          <h3 className="text-sm font-medium text-gray-200">Tests Completed</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-300">
            {results.length}
          </p>
        </div>
        <div className="bg-white/6 p-4 rounded-2xl shadow">
          <h3 className="text-sm font-medium text-gray-200">Average Score</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-300">
            {calculateAverageScore()}%
          </p>
        </div>
        <div className="bg-white/6 p-4 rounded-2xl shadow">
          <h3 className="text-sm font-medium text-gray-200">
            Total Time Spent
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-300">
            {Math.round(calculateTotalTestsTime() / 60)} mins
          </p>
        </div>
      </div>

      <div className="bg-white/6 p-6 h-100 rounded-2xl shadow">
        <Bar data={chartData} options={chartOptions} />
      </div>

      
      
      <div className="bg-white/6 rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-500/50">
          <thead className="bg-white/6">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Score
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Questions
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/0 divide-y divide-gray-500/50">
            {results.map((result, index) => (
              <tr key={result._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                  {formatCategoryWithSpaces(result.category)}
                </td>
                <td className={`px-2 my-4 inline-flex text-sm rounded-full ${result.score >= 70 ? 'bg-green-900/30 text-green-400' : result.score >= 40 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
                  {result.score}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {result.correctAnswers}/{result.totalQuestions}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {Math.round(result.timeTaken / 60)} mins
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {new Date(result.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
