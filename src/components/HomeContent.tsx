"use client";

import Link from "next/link";
import { useTheme } from "../components/providers/ThemeProvider";

interface HomeContentProps {
  session: any; // Adjust type based on your authOptions
}

export default function HomeContent({ session }: HomeContentProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
      <main
        className={`min-h-screen ${isDarkMode ? "[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] text-white" : "bg-gradient-to-t from-orange-200 to-sky-100 text-gray-900"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1
              className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="block">Master Your Knowledge with</span>
              <span
                className={`block ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                Interactive Tests
              </span>
            </h1>
            <p
              className={`mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Test your understanding of psychology and learning theory through
              our comprehensive question bank. Track your progress and improve
              your knowledge.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
              {session ? (
                <div className="rounded-md shadow">
                  <Link
                    href="/dashboard"
                    className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                      isDarkMode
                        ? "bg-indigo-500 text-white hover:bg-indigo-600"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    } md:py-4 md:text-lg md:px-10`}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <div className="rounded-md shadow">
                    <Link
                      href="/test/settings"
                      className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                        isDarkMode
                          ? "bg-indigo-500 text-white hover:bg-indigo-600"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      } md:py-4 md:text-lg md:px-10`}
                    >
                      Take Test (Guest)
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md ${
                        isDarkMode
                          ? "bg-white text-black hover:bg-gray-300"
                          : "bg-white text-indigo-600 hover:bg-gray-50"
                      } md:py-4 md:text-lg md:px-10`}
                    >
                      Login / Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-24">
            <h2
              className={`text-2xl font-bold text-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mb-12`}
            >
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div
                className={`rounded-lg p-6 shadow-lg ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-sky-100 text-gray-900"
                }`}
              >
                <h3 className="text-lg font-medium mb-2">
                  Comprehensive Tests
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                  Access a wide range of questions covering psychology and
                  learning theory concepts.
                </p>
              </div>
              <div
                className={`rounded-lg p-6 shadow-lg ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-sky-100 text-gray-900"
                }`}
              >
                <h3 className="text-lg font-medium mb-2">Study Mode</h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                  Practice without time pressure and get detailed explanations for
                  each answer.
                </p>
              </div>
              <div
                className={`rounded-lg p-6 shadow-lg ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-sky-100 text-gray-900"
                }`}
              >
                <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>
                  Monitor your performance and identify areas for improvement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}