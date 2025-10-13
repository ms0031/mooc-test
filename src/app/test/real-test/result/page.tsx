"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Fireworks } from "@fireworks-js/react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Loading from "@/components/ui/Loading";

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
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<TestAnswer[]>([]);

  const isPerfectScore = testResult?.score === 100;

  useEffect(() => {
    const resultData = searchParams.get("result");
    if (resultData) {
      try {
        const parsedResult = JSON.parse(decodeURIComponent(resultData));
        setTestResult(parsedResult);
        getWrongAnswersFromLocalStorage();
      } catch (error) {
        console.error("Error parsing test result:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [searchParams, router]);

  const getWrongAnswersFromLocalStorage = () => {
    try {
      const wrongAnswersData = localStorage.getItem('realTestWrongAnswers');
      if (wrongAnswersData) {
        setWrongAnswers(JSON.parse(wrongAnswersData));
      }
    } catch (error) {
      console.error("Error retrieving wrong answers:", error);
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
    return "F";
  }

  if (!testResult) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen relative">
      <BackgroundGradientAnimation 
        gradientBackgroundStart="rgb(2, 6, 23)" 
        gradientBackgroundEnd="rgb(2, 6, 23)" 
        firstColor="20, 90, 100"
        secondColor="50, 40, 130"
        thirdColor="80, 60, 110"
        fourthColor="30, 80, 70"
        fifthColor="120, 80, 40"
        interactive={false}
        containerClassName="fixed inset-0 -z-10"
      />
      {isPerfectScore && (
        <Fireworks
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
          options={{
              autoresize: true, opacity: 0.8, acceleration: 1.02, friction: 0.97, gravity: 1.5,
              particles: 75, traceLength: 2, explosion: 6, intensity: 30, flickering: 50,
              lineStyle: "round", hue: { min: 0, max: 360 }, delay: { min: 30, max: 60 },
              rocketsPoint: { min: 50, max: 50 },
              lineWidth: { explosion: { min: 1, max: 4 }, trace: { min: 0.5, max: 1.5 } },
              brightness: { min: 50, max: 80 }, decay: { min: 0.015, max: 0.03 },
          }}
        />
      )}
      <div className="relative z-10 min-h-screen py-12 px-5">
        <div className="max-w-4xl mx-auto bg-white/5 rounded-4xl border border-white/15 backdrop-blur-xl shadow-2xl overflow-hidden">
          
          <div className="p-5">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="text-7xl font-bold text-teal-400">
                  {getGrade(testResult.normalizedScore)}
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  Overall Grade
                </p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
              <div className="bg-black/20 rounded-3xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-1">Questions</div>
                <div className="text-2xl font-semibold text-gray-200">{testResult.totalQuestions}</div>
              </div>
              <div className="bg-black/20 rounded-3xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-1">Time Taken</div>
                <div className="text-2xl font-semibold text-gray-200">{formatTime(testResult.timeTaken)}</div>
              </div>
              <div className="bg-green-500/10 rounded-3xl p-4 border border-green-500/20">
                <div className="text-green-300 text-sm mb-1">Correct</div>
                <div className="text-2xl font-semibold text-green-400">{testResult.correctAnswers}</div>
              </div>
              <div className="bg-red-500/10 rounded-3xl p-4 border border-red-500/20">
                <div className="text-red-300 text-sm mb-1">Incorrect</div>
                <div className="text-2xl font-semibold text-red-400">{testResult.wrongAnswers}</div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-black/20 p-4 rounded-3xl border border-white/10 mb-8">
              <h3 className="text-lg font-medium text-gray-200 mb-4">Score Breakdown</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-gray-300">Test Score</span>
                    <span className="text-white font-semibold">{testResult.marksScored} / {testResult.totalMarks}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${testResult.score}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm"><span className="text-gray-300">Assignment (Assumed)</span><span className="text-white font-semibold">25 / 25</span></div>
                  <div className="w-full bg-white/10 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div></div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between mb-1 text-base"><span className="text-gray-200 font-bold">Total Normalized Score</span><span className="text-teal-400 font-bold">{testResult.normalizedScore}%</span></div>
                  <div className="w-full bg-white/10 rounded-full h-3"><div className="bg-teal-500 h-3 rounded-full" style={{ width: `${testResult.normalizedScore}%` }}></div></div>
                </div>
              </div>
            </div>

            {/* Wrong Answers Section */}
            {wrongAnswers.length > 0 && (
              <details className="bg-black/20 p-4 rounded-3xl border border-white/10 group">
                <summary className="text-lg font-medium text-gray-200 cursor-pointer flex items-center justify-between list-none">
                  <span>Review Incorrect Answers</span>
                  <div className="flex ml-1 items-center">
                    <span className="text-sm bg-red-500/20 text-red-300 px-2 py-1 rounded-lg mr-2">{wrongAnswers.length}</span>
                    <svg className="h-5 w-5 text-gray-400 transition-transform duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </summary>
                <div className="mt-6 space-y-4">
                  {wrongAnswers.map((answer, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-3xl border border-white/10">
                      <p className="text-gray-200 mb-3 border-l-4 border-purple-400 pl-4">{answer.question}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start"><span className="bg-red-500/10 text-red-300 px-2 py-1 rounded-xl mr-3 font-medium">Your Answer:</span><p className="text-red-300">{answer.userAnswer}</p></div>
                        <div className="flex items-start"><span className="bg-green-500/10 text-green-300 px-2 py-1 rounded-xl mr-3 font-medium">Correct Answer:</span><p className="text-green-300">{answer.correctAnswer}</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
          
          {/* Footer with Actions and Note */}
          <div className="bg-white/0 border-t border-white/10">
            <div className="p-6">
                <p className="text-amber-300 text-sm bg-amber-500/10 p-4 rounded-3xl border border-amber-500/20 text-center mb-6">
                    <strong>Note:</strong> Results from this "Real Test" simulation are for practice only and are not saved to your history.
                </p>
                <div className="flex flex-wrap gap-4 justify-center items-center">
                    <Button variant="glass" onClick={() => router.push("/test/real-test")}  size="round">Take Another Test</Button>
                    <Button variant="glassTeal" onClick={() => router.push("/dashboard")}  size = "round">Back to Dashboard</Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
