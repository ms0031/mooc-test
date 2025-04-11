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
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Test Results</h1>
          </div>

          {/* Result Summary */}
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100 mb-4">
                <span className="text-3xl font-bold text-indigo-600">
                  {testResult.score}%
                </span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {testResult.score >= 70 ? "Great job!" : "Keep practicing!"}
              </h2>
              <p className="text-gray-500 mt-1">
                You answered {testResult.correctAnswers} out of{" "}
                {testResult.totalQuestions} questions correctly.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                  {testResult.category || "General"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Time Taken
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {Math.floor(testResult.timeTaken / 60)}m{" "}
                  {testResult.timeTaken % 60}s
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Correct Answers
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {testResult.correctAnswers} ({Math.round((testResult.correctAnswers / testResult.totalQuestions) * 100)}%)
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Wrong Answers
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {testResult.wrongAnswers} ({Math.round((testResult.wrongAnswers / testResult.totalQuestions) * 100)}%)
                </p>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Share Your Results
              </h3>
              <div className="flex space-x-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodedMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#1DA1F2] hover:bg-opacity-90"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodedMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0077B5] hover:bg-opacity-90"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodedMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#25D366] hover:bg-opacity-90"
                >
                  WhatsApp
                </a>
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
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
              <Button
                variant="primary"
                onClick={() => router.push("/test")}
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