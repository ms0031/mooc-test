"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { Button } from "@/components/ui/Button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import TestNavbar from "@/components/ui/TestNavbar";

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
  const router = useTransitionRouter();
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
      //console.log("Fetched questions data:", data);

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
    // Calculate total time taken
    const totalTime = testStartTime
      ? Math.round((new Date().getTime() - testStartTime.getTime()) / 1000)
      : 0;

    // Prepare answers array for the backend
    let correctCount = 0;
    const processedAnswers = questions.map((q) => {
      const attempts = answerAttempts[q._id] || [];
      const finalAnswer = attempts[attempts.length - 1] || "";
      const isCorrect = finalAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;

      const wrongFrequency: Record<string, number> = {};
      attempts.forEach((option) => {
        if (option !== q.correctAnswer) {
          wrongFrequency[option] = (wrongFrequency[option] || 0) + 1;
        }
      });

      return {
        qid: q.qid,
        question: q.question,
        userAnswer: finalAnswer,
        isCorrect,
        timeSpent: 0,
        wrongFrequency,
        correctAnswer: q.correctAnswer || "",
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);

    // Save full result data to database
    if (!isStudyMode) {
      try {
        await fetch("/api/test-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score,
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            wrongAnswers: questions.length - correctCount,
            timeTaken: totalTime,
            category: category || "general",
            answers: processedAnswers,
          }),
        });
      } catch (error) {
        console.error("Error submitting test results:", error);
      }
    }

    // Only pass essential data in URL
    const urlResultData = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeTaken: totalTime,
      category: category || "general",
    };

    const searchParamsForResult = new URLSearchParams();
    searchParamsForResult.append(
      "result",
      encodeURIComponent(JSON.stringify(urlResultData))
    );
    if (isStudyMode) {
      searchParamsForResult.append("mode", "study");
    }

    router.push(`/test/result?${searchParamsForResult.toString()}`);
  };

  if (isLoading) {
    return null;
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
      <TestNavbar 
        answeredQuestions={Object.keys(answerAttempts).length} 
        totalQuestions={questions.length} 
      />
    <div className="relative z-10">
    <div className="min-h-screenpy-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden">
      {!session && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-2">
          <div className="bg-yellow-50/90 border-l-8 rounded-xl border-yellow-400 p-4 ">
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

      <div className="space-y-3 p-5">
        {questions.map((question, index) => {
          const attempts = answerAttempts[question._id] || [];
          const finalAnswer = attempts[attempts.length - 1] || "";
          const isAnswered = isStudyMode
            ? answeredQuestions[question._id] || submitted
            : submitted;

          return (
            <div
              key={question._id}
              className="bg-white/5 rounded-3xl p-4 border border-white/10 shadow-lg"
            >
              <h3 className="text-lg font-medium text-white mb-2">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-2 text-gray-100">
                {question.options.map((option, idx) => {
                  // Determine the state of the option for styling
                  const isSelected = finalAnswer === option;
                  const isCorrect = option === question.correctAnswer;
                  
                  let state: 'correct' | 'incorrect' | 'selected' | 'default' = 'default';
                  if (isAnswered) {
                    if (isCorrect) state = 'correct';
                    else if (isSelected) state = 'incorrect';
                  } else if (isSelected) {
                    state = 'selected';
                  }

                  // Define classes based on the state
                  const containerClasses = {
                    correct: 'bg-green-900/30 border-green-500',
                    incorrect: 'bg-red-900/30 border-red-500',
                    selected: 'bg-indigo-600/30 border-indigo-500',
                    default: 'bg-white/5 hover:bg-white/10 border-transparent',
                  };

                  const radioClasses = {
                      correct: 'border-green-500 bg-green-500/50',
                      incorrect: 'border-red-500 bg-red-500/50',
                      selected: 'border-indigo-500 bg-indigo-500',
                      default: 'border-gray-400',
                  };

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleAnswerSelect(question._id, option)}
                      className={`w-full p-2 px-3 rounded-2xl cursor-pointer transition-colors flex items-start text-left border ${containerClasses[state]} ${!isAnswered ? '' : 'cursor-default'}`}
                    >
                      <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 ${radioClasses[state]} flex items-center justify-center mr-4 mt-0.5 transition-colors`}>
                        {/* Inner dot for 'selected' state */}
                        {state === 'selected' && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                        {/* Checkmark for 'correct' state */}
                        {state === 'correct' && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        )}
                        {/* X mark for 'incorrect' state */}
                        {state === 'incorrect' && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        )}
                      </div>
                      <span className="text-gray-100">{option}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Explanation Box - Restyled for dark mode */}
              {isStudyMode && isAnswered && question.explanation && (
                <div className="mt-5 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                  <h3 className="font-medium text-blue-400 mb-2">Explanation:</h3>
                  <p className="text-blue-300">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        <div className="flex justify-center mt-8">
          {!submitted ? (
            <div className="flex justify-between w-full">
              <Button variant="glassRed"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/test/settings", {
                    onTransitionReady: () => pageAnimation('right'),
                  })
                }}
                size={"lg"}>
                Cancel
              </Button>
              <Button variant="glassTeal"
                onClick={handleSubmit}
                size={"lg"}>
                Submit
              </Button>
            </div>
          ) : (
              <Button variant="glassTeal"
                onClick={handleFinishTest}
                size={"lg"}>
                Finish Test
              </Button>
          )}
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
    </main>
  );
}
