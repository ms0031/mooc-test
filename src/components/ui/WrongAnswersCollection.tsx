"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TestResultResponse } from "@/types";
import questionsByWeekData from "../../../questions_psychology_of_learning.json";

interface WrongAnswer {
  question: string;
  correctAnswer: string;
  options: string[];
  optionCounts: Record<string, number>;
  totalWrong: number;
}

interface PsychologyQuestion {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface MongoQuestion {
  qid: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface WrongAnswersCollectionProps {
  testResults: TestResultResponse[];
}

export default function WrongAnswersCollection({
  testResults,
}: WrongAnswersCollectionProps) {
  const { data: session } = useSession();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (testResults.length > 0) {
      processWrongAnswers();
    } else {
      setIsLoading(false);
    }
  }, [testResults]);

  const processWrongAnswers = async () => {
    try {
      const questionIds = new Set<string>();
      const psychologyQuestions = new Set<string>();
      const mongoQuestions = new Set<string>();

      // Sort questions into psychology (p_*) and MongoDB questions
      testResults.forEach((result) => {
        result.answers.forEach((answer) => {
          if (!answer.isCorrect) {
            questionIds.add(answer.qid);
            if (answer.qid.startsWith("p_")) {
              psychologyQuestions.add(answer.qid);
            } else {
              mongoQuestions.add(answer.qid);
            }
          }
        });
      });

      // Create a map for psychology questions
      const psychologyQuestionsMap = new Map<string, PsychologyQuestion>();
      if (psychologyQuestions.size > 0) {
        const allPsychQuestions = Object.values(questionsByWeekData).flat();
        allPsychQuestions.forEach((q) => {
          if (psychologyQuestions.has(q.qid)) {
            psychologyQuestionsMap.set(q.qid, q);
          }
        });
      }


      // Process wrong answers with option counts
      const wrongAnswerMap = new Map<string, WrongAnswer>();

      testResults.forEach((result) => {
        result.answers.forEach((answer) => {
          if (!answer.isCorrect) {
            const question = answer.qid.startsWith("p_")
              ? psychologyQuestionsMap.get(answer.qid)
              : "";

            if (question) {
              const key = answer.qid;

              if (wrongAnswerMap.has(key)) {
                const existing = wrongAnswerMap.get(key)!;
                existing.optionCounts[answer.userAnswer] =
                  (existing.optionCounts[answer.userAnswer] || 0) + 1;
                existing.totalWrong += 1;
                wrongAnswerMap.set(key, existing);
              } else {
                const optionCounts: Record<string, number> = {};
                question.options.forEach((opt) => {
                  optionCounts[opt] = opt === answer.userAnswer ? 1 : 0;
                });

                wrongAnswerMap.set(key, {
                  question: question.question,
                  correctAnswer:
                    "answer" in question
                      ? question.answer
                      : "",
                  options: question.options,
                  optionCounts,
                  totalWrong: 1,
                });
              }
            }
          }
        });
      });

      // Sort by total wrong attempts
      const sortedWrongAnswers = Array.from(wrongAnswerMap.values()).sort(
        (a, b) => b.totalWrong - a.totalWrong
      );

      setWrongAnswers(sortedWrongAnswers);
    } catch (error) {
      console.error("Error processing wrong answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-slate-950 shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Frequently Incorrect Answers
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200/20 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200/20 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Frequently Incorrect Answers
        </h2>
        <p className="text-gray-300">No incorrect answers found. Great job!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden shadow rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-5">
        Frequently Incorrect Answers
      </h2>
      <div className="space-y-6">
        {wrongAnswers.slice(0, 5).map((wrongAnswer, index) => (
          <div
            key={index}
            className="border-b border-gray-200/20 pb-6 last:border-0 last:pb-0"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-md font-medium text-gray-300">
                {wrongAnswer.question}
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-900/60 border-2 border-red-500/60 text-red-200">
                {wrongAnswer.totalWrong}x
              </span>
            </div>
            <div className="space-y-2">
              {wrongAnswer.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className="flex justify-between items-center p-2 px-3 rounded-xl bg-white/5"
                >
                  <span
                    className={
                      option === wrongAnswer.correctAnswer
                        ? "text-green-400"
                        : "text-gray-300"
                    }
                  >
                    {option}
                  </span>
                  <span className={`text-red-400 font-medium ${wrongAnswer.optionCounts[option]?"bg-red-900/30 border-1 border-red-500/30":""} rounded-full px-2.5 py-1 text-xs`}>
                  {wrongAnswer.optionCounts[option] ? `${wrongAnswer.optionCounts[option]}x` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
