"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Fireworks } from "@fireworks-js/react";
import questionsByWeekData from "@/../questions_psychology_of_learning.json";
import conservationEconomicsData from "@/../questions_conservation_economics.json";
import wildlifeEcologyData from "@/../questions_wildlife_ecology.json";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

interface TestAnswer {
  qid: string;
  question?: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  wrongFrequency?: Record<string, number>;
  correctAnswer: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  category: string;
  answers?: TestAnswer[];
}

interface Question {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface EnhancedTestAnswer extends TestAnswer {
  options?: string[];
}

interface QuestionsByWeek {
  [week: string]: Question[];
}

export default function TestResultPage() {
  const searchParams = useSearchParams();
  const router = useTransitionRouter();
  const { data: session, status } = useSession();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<EnhancedTestAnswer[]>([]);
  const isPerfectScore = testResult?.score === 100;

  useEffect(() => {
    // Get test result from URL params
    const resultData = searchParams.get("result");
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setTestResult(parsedResult);

        // If user is authenticated, fetch wrong answers from the most recent test
        if (session?.user) {
          fetchWrongAnswers();
        }
      } catch (error) {
        console.error("Error parsing test result:", error);
      }
    } else {
      router.push("/", {
        onTransitionReady: () => pageAnimation('left'),
      });
    }
  }, [searchParams, router, session]);

  // Helper function to get questions from JSON files
  const getQuestionDetails = (qid: string): Question | undefined => {
    if (qid.startsWith("p_")) {
      const allPsychQuestions = Object.values(
        questionsByWeekData as QuestionsByWeek
      ).flat();
      return allPsychQuestions.find((q: Question) => q.qid === qid);
    } else if (qid.startsWith("c_")) {
      const allConservationQuestions = Object.values(
        conservationEconomicsData as QuestionsByWeek
      ).flat();
      return allConservationQuestions.find((q: Question) => q.qid === qid);
    } else if (qid.startsWith("w_")) {
      const allwildlifeEcologyQuestions = Object.values(
        wildlifeEcologyData as QuestionsByWeek
      ).flat();
      return allwildlifeEcologyQuestions.find((q: Question) => q.qid === qid);
    }
    return undefined;
  };

  const fetchWrongAnswers = async () => {
    try {
      const response = await fetch("/api/test-results");
      if (!response.ok) {
        throw new Error("Failed to fetch test results");
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Get the most recent test result's wrong answers
        const mostRecent = data.results[0];
        const wrongOnes = mostRecent.answers.filter(
          (answer: TestAnswer) => !answer.isCorrect
        );

        // Enhance wrong answers with full question details
        const enhancedWrongAnswers = wrongOnes.map((answer: TestAnswer) => {
          const questionDetails = getQuestionDetails(answer.qid);
          return {
            ...answer,
            question: questionDetails?.question || answer.question,
            options: questionDetails?.options || [],
          };
        });

        setWrongAnswers(enhancedWrongAnswers);
      }
    } catch (error) {
      console.error("Error fetching wrong answers:", error);
    }
  };


  function formatCategoryWithSpaces(category: string): string {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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
    <div className="min-h-screen py-12">
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
        <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[16px] shadow-xl rounded-4xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4">
            <h1 className="text-center text-2xl font-bold text-gray-200">Test Results</h1>
          </div>
          <div className=" h-1 w-22 bg-white/20 rounded-3xl mx-auto mb-3"></div>
          {/* Result Summary */}
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-500/15 mb-5 mt-1 relative">
                <svg
                  width="150"
                  height="150"
                  viewBox="0 0 96 96"
                  className="absolute"
                  style={{ zIndex: 2 }}
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="35"
                    stroke="#312e81"
                    strokeWidth="8"
                    fill="none"
                    opacity="1"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="35"
                    stroke="#6366f1"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={
                      testResult?.score !== undefined
                        ? (1 - testResult.score / 100) * 2 * Math.PI * 38
                        : 2 * Math.PI * 38
                    }
                    strokeLinecap="round"
                    style={{
                      transition:
                        "stroke-dashoffset 0.7s cubic-bezier(.4,2,.6,1)",
                    }}
                  />
                </svg>
                <span className="text-3xl font-bold text-slate-400 z-10">
                  {testResult?.score}%
                </span>
              </div>
              <h2 className="text-xl font-semibold text-teal-500">
                {testResult?.score! >= 70 ? "Great job!" : "Keep practicing!"}
              </h2>
              <p className="text-gray-300 mt-1">
                You answered {testResult?.correctAnswers} out of{" "}
                {testResult?.totalQuestions} questions correctly.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5  backdrop-blur-[16px] p-4 rounded-4xl border border-white/10">
                <h3 className="text-center text-sm font-medium text-gray-200">Category</h3>
                <div className=" h-0.5 w-6 bg-white/20 rounded-3xl mx-auto my-1"></div>
                <p className="text-center mt-1 text-lg font-semibold text-blue-400 capitalize">
                  {formatCategoryWithSpaces(testResult?.category || "General")}
                </p>
              </div>
              <div className="bg-white/5  backdrop-blur-[16px] p-4 rounded-4xl border border-white/10">
                <h3 className=" text-center text-sm font-medium text-gray-200">
                  Time Taken
                    </h3>
                    <div className=" h-0.5 w-6 bg-white/20 rounded-3xl mx-auto my-1"></div>
                <p className="text-center mt-1 text-lg font-semibold text-blue-400">
                  {Math.floor(testResult?.timeTaken! / 60)}m{" "}
                  {testResult?.timeTaken! % 60}s
                </p>
              </div>
              <div className="bg-green-500/20  p-4 rounded-4xl border border-white/10">
                <h3 className="text-center text-sm font-medium text-gray-200">
                  Correct Answers
                </h3>
                <div className=" h-0.5 w-6 bg-white/20 rounded-3xl mx-auto my-1"></div>
                <p className="text-center mt-1 text-lg font-semibold text-green-400">
                  {testResult?.correctAnswers} (
                  {Math.round(
                    (testResult?.correctAnswers! /
                      testResult?.totalQuestions!) *
                      100
                  )}
                  %)
                </p>
              </div>
              <div className="bg-red-500/20  p-4 rounded-4xl border border-white/10">
                <h3 className="text-center text-sm font-medium text-gray-200">
                  Wrong Answers
                </h3>
                <div className=" h-0.5 w-6 bg-white/20 rounded-3xl mx-auto my-1"></div>
                <p className="text-center mt-1 text-lg font-semibold text-red-400">
                  {testResult?.wrongAnswers} (
                  {Math.round(
                    (testResult?.wrongAnswers! / testResult?.totalQuestions!) *
                      100
                  )}
                  %)
                </p>
              </div>
            </div>

            {/* Wrong Answers Dropdown */}
            <div className="mb-8">
              <details className="bg-slate-500/12 p-4 rounded-3xl">
                <summary className="text-lg font-medium text-gray-200 cursor-pointer flex items-center justify-between">
                  <span>Wrong Answers</span>
                  <div className="flex items-center">
                    <span className="text-sm bg-red-500/30 px-2 py-1 rounded-lg mr-2">
                      {testResult?.wrongAnswers} Questions
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

                {searchParams.get('mode') === 'study' ? (
                  <div className="mt-4 bg-indigo-900/30 p-4 rounded-3xl text-center">
                    <p className="text-indigo-300">
                      This feature is not available in study mode.
                    </p>
                  </div>
                ) :session ? (
                  <div className="mt-4 space-y-4">
                    {wrongAnswers.map((answer, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-2xl">
                        <p className="text-gray-300 mb-2 font-medium">
                          Question {index + 1}
                        </p>
                        {answer.question && (
                          <p className="text-gray-200 mb-3 border-l-2 border-purple-400 pl-3">
                            {answer.question}
                          </p>
                        )}
                        <div className="mb-3">
                          <div className="flex items-start mb-2">
                            <span className="bg-red-500/5 border border-white/15 text-red-400 px-2 py-1 rounded-xl mr-2 text-xs">
                              Your Answer
                            </span>
                            <p className="text-red-400">{answer.userAnswer}</p>
                          </div>
                          <div className="flex items-start">
                            <span className="bg-green-500/5 border border-white/15 text-green-400 px-2 py-1 rounded-xl mr-2 text-xs">
                              Correct Answer
                            </span>
                            <p className="text-green-400">
                              {answer.correctAnswer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-white mb-3">
                      Sign in to view your wrong answers.
                    </p>
                    <div className="flex space-x-3 justify-center">
                    <Button variant="glassTeal"
                      onClick={(e) => {
                              e.preventDefault()
                              router.push('/register', {
                                onTransitionReady: () => pageAnimation('up'),
                              })
                            }}
                      size={"round"}>
                      Sign Up
                      </Button>
                      <Button variant="glass"
                         onClick={(e) => {
                              e.preventDefault()
                              router.push('/login', {
                                onTransitionReady: () => pageAnimation('up'),
                              })
                            }}
                        size={"round"}>
                        Log In
                      </Button>
                    </div>
                  </div>
                )}
              </details>
            </div>

            {/* Guest Prompt */}
            {!session && (
              <div className="bg-white/5 backdrop-blur-3xl p-4 rounded-3xl border border-white/15 mb-8">
                <h3 className="text-lg font-medium text-white mb-2">
                  Save Your Progress
                </h3>
                <p className="text-white mb-4">
                  Sign up to save your test results and track your progress over
                  time.
                </p>
                <div className="flex space-x-3">
                  <Button variant="glassTeal"
                      onClick={(e) => {
                              e.preventDefault()
                              router.push('/register', {
                                onTransitionReady: () => pageAnimation('up'),
                              })
                            }}
                      size={"round"}>
                      Sign Up
                      </Button>
                      <Button variant="glass"
                         onClick={(e) => {
                              e.preventDefault()
                              router.push('/login', {
                                onTransitionReady: () => pageAnimation('up'),
                              })
                            }}
                        size={"round"}>
                        Log In
                      </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="glass"
                onClick={(e) => {
                  e.preventDefault()
                  router.push(`${session ? "/dashboard" : "/"}`, {
                    onTransitionReady: () => pageAnimation('right'),
                  })
                    }}
                    size={"round"}
                  >
                  
                Back to Home
              </Button>
              <Button
                variant="glass"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/test/settings", {
                    onTransitionReady: () => pageAnimation('left'),
                  })
                    }}
                    size={"round"}
              >
                Take Another Test
              </Button>
            </div>
          </div>
        </div>
      </div>
        </div>
        </div>
    </main>
  );
}
