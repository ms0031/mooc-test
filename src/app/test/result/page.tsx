"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Fireworks } from "@fireworks-js/react";

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  category: string;
  answers: Array<{
    qid: string;
    question?: string; // Added question field
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
  const isPerfectScore = testResult?.score === 100;

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

  function formatCategoryWithSpaces(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      {isPerfectScore && (
        <Fireworks
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
          }}
          options={{
            autoresize: true,
            opacity: 1,
            acceleration: 1.02,
            friction: 0.97,
            gravity: 1.5,
            particles: 60,
            traceLength: 1,
            traceSpeed: 2,
            explosion: 5,
            intensity: 30,
            flickering: 50,
            lineStyle: "round",
            hue: {
              min: 0,
              max: 360,
            },
            delay: {
              min: 30,
              max: 60,
            },
            rocketsPoint: {
              min: 50,
              max: 50,
            },
            lineWidth: {
              explosion: {
                min: 1,
                max: 10,
              },
              trace: {
                min: 1,
                max: 2,
              },
            },
            brightness: {
              min: 50,
              max: 100,
            },
            decay: {
              min: 0.015,
              max: 0.03,
            },
          }}
        />
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[15px] shadow-xl rounded-2xl overflow-hidden">
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
                  {formatCategoryWithSpaces(testResult.category) || "General"}
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

            {/* Wrong Answers Dropdown */}
            <div className="mb-8">
              <details className="bg-purple-500/10 p-4 rounded-2xl">
                <summary className="text-lg font-medium text-gray-200 cursor-pointer flex items-center justify-between">
                  <span>Wrong Answers</span>
                  <span className="text-sm bg-red-500/30 px-2 py-1 rounded-lg">
                    {testResult.wrongAnswers} Questions
                  </span>
                </summary>
                
                {session ? (
                  <div className="mt-4 space-y-4">
                    {testResult.answers.filter(answer => !answer.isCorrect).map((answer, index) => (
                      <div key={index} className="bg-white/4 outline-2 outline-offset-[-1px] outline-white/5 p-4 rounded-xl">
                        <p className="text-gray-300 mb-2 font-medium">Question {index + 1}</p>
                        {answer.question && (
                          <p className="text-gray-200 mb-3 border-l-2 border-purple-400 pl-3">{answer.question}</p>
                        )}
                        <div className="mb-3">
                          <div className="flex items-start mb-2">
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded mr-2 text-xs">Your Answer</span>
                            <p className="text-red-300">{answer.userAnswer}</p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded mr-2 text-xs">Correct Answer</span>
                            <p className="text-green-300">{answer.correctAnswer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 bg-indigo-900/30 p-4 rounded-2xl text-center">
                    <p className="text-indigo-300 mb-3">Sign in to view your wrong answers.</p>
                    {/* <div className="flex space-x-3 justify-center">
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
                    </div> */}
                  </div>
                )}
              </details>
            </div>

            {/* Guest Prompt */}
            {!session && (
              <div className="bg-indigo-50/75 p-4 rounded-2xl border border-indigo-100 mb-8">
                <h3 className="text-lg font-medium text-indigo-700 mb-2">
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
                onClick={() => router.push(`${session ? "/dashboard" : "/"}`)}
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
