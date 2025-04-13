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
    <div className="min-h-screen w-full bg-slate-950 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
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
                <div className="space-y-3 lg:px-0 md:px-0 px-3">
                  <Button
                    variant="primary"
                    className="w-full py-6 text-lg"
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
                <div className="space-y-3 lg:px-0 md:px-0 px-3">
                  <Button
                    variant="cyan"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/dashboard/history")}
                  >
                    Test History
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/dashboard/wrong-answers")}
                  >
                    Wrong Answers
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/profile")}
                  >
                    Edit Profile
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/settings")}
                  >
                    Settings
                  </Button> */}
                  <Button
                    variant="orange"
                    className="w-full py-6 text-[16px]"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 lg:block hidden rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Support & More
                </h2>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/buy-me-a-coffee")}
                  >
                    Buy Me a Coffee
                  </Button>
                  <Button
                    variant="cyan"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/about")}
                  >
                    About 
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/profile")}
                  >
                    Edit Profile
                  </Button> */}
                  <Button
                    variant="cyan"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/faq")}
                  >
                    FAQ 
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/feedback")}
                  >
                    Report an Issue/Bug
                  </Button>
                </div>
              </div>
            </div>


          </div>
          <div className="w-screen h-screen left-0 top-0 absolute opacity-30 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="w-64 h-64 absolute bg-violet-700 rounded-full blur-[200px]" style={{ left: '100px', bottom: '0px' }}></div>
          <div className="w-64 h-64 absolute bg-violet-700 rounded-full blur-[200px]" style={{ left: '700px', bottom: '0px' }}></div>
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
                        className="py-6 text-[16px]"
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

          <div className="bg-white/5 lg:hidden rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
              <div className="p-6 ">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Support & More
                </h2>
                <div className="space-y-3 lg:px-0 md:px-0 px-3">
                  <Button
                    variant="orange"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/buy-me-a-coffee")}
                  >
                    Buy Me a Coffee
                  </Button>
                  <Button
                    variant="cyan"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/about")}
                  >
                    About 
                  </Button>
                  {/* <Button
                    variant="outline"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/profile")}
                  >
                    Edit Profile
                  </Button> */}
                  <Button
                    variant="cyan"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/faq")}
                  >
                    FAQ 
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/feedback")}
                  >
                    Report an Issue/Bug
                  </Button>
                </div>
              </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
