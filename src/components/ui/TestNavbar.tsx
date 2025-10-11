"use client";

import React from 'react';

type TestNavbarProps = {
  answeredQuestions: number;
  totalQuestions: number;
};

const TestNavbar = ({ answeredQuestions, totalQuestions }: TestNavbarProps) => {
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/50 mb-2 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Left side: Title */}
          {/* <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Test in Progress</h1>
          </div> */}

          {/* Right side: Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
                <span className="font-semibold bg-white/15 px-2 mb-2 rounded-full text-white">
                    {answeredQuestions} / {totalQuestions}
                </span>
                <span className="text-xs font-medium text-gray-400 leading-none">
                    Answered
                </span>
            </div>
            {/* Progress Bar */}
            <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TestNavbar;
