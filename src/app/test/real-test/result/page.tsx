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
  marksScored: number;
  totalMarks: number;
  normalizedScore: number;
}

interface TestAnswer {
  qid: string;
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  correctAnswer: string;
}

export default function RealTestResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<TestAnswer[]>([]);

  const isPerfectScore = testResult?.score === 100;

  useEffect(() => {
    // Get test result from URL params
    const resultData = searchParams.get("result");
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setTestResult(parsedResult);

        // Get wrong answers from cookies
        getWrongAnswersFromCookies();
      } catch (error) {
        console.error("Error parsing test result:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  // Function to get wrong answers from cookies
  const getWrongAnswersFromCookies = () => {
    try {
      const wrongAnswersCookie = localStorage.getItem('realTestWrongAnswers');
      if (wrongAnswersCookie) {
        const parsedWrongAnswers = JSON.parse(wrongAnswersCookie);
        setWrongAnswers(parsedWrongAnswers);
      }
    } catch (error) {
      console.error("Error retrieving wrong answers from cookies:", error);
    }
  };

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }

  function getGrade(normalizedScore: number): string {
    if (normalizedScore >= 90) return "A+";
    if (normalizedScore >= 80) return "A";
    if (normalizedScore >= 70) return "B";
    if (normalizedScore >= 60) return "C";
    if (normalizedScore >= 50) return "D";
    if (normalizedScore >= 40) return "E";
    return "F";
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
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
            traceSpeed: 10,
            explosion: 5,
            intensity: 30,
            flickering: 50,
            lineStyle: "round",
            hue: {
              min: 0,
              max: 360,
            },
            delay: {
              min: 20,
              max: 60,
            },
            rocketsPoint: {
              min: 0,
              max: 100,
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
        <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[15px] shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-200">Real Test Results</h1>
          </div>

          {/* Score Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="text-center">
              <div className="text-6xl font-bold text-indigo-500 mb-2">
                {getGrade(testResult.normalizedScore)}
              </div>
              <p className="text-gray-400 text-sm">
                Total Score ({testResult.marksScored}/{testResult.totalMarks} marks)
              </p>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 gap-4 p-6">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Questions</div>
              <div className="text-2xl font-semibold text-gray-200">
                {testResult.totalQuestions}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Time Taken</div>
              <div className="text-2xl font-semibold text-gray-200">
                {formatTime(testResult.timeTaken)}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Correct Answers</div>
              <div className="text-2xl font-semibold text-green-500">
                {testResult.correctAnswers}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-gray-400 text-sm mb-1">Normalized Score</div>
              <div className="text-2xl font-semibold text-indigo-500">
                {testResult.normalizedScore}
              </div>
            </div>
          </div>
          {/* Score Breakdown */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-200 mb-3">Score Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Test Score (100)</span>
                    <span className="text-gray-300">{testResult.score}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: `${testResult.score}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Assignment (25)</span>
                    <span className="text-gray-300">25</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    (Assuming full marks in assignment)
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300 font-medium">Total Normalized Score</span>
                    <span className="text-gray-300 font-medium">{testResult.normalizedScore}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full"
                      style={{ width: `${testResult.normalizedScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wrong Answers Section */}
            {wrongAnswers.length > 0 && (
              <div className="mt-8">
                <details className="bg-purple-500/12 p-4 rounded-2xl">
                  <summary className="text-lg font-medium text-gray-200 cursor-pointer flex items-center justify-between">
                    <span>Wrong Answers</span>
                    <div className="flex items-center">
                      <span className="text-sm bg-red-500/30 px-2 py-1 rounded-lg mr-2">
                        {wrongAnswers.length} Questions
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="mt-4 space-y-4">
                    {wrongAnswers.map((answer, index) => (
                      <div key={index} className="bg-white/4 p-4 rounded-xl">
                        <p className="text-gray-300 mb-2 font-medium">
                          Question {index + 1}
                        </p>
                        <p className="text-gray-200 mb-3 border-l-2 border-purple-400 pl-3">
                          {answer.question}
                        </p>
                        <div className="mb-3">
                          <div className="flex items-start mb-2">
                            <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded mr-2 text-xs">
                              Your Answer
                            </span>
                            <p className="text-red-400">{answer.userAnswer}</p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded mr-2 text-xs">
                              Correct Answer
                            </span>
                            <p className="text-green-400">{answer.correctAnswer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-wrap gap-4 justify-center items-center">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/test/real-test")}
            >
              Take Another Real Test
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Note about results not being saved */}
        <div className="p-6 border-t border-gray-700 bg-yellow-900/10">
          <p className="text-amber-300 text-sm">
            <strong>Note:</strong> Results from this real test are not saved to your history.
            This is a practice simulation only.
          </p>
        </div>
      </div>
    </div>
  );
}