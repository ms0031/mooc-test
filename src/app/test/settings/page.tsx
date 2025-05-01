"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";

export default function TestSettingsPage() {
  const router = useTransitionRouter();
  const { data: session } = useSession();

  const [category, setCategory] = useState("sustainable_development");
  const [enableTimer, setEnableTimer] = useState(true);
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);
  const [shuffleWeeks, setShuffleWeeks] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [categories, setCategories] = useState([
    { id: "conservation_economics", name: "Conservation Economics" },
    { id: "psychology_of_learning", name: "Psychology of Learning" },
    { id: "sustainable_development", name: "Sustainable Development" },
  ]);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  // Dynamic weeks state – will be fetched from the API.
  const [weeks, setWeeks] = useState<{ id: string; name: string }[]>([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(true);

  // Fetch available weeks dynamically when the category is psychology_of_learning.
  useEffect(() => {
    async function fetchWeeks() {
      try {
        let apiUrl = "/api/psychology-questions?getWeeks=true";
        if (category === "conservation_economics") {
          apiUrl = "/api/conservation-economics-questions?getWeeks=true";
        } else if (category === "psychology_of_learning") {
          apiUrl = "/api/psychology-questions?getWeeks=true";
        } else if (category === "sustainable_development") {
          apiUrl = "/api/sustainable-development-questions?getWeeks=true";
        }
        const res = await fetch(apiUrl);
        const data = await res.json();
        // Expecting an object like { weeks: ["week0", "week1", ...] }
        if (data.weeks) {
          const availableWeeks = data.weeks.map((week: string) => ({
            id: week,
            name: week.replace("week", "Week "),
          }));
          setWeeks(availableWeeks);
        }
      } catch (error) {
        console.error("Error fetching weeks:", error);
      }
    }
    fetchWeeks();
  }, [category]);

  // Toggle study mode disables timer
  useEffect(() => {
    if (studyMode) {
      setEnableTimer(false);
    }
  }, [studyMode]);

  // Ensure randomizeQuestions is always true when shuffleWeeks is enabled
  useEffect(() => {
    if (shuffleWeeks && !randomizeQuestions) {
      setRandomizeQuestions(true);
    }
  }, [shuffleWeeks]);

  const handleStartTest = () => {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("category", category);

    if (!enableTimer) {
      params.append("timer", "off");
    }

    if (randomizeAnswers) {
      params.append("randomize", "true");
    }

    if (randomizeQuestions) {
      params.append("randomizeQuestions", "true");
    }

    if (studyMode) {
      params.append("mode", "study");
    }

    if (shuffleWeeks) {
      params.append("shuffleWeeks", "true");
    } else {
      if (selectedWeeks.length > 0) {
        params.append("weeks", selectedWeeks.join(","));
      }
    }

    // Navigate to test page with settings
    router.push(`/test?${params.toString()}`, {
      onTransitionReady: () => pageAnimation('left'),
    });
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="mt-4 mb-16 lg:max-w-3xl lg:min-w-sm md:max-w-2xl min-w-9/10 mx-5 bg-white/1 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden">
        <div className="bg-white/5 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-200">Test Settings</h1>
        </div>

        {/* Two-column layout on large screens */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div
              className={`space-y-6 ${category && shuffleWeeks ? "lg:col-span-2" : ""
                }`}
            >
              {/* Category Selection */}
              <div>
                <label
                  htmlFor="category"
                  className="block font-medium text-gray-200 mb-2"
                >
                  Test Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-3 py-2.5 border bg-slate-950/50 text-gray-200 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timer Toggle
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="timer-toggle"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Enable Timer
                  </label>
                  <p className="text-xs text-gray-400">
                    Track time during your test
                  </p>
                </div>
                <button
                  type="button"
                  id="timer-toggle"
                  disabled={studyMode}
                  className={`${
                    enableTimer ? "bg-teal-500/90" : "bg-gray-500"
                  } ${
                    studyMode ? "opacity-50 cursor-not-allowed" : ""
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => !studyMode && setEnableTimer(!enableTimer)}
                >
                  <span className="sr-only">Enable timer</span>
                  <span
                    className={`${
                      enableTimer ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div> */}

              {/* Randomize Answers Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="randomize-toggle"
                    className="block font-medium text-gray-200"
                  >
                    Randomize Options
                  </label>
                  <p className=" text-gray-400">
                    Shuffle the order of options
                  </p>
                </div>
                <button
                  type="button"
                  id="randomize-toggle"
                  className={`${randomizeAnswers ? "bg-teal-500/90" : "bg-gray-500"
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setRandomizeAnswers(!randomizeAnswers)}
                >
                  <span className="sr-only">Randomize answers</span>
                  <span
                    className={`${randomizeAnswers ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Randomize Questions Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="randomize-questions-toggle"
                    className="block font-medium text-gray-200"
                  >
                    Randomize Questions
                  </label>
                  <p className=" text-gray-400">
                    Shuffle the order of questions
                  </p>
                </div>
                <button
                  type="button"
                  id="randomize-questions-toggle"
                  disabled={shuffleWeeks}
                  className={`${randomizeQuestions && shuffleWeeks ? "bg-teal-500/30" : randomizeQuestions ? "bg-teal-500/90" : "bg-gray-500"
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => !shuffleWeeks && setRandomizeQuestions(!randomizeQuestions)}
                >
                  <span className="sr-only">Randomize questions</span>
                  <span
                    className={`${randomizeQuestions ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Study Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="study-mode-toggle"
                    className="block font-medium text-gray-200"
                  >
                    Study Mode
                  </label>
                  <p className=" text-gray-400">
                    See answers immediately
                  </p>
                </div>
                <button
                  type="button"
                  id="study-mode-toggle"
                  className={`${studyMode ? "bg-red-500/80" : "bg-gray-500"
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setStudyMode(!studyMode)}
                >
                  <span className="sr-only">Enable study mode</span>
                  <span
                    className={`${studyMode ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Shuffle Weeks Toggle */}
              {category && (
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="shuffle-weeks-toggle"
                      className="block font-medium text-gray-200"
                    >
                      Shuffle Weeks
                    </label>
                    <p className=" text-gray-400">
                      Mix questions from all weeks
                    </p>
                  </div>
                  <button
                    type="button"
                    id="shuffle-weeks-toggle"
                    className={`${shuffleWeeks ? "bg-teal-500/90" : "bg-gray-500"
                      } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => setShuffleWeeks(!shuffleWeeks)}
                  >
                    <span className="sr-only">Shuffle weeks</span>
                    <span
                      className={`${shuffleWeeks ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex justify-between">
                <Button
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(`${session ? "/dashboard" : "/"}`, {
                      onTransitionReady: () => pageAnimation('right'),
                    })
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleStartTest}>
                  Start Test
                </Button>
              </div>
            </div>

            {/* Right Column: Week Selection (only displayed when shuffleWeeks is off) */}
            {category && !shuffleWeeks && (
              <div className="bg-white/1 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium text-gray-200">
                    Select Weeks
                  </label>
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setSelectedWeeks(weeks.map(w => w.id))}
                      className="p-2 text-gray-300 hover:text-teal-400 transition-colors"
                      title="Select All Weeks"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"  fill="none" stroke="#4CAF50" strokeOpacity="0.8" strokeWidth="2" />
                        <path d="M8 12l3 3 6-6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWeeks([])}
                      className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                      title="Clear All Weeks"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#F44336" strokeOpacity="0.8" strokeWidth="2"/>
                        <path d="M16 8l-8 8m0-8l8 8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {weeks.map((week) => {
                    const isSelected = selectedWeeks.includes(week.id);
                    return (
                      <button
                        key={week.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedWeeks(
                              selectedWeeks.filter((w) => w !== week.id)
                            );
                          } else {
                            setSelectedWeeks([...selectedWeeks, week.id]);
                          }
                        }}
                        className={`px-4 py-3.5 font-medium rounded-3xl border text-sm 
                          transition-all duration-300 ease-in-out transform
                          ${isSelected
                            ? "bg-teal-500/80 text-white scale-110 border-teal-500/0 shadow-md animate-pulse-subtle"
                            : "bg-transparent text-gray-300 border-gray-200 hover:border-teal-300"
                          }`}
                      >
                        {week.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
