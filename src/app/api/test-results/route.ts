import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import TestResult from "@/models/TestResult";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { category, answers, timeTaken } = await request.json();

    if (!session && !answers) {
      return NextResponse.json(
        { message: "Unauthorized or invalid data" },
        { status: 401 }
      );
    }

    await connectDB();

    const correctAnswers = answers.filter((a: any) => a.isCorrect).length;
    const score = Math.round((correctAnswers / answers.length) * 100);

    const testResult = await TestResult.create({
      userId: session?.user?.id,
      isGuest: !session,
      category,
      score,
      totalQuestions: answers.length,
      correctAnswers,
      wrongAnswers: answers.length - correctAnswers,
      timeTaken,
      answers,
    });

    return NextResponse.json({ testResult }, { status: 201 });
  } catch (error) {
    console.error("Error saving test result:", error);
    return NextResponse.json(
      { message: "Error saving test result" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const results = await TestResult.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error fetching test results:", error);
    return NextResponse.json(
      { message: "Error fetching test results" },
      { status: 500 }
    );
  }
}
