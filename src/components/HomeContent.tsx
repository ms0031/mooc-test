"use client";

import Link from "next/link";

interface HomeContentProps {
  session: any;
}

export default function HomeContent({ session }: HomeContentProps) {
  return (   
      <main className="bg-slate-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-raleway tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Master Your Knowledge with</span>
              <span className="block text-[#0FAE96]">Interactive Tests</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Test your understanding of Conservation Economics and Psychology of Learning through
              our comprehensive tests. Track your progress and improve
              your knowledge.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
              {session ? (
                <div className="rounded-md lg:px-0 md:px-0 px-3 shadow">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-teal-500 text-white hover:bg-[#0C9A85] transition-colors md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <div className="rounded-md lg:px-0 md:px-0 px-3 shadow">
                    <Link
                      href="/test/settings"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-teal-500/90 text-white hover:bg-[#0C9A85] transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Take Test (Guest)
                    </Link>
                  </div>
                  <div className="mt-3 lg:px-0 md:px-0 px-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-gray-200 text-gray-900 hover:bg-gray-100 transition-colors md:py-4 md:text-lg md:px-10"
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
              
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2">
                Error Analysis
                </h3>
                <p className="text-gray-300 text-center ">
                View a collection of your most frequently wrong answers to focus your revision where it matters most.
                </p>
              </div>
              <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2">Smart Practice Modes</h3>
                <p className="text-gray-300 text-center">
                Choose between Study Mode (see answers instantly) or Test Mode. Perfect for both learning and revision.
                </p>
              </div>
              
            <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2"> Smart Randomization</h3>
                <p className="text-gray-300 text-center">
                Add variety to your practice with shuffled questions from all weeks and randomized answer options for a fresh experience every time.
                </p>
            </div>
            <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2">Progress Tracking</h3>
                <p className="text-gray-300 text-center">
                  Monitor your performance and identify areas for improvement.
                </p>
            </div>
            <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2">Tests History</h3>
                <p className="text-gray-300 text-center">
                Check your performance history with a clean, visual progress graph and detailed session stats.
                </p>
            </div>
            <div className="self-stretch px-5 py-4 bg-white/5 rounded-2xl outline-1 backdrop-blur-[100px] outline-offset-[-1px] outline-white/5 inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
                <h3 className="text-lg font-medium text-white mb-2">Focused Week Testing</h3>
                <p className="text-gray-300 text-center">
                Customize your test by selecting specific weeks or topics to revise only what matters most to you.
                </p>
            </div>
            </div>
          </div>
        </div>
      </main>
  );
}