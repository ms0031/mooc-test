import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/lib/mongodb";
import GoogleUser from "@/models/GoogleUser";
import TestResult from "@/models/TestResult";
import User from "@/models/User";
import mongoose, { Types } from 'mongoose';

// --- Interfaces for Data Shapes ---
interface LeanGoogleUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    image?: string;
}

interface LeanUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
}

interface AggregatedBookmarkedUser {
     _id: Types.ObjectId;
    name: string;
    email: string;
    bookmarkCount: number;
}

interface TopQuestionStat {
    _id: string; // This will be the qid
    count: number;
}

interface AdminStatsData {
  kpis: { /* ... */ };
  googleUsers: { /* ... */ };
  users: { /* ... */ };
  tests: { /* ... */ };
  // New fields
  topBookmarkedQuestions: TopQuestionStat[];
  topWrongAnsweredQuestions: TopQuestionStat[];
}
// --- End Interfaces ---

// Helper function to get larger Google Image URL
const getLargeGoogleImageUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    // Remove size constraints like =s96-c or =s100-c etc.
    return url.replace(/=s\d+(-c)?$/, '');
};


export async function GET(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request as any, secret });

  if (!token || (token as { role?: string }).role !== "admin") {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await connectDB();

  try {
    // --- Existing Date Calculations & KPI Fetching ---
    const now = new Date();
    // ... (oneMinuteAgo, twoMinutesAgo, etc.)
    const oneMinuteAgo = new Date(now.getTime() - 1 * 60 * 1000);
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [
        totalRegisteredUsers,
        totalGoogleUsers,
        totalTestsCompleted,
        avgStats,
        googleUsersLoginsLast1Min,
        googleUsersLoginsLast2Min,
        googleUsersLoginsLast5Min,
        googleUsersLoginsLast30Min,
        googleUsersLoginsLast1Hour,
        allGoogleUsersLean,
        googleUsersMostBookmarked,
        allUsersLean,
        usersMostBookmarked,
        testsPerCategory,
        // --- NEW: Run aggregations in parallel ---
        topBookmarkedGoogle,
        topBookmarkedUsers,
        topWrongAnsweredQuestionsAgg
    ] = await Promise.all([
        User.countDocuments(),
        GoogleUser.countDocuments(),
        TestResult.countDocuments(),
        TestResult.aggregate([ { $group: { _id: null, avgScore: { $avg: "$score" }, avgTime: { $avg: "$timeTaken" }, }, }, ]),
        GoogleUser.countDocuments({ lastLogin: { $gte: oneMinuteAgo } }),
        GoogleUser.countDocuments({ lastLogin: { $gte: twoMinutesAgo } }),
        GoogleUser.countDocuments({ lastLogin: { $gte: fiveMinutesAgo } }),
        GoogleUser.countDocuments({ lastLogin: { $gte: thirtyMinutesAgo } }),
        GoogleUser.countDocuments({ lastLogin: { $gte: oneHourAgo } }),
        GoogleUser.find({}, "name email image _id").limit(50).lean<LeanGoogleUser[]>(),
        GoogleUser.aggregate<AggregatedBookmarkedUser>([ { $match: { bookmarkedQids: { $exists: true, $ne: [] } } }, { $addFields: { bookmarkCount: { $size: "$bookmarkedQids" } } }, { $sort: { bookmarkCount: -1 } }, { $limit: 10 }, { $project: { name: 1, email: 1, bookmarkCount: 1, _id: 1 } }, ]),
        User.find({}, "name email role _id").limit(50).lean<LeanUser[]>(),
        User.aggregate<AggregatedBookmarkedUser>([ { $match: { bookmarkedQids: { $exists: true, $ne: [] } } }, { $addFields: { bookmarkCount: { $size: "$bookmarkedQids" } } }, { $sort: { bookmarkCount: -1 } }, { $limit: 10 }, { $project: { name: 1, email: 1, bookmarkCount: 1, _id: 1 } }, ]),
        TestResult.aggregate([ { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }, ]),
        // --- NEW Aggregations ---
        GoogleUser.aggregate<TopQuestionStat>([ { $unwind: "$bookmarkedQids" }, { $group: { _id: "$bookmarkedQids", count: { $sum: 1 } } } ]),
        User.aggregate<TopQuestionStat>([ { $unwind: "$bookmarkedQids" }, { $group: { _id: "$bookmarkedQids", count: { $sum: 1 } } } ]),
        TestResult.aggregate<TopQuestionStat>([ { $unwind: "$answers" }, { $match: { "answers.isCorrect": false } }, { $group: { _id: "$answers.qid", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 } ])
    ]);

    const overallAverageScore = avgStats[0]?.avgScore ?? 0;
    const averageTimeTaken = avgStats[0]?.avgTime ?? 0;

     // --- NEW: Combine and sort top bookmarked questions ---
    const combinedBookmarks: { [qid: string]: number } = {};
    topBookmarkedGoogle.forEach(item => { combinedBookmarks[item._id] = (combinedBookmarks[item._id] || 0) + item.count; });
    topBookmarkedUsers.forEach(item => { combinedBookmarks[item._id] = (combinedBookmarks[item._id] || 0) + item.count; });
    const topBookmarkedQuestions = Object.entries(combinedBookmarks)
        .map(([qid, count]) => ({ _id: qid, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    // --- End NEW ---


    const responseData /*: AdminStatsData */ = { // Type inference might struggle here, be explicit if needed
       kpis: {
            totalRegisteredUsers,
            totalGoogleUsers,
            totalTestsCompleted,
            overallAverageScore: Math.round(overallAverageScore),
            averageTimeTaken: Math.round(averageTimeTaken),
        },
      googleUsers: {
        loginsLast1Min: googleUsersLoginsLast1Min,
        loginsLast2Min: googleUsersLoginsLast2Min,
        loginsLast5Min: googleUsersLoginsLast5Min,
        loginsLast30Min: googleUsersLoginsLast30Min,
        loginsLast1Hour: googleUsersLoginsLast1Hour,
        all: allGoogleUsersLean.map((u: LeanGoogleUser) => ({
            ...u,
            _id: u._id.toString(),
            // Get potentially larger image URL
            image: getLargeGoogleImageUrl(u.image)
        })),
        mostBookmarked: googleUsersMostBookmarked.map((u: AggregatedBookmarkedUser) => ({ ...u, _id: u._id.toString() })),
      },
      users: {
        all: allUsersLean.map((u: LeanUser) => ({ ...u, _id: u._id.toString() })),
        mostBookmarked: usersMostBookmarked.map((u: AggregatedBookmarkedUser) => ({ ...u, _id: u._id.toString() })),
      },
      tests: {
        perCategory: testsPerCategory,
      },
      // --- NEW: Add top questions to response ---
      topBookmarkedQuestions: topBookmarkedQuestions,
      topWrongAnsweredQuestions: topWrongAnsweredQuestionsAgg,
      // --- End NEW ---
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    if (error instanceof Error) console.error("Error details:", error.message, error.stack);
    else console.error("Unknown error:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

