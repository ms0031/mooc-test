"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  category: string;
  answers: Array<{
    qid: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    wrongFrequency?: Record<string, number>;
    correctAnswer: string;
  }>;
}

export default function TestResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  useEffect(() => {
    // Get test result from URL params
    const resultData = searchParams.get("result");
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setTestResult(parsedResult);
      } catch (error) {
        console.error("Error parsing test result:", error);
      }
    } else {
      // If no result data, redirect to home
      router.push("/");
    }
  }, [searchParams, router]);

  if (!testResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Results...</h1>
          <p>Please wait while we process your test results.</p>
        </div>
      </div>
    );
  }

  const shareMessage = `I scored ${testResult.score}% on the MOOC Test App!`;
  const encodedMessage = encodeURIComponent(shareMessage);

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/5  px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-200">Test Results</h1>
          </div>

          {/* Result Summary */}
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-24 w-25 rounded-full bg-indigo-100 mb-4">
                <span className="text-3xl font-bold text-slate-700">
                  {testResult.score}%
                </span>
              </div>
              <h2 className="text-xl font-semibold text-teal-500">
                {testResult.score >= 70 ? "Great job!" : "Keep practicing!"}
              </h2>
              <p className="text-gray-300 mt-1">
                You answered {testResult.correctAnswers} out of{" "}
                {testResult.totalQuestions} questions correctly.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-500/15   p-4 rounded-2xl">
                <h3 className="text-sm font-medium text-gray-200">Category</h3>
                <p className="mt-1 text-lg font-semibold text-blue-400 capitalize">
                  {testResult.category || "General"}
                </p>
              </div>
              <div className="bg-blue-500/15  p-4 rounded-2xl">
                <h3 className="text-sm font-medium text-gray-200">
                  Time Taken
                </h3>
                <p className="mt-1 text-lg font-semibold text-blue-400">
                  {Math.floor(testResult.timeTaken / 60)}m{" "}
                  {testResult.timeTaken % 60}s
                </p>
              </div>
              <div className="bg-green-500/20  p-4 rounded-2xl">
                <h3 className="text-sm font-medium text-gray-200">
                  Correct Answers
                </h3>
                <p className="mt-1 text-lg font-semibold text-green-400">
                  {testResult.correctAnswers} (
                  {Math.round(
                    (testResult.correctAnswers / testResult.totalQuestions) *
                      100
                  )}
                  %)
                </p>
              </div>
              <div className="bg-red-500/20  p-4 rounded-2xl">
                <h3 className="text-sm font-medium text-gray-200">
                  Wrong Answers
                </h3>
                <p className="mt-1 text-lg font-semibold text-red-400">
                  {testResult.wrongAnswers} (
                  {Math.round(
                    (testResult.wrongAnswers / testResult.totalQuestions) * 100
                  )}
                  %)
                </p>
              </div>
            </div>

            {/* Guest Prompt */}
            {!session && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-8">
                <h3 className="text-lg font-medium text-indigo-800 mb-2">
                  Save Your Progress
                </h3>
                <p className="text-indigo-600 mb-4">
                  Sign up to save your test results and track your progress over
                  time.
                </p>
                <div className="flex space-x-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Log In
                  </Link>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Back to Home
              </Button>
              {/* <Button
                variant="destructive"
                onClick={() => router.push("/dashboard/wrong-answers")}
              >
                Wrong Answers
              </Button> */}
              <Button
                variant="primary"
                onClick={() => router.push("/test/settings")}
              >
                Take Another Test
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
