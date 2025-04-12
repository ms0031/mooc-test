import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

// Create analytics schema
const analyticsSchema = new mongoose.Schema({
  userId: String,
  path: String,
  params: Object,
  timestamp: Date,
  userAgent: String,
});

// Get the model, creating it if it doesn't exist
const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const userAgent = request.headers.get("user-agent");

    await connectDB();

    await Analytics.create({
      userId: session?.user?.id || "anonymous",
      path: data.path,
      params: data.params,
      timestamp: new Date(data.timestamp),
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    // Return success anyway to avoid disrupting user experience
    return NextResponse.json({ success: true });
  }
}
