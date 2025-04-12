"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  explanation?: string;
}

export default function TestPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const category = searchParams.get("category");
  const isStudyMode = searchParams.get("mode") === "study";

  const [questions, setQuestions] = useState<Question[]>([]);
  // Answers keyed by question id
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date>(new Date());
  const [randomizeOptions, setRandomizeOptions] = useState(
    searchParams.get("randomize") === "true"
  );

  useEffect(() => {
    // Allow guest access from home page or if in study mode
    const isGuestAccess = searchParams.get("category") !== null;
    if (status === "unauthenticated" && !isStudyMode && !isGuestAccess) {
      router.push("/login");
      return;
    }
    fetchQuestions();
    // Set test start time
    setTestStartTime(new Date());
  }, [status, category, isStudyMode, router]);

  const fetchQuestions = async () => {
    try {
      const apiUrl = "/api/psychology-questions";
      const queryParams = new URLSearchParams();

      const shuffleWeeksVal = searchParams.get("shuffleWeeks") === "true";
      const weeksParam = searchParams.get("weeks");

      if (shuffleWeeksVal) {
        // Display all questions of all weeks in shuffled sequence.
        queryParams.append("shuffleWeeks", "true");
      } else if (weeksParam) {
        // Display all questions for the selected weeks.
        queryParams.append("weeks", weeksParam);
      } else {
        const week = searchParams.get("week") || "week1";
        queryParams.append("week", week);
      }

      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      const data = await response.json();
      console.log("Fetched questions data:", data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch questions");
      }

      // If randomize options is enabled, shuffle the options for each question
      let fetchedQuestions = data.questions;
      if (randomizeOptions) {
        fetchedQuestions = fetchedQuestions.map((q: Question) => ({
          ...q,
          options: shuffleArray([...q.options]),
        }));
      }

      // Verify correct answer exists for each question
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

  // Function to shuffle array (for randomizing options)
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    // You can add a check to ensure all questions are answered
    setSubmitted(true);
  };

  const handleFinishTest = async () => {
    // Calculate total time (in seconds)
    const totalTime = testStartTime
      ? Math.round((new Date().getTime() - testStartTime.getTime()) / 1000)
      : 0;

    // Calculate score
    const correctCount = questions.reduce((total, question) => {
      return total + (answers[question._id] === question.correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctCount / questions.length) * 100);

    const resultData = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeTaken: totalTime,
      category: category || "general",
      answers, // you may send detailed answers if needed
    };

    // Optionally, submit test results
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
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Guest Mode Banner */}
      {!session && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're in guest mode. Log in to save your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {questions.map((question, index) => {
          const selected = answers[question._id];
          return (
            <div
              key={question._id}
              className="bg-white shadow-xl rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {index + 1}. {question.question}
              </h2>
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  // Debug log when submitted
                  if (submitted) {
                    console.log("Question:", question.question);
                    console.log("Correct Answer:", question.correctAnswer);
                    console.log("Selected Answer:", selected);
                  }

                  let baseClasses =
                    "w-full text-left p-4 rounded-lg border cursor-pointer";
                  if (submitted) {
                    // Always show the correct answer in green.
                    if (option === question.correctAnswer) {
                      baseClasses += " bg-green-100 border-green-500";
                    }
                    // If the user selected a wrong answer, show it in red.
                    if (
                      selected === option &&
                      option !== question.correctAnswer
                    ) {
                      baseClasses += " bg-red-100 border-red-500";
                    }

                    // Other options remain with a neutral border.
                    if (
                      option !== question.correctAnswer &&
                      selected !== option
                    ) {
                      baseClasses += " border-gray-300";
                    }
                  } else {
                    baseClasses +=
                      selected === option
                        ? " bg-indigo-100 border-indigo-500"
                        : " border-gray-300 hover:border-indigo-500 hover:bg-indigo-50";
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleAnswerSelect(question._id, option)}
                      className={baseClasses}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {/* Display explanation in Study Mode after submission */}
              {isStudyMode && submitted && question.explanation && (
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

        <div className="flex justify-end">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length !== questions.length}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          ) : (
            <button
              onClick={handleFinishTest}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Finish Test
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
