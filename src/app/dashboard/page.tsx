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
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-200">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="mt-2 text-gray-400">
            Track your progress and start new tests below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Options Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
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
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
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
                    variant="destructive"
                    className="w-full"
                    onClick={() => router.push("/dashboard/wrong-answers")}
                  >
                    Wrong Answers
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
          <div className="w-[1440px] h-[900px] left-0 top-0 absolute opacity-30">
        <div className="w-[675px] h-80 left-[202px] top-[790px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
        <div className="w-[675px] h-80 left-[800px] top-[840px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
      </div>
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-6">
                  Your Test Statistics
                </h2>
                {testHistory.length > 0 ? (
                  <TestStats results={testHistory} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
