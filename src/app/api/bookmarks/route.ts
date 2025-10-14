import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

// GET /api/bookmarks - Get all bookmarked question IDs for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find user by email instead of ID to avoid ObjectId conversion issues
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ bookmarkedQids: user.bookmarkedQids || [] });
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Add a question to bookmarks
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { qid } = await req.json();
    if (!qid) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Add qid if not already bookmarked
    if (!user.bookmarkedQids.includes(qid)) {
      user.bookmarkedQids.push(qid);
      await user.save();
    }

    return NextResponse.json({ bookmarkedQids: user.bookmarkedQids });
  } catch (error: any) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json(
      { message: error.message || "Error adding bookmark" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a question from bookmarks
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const qid = searchParams.get("qid");
    if (!qid) {
      return NextResponse.json(
        { message: "Question ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Remove qid from bookmarks
    user.bookmarkedQids = user.bookmarkedQids.filter((id: string) => id !== qid);
    await user.save();

    return NextResponse.json({ bookmarkedQids: user.bookmarkedQids });
  } catch (error: any) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { message: error.message || "Error removing bookmark" },
      { status: 500 }
    );
  }
}