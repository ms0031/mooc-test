"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import WrongAnswersCollection from "@/components/ui/WrongAnswersCollection";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import type { TestResultResponse } from "@/types";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
export default function WrongAnswersPage() {
  const { data: session, status } = useSession();
  const router = useTransitionRouter();
  const [testResults, setTestResults] = useState<TestResultResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTestResults();
    }
  }, [status, router]);

  const fetchTestResults = async () => {
    try {
      const response = await fetch("/api/test-results");
      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }
      const data = await response.json();
      setTestResults(data.results);
    } catch (error) {
      setError("Failed to load test results. Please try again.");
      console.error("Error fetching test results:", error);
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-200">
              Wrong Answers Collection
            </h1>
            <p className="mt-2 text-gray-400">
              Review your frequently incorrect answers to focus on improvement.
            </p>
          </div>
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

        {testResults.length === 0 ? (
          <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden rounded-2xl shadow-lg p-6 text-center">
            <p className="text-gray-300 mb-4">
              You haven't taken any tests yet. Complete some tests to see your wrong answers collection.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push("/test/settings")}
            >
              Take a Test
            </Button>
          </div>
        ) : (
          <div className="bg-white/0 rounded-lg shadow-lg overflow-hidden">
            <WrongAnswersCollection testResults={testResults} />
          </div>
        )}
      </div>
    </div>
  );
}