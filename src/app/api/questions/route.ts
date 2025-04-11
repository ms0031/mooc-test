import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    await connectDB();

    const query = category ? { category } : {};
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: 10 } }, // Get 10 random questions
      {
        $project: {
          _id: 1,
          question: 1,
          options: 1,
          category: 1,
          difficulty: 1,
          explanation: 1,
          correctAnswer: 1,
        },
      },
    ]);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Error fetching questions" },
      { status: 500 }
    );
  }
}
