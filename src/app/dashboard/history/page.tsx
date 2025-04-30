"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import type { TestResultResponse } from "@/types";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
export default function TestHistoryPage() {
  const { data: session, status } = useSession();
  const router = useTransitionRouter();
  const [testHistory, setTestHistory] = useState<TestResultResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTestHistory();
    }
  }, [status, router]);

  const fetchTestHistory = async () => {
    try {
      const response = await fetch("/api/test-results");
      if (!response.ok) {
        throw new Error("Failed to fetch test history");
      }
      const data = await response.json();
      setTestHistory(data.results);
    } catch (error) {
      setError("Failed to load test history. Please try again.");
      console.error("Error fetching test history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  function formatCategoryWithSpaces(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">
              Test History
            </h1>
            <p className="mt-2 text-gray-300">
              View your past test attempts and track your progress over time.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                router.push('/dashboard', {
                  onTransitionReady: () => pageAnimation('left'),
                })
              }}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {testHistory.length === 0 ? (
          <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              You haven't taken any tests yet. Complete some tests to see your history.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/test/settings")}
            >
              Take a Test
            </Button>
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/70">
                <thead className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Questions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Correct
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                      Time Taken
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  x] divide-y divide-gray-200/30">
                  {testHistory.map((test) => (
                    <tr key={test._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(test.createdAt.toString())}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {formatCategoryWithSpaces(test.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${test.score >= 70 ? 'bg-green-900/30 text-green-400' : test.score >= 40 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-red-900/30 text-red-400'}`}>
                          {test.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {test.totalQuestions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {test.correctAnswers} / {test.totalQuestions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatTime(test.timeTaken)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}