"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../../../components/providers/ThemeProvider";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login page after successful registration
      router.push("/login?registered=true");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen relative bg-slate-950 overflow-hidden  flex items-center justify-center">
    <div className="w-[1440px] h-[900px] left-0 top-0 absolute opacity-30">
    <div className="w-[675px] h-80 left-[202px] top-[190px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
    <div className="w-[675px] h-80 left-[800px] top-[190px] absolute bg-violet-700  rounded-full blur-[200px]"></div>
    </div>
      <div className="max-w-md w-full p-10 py-12 gap-4 bg-white/0 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5  backdrop-blur-[100px] overflow-hidden">
        <div>
          <h2 className={`text-center text-3xl font-bold text-gray-200`}>
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl bg-red-200 p-4">
              <div className="text-md text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm gap-5">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative mb-4 block bg-white/5 w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative mb-4 block bg-white/5 w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative mb-4 block bg-white/5 w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="relative mb-4 block bg-white/5 w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="mb-2 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-mono rounded-xl text-white bg-teal-500 hover:hover:bg-[#0C9A85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-red-500 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
