import { NextResponse } from "next/server";
// Import the fixed JSON file. Adjust the relative path if necessary.
import questionsByWeekData from "../../../../questions_conservation_economics.json";

// Define interfaces.
interface Question {
  qid: string; // Add qid to interface
  question: string;
  options: string[];
  answer: string;
}

interface QuestionsByWeek {
  [key: string]: Question[];
}

// Explicitly cast the imported JSON to the correct type.
const questionsByWeek = questionsByWeekData as QuestionsByWeek;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // If getWeeks is true, return the available week IDs.
    if (searchParams.get("getWeeks") === "true") {
      const weeks = Object.keys(questionsByWeek);
      return NextResponse.json({ weeks });
    }

    const shuffleWeeks = searchParams.get("shuffleWeeks") === "true";
    const weeksParam = searchParams.get("weeks");
    const week = searchParams.get("week");

    let selectedQuestions: Question[] = [];

    if (shuffleWeeks) {
      // Combine questions from all weeks and shuffle them.
      const allQuestions = Object.values(questionsByWeek).flat();
      selectedQuestions = shuffleArray(allQuestions);
    } else if (weeksParam) {
      // Handle multiple weeks provided as a comma‑separated list.
      const selectedWeeks = weeksParam.split(",").map((w) => w.trim());
      selectedQuestions = selectedWeeks.flatMap(
        (w) => questionsByWeek[w] || []
      );
    } else if (week && questionsByWeek[week]) {
      // Return questions for the specific week.
      selectedQuestions = questionsByWeek[week];
    } else {
      // Default to week1 questions if nothing is provided.
      selectedQuestions = questionsByWeek["week1"] || [];
    }

    // Add _id to each question and map "answer" to "correctAnswer" for frontend consistency
    const questionsWithIds = selectedQuestions.map((q, index) => ({
      ...q,
      _id: `question_${index}`,
      qid: q.qid, // Ensure qid is included
      correctAnswer: q.answer,
    }));

    return NextResponse.json({ questions: questionsWithIds });
  } catch (error) {
    console.error("Error fetching Conservation Economics questions:", error);
    return NextResponse.json(
      { message: "Error fetching Conservation Economics questions" },
      { status: 500 }
    );
  }
}

// Helper function to shuffle an array.
function shuffleArray(array: Question[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
