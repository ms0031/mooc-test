"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TestResultResponse } from "@/types";

interface WrongAnswer {
  question: string;
  correctAnswer: string;
  userAnswer: string;
  frequency: number;
}

interface WrongAnswersCollectionProps {
  testResults: TestResultResponse[];
}

export default function WrongAnswersCollection({ testResults }: WrongAnswersCollectionProps) {
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
      // Fetch question details for the wrong answers
      const questionIds = new Set<string>();
      
      // Collect all wrong answer question IDs
      testResults.forEach(result => {
        result.answers.forEach((answer: { questionId: string | number; isCorrect: boolean }) => {
          if (!answer.isCorrect) {
            questionIds.add(answer.questionId.toString());
          }
        });
      });

      // Fetch question details
      const response = await fetch(`/api/questions/details?ids=${Array.from(questionIds).join(',')}`);
      const data = await response.json();
      const questions = data.questions || [];

      // Create a map of question ID to question details
      const questionMap = new Map();
      questions.forEach((q: { _id: string }) => questionMap.set(q._id, q));

      // Count wrong answer frequencies
      const wrongAnswerMap = new Map<string, WrongAnswer>();

      testResults.forEach(result => {
        result.answers.forEach((answer: { isCorrect: boolean; questionId: string | number; userAnswer: string }) => {
          if (!answer.isCorrect) {
            const questionId = answer.questionId.toString();
            const question = questionMap.get(questionId);
            
            if (question) {
              const key = `${questionId}-${answer.userAnswer}`;
              
              if (wrongAnswerMap.has(key)) {
                const existing = wrongAnswerMap.get(key)!;
                existing.frequency += 1;
                wrongAnswerMap.set(key, existing);
              } else {
                wrongAnswerMap.set(key, {
                  question: question.question,
                  correctAnswer: question.correctAnswer,
                  userAnswer: answer.userAnswer,
                  frequency: 1
                });
              }
            }
          }
        });
      });

      // Sort by frequency
      const sortedWrongAnswers = Array.from(wrongAnswerMap.values())
        .sort((a, b) => b.frequency - a.frequency);

      setWrongAnswers(sortedWrongAnswers);
    } catch (error) {
      console.error("Error processing wrong answers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null; // Only show for authenticated users
  }

  if (isLoading) {
    return (
      <div className="bg-slate-950 shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Frequently Incorrect Answers
        </h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden shadow rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Frequently Incorrect Answers
        </h2>
        <p className="text-gray-300">
          No incorrect answers found. Great job!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden shadow rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Frequently Incorrect Answers
      </h2>
      <div className="space-y-4">
        {wrongAnswers.slice(0, 5).map((wrongAnswer, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <h3 className="text-md font-medium text-gray-300">{wrongAnswer.question}</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/60 border-2 border-red-500/60 text-red-200">
                {wrongAnswer.frequency}x
              </span>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-red-600">
                <span className="font-medium">Your answer:</span> {wrongAnswer.userAnswer}
              </p>
              <p className="text-green-600">
                <span className="font-medium">Correct answer:</span> {wrongAnswer.correctAnswer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}