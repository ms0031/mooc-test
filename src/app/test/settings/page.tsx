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
    { id: "psychology", name: "General Psychology" },
    { id: "learning", name: "Learning Theory" },
  ]);
  const [selectedWeek, setSelectedWeek] = useState("week1");
  const weeks = [
    { id: "week0", name: "Week 0" },
    { id: "week1", name: "Week 1" },
    { id: "week2", name: "Week 2" },
    { id: "week3", name: "Week 3" },
    { id: "week4", name: "Week 4" },
    { id: "week5", name: "Week 5" },
    { id: "week6", name: "Week 6" },
    { id: "week7", name: "Week 7" },
  ];

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
    
    if (studyMode) {
      params.append("mode", "study");
    }
    
    // Add psychology of learning specific parameters
    if (category === "psychology_of_learning") {
      if (shuffleWeeks) {
        params.append("shuffleWeeks", "true");
      } else {
        params.append("week", selectedWeek);
      }
    }
    
    // Navigate to test page with settings
    router.push(`/test?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Test Settings</h1>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Guest Mode Banner */}
          {!session && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    You're in guest mode. Log in to save your progress.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Test Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              <label htmlFor="timer-toggle" className="block text-sm font-medium text-gray-700">
                Enable Timer
              </label>
              <p className="text-xs text-gray-500">Track time during your test</p>
            </div>
            <button
              type="button"
              id="timer-toggle"
              disabled={studyMode}
              className={`${enableTimer ? 'bg-indigo-600' : 'bg-gray-200'} ${studyMode ? 'opacity-50 cursor-not-allowed' : ''} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => !studyMode && setEnableTimer(!enableTimer)}
            >
              <span className="sr-only">Enable timer</span>
              <span
                className={`${enableTimer ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              ></span>
            </button>
          </div>
          
          {/* Randomize Answers Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="randomize-toggle" className="block text-sm font-medium text-gray-700">
                Randomize Answers
              </label>
              <p className="text-xs text-gray-500">Shuffle the order of answer options</p>
            </div>
            <button
              type="button"
              id="randomize-toggle"
              className={`${randomizeAnswers ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setRandomizeAnswers(!randomizeAnswers)}
            >
              <span className="sr-only">Randomize answers</span>
              <span
                className={`${randomizeAnswers ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              ></span>
            </button>
          </div>
          
          {/* Psychology of Learning Week Selection */}
          {category === "psychology_of_learning" && (
            <>
              {/* Shuffle Weeks Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="shuffle-weeks-toggle" className="block text-sm font-medium text-gray-700">
                    Shuffle Weeks
                  </label>
                  <p className="text-xs text-gray-500">Mix questions from all weeks</p>
                </div>
                <button
                  type="button"
                  id="shuffle-weeks-toggle"
                  className={`${shuffleWeeks ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  onClick={() => setShuffleWeeks(!shuffleWeeks)}
                >
                  <span className="sr-only">Shuffle weeks</span>
                  <span
                    className={`${shuffleWeeks ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  ></span>
                </button>
              </div>
              
              {/* Week Selection (only visible when shuffle is off) */}
              {!shuffleWeeks && (
                <div>
                  <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Week
                  </label>
                  <select
                    id="week"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {weeks.map((week) => (
                      <option key={week.id} value={week.id}>
                        {week.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          
          {/* Study Mode Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="study-mode-toggle" className="block text-sm font-medium text-gray-700">
                Study Mode
              </label>
              <p className="text-xs text-gray-500">Practice without time pressure and see explanations</p>
            </div>
            <button
              type="button"
              id="study-mode-toggle"
              className={`${studyMode ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setStudyMode(!studyMode)}
            >
              <span className="sr-only">Enable study mode</span>
              <span
                className={`${studyMode ? 'translate-x-5' : 'translate-x-0'} pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              ></span>
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleStartTest}
            >
              Start Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}