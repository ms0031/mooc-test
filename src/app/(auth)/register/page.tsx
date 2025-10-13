"use client";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../../components/providers/ThemeProvider";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useTransitionRouter();
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
      <div className="relative z-10 flex items-center justify-center py-12 px-5">
      <div className="w-full max-w-md space-y-4 bg-black/20 rounded-4xl border border-white/15 backdrop-blur-xl p-8 shadow-2xl">
      
          {/* Header */}
          <div className="text-center">
             <div className="flex justify-center items-center mb-4">
                <div className="bg-white/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#e5e7eb" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                </div>
            </div>
          <div>
          <h2 className="text-3xl font-bold text-gray-200">
            Create your account
          </h2>
            </div>
            
        {/* Social Sign-in and Separator */}
        <div className="space-y-4 mt-4">
          <GoogleSignInButton />
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-900/50 border border-white/15 rounded-3xl backdrop-blur-sm px-2 text-gray-400">
                  Or continue with
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 text-center text-sm font-medium text-red-300">
                {error}
              </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
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
                className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <Button
              variant="glassTeal"
              type="submit"
              disabled={isLoading}
                className="px-6 py-3 text-base"
                size={"round"}
              >
               {isLoading ? "Creating account..." : "Create account"}
              </Button>
          </div>
        </form>
        <div className="mb-4 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="text-center">
          <Button
              variant="glass"
              onClick={(e) => {
              e.preventDefault()
              router.push('login', {
                onTransitionReady: () => pageAnimation('down'),
              })
              }}
                className="px-4 py-3 text-base"
                size={"round"}
              >
                Already have an account? Sign in
          </Button>
        </div>
      </div>
        </div>
      </div>
    </main>
  );
}
