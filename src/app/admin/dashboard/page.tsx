'use client';

import useSWR from 'swr';
import React, { useState } from 'react';
import Image from 'next/image';
import Loading from '@/components/ui/Loading';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
// --- TypeScript Interfaces (Updated) ---
interface GoogleUser { _id: string; name: string; email: string; image?: string; }
interface User { _id: string; name: string; email: string; role: string; }
interface BookmarkedUser { _id: string; name: string; email: string; bookmarkCount: number; }
interface CategoryCount { _id: string | null; count: number; }
interface TopQuestionStat { _id: string; count: number; }

interface AdminStatsData {
  kpis: {
    totalRegisteredUsers: number;
    totalGoogleUsers: number;
    totalTestsCompleted: number;
    overallAverageScore: number;
    averageTimeTaken: number;
  };
  googleUsers: {
    loginsLast1Min: number;
    loginsLast2Min: number;
    loginsLast5Min: number;
    loginsLast30Min: number;
    loginsLast1Hour: number;
    all: GoogleUser[];
    mostBookmarked: BookmarkedUser[];
  };
  users: {
    all: User[];
    mostBookmarked: BookmarkedUser[];
  };
  tests: {
    perCategory: CategoryCount[];
  };
  // New fields to match the updated API response
  topBookmarkedQuestions: TopQuestionStat[];
  topWrongAnsweredQuestions: TopQuestionStat[];
}

// --- Reusable Stat Card Component ---
const StatCard = ({ title, value, unit = '' }: { title: string; value: string | number; unit?: string }) => (
    <div className="bg-black/20 border border-white/15 rounded-2xl p-5 backdrop-blur-xl text-center shadow-lg">
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-semibold text-white">
            {value}
            {unit && <span className="text-lg ml-1 text-gray-300">{unit}</span>}
        </p>
    </div>
);

// --- Fetcher Function for SWR ---
const fetcher = (url: string): Promise<AdminStatsData> => fetch(url).then((res) => {
    if (!res.ok) {
        throw new Error('Failed to fetch admin stats');
    }
    return res.json();
});

// --- Main Admin Dashboard Component ---
export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [googleUsersPage, setGoogleUsersPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const router = useTransitionRouter();
  const usersPerPage = 10;

  useEffect(() => {
  // 1. Wait until the session status is determined (not loading)
    if (status === "loading") {
      return; // Do nothing while loading
    }

  // 2. Redirect if:
  //    - The user is definitively unauthenticated OR
  //    - The user is authenticated BUT their role is NOT 'admin'
    if (status === "unauthenticated") {
      router.push("/login");
    }
    else if ((status === "authenticated" && session?.user?.role !== 'admin')) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // NEW: State for image enlargement modal
  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR<AdminStatsData>('/api/admin/stats', fetcher, {
     refreshInterval: 15000,
     revalidateOnFocus: true,
   });

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-400 bg-slate-950 p-4 text-center">
        Failed to load dashboard data. Please check the API or try again later. <br /> Error: {error.message}
    </div>
   );
  if (isLoading || !data) return <div className="min-h-screen"><Loading /></div>;

  const paginatedGoogleUsers = data.googleUsers.all.slice((googleUsersPage - 1) * usersPerPage, googleUsersPage * usersPerPage);
  const paginatedUsers = data.users.all.slice((usersPage - 1) * usersPerPage, usersPage * usersPerPage);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <main className="min-h-screen relative">
       <BackgroundGradientAnimation
            gradientBackgroundStart="rgb(2, 6, 23)"
            gradientBackgroundEnd="rgb(2, 6, 23)"
            firstColor="20, 90, 100"
            secondColor="50, 40, 130"
            thirdColor="80, 60, 110"
            fourthColor="30, 80, 70"
            fifthColor="120, 80, 40"
            interactive={false}
            containerClassName="fixed inset-0 -z-10"
        />

        {/* NEW: Image Enlargement Modal */}
        {enlargedImageUrl && (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 cursor-pointer"
                onClick={() => setEnlargedImageUrl(null)}
            >
                <div className="relative max-w-lg max-h-[80vh] rounded-lg overflow-hidden shadow-2xl">
                    <Image
                        src={enlargedImageUrl}
                        alt="Enlarged Google User Profile"
                        width={600}
                        height={600}
                        className="object-contain w-auto h-auto max-h-[80vh]"
                        unoptimized
                    />
                </div>
            </div>
        )}

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

            {/* KPIs Section */}
            <h2 className="text-2xl font-semibold text-gray-300 mb-4">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                <StatCard title="Registered Users" value={data.kpis.totalRegisteredUsers} />
                <StatCard title="Google Users" value={data.kpis.totalGoogleUsers} />
                <StatCard title="Tests Completed" value={data.kpis.totalTestsCompleted} />
                <StatCard title="Avg. Score" value={data.kpis.overallAverageScore} unit="%" />
                <StatCard title="Avg. Time" value={formatTime(data.kpis.averageTimeTaken)} />
            </div>

            {/* Recent Logins, Tests, and Top Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                 <div className="bg-black/20 border border-white/15 rounded-2xl p-6 backdrop-blur-xl shadow-lg"><h2 className="text-xl font-semibold text-gray-200 mb-4">Recent Google Logins</h2><div className="space-y-2 text-gray-300"><p>Last 1 min: <span className="font-semibold text-white">{data.googleUsers.loginsLast1Min}</span></p><p>Last 5 mins: <span className="font-semibold text-white">{data.googleUsers.loginsLast5Min}</span></p><p>Last 1 hour: <span className="font-semibold text-white">{data.googleUsers.loginsLast1Hour}</span></p></div></div>
                 <div className="bg-black/20 border border-white/15 rounded-2xl p-6 backdrop-blur-xl shadow-lg"><h2 className="text-xl font-semibold text-gray-200 mb-4">Tests per Category</h2><ul className="space-y-2 text-gray-300 max-h-48 overflow-y-auto">{data.tests.perCategory.map((category) => (<li key={category._id || 'unknown'} className="flex justify-between"><span className="capitalize">{category._id?.replace(/_/g, ' ') || 'Unknown'}</span><span className="font-semibold text-white">{category.count}</span></li>))}</ul></div>
                 <div className="bg-black/20 border border-white/15 rounded-2xl p-6 backdrop-blur-xl shadow-lg"><h2 className="text-xl font-semibold text-gray-200 mb-4">Top 10 Bookmarked Questions</h2><ul className="space-y-2 text-gray-300">{data.topBookmarkedQuestions.length > 0 ? data.topBookmarkedQuestions.map((q, index) => (<li key={q._id} className="flex justify-between items-center text-sm"><span>{index + 1}. <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">{q._id}</code></span><span className="font-semibold text-white bg-white/10 px-2 py-0.5 rounded text-xs">{q.count} times</span></li>)) : <p className="text-sm text-gray-500">No bookmark data yet.</p>}</ul></div>
                 <div className="bg-black/20 border border-white/15 rounded-2xl p-6 backdrop-blur-xl shadow-lg"><h2 className="text-xl font-semibold text-gray-200 mb-4">Top 10 Wrongly Answered</h2><ul className="space-y-2 text-gray-300">{data.topWrongAnsweredQuestions.length > 0 ? data.topWrongAnsweredQuestions.map((q, index) => (<li key={q._id} className="flex justify-between items-center text-sm"><span>{index + 1}. <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">{q._id}</code></span><span className="font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded text-xs">{q.count} times</span></li>)) : <p className="text-sm text-gray-500">No wrong answer data yet.</p>}</ul></div>
            </div>

            {/* User Tables */}
            <div className="space-y-10">
                {/* All Google Users Table */}
                <div className="bg-black/20 border border-white/15 rounded-2xl backdrop-blur-xl shadow-lg overflow-hidden">
                    <h2 className="text-2xl font-semibold text-gray-200 p-6 border-b border-white/10">All Google Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-white/5"><tr><th className="py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Image</th><th className="py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th><th className="py-3 px-6 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {paginatedGoogleUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-6 whitespace-nowrap text-center">
                                            <button onClick={() => user.image && setEnlargedImageUrl(user.image)} className="focus:outline-none focus:ring-2 focus:ring-teal-500/50 rounded-full w-16 h-16">
                                                <Image src={user.image || '/default-avatar.png'} alt={user.name ? `${user.name}'s profile picture` : 'User profile picture'} width={48} height={48} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} />
                                            </button>
                                        </td>
                                        <td className="py-3 px-6 whitespace-nowrap text-sm text-center text-gray-200">{user.name}</td>
                                        <td className="py-3 px-6 whitespace-nowrap text-sm text-center text-gray-300">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end gap-2"><Button variant="glass" size="sm" onClick={() => setGoogleUsersPage(p => Math.max(1, p - 1))} disabled={googleUsersPage === 1}>Prev</Button><Button variant="glass" size="sm" onClick={() => setGoogleUsersPage(p => p + 1)} disabled={googleUsersPage * usersPerPage >= data.googleUsers.all.length}>Next</Button></div>
                </div>

                {/* All Regular Users Table */}
                <div className="bg-black/20 border border-white/15 rounded-2xl backdrop-blur-xl shadow-lg overflow-hidden">
                    <h2 className="text-2xl font-semibold text-gray-200 p-6 border-b border-white/10">All Registered Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-white/5"><tr><th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th><th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th><th className="py-3 px-6 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th></tr></thead>
                            <tbody className="divide-y divide-white/10">
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors"><td className="py-3 px-6 whitespace-nowrap text-sm text-gray-200">{user.name}</td><td className="py-3 px-6 whitespace-nowrap text-sm text-gray-300">{user.email}</td><td className="py-3 px-6 whitespace-nowrap text-sm text-gray-300 capitalize">{user.role}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end gap-2"><Button variant="glass" size="sm" onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1}>Prev</Button><Button variant="glass" size="sm" onClick={() => setUsersPage(p => p + 1)} disabled={usersPage * usersPerPage >= data.users.all.length}>Next</Button></div>
                </div>
            </div>
        </div>
    </main>
  );
}