"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TestStats from "@/components/ui/TestStats";
import ProgressCharts from "@/components/ui/ProgressCharts";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import type { TestResultResponse } from "@/types";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
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

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress and start new tests below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Options Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Start New Test
                </h2>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push("/test/settings")}
                  >
                    Customize Test
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push("/test?category=psychology")}
                  >
                    Psychology Test
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => router.push("/test?category=learning")}
                  >
                    Learning Theory
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Links
                </h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/history")}
                  >
                    Test History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/wrong-answers")}
                  >
                    Wrong Answers
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    Export as PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/profile")}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/settings")}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Test Statistics
                </h2>
                {testHistory.length > 0 ? (
                  <TestStats results={testHistory} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      You haven't taken any tests yet. Start a test to see your
                      statistics.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => router.push("/test/settings")}
                    >
                      Take Your First Test
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {testHistory.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Your Progress Over Time
                  </h2>
                  <ProgressCharts results={testHistory} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
