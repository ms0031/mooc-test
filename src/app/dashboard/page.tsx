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
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import type { TestResultResponse } from "@/types";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Dashboard() {
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

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
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
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-200">
            Welcome back, <span className="text-teal-500">{session?.user?.name}!</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Track your progress and start new tests below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Options Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="w-11/12 mx-auto bg-white/2 rounded-4xl backdrop-blur-3xl border border-white/15 overflow-hidden">
              <div className="p-6">
                <h2 className="text-center text-xl font-semibold text-gray-200 mb-2">
                  Start New Test
                    </h2>
                    <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
                <div className="space-y-3 flex flex-col items-center">
                  <Button
                    variant="glass"
                    className="py-6 px-10 text-lg"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/test/settings', {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}
                    size={"round"}
                  >
                    Customize Test
                  </Button>
                  <Button
                    variant="glass"
                    className="py-6 px-10 text-lg"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/test/real-test", {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}  
                    size={"round"}
                  >
                   Exam Mode
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-11/12 mx-auto bg-white/2 rounded-4xl backdrop-blur-3xl border border-white/15 overflow-hidden">
              <div className="p-6">
                <h2 className="text-center text-xl font-semibold text-gray-200 mb-2">
                  Quick Links
                    </h2>
                    <div className="h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
                <div className="space-y-3 flex flex-col items-center">
                <Button
                    variant="glass"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/dashboard/study", {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}
                        size={"round"}
                  >
                    Study Materials
                      </Button>
                      <Button
                    variant="glass"
                    className="px-10 py-6 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/dashboard/bookmarks", {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}
                         size={"round"}
                  >
                    Bookmarks
                  </Button>
                  <Button
                    variant="glassTeal"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/dashboard/history", {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}
                        size={"round"}
                  >
                    Test History
                  </Button>
                  <Button
                    variant="glassRed"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/dashboard/wrong-answers", {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                        }}
                        size={"round"}
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
                  {/* <Button
                    variant="orange"
                    className="w-full py-6 text-[16px]"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button> */}
                </div>
              </div>
            </div>

            <div className="w-11/12 mx-auto bg-white/2 lg:block hidden rounded-4xl backdrop-blur-3xl border border-white/15 overflow-hidden">
              <div className="p-6">
                <h2 className="text-center text-xl font-semibold text-gray-200 mb-2">
                Support & More
                    </h2>
                <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
                <div className="space-y-3 flex flex-col items-center">
                  {/* <Button
                    variant="primary"
                    className="w-full py-6 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/buy-me-a-coffee", {
                        onTransitionReady: () => pageAnimation('left'),
                      })
                    }}
                  >
                    Buy Me a Coffee
                  </Button> */}
                  <Button
                    variant="glass"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/about", {
                        onTransitionReady: () => pageAnimation('left'),
                      })
                        }}
                        size={"round"}
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
                    variant="glass"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/faq", {
                        onTransitionReady: () => pageAnimation('left'),
                      })
                        }}
                        size={"round"}
                  >
                    FAQ 
                  </Button>
                  <Button
                    variant="glassRed"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/feedback", {
                      onTransitionReady: () => pageAnimation('left'),
                      });
                    }}
                    size={"round"}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bug mr-2"
                    viewBox="0 0 16 16"
                  >
                  <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                  </svg>
                Report Bug
              </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/2 rounded-4xl backdrop-blur-3xl border border-white/15 overflow-hidden">
              <div className="p-6">
                <h2 className="text-center text-xl font-semibold text-gray-200 mb-2">
                  Your Test Statistics
                    </h2>
                <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-6 mx-auto"></div>
                {testHistory.length > 0 ? (
                  <TestStats statsDisplay={true} results={testHistory} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-300 mb-4">
                      You haven't taken any tests yet. Start a test to see your
                      statistics.
                    </p>
                      <Button
                        className="py-6 text-[16px]"
                        variant="glassTeal"
                        onClick={() => router.push("/test/settings")}
                        size={"round"}
                    >
                      Take Your First Test
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-11/12 mx-auto bg-white/2 lg:hidden rounded-4xl backdrop-blur-3xl border border-white/15 overflow-hidden">
              <div className="p-6 ">
                <h2 className="text-center text-xl font-semibold text-gray-200 mb-2">
                Support & More
                  </h2>
                <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
                <div className="space-y-3 flex flex-col items-center">
                  {/* <Button
                    variant="orange"
                    className="w-full py-6 text-[16px]"
                    onClick={() => router.push("/buy-me-a-coffee")}
                  >
                    Buy Me a Coffee
                  </Button> */}
                  <Button
                    variant="glass"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/about", {
                        onTransitionReady: () => pageAnimation('left'),
                      })
                      }}
                    size={"round"}
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
                    variant="glass"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push("/faq", {
                        onTransitionReady: () => pageAnimation('left'),
                      })
                      }}
                    size={"round"}
                  >
                    FAQ 
                  </Button>
                  <Button
                    variant="glassRed"
                    className="py-6 px-10 text-[16px]"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/feedback", {
                      onTransitionReady: () => pageAnimation('left'),
                      });
                    }}
                    size={"round"}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-bug mr-2"
                    viewBox="0 0 16 16"
                  >
                  <path d="M4.355.522a.5.5 0 0 1 .623.333l.291.956A5 5 0 0 1 8 1c1.007 0 1.946.298 2.731.811l.29-.956a.5.5 0 1 1 .957.29l-.41 1.352A5 5 0 0 1 13 6h.5a.5.5 0 0 0 .5-.5V5a.5.5 0 0 1 1 0v.5A1.5 1.5 0 0 1 13.5 7H13v1h1.5a.5.5 0 0 1 0 1H13v1h.5a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 1 1-1 0v-.5a.5.5 0 0 0-.5-.5H13a5 5 0 0 1-10 0h-.5a.5.5 0 0 0-.5.5v.5a.5.5 0 1 1-1 0v-.5A1.5 1.5 0 0 1 2.5 10H3V9H1.5a.5.5 0 0 1 0-1H3V7h-.5A1.5 1.5 0 0 1 1 5.5V5a.5.5 0 0 1 1 0v.5a.5.5 0 0 0 .5.5H3c0-1.364.547-2.601 1.432-3.503l-.41-1.352a.5.5 0 0 1 .333-.623M4 7v4a4 4 0 0 0 3.5 3.97V7zm4.5 0v7.97A4 4 0 0 0 12 11V7zM12 6a4 4 0 0 0-1.334-2.982A3.98 3.98 0 0 0 8 2a3.98 3.98 0 0 0-2.667 1.018A4 4 0 0 0 4 6z"/>
                  </svg>
                Report Bug
              </Button>
                </div>
              </div>
          </div>
          
        </div>
      </div>
      </div>
      </div>
      </main>
  );
}
