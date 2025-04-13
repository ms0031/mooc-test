"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CountdownTimer from "@/components/ui/CountdownTimer";

interface Question {
  _id: string;
  qid: string; // Unique identifier for the question
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export default function TestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const category = searchParams.get("category");
  const isStudyMode = searchParams.get("mode") === "study";
  const timerDisabled = searchParams.get("timer") === "off" || isStudyMode;
  const [testDuration] = useState(1800);
  const [questions, setQuestions] = useState<Question[]>([]);
  // Instead of a single answer per question, store all attempts in an array.
  const [answerAttempts, setAnswerAttempts] = useState<
    Record<string, string[]>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    Record<string, boolean>
  >({});
  const [testStartTime, setTestStartTime] = useState<Date>(new Date());
  const [randomizeOptions, setRandomizeOptions] = useState(
    searchParams.get("randomize") === "true"
  );
  const [randomizeQuestions, setRandomizeQuestions] = useState(
    searchParams.get("randomizeQuestions") === "true"
  );

  useEffect(() => {
    const isGuestAccess = searchParams.get("category") !== null;
    if (status === "unauthenticated" && !isStudyMode && !isGuestAccess) {
      router.push("/login");
      return;
    }
    fetchQuestions();
    setTestStartTime(new Date());
  }, [status, category, isStudyMode, router]);

  const fetchQuestions = async () => {
    try {
      let apiUrl = "/api/psychology-questions";
      if (category === "conservation_economics") {
        apiUrl = "/api/conservation-economics-questions";
      } else if (category === "psychology_of_learning") {
        apiUrl = "/api/psychology-questions";
      } else if (category === "sustainable_development") {
        apiUrl = "/api/sustainable-development-questions";
      }
      const queryParams = new URLSearchParams();

      const shuffleWeeksVal = searchParams.get("shuffleWeeks") === "true";
      const weeksParam = searchParams.get("weeks");

      if (shuffleWeeksVal) {
        queryParams.append("shuffleWeeks", "true");
      } else if (weeksParam) {
        queryParams.append("weeks", weeksParam);
      } else {
        const week = searchParams.get("week") || "week1";
        queryParams.append("week", week);
      }

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      const data = await response.json();
      console.log("Fetched questions data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch questions");
      }

      let fetchedQuestions = data.questions;

      if (randomizeQuestions) {
        fetchedQuestions = shuffleArray([...fetchedQuestions]);
      }

      if (randomizeOptions) {
        fetchedQuestions = fetchedQuestions.map((q: Question) => ({
          ...q,
          options: shuffleArray([...q.options]),
        }));
      }

      fetchedQuestions.forEach((q: Question, index: number) => {
        if (!q.correctAnswer) {
          console.warn(`Question ${index + 1} is missing correctAnswer:`, q);
        }
      });

      setQuestions(fetchedQuestions);
    } catch (error) {
      setError("Failed to load questions. Please try again.");
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (submitted) return;
    // Accumulate attempts in an array for each question.
    setAnswerAttempts((prev) => {
      const prevAttempts = prev[questionId] || [];
      return { ...prev, [questionId]: [...prevAttempts, option] };
    });

    // In study mode, mark question as answered immediately.
    if (isStudyMode) {
      setAnsweredQuestions((prev) => ({ ...prev, [questionId]: true }));
    }
  };

  const handleSubmit = () => {
    // Basic check: each question should have at least one attempt.
    if (Object.keys(answerAttempts).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
  };

  const handleFinishTest = async () => {
    // Calculate total time taken.
    const totalTime = testStartTime
      ? Math.round((new Date().getTime() - testStartTime.getTime()) / 1000)
      : 0;

    // Prepare answers array for the backend.
    let correctCount = 0;
    const processedAnswers = questions.map((q) => {
      const attempts = answerAttempts[q._id] || [];
      const finalAnswer = attempts[attempts.length - 1] || "";
      const isCorrect = finalAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      // Calculate wrong frequencies.
      const wrongFrequency: Record<string, number> = {};
      attempts.forEach((option) => {
        if (option !== q.correctAnswer) {
          wrongFrequency[option] = (wrongFrequency[option] || 0) + 1;
        }
      });

      return {
        qid: q.qid, // Use qid instead of _id
        userAnswer: finalAnswer,
        isCorrect,
        timeSpent: 0, // Optionally track per-question time.
        wrongFrequency,
        correctAnswer: q.correctAnswer || "",
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    const resultData = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeTaken: totalTime,
      category: category || "general",
      answers: processedAnswers,
    };

    if (!isStudyMode) {
      try {
        await fetch("/api/test-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resultData),
        });
      } catch (error) {
        console.error("Error submitting test results:", error);
      }
    }

    router.push(
      `/test/result?result=${encodeURIComponent(JSON.stringify(resultData))}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Questions...</h1>
          <p>Please wait while we prepare your test.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Questions Available</h1>
          <p className="mb-4">
            There are no questions available for this category.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      {!session && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-yellow-50 border-l-8 rounded-xl border-yellow-400 p-4 ">
            <div className="flex">
              <div className="ml-3">
                <p className="text-md text-yellow-700">
                  You're in guest mode. Log in to save your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {!timerDisabled && !submitted && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 justify-items-start lg:px-8 mb-6">
          <div className="bg-slate-800/80 w-1/3 rounded-3xl p-4 flex justify-center">
            <CountdownTimer
              duration={testDuration}
              onTimeUp={handleSubmit}
              className="text-2xl text-white"
            />
          </div>
        </div>
      )} */}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {questions.map((question, index) => {
          const attempts = answerAttempts[question._id] || [];
          const finalAnswer = attempts[attempts.length - 1] || "";
          const isAnswered = isStudyMode
            ? answeredQuestions[question._id] || submitted
            : submitted;
          return (
            <div
              key={question._id}
              className=" bg-white/5 rounded-2xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden shadow-xl p-6"
            >
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                {index + 1}. {question.question}
              </h2>
              <div className="space-y-3 text-gray-100">
                {question.options.map((option, idx) => {
                  let baseClasses =
                    "w-full text-left p-4 rounded-xl border cursor-pointer";
                  if (isAnswered) {
                    if (option === question.correctAnswer) {
                      baseClasses += " bg-green-900/30 border-green-500";
                    }
                    if (
                      finalAnswer === option &&
                      option !== question.correctAnswer
                    ) {
                      baseClasses += " bg-red-900/30 border-red-500";
                    }
                    if (
                      option !== question.correctAnswer &&
                      finalAnswer !== option
                    ) {
                      baseClasses += " border-gray-300";
                    }
                  } else {
                    baseClasses +=
                      finalAnswer === option
                        ? " bg-blue-900/30 border-blue-600"
                        : " border-gray-300 hover:border-indigo-500 hover:bg-teal-50/10";
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={
                        isStudyMode
                          ? answeredQuestions[question._id] || submitted
                          : submitted
                      }
                      onClick={() => handleAnswerSelect(question._id, option)}
                      className={baseClasses}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {isStudyMode &&
                (answeredQuestions[question._id] || submitted) &&
                question.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Explanation:
                    </h3>
                    <p className="text-blue-700">{question.explanation}</p>
                  </div>
                )}
            </div>
          );
        })}

        <div className="flex justify-center mt-8">
          {!submitted ? (
            <div className="flex justify-between w-full">
              <button
                onClick={() => router.push("/test/settings")}
                className="px-6 py-2 bg-red-500/80 text-gray-200 rounded-xl hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  Object.keys(answerAttempts).length !== questions.length
                }
                className="px-6 py-2 bg-indigo-500/95 text-gray-100 rounded-xl hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <button
              onClick={handleFinishTest}
              className="px-6 py-2 bg-teal-500/80 text-white rounded-xl hover:bg-green-700"
            >
              Finish Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
