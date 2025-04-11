import { NextResponse } from "next/server";
import { questionsByWeek } from "../../../../questions_psychology_of_learning";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shuffleWeeks = searchParams.get("shuffleWeeks") === "true";
    const week = searchParams.get("week");
    
    let selectedQuestions = [];
    
    if (shuffleWeeks) {
      // Combine questions from all weeks and shuffle them
      const allQuestions = Object.values(questionsByWeek).flat();
      selectedQuestions = shuffleArray(allQuestions).slice(0, 10); // Get 10 random questions
    } else if (week && questionsByWeek[week]) {
      // Get questions from specific week
      selectedQuestions = questionsByWeek[week];
    } else {
      // Default: get questions from week1
      selectedQuestions = questionsByWeek.week1 || [];
    }
    
    // Add _id to each question to match the expected format in the frontend
    const questionsWithIds = selectedQuestions.map((q, index) => ({
      ...q,
      _id: `psychology_${index}`,
    }));

    return NextResponse.json({ questions: questionsWithIds });
  } catch (error) {
    console.error("Error fetching psychology questions:", error);
    return NextResponse.json(
      { message: "Error fetching psychology questions" },
      { status: 500 }
    );
  }
}

// Function to shuffle array
function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}