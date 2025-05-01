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
      } else{
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

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[15px] overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-200">⚔️ Final Boss</h1>
            <div className="flex items-center space-x-4">
              <div className="text-gray-300">
                <CountdownTimer 
                  duration={timeRemaining} 
                  onTimeUp={handleTimeUp} 
                />
              </div>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? "Submitting..." : "Submit Test"}
              </Button>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-6">
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
            
                  }}
                  className="w-full bg-white/50 border border-gray-700 rounded-xl py-2 px-3 text-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={submitted || isLoading }
                >
                  <option value="psychology_of_learning">Psychology of Learning</option>
                  <option value="conservation_economics">Conservation Economics</option>
                  <option value="sustainable_development">Sustainable Development</option>
                </select>
              </div>
              <p className="text-gray-300 mb-2">
                This is a simulated real test with 50 randomly selected questions from {selectedCategory.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}.
                You have 60 minutes to complete the test.
              </p>
              <p className="text-gray-300">
                Each correct answer is worth 2 marks. Total marks: 100
              </p>
            </div>

            <div className="space-y-8">
              {questions.map((question, index) => (
                <div 
                  key={question.qid} 
                  className="bg-white/5 rounded-xl p-5"
                >
                  <h3 className="text-lg font-medium text-gray-200 mb-4">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${userAnswers[question.qid] === option ? 'bg-indigo-600/30 border border-indigo-500' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
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

            <div className="mt-8 flex justify-end">
              <Button
                variant="primary"
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
  );
}