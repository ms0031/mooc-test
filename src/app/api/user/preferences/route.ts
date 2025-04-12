import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { theme } = await request.json();
    await connectDB();

    // Update user preferences
    await User.findByIdAndUpdate(
      session.user.id,
      { $set: { "preferences.theme": theme } },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { message: "Error updating preferences" },
      { status: 500 }
    );
  }
}
