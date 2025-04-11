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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date>();
  const [questionStartTime, setQuestionStartTime] = useState<Date>();
  const [answers, setAnswers] = useState<
    Array<{
      questionId: string;
      userAnswer: string;
      isCorrect: boolean;
      timeSpent: number;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTimer, setShowTimer] = useState(searchParams.get("timer") !== "off");
  const [randomizeOptions, setRandomizeOptions] = useState(searchParams.get("randomize") === "true");

  useEffect(() => {
    // Allow guest access from home page or if in study mode
    const isGuestAccess = searchParams.get("category") !== null;
    
    if (status === "unauthenticated" && !isStudyMode && !isGuestAccess) {
      router.push("/login");
      return;
    }

    fetchQuestions();
  }, [status, category, isStudyMode, router]);

  useEffect(() => {
    if (questions.length > 0) {
      setTestStartTime(new Date());
      setQuestionStartTime(new Date());
    }
  }, [questions]);

  const fetchQuestions = async () => {
    try {
      let apiUrl = "/api/questions";
      let queryParams = new URLSearchParams();
      
      // Handle psychology of learning questions differently
      if (category === "psychology_of_learning") {
        apiUrl = "/api/psychology-questions";
        
        // Check if we should shuffle weeks or use a specific week
        const shuffleWeeks = searchParams.get("shuffleWeeks") === "true";
        if (shuffleWeeks) {
          queryParams.append("shuffleWeeks", "true");
        } else {
          const week = searchParams.get("week") || "week1";
          queryParams.append("week", week);
        }
      } else {
        // For other categories, use the standard API
        if (category) {
          queryParams.append("category", category);
        }
      }
      
      const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch questions");
      }

      // If randomize options is enabled, shuffle the options for each question
      let fetchedQuestions = data.questions;
      if (randomizeOptions) {
        fetchedQuestions = fetchedQuestions.map((q: Question) => ({
          ...q,
          options: shuffleArray([...q.options])
        }));
      }

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

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
    const timeSpent = questionStartTime
      ? Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000)
      : 0;

    const answerData = {
      questionId: currentQuestion._id,
      userAnswer: selectedAnswer,
      isCorrect,
      timeSpent,
    };

    setAnswers([...answers, answerData]);
    setIsAnswerSubmitted(true);

    if (
      currentQuestionIndex === questions.length - 1 ||
      (isStudyMode && isAnswerSubmitted)
    ) {
      // Test completed
      const totalTime = testStartTime
        ? Math.round((new Date().getTime() - testStartTime.getTime()) / 1000)
        : 0;

      if (!isStudyMode) {
        // Submit test results
        try {
          await fetch("/api/test-results", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category: category || "general",
              answers: [...answers, answerData],
              timeTaken: totalTime,
            }),
          });
        } catch (error) {
          console.error("Error submitting test results:", error);
        }
      }

      // Prepare result data for the result page
      const resultData = {
        score: Math.round(
          ((answers.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0)) /
            questions.length) *
            100
        ),
        totalQuestions: questions.length,
        correctAnswers: answers.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0),
        wrongAnswers: answers.filter((a) => !a.isCorrect).length + (!isCorrect ? 1 : 0),
        timeTaken: totalTime,
        category: category || "general",
        answers: [...answers, answerData],
      };

      // Navigate to results page
      router.push(
        `/test/result?result=${encodeURIComponent(JSON.stringify(resultData))}`
      );
      return;
    }

    // Move to next question
    if (isStudyMode && !isAnswerSubmitted) {
      return; // In study mode, wait for user to proceed after seeing the answer
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer("");
    setIsAnswerSubmitted(false);
    setQuestionStartTime(new Date());
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer("");
    setIsAnswerSubmitted(false);
    setQuestionStartTime(new Date());
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
          <p className="mb-4">There are no questions available for this category.</p>
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

  const currentQuestion = questions[currentQuestionIndex];

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header with progress */}
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h1>
            {showTimer && questionStartTime && (
              <div className="text-white font-mono">
                Time: {Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)}s
              </div>
            )}
          </div>

          {/* Question */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border ${isAnswerSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : option === selectedAnswer
                        ? "bg-red-100 border-red-500"
                        : "border-gray-300"
                    : selectedAnswer === option
                      ? "bg-indigo-100 border-indigo-500"
                      : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Explanation in Study Mode */}
            {isStudyMode &&
              isAnswerSubmitted &&
              currentQuestion.explanation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Explanation:</h3>
                  <p className="text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={
                  isAnswerSubmitted && isStudyMode
                    ? handleNextQuestion
                    : handleAnswerSubmit
                }
                disabled={!selectedAnswer && !isAnswerSubmitted}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isAnswerSubmitted
                  ? currentQuestionIndex === questions.length - 1
                    ? "Finish Test"
                    : "Next Question"
                  : "Submit Answer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
