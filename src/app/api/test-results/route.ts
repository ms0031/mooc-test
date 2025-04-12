import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import TestResult from "@/models/TestResult";
import { authOptions } from "@/lib/auth";
import { ITestAnswer } from "@/models/TestResult"; // Import the interface if needed

export async function POST(request: Request) {
  try {
    console.log("Received POST request for test results");
    const session = await getServerSession(authOptions);
    const payload = await request.json();
    console.log("Payload received:", payload);

    // Destructure all expected fields from the payload
    const {
      category,
      answers,
      timeTaken,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
    } = payload;

    // Validate required fields
    if (
      !category ||
      !answers ||
      !Array.isArray(answers) ||
      answers.length === 0 ||
      typeof timeTaken !== "number"
    ) {
      console.error("Invalid payload structure or missing fields:", payload);
      return NextResponse.json(
        { message: "Invalid data provided" },
        { status: 400 }
      );
    }

    await connectDB();
    console.log("Connected to DB.");

    // Prepare answers data, ensuring structure matches the schema
    const processedAnswers: ITestAnswer[] = answers.map((ans: any) => ({
      qid: String(ans.qid), // Changed from questionId to qid
      userAnswer: String(ans.userAnswer),
      isCorrect: Boolean(ans.isCorrect),
      timeSpent: Number(ans.timeSpent) || 0,
      // Ensure wrongFrequency is an object, default to empty if null/undefined
      wrongFrequency:
        typeof ans.wrongFrequency === "object" && ans.wrongFrequency !== null
          ? ans.wrongFrequency
          : {},
      correctAnswer: String(ans.correctAnswer),
    }));
    console.log("Processed answers for DB:", processedAnswers);

    // Create the TestResult document
    const testResultData = {
      // Use session?.user?.id if available, otherwise null for guests
      userId: session?.user?.id || null,
      isGuest: !session?.user?.id,
      category: String(category),
      // Use values directly from payload if they are pre-calculated client-side
      score: Number(score),
      totalQuestions: Number(totalQuestions),
      correctAnswers: Number(correctAnswers),
      wrongAnswers: Number(wrongAnswers),
      // Or recalculate server-side if needed (more robust)
      // totalQuestions: processedAnswers.length,
      // correctAnswers: processedAnswers.filter(a => a.isCorrect).length,
      // wrongAnswers: processedAnswers.filter(a => !a.isCorrect).length,
      // score: Math.round((processedAnswers.filter(a => a.isCorrect).length / processedAnswers.length) * 100),
      timeTaken: Number(timeTaken),
      answers: processedAnswers,
    };

    console.log("Data being sent to TestResult.create:", testResultData);

    const testResult = await TestResult.create(testResultData);
    console.log("Test result saved successfully:", testResult._id); // Log the ID of the saved doc

    return NextResponse.json(
      { success: true, testResultId: testResult._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("--- Error saving test result ---");
    console.error("Error Message:", error.message);
    // Log validation errors specifically if available
    if (error.name === "ValidationError") {
      console.error("Validation Errors:", error.errors);
    }
    console.error("Error Stack:", error.stack);
    console.error("--- End Error Log ---");
    return NextResponse.json(
      { message: "Error saving test result", error: error.message },
      { status: 500 }
    );
  }
}

// --- GET Request Handler (keep as is or update if needed) ---
export async function GET(request: Request) {
  try {
    console.log("Received GET request for test results");
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.error("User not authenticated for GET");
      // Decide if you want to return guest results or require login
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    console.log("Connected to DB for GET.");

    const results = await TestResult.find({ userId: session.user.id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(10); // Limit to the last 10 results
    console.log(
      `Fetched ${results.length} results for user ${session.user.id}`
    );

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Error fetching test results:", error.message);
    console.error(error.stack);
    return NextResponse.json(
      { message: "Error fetching test results", error: error.message },
      { status: 500 }
    );
  }
}
