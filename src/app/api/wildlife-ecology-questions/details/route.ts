import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import questionsByWeekData from "../../../../../questions_wildlife_ecology.json";

interface Question {
  qid: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuestionsByWeek {
  [key: string]: Question[];
}

const questionsByWeek = questionsByWeekData as QuestionsByWeek;

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json(
        { message: "Question IDs are required" },
        { status: 400 }
      );
    }

    const questionIds = ids.split(",").map((id) => id.trim());
    const allQuestions = Object.values(questionsByWeek).flat();
    const questions = allQuestions.filter((q) => questionIds.includes(q.qid));

    // Map the questions to match the expected format
    const mappedQuestions = questions.map((q) => ({
      ...q,
      correctAnswer: q.answer,
    }));

    return NextResponse.json({ questions: mappedQuestions });
  } catch (error) {
    console.error("Error fetching Wildlife Ecology question details:", error);
    return NextResponse.json(
      { message: "Error fetching Wildlife Ecology question details" },
      { status: 500 }
    );
  }
}
