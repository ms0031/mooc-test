"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import ToggleSwitch from '@/components/ui/ToggleSwitch';

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
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
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
    <div className=" min-h-screen flex items-center justify-center">
      <div className="mt-4 mb-16 lg:max-w-3xl lg:min-w-sm md:max-w-2xl min-w-9/10 mx-5 bg-white/1 rounded-4xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-center text-2xl font-bold text-gray-200">Test Settings</h1>
        </div>
        <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mb-4 mx-auto"></div>

        {/* Two-column layout on large screens */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div
              className={`space-y-6 ${category && shuffleWeeks ? "lg:col-span-2" : ""
                }`}
            >
              {/* UPDATED: Category Selection */}
              <div>
                <div className="relative">
                  {/* Trigger button showing the selected category */}
                  <button
                    id="category"
                    onClick={() => setIsCategorySelectorOpen(!isCategorySelectorOpen)}
                    className="w-full flex items-center justify-between rounded-full bg-white/5 p-2 pl-4 backdrop-blur-md border border-white/15"
                  >
                    <span className="mr-2 text-white font-semibold">
                      {categories.find(c => c.id === category)?.name}
                    </span>
                    <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gray-200">
                        Change
                      <svg
                        className={`w-5 h-5 transition-transform ${isCategorySelectorOpen ? 'rotate-180' : ''}`}
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
                    <div className="absolute z-20 mt-2 w-full bg-slate-900 backdrop-blur-xl border border-white/15 rounded-3xl p-2 shadow-lg">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCategorySelectorOpen(false); // Close panel on selection
                          }}
                          className={`w-full text-left rounded-2xl p-3 hover:bg-white/10 transition-colors ${
                            category === cat.id ? 'bg-white/10 text-white' : 'text-gray-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 bg-white/5 p-5 rounded-3xl border border-white/10">
                <ToggleSwitch
                  label="Study Mode"
                  description="See answers immediately"
                  isEnabled={studyMode}
                  isRed={true}
                  onToggle={() => setStudyMode(!studyMode)}
                    />
                <div className=" h-0.5 w-40 bg-white/20 rounded-3xl mx-auto"></div>
                <ToggleSwitch
                  label="Randomize Options"
                  description="Shuffle the order of options"
                  isEnabled={randomizeAnswers}
                  onToggle={() => setRandomizeAnswers(!randomizeAnswers)}
                />
                <ToggleSwitch
                  label="Randomize Questions"
                  description="Shuffle the order of questions"
                  isEnabled={randomizeQuestions}
                  onToggle={() => setRandomizeQuestions(!randomizeQuestions)}
                  isDisabled={shuffleWeeks} // This toggle is disabled when "Shuffle Weeks" is on
                />
                {/* <ToggleSwitch
                  label="Shuffle Weeks"
                  description="Mix questions from all weeks"
                  isEnabled={shuffleWeeks}
                  onToggle={() => setShuffleWeeks(!shuffleWeeks)}
                /> */}
              </div>
                  
              {/* Action Buttons */}
              <div className="flex justify-center">
                    <Button variant="glassTeal"
                      onClick={handleStartTest}
                      size={"lg"}>
                  Start Test
                </Button>
              </div>
            </div>
                
            
            {/* Right Column: Week Selection (only displayed when shuffleWeeks is off) */}
            {category && !shuffleWeeks && (
              <div className="bg-white/3 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] p-4">
                <div className="flex items-center justify-center mb-2">
                  <label className="block font-medium text-gray-200">
                    Select Weeks
                  </label>
                    </div>
                <div className=" h-0.5 w-20 bg-white/20 rounded-3xl mx-auto mb-3"></div>
                <div className="grid grid-cols-3 gap-4">
                {weeks.map((week) => {
                  const isSelected = selectedWeeks.includes(week.id);
                  return (
                    <label
                      key={week.id}
                      className={`relative flex items-center justify-center py-2 rounded-3xl border-2 transition-all duration-200 cursor-pointer 
                        ${isSelected 
                          ? 'border-teal-500/50 bg-teal-500/20 text-white' 
                          : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/50 hover:bg-white/10'
                        }`}
                    >
                      {/* Hidden checkbox to manage state */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          if (isSelected) {
                            setSelectedWeeks(selectedWeeks.filter((w) => w !== week.id));
                          } else {
                            setSelectedWeeks([...selectedWeeks, week.id]);
                          }
                        }}
                        className="sr-only" // Visually hide the default checkbox
                      />
                      <span className="font-medium text-sm">{week.name}</span>
                    </label>
                  );
                })}
                    </div>
                    <div className=" h-0.5 w-40 bg-white/20 rounded-3xl mt-4 mx-auto"></div>
                    <div className="flex justify-between mt-4">
                        <Button variant="glassTeal"
                          onClick={() => setSelectedWeeks(weeks.map(w => w.id))}
                          className="p-2 px-3 text-gray-300 "
                          size={"round"}>
                          Select All
                        </Button>
                        <Button variant="glassRed"
                          onClick={() => setSelectedWeeks([])}
                          className="p-2 px-3 text-gray-300 "
                          size={"round"}>
                          Clear All
                        </Button>
                      </div>
              </div>
                )}
                
          </div>
        </div>
      </div>
      </div>
      </div>
    </main>
  );
}
