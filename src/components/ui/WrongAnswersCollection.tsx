"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TestResultResponse } from "@/types";
import questionsByWeekData from "../../../questions_psychology_of_learning.json";
import conservationEconomicsData from "../../../questions_conservation_economics.json";
import sustainableDevData from "../../../questions_sustainable_development.json";
import Loading from "@/components/ui/Loading";

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

interface ConservationEconomicsQuestion {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface SustainableDevelopmentQuestion {
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
      const conservationQuestions = new Set<string>();
      const sustainableDevQuestions = new Set<string>();
      const mongoQuestions = new Set<string>();

      // Sort questions by type
      testResults.forEach((result) => {
        result.answers.forEach((answer) => {
          if (!answer.isCorrect) {
            questionIds.add(answer.qid);
            if (answer.qid.startsWith("p_")) {
              psychologyQuestions.add(answer.qid);
            } else if (answer.qid.startsWith("c_")) {
              conservationQuestions.add(answer.qid);
            } else if (answer.qid.startsWith("s_")) {
              sustainableDevQuestions.add(answer.qid);
            } else {
              mongoQuestions.add(answer.qid);
            }
          }
        });
      });

      // Create maps for both question types
      const psychologyQuestionsMap = new Map<string, PsychologyQuestion>();
      const conservationQuestionsMap = new Map<
        string,
        ConservationEconomicsQuestion
      >();
      const sustainableDevQuestionsMap = new Map<
        string,
        SustainableDevelopmentQuestion
      >();

      if (psychologyQuestions.size > 0) {
        const allPsychQuestions = Object.values(questionsByWeekData).flat();
        allPsychQuestions.forEach((q) => {
          if (psychologyQuestions.has(q.qid)) {
            psychologyQuestionsMap.set(q.qid, q);
          }
        });
      }

      if (conservationQuestions.size > 0) {
        const allConservationQuestions = Object.values(
          conservationEconomicsData
        ).flat();
        allConservationQuestions.forEach((q) => {
          if (conservationQuestions.has(q.qid)) {
            conservationQuestionsMap.set(q.qid, q);
          }
        });
      }

      if (sustainableDevQuestions.size > 0) {
        const allSustainableDevQuestions = Object.values(
          sustainableDevData as Record<string, SustainableDevelopmentQuestion[]>
        ).flat();
        allSustainableDevQuestions.forEach((q) => {
          if (sustainableDevQuestions.has(q.qid)) {
            sustainableDevQuestionsMap.set(q.qid, q);
          }
        });
      }

      // Process wrong answers with option counts
      const wrongAnswerMap = new Map<string, WrongAnswer>();

      testResults.forEach((result) => {
        result.answers.forEach((answer) => {
          if (!answer.isCorrect) {
            let question;
            if (answer.qid.startsWith("p_")) {
              question = psychologyQuestionsMap.get(answer.qid);
            } else if (answer.qid.startsWith("c_")) {
              question = conservationQuestionsMap.get(answer.qid);
            } else if (answer.qid.startsWith("s_")) {
              question = sustainableDevQuestionsMap.get(answer.qid);
            }

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
                  correctAnswer: question.answer,
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
      <Loading />
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="">
        <h2 className="text-center text-xl font-semibold text-gray-100 mb-5">
          Frequently Incorrect Answers
        </h2>
        <div className="space-y-6">
          {wrongAnswers.map((wrongAnswer, index) => (
            <div
              key={index}
              className=" bg-white/5 outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] rounded-3xl p-4  pb-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-md font-medium text-gray-300">
                  {wrongAnswer.question}
                </h3>
                <span className="inline-flex items-center ml-2 px-3 py-1.5 rounded-full text-xs font-medium bg-red-900/60 border-2 border-red-500/60 text-red-200">
                  {wrongAnswer.totalWrong}x
                </span>
              </div>
              <div className="space-y-2">
                {wrongAnswer.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex justify-between items-center p-2 px-3 rounded-2xl bg-white/1 outline-2 outline-offset-[-1px] outline-white/3 backdrop-blur-[10px]"
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
                    <span
                      className={`text-red-400 font-medium ${
                        wrongAnswer.optionCounts[option]
                          ? "bg-red-900/30 border-1 border-red-500/30"
                          : ""
                      } rounded-full px-2.5 py-1 text-xs`}
                    >
                      {wrongAnswer.optionCounts[option]
                        ? `${wrongAnswer.optionCounts[option]}x`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
