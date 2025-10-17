"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useBookmarkStore } from "@/lib/stores/bookmarkStore";
import BookmarkButton from "@/components/ui/BookmarkButton";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import psychologyData from "../../../../questions_psychology_of_learning.json";
import conservationData from "../../../../questions_conservation_economics.json";
import sustainableDevData from "../../../../questions_sustainable_development.json";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

interface Question {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuestionsByWeek {
  [key: string]: Question[];
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { bookmarkedQids, setBookmarks } = useBookmarkStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/bookmarks");
        
        if (!response.ok) {
          throw new Error("Failed to fetch bookmarks");
        }
        
        const data = await response.json();
        setBookmarks(data.bookmarkedQids || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchBookmarks();
    }
  }, [status, router, setBookmarks]);

  // Helper function to get question details from JSON files
  const getQuestionDetails = (qid: string): Question | undefined => {
    if (qid.startsWith("p_")) {
      const allPsychQuestions = Object.values(psychologyData as QuestionsByWeek).flat();
      return allPsychQuestions.find((q) => q.qid === qid);
    } else if (qid.startsWith("c_")) {
      const allConservationQuestions = Object.values(conservationData as QuestionsByWeek).flat();
      return allConservationQuestions.find((q) => q.qid === qid);
    } else if (qid.startsWith("s_")) {
      const allSustainableDevQuestions = Object.values(sustainableDevData as QuestionsByWeek).flat();
      return allSustainableDevQuestions.find((q) => q.qid === qid);
    }
    return undefined;
  };

  // Get details for all bookmarked questions
  const bookmarkedQuestions = useMemo(() => {
    return bookmarkedQids
      .map(getQuestionDetails)
      .filter((q): q is Question => q !== undefined);
  }, [bookmarkedQids]);

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold text-gray-200">
            Bookmarked Questions
              </h1>
            <div className=" h-0.5 w-20 bg-white/20 rounded-3xl my-2 mx-auto"></div>
          <p className="text-center mt-2 text-gray-400">
            Your saved questions for future reference.
          </p>
        </div>

        <div className="bg-white/5 rounded-4xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-2xl overflow-hidden p-6">
          {bookmarkedQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">You have no saved questions.</p>
              <button 
                onClick={() => router.push("/dashboard/study")}
                className="mt-4 px-6 py-2 bg-indigo-500/5 border border-white/20 text-white rounded-3xl hover:bg-indigo-700 transition-colors"
              >
                Browse Questions
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookmarkedQuestions.map((question) => (
                <div 
                  key={question.qid}
                  className="bg-white/3 rounded-3xl outline-1 outline-offset-[-1px] outline-white/5 overflow-hidden shadow-md p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-200 flex-1 pr-4">
                      {question.question}
                    </h3>
                    <BookmarkButton qid={question.qid} />
                  </div>
                  
                  <div className="space-y-3 text-gray-100">
                    {question.options.map((option, idx) => {
                      const isCorrect = option === question.answer;
                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded-2xl ${
                            isCorrect 
                              ? "bg-green-500/20 border border-green-500/30" 
                              : "bg-white/5 border border-white/10"
                          }`}
                        >
                          {option}
                          {isCorrect && (
                            <span className="ml-2 text-green-400">✓ Correct</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </div>
        </div>
    </main>
  );
}