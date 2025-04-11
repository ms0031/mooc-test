import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import Question from "@/models/Question";
import { authOptions } from "../../auth/[...nextauth]/route";

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

    await connectDB();

    const questionIds = ids.split(",").map((id) => id.trim());
    const questions = await Question.find({ _id: { $in: questionIds } });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching question details:", error);
    return NextResponse.json(
      { message: "Error fetching question details" },
      { status: 500 }
    );
  }
}