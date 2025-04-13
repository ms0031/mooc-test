import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Feedback from "@/models/Feedback";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { type, rating, message } = await request.json();

    // Validate required fields
    if (!type || !rating || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const feedback = await Feedback.create({
      userId: session?.user?.id, // Will be undefined for non-authenticated users
      type,
      rating,
      message,
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully", feedback },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      {
        message: "Error submitting feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admin users to fetch feedback
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const feedback = await Feedback.find().sort({ createdAt: -1 }).limit(100); // Limit to last 100 feedback entries

    return NextResponse.json({ feedback });
  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      {
        message: "Error fetching feedback",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
