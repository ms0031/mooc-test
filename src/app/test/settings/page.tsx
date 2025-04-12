"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function TestSettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [category, setCategory] = useState("psychology_of_learning");
  const [enableTimer, setEnableTimer] = useState(true);
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);
  const [shuffleWeeks, setShuffleWeeks] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [categories, setCategories] = useState([
    { id: "psychology_of_learning", name: "Psychology of Learning" },
  ]);
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>([]);
  // Dynamic weeks state – will be fetched from the API.
  const [weeks, setWeeks] = useState<{ id: string; name: string }[]>([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);

  // Fetch available weeks dynamically when the category is psychology_of_learning.
  useEffect(() => {
    async function fetchWeeks() {
      try {
        const res = await fetch("/api/psychology-questions?getWeeks=true");
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
    if (category === "psychology_of_learning") {
      fetchWeeks();
    }
  }, [category]);

  // Toggle study mode disables timer
  useEffect(() => {
    if (studyMode) {
      setEnableTimer(false);
    }
  }, [studyMode]);

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

    // Add psychology of learning specific parameters
    if (category === "psychology_of_learning") {
      if (shuffleWeeks) {
        params.append("shuffleWeeks", "true");
      } else {
        if (selectedWeeks.length > 0) {
          params.append("weeks", selectedWeeks.join(","));
        }
      }
    }

    // Navigate to test page with settings
    router.push(`/test?${params.toString()}`);
  };

  return (
    <div className="bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="mt-4 mb-16 lg:max-w-3xl lg:min-w-sm md:max-w-2xl min-w-sm mx-5 bg-white/1 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden">
        <div className="bg-white/5 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-200">Test Settings</h1>
        </div>

        {/* Two-column layout on large screens */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div
              className={`space-y-6 ${
                category === "psychology_of_learning" && shuffleWeeks
                  ? "lg:col-span-2"
                  : ""
              }`}
            >
              {/* Category Selection */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Test Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-3 py-2 border bg-slate-950/50 text-gray-200 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timer Toggle */}
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
              </div>

              {/* Randomize Answers Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="randomize-toggle"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Randomize Options
                  </label>
                  <p className="text-xs text-gray-400">
                    Shuffle the order of options
                  </p>
                </div>
                <button
                  type="button"
                  id="randomize-toggle"
                  className={`${
                    randomizeAnswers ? "bg-teal-500/90" : "bg-gray-500"
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setRandomizeAnswers(!randomizeAnswers)}
                >
                  <span className="sr-only">Randomize answers</span>
                  <span
                    className={`${
                      randomizeAnswers ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Randomize Questions Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="randomize-questions-toggle"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Randomize Questions
                  </label>
                  <p className="text-xs text-gray-400">
                    Shuffle the order of questions
                  </p>
                </div>
                <button
                  type="button"
                  id="randomize-questions-toggle"
                  className={`${
                    randomizeQuestions ? "bg-teal-500/90" : "bg-gray-500"
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setRandomizeQuestions(!randomizeQuestions)}
                >
                  <span className="sr-only">Randomize questions</span>
                  <span
                    className={`${
                      randomizeQuestions ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Study Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="study-mode-toggle"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Study Mode
                  </label>
                  <p className="text-xs text-gray-300">
                    Practice without time pressure and see answers
                  </p>
                </div>
                <button
                  type="button"
                  id="study-mode-toggle"
                  className={`${
                    studyMode ? "bg-red-500/80" : "bg-gray-500"
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setStudyMode(!studyMode)}
                >
                  <span className="sr-only">Enable study mode</span>
                  <span
                    className={`${
                      studyMode ? "translate-x-5" : "translate-x-0"
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>

              {/* Shuffle Weeks Toggle */}
              {category === "psychology_of_learning" && (
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="shuffle-weeks-toggle"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Shuffle Weeks
                    </label>
                    <p className="text-xs text-gray-400">
                      Mix questions from all weeks
                    </p>
                  </div>
                  <button
                    type="button"
                    id="shuffle-weeks-toggle"
                    className={`${
                      shuffleWeeks ? "bg-teal-500/90" : "bg-gray-500"
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    onClick={() => setShuffleWeeks(!shuffleWeeks)}
                  >
                    <span className="sr-only">Shuffle weeks</span>
                    <span
                      className={`${
                        shuffleWeeks ? "translate-x-5" : "translate-x-0"
                      } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex justify-between">
                <Button
                  variant="destructive"
                  onClick={() => router.push(`${session ? "/dashboard" : "/"}`)}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleStartTest}>
                  Start Test
                </Button>
              </div>
            </div>

            {/* Right Column: Week Selection (only displayed when shuffleWeeks is off) */}
            {category === "psychology_of_learning" && !shuffleWeeks && (
              <div className="bg-white/1 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] p-4">
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Select Weeks
                </label>
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
                        className={`px-4 py-2 rounded-full border text-sm 
                          ${
                            isSelected
                              ? "bg-teal-500 text-white border-teal-500"
                              : "bg-transparent text-gray-200 border-gray-200"
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
