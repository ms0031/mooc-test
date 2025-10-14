"use client";

import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useTransitionRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // Use router.push for view transitions
        router.push("/dashboard", {
          onTransitionReady: () => pageAnimation('left'),
        });
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
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
        {/* CORRECTED: Card width and styling */}
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
            <h2 className="text-3xl font-bold text-gray-200">
              Sign in to your account
            </h2>
          </div>

          {/* Social Sign-in and Separator */}
          <div className="space-y-4">
            <GoogleSignInButton />
            <div className="relative">
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

          <form className="space-y-6 " onSubmit={handleSubmit}>
            {/* STYLED: Error Message */}
            {error && (
              <div className="rounded-xl bg-red-500/20 border border-red-500/50 p-3 text-center text-sm font-medium text-red-300">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* STYLED: Email Input */}
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              {/* STYLED: Password Input */}
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full appearance-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-gray-200 placeholder-gray-400 focus:z-10 focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {/* STYLED: Sign In Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="glassTeal"
                className="px-6 py-3 text-base"
                disabled={isLoading}
                size={"round"}
              >
                {isLoading ? "Signing in..." : "Sign in"}
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
                router.push('register', {
                  onTransitionReady: () => pageAnimation('up'),
                })
              }}
                className="px-6 py-3 text-base"
                size={"round"}
              >
                Don&apos;t have an account? Sign up
              </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
