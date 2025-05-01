"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import questionsByWeekData from "@/../questions_psychology_of_learning.json";
import conservationEconomicsData from "@/../questions_conservation_economics.json";
import sustainableDevData from "@/../questions_sustainable_development.json";

interface Question {
  qid: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface QuestionsByWeek {
  [week: string]: Question[];
}

export default function StudyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("sustainable_development");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [weekQuestions, setWeekQuestions] = useState<Record<string, Question[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weeks, setWeeks] = useState<string[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Update available weeks when category changes
  useEffect(() => {
    if (selectedCategory) {
      let data: QuestionsByWeek;
      
      if (selectedCategory === "psychology_of_learning") {
        data = questionsByWeekData as QuestionsByWeek;
      } else if (selectedCategory === "conservation_economics") {
        data = conservationEconomicsData as QuestionsByWeek;
      } else {
        data = sustainableDevData as QuestionsByWeek;
      }
      
      const availableWeeks = Object.keys(data).sort((a, b) => {
        const numA = parseInt(a.replace('week', ''), 10);
        const numB = parseInt(b.replace('week', ''), 10);
        return numA - numB;
      });
      setWeeks(availableWeeks);
      
      // Reset expanded weeks when category changes
      setExpandedWeeks({});
    }
  }, [selectedCategory]);

  // Load all questions for the selected category
  useEffect(() => {
    setIsLoading(true);
    
    let data: QuestionsByWeek;
    if (selectedCategory === "psychology_of_learning") {
      data = questionsByWeekData as QuestionsByWeek;
    } else if (selectedCategory === "conservation_economics") {
      data = conservationEconomicsData as QuestionsByWeek;
    } else {
      data = sustainableDevData as QuestionsByWeek;
    }
    
    setWeekQuestions(data);
    setIsLoading(false);
  }, [selectedCategory]);

  // Format week label for display
  const formatWeekLabel = (week: string): string => {
    return week
      .replace("week", "Week ")
      .replace(/^(\w)/, (match) => match.toUpperCase());
  };

  // Format category label for display
  const formatCategoryLabel = (category: string): string => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // Toggle expanded state for a week
  const toggleWeekExpansion = (week: string) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [week]: !prev[week]
    }));
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200/20 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200/20 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="h-12 bg-gray-200/20 rounded"></div>
              <div className="h-12 bg-gray-200/20 rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 bg-gray-200/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Study Materials</h1>
        <p className="text-gray-300 mb-8">
          Select a category to study the questions and answers.
        </p>

        {/* Category Selection */}
        <div className="mb-8 px-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-1/2 bg-white/5 border border-gray-700 rounded-3xl py-3 px-4 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="psychology_of_learning">Psychology of Learning</option>
            <option value="conservation_economics">Conservation Economics</option>
            <option value="sustainable_development">Sustainable Development</option>
          </select>
        </div>

        {/* Weeks and Questions Display */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200/20 rounded-3xl"></div>
            ))}
          </div>
        ) : weeks.length > 0 ? (
          <div className="space-y-4 px-2">
            {weeks.map((week) => {
              const isExpanded = expandedWeeks[week] || false;
              const weekQuestionsData = weekQuestions[week] || [];
              
              return (
                <div key={week} className="bg-purple-700/5 outline-2 outline-offset-[-1px] outline-white/5 rounded-3xl overflow-hidden shadow-lg">
                  {/* Week Header - Clickable to expand/collapse */}
                  <button
                    onClick={() => toggleWeekExpansion(week)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/10 transition-colors"
                  >
                    <h2 className="text-xl font-semibold text-gray-200">
                      {formatWeekLabel(week)}
                    </h2>
                    <svg
                      className={`w-6 h-6 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Questions - Only shown when expanded */}
                  {isExpanded && (
                    <div className="pb-6 space-y-6 px-4">
                      {weekQuestionsData.length > 0 ? (
                        weekQuestionsData.map((question, index) => (
                          <div
                            key={question.qid}
                            className="bg-white/3 rounded-3xl outline-1 outline-offset-[-1px] backdrop-blur-[100px] outline-white/5 overflow-hidden shadow-md p-5 mt-4"
                          >
                            <h3 className="text-lg font-semibold text-gray-200 mb-4">
                              {index + 1}. {question.question}
                            </h3>
                            <div className="space-y-3 text-gray-100">
                              {question.options.map((option, idx) => {
                                const isCorrect = option === question.answer;
                                const baseClasses = "w-full text-left px-4 py-3 rounded-2xl";
                                const statusClasses = isCorrect
                                  ? " bg-green-900/30 border border-green-500"
                                  : "outline-2 outline-offset-[-1px] outline-white/30 backdrop-blur-[2px]";

                                return (
                                  <div
                                    key={idx}
                                    className={`${baseClasses} ${statusClasses}`}
                                  >
                                    {option}
                                  </div>
                                );
                              })}
                            </div>
                            {question.explanation && (
                              <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                                <h3 className="font-medium text-blue-400 mb-2">Explanation:</h3>
                                <p className="text-blue-300">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-gray-400">
                            No questions available for this week.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              No weeks available for this category
            </h2>
            <p className="text-gray-400">
              Try selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}