"use client";

import React from "react";
import type { TestResultResponse } from "@/types";

interface WrongAnswersCollectionProps {
  testResults: TestResultResponse[];
}

export default function WrongAnswersCollection({
  testResults,
}: WrongAnswersCollectionProps) {
  return (
    <div className="space-y-6">
      {testResults.map((result) => (
        <div key={result._id} className="p-4 bg-white/5 rounded-lg shadow-md">
          <h2 className="text-xl text-gray-200 mb-2">
            Test on {new Date(result.createdAt).toLocaleString()}
          </h2>
          {result.answers.map((ans: any, idx: number) => {
            // Only show details for wrong answers.
            if (ans.isCorrect) return null;
            return (
              <div key={idx} className="mb-4 p-3 bg-gray-800 rounded">
                <p className="text-gray-300">Question ID: {ans.questionId}</p>
                <p className="text-gray-300">
                  Your Final Answer: {ans.userAnswer}
                </p>
                <p className="text-gray-300">
                  Correct Answer: {ans.correctAnswer}
                </p>
                <div>
                  <span className="text-gray-300">
                    Wrong Selected Frequency:{" "}
                  </span>
                  {ans.wrongFrequency &&
                  Object.keys(ans.wrongFrequency).length > 0 ? (
                    <ul className="list-disc list-inside text-gray-300">
                      {Object.entries(ans.wrongFrequency).map(
                        ([option, count]) => (
                          <li key={option}>
                            {option}: {count as number} times
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="text-gray-300">
                      No wrong attempts recorded.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
