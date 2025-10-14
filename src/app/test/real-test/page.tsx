"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import questionsByWeekData from "@/../questions_psychology_of_learning.json";
import conservationEconomicsData from "@/../questions_conservation_economics.json";
import sustainableDevData from "@/../questions_sustainable_development.json";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import TestNavbar from "@/components/ui/TestNavbar";

interface Question {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuestionsByWeek {
  [week: string]: Question[];
}

export default function RealTestPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [testStartTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes for real test
  const [selectedCategory, setSelectedCategory] = useState<string>("sustainable_development");
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = useState(false);
  const categories = [
    { id: 'psychology_of_learning', label: 'Psychology of Learning' },
    { id: 'conservation_economics', label: 'Conservation Economics' },
    { id: 'sustainable_development', label: 'Sustainable Development' },
  ];
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    setIsLoading(true);
    setQuestions([]);
    prepareQuestions();
  }, [status, router, selectedCategory]);

  const prepareQuestions = () => {
    try {
      // Get questions from selected category only
      let categoryQuestions;
      if (selectedCategory === 'psychology_of_learning') {
        categoryQuestions = Object.values(questionsByWeekData as QuestionsByWeek).flat();
      } else if (selectedCategory === 'conservation_economics') {
        categoryQuestions = Object.values(conservationEconomicsData as QuestionsByWeek).flat();
      } else {
        categoryQuestions = Object.values(sustainableDevData as QuestionsByWeek).flat();
      }

      // Shuffle and select 50 questions from selected category
      const shuffledQuestions = shuffleArray([...categoryQuestions]).slice(0, 50);

      // Shuffle options for each question
      const questionsWithShuffledOptions = shuffledQuestions.map(q => ({
        ...q,
        options: shuffleArray([...q.options])
      }));

      setQuestions(questionsWithShuffledOptions);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to prepare questions. Please try again.");
      console.error("Error preparing questions:", error);
      setIsLoading(false);
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(userAnswers).length !== questions.length) {
      const unansweredCount = questions.length - Object.keys(userAnswers).length;
      if (!confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`)) {
        return;
      }
    }
    setSubmitted(true);
    calculateResults();
  };

  const calculateResults = () => {
    // Calculate total time taken
    const totalTime = Math.round((new Date().getTime() - testStartTime.getTime()) / 1000);

    // Calculate score
    let correctCount = 0;
    const processedAnswers = questions.map(q => {
      const userAnswer = userAnswers[q.qid] || "";
      const isCorrect = userAnswer === q.answer;
      if (isCorrect) correctCount++;

      return {
        qid: q.qid,
        question: q.question,
        userAnswer,
        isCorrect,
        timeSpent: 0,
        correctAnswer: q.answer
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const marksScored = correctCount * 2;
    const totalMarks = questions.length * 2;

    // Calculate normalized score (75% test + 25% assignment with full marks)
    const testContribution = (marksScored / totalMarks) * 0.75;
    const assignmentContribution = 0.25; // Assuming full marks
    const normalizedScore = Math.round((testContribution + assignmentContribution) * 100);

    // Save wrong answers to local storage
    const wrongAnswers = processedAnswers.filter(answer => !answer.isCorrect);
    try {
      localStorage.setItem('realTestWrongAnswers', JSON.stringify(wrongAnswers));
    } catch (error) {
      console.error("Error saving wrong answers to local storage:", error);
    }

    // Prepare result data
    const resultData = {
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeTaken: totalTime,
      category: "real_test",
      answers: processedAnswers,
      marksScored,
      totalMarks,
      normalizedScore
    };

    // Navigate to result page with only statistics
    const { answers, ...stats } = resultData;
    router.push(`/test/real-test/result?result=${encodeURIComponent(JSON.stringify(stats))}`);
  };

  const handleTimeUp = () => {
    alert("Time's up! Your test will be submitted automatically.");
    handleSubmit();
  };

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }
  const selectedCategoryLabel = categories.find(c => c.id === selectedCategory)?.label || "Select Category";
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
      <TestNavbar 
        answeredQuestions={Object.keys(userAnswers).length} 
        totalQuestions={questions.length} 
      />
    <div className="relative z-10">
    <div className="min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-4xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[15px] overflow-hidden">
          <div className="p-5">
            <div className="mb-6 p-6 bg-black/20 rounded-4xl border border-white/10">
                <div className="mb-4">
                  <div className="relative">
                    <button
                      onClick={() => !submitted && !isLoading && setIsCategorySelectorOpen(!isCategorySelectorOpen)}
                      disabled={submitted || isLoading}
                      className="w-full flex items-center justify-between rounded-full bg-black/20 p-2 pl-4 border border-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-white font-semibold">{selectedCategoryLabel}</span>
                      <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gray-200">
                        Change
                        <svg className={`w-4 h-4 transition-transform ${isCategorySelectorOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    {isCategorySelectorOpen && (
                      <div className="absolute z-20 mt-2 w-full bg-slate-900 text-white backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-lg">
                        {categories.map((cat) => (
                          <button key={cat.id} type="button" onClick={() => { setSelectedCategory(cat.id); setIsCategorySelectorOpen(false); }} className={`w-full text-left mb-1 rounded-xl p-3 py-2 hover:bg-white/10 transition-colors ${selectedCategory === cat.id ? 'bg-white/10' : ''}`}>
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                    This is a simulated test with <strong>50 random questions</strong>. You have <strong>60 minutes</strong>. Each correct answer is worth <strong>2 marks</strong>.
                </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={question.qid}
                  className="bg-white/5 rounded-3xl p-5 py-4"
                >
                  <h3 className="text-lg font-medium text-gray-200 mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`px-3 py-2 rounded-xl cursor-pointer transition-colors ${userAnswers[question.qid] === option ? 'bg-indigo-600/30 border border-indigo-500' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                        onClick={() => handleAnswerSelect(question.qid, option)}
                      >
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${userAnswers[question.qid] === option ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'} flex items-center justify-center mr-3 mt-0.5`}>
                            {userAnswers[question.qid] === option && (
                              <div className="h-2 w-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="text-gray-300">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                variant="glassTeal"
                size="lg"
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? "Submitting..." : "Submit Test"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </main>
  );
}