"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import TestStats from "@/components/ui/TestStats";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import type { TestResultResponse } from "@/types";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

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
    <main className="min-h-screen relative">
          <BackgroundGradientAnimation 
                  gradientBackgroundStart="rgb(2, 6, 23)" 
                  gradientBackgroundEnd="rgb(2, 6, 23)" 
                  firstColor="20, 90, 100"       // Darkest Teal
                  secondColor="50, 40, 130"      // Deep Indigo
                  thirdColor="80, 60, 110"       // Muted Purple
                  fourthColor="30, 80, 70"       // Forest Green
                  fifthColor="120, 80, 40"       // Muted Amber
                  interactive={false}
                  containerClassName="fixed inset-0 -z-10"
            />
    <div className="relative z-10">
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-200 mb-4">
              Test History
              </h1>
              <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
            <p className="text-center text-gray-300">
              View your past test attempts and track your progress over time.
            </p>
        </div>

        {testHistory.length === 0 ? (
          <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden rounded-3xl shadow-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              You haven't taken any tests yet. Complete some tests to see your history.
            </p>
            <Button
              variant="glass"
                  onClick={() => router.push("/test/settings")}
                  size={"round"}
            >
              Take a Test
            </Button>
          </div>
        ) : (
          <div className="p-2 overflow-hidden">
              <TestStats statsDisplay={false} results={testHistory} />
            <div className="my-8 rounded-2xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/70">
                <thead className="bg-white/5  outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px]">
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
                <tbody className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] divide-y divide-gray-200/30">
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
        </div>
    </main>
  );
}