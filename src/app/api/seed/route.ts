import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import { sampleQuestions } from "./questions";

export async function POST() {
  try {
    await connectDB();

    // Clear existing questions
    await Question.deleteMany({});

    // Insert sample questions
    await Question.insertMany(sampleQuestions);

    return NextResponse.json(
      { message: "Database seeded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { message: "Error seeding database" },
      { status: 500 }
    );
  }
}
