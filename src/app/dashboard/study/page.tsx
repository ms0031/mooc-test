"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import questionsByWeekData from "@/../questions_psychology_of_learning.json";
import conservationEconomicsData from "@/../questions_conservation_economics.json";
import sustainableDevData from "@/../questions_sustainable_development.json";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

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

const categories = [
    { id: "sustainable_development", label: "Sustainable Development" },
    { id: "psychology_of_learning", label: "Psychology of Learning" },
    { id: "conservation_economics", label: "Conservation Economics" },
];

export default function StudyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("sustainable_development");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<string, boolean>>({});
  const [weekQuestions, setWeekQuestions] = useState<Record<string, Question[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [weeks, setWeeks] = useState<string[]>([]);
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
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
      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
              {/* Header Skeleton */}
              <div className="px-14">
            <div className="h-9 w-full bg-white/10 rounded-lg mb-8"></div>
            <div className="h-5 w-full bg-white/10 rounded-lg mb-10"></div>
            </div>
            {/* Category Selector Skeleton */}
            <div className="mb-8 px-2">
                <div className="h-14 w-full bg-white/5 rounded-full p-2 border border-white/15"></div>
            </div>

            {/* Accordion List Skeleton */}
            <div className="space-y-4 px-2">
              {[1, 2, 3, 4,5].map((i) => (
                <div key={i} className="h-14 bg-white/5 rounded-full border border-white/15"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
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
    <div className="relative z-10">
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold text-gray-100 mb-2">Study Materials</h1>
        <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>
        <p className="text-center text-gray-300 mb-8">
          Choose a category to start studying.
        </p>

        {/* REPLACED: Native select with custom responsive tabs component */}
        <div className="mb-8 px-2">
          {/* Desktop View (sm screens and up) 🖥️ */}
          <div className="hidden sm:flex flex-col sm:flex-row items-center gap-2 rounded-full bg-white/5 p-2 backdrop-blur-md border border-white/15">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-1 rounded-full px-4 sm:px-6 py-3  transition-colors text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-white/10 backdrop-blur-lg text-white font-semibold'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Mobile View (extra small screens) 📱 */}
          <div className="relative sm:hidden">
            {/* Trigger button showing only the selected category */}
            <button
              onClick={() => setIsCategorySelectorOpen(!isCategorySelectorOpen)}
              className="w-full flex items-center justify-between rounded-full bg-white/5 p-2 pl-4 backdrop-blur-md border border-white/15"
            >
              <span className="text-white font-semibold">
                {categories.find(c => c.id === selectedCategory)?.label}
              </span>
              <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gray-200">
                Change
                <svg
                  className={`w-4 h-4 transition-transform ${isCategorySelectorOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Dropdown panel that appears on click */}
            {isCategorySelectorOpen && (
              <div className="absolute z-20 mt-2 w-full bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-2 shadow-lg">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setIsCategorySelectorOpen(false); // Close panel on selection
                    }}
                    className="w-full text-left rounded-lg p-3 hover:bg-white/10 text-white"
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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
                <div key={week} className="bg-white/5 outline-2 outline-offset-[-1px] outline-white/5 rounded-3xl overflow-hidden shadow-lg">
                  {/* Week Header - Clickable to expand/collapse */}
                  <button
                    onClick={() => toggleWeekExpansion(week)}
                    className="w-full px-6 py-3 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                  >
                    <h2 className="text-lg font-semibold text-gray-200">
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
                            className="bg-white/2 rounded-3xl outline-1 outline-offset-[-1px] backdrop-blur-[100px] outline-white/5 overflow-hidden shadow-md p-5 mt-4"
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
      </div>
    </main>
  );
}