"use client";
import { useTransitionRouter } from "next-view-transitions";
import { pageAnimation } from "@/utils/animations";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

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
        setError("Invalid credentials");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* <div className="w-[1440px] h-[900px] left-0 top-0 absolute opacity-30">
        <div className="w-[675px] h-80 left-[202px] top-[190px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
        <div className="w-[675px] h-80 left-[800px] top-[190px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
      </div> */}
      <div className="mt-20 max-w-md lg:w-full md:w-full w-100 lg:px-10 md:px-10 px-6 pb-10 pt-6 gap-4 bg-white/0 rounded-3xl outline-2 outline-offset-[-1px] outline-white/5 backdrop-blur-[100px] overflow-hidden">
        <div className="flex justify-center items-center my-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#e5e7eb" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
        </div>
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-200">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8">
          <GoogleSignInButton />

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-950 rounded-2xl text-gray-300">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-2xl bg-red-200 p-4">
              <div className="text-md text-red-700">{error}</div>
            </div>
          )}
          <div className="rounded-md">
            <div>
              <label htmlFor="email" className="sr-only text-zinc-400">
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
              <label htmlFor="password" className="sr-only text-zinc-100 ">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className=" relative block bg-white/5 w-full px-3 py-3 border border-gray-300  placeholder-gray-500 text-gray-100 rounded-2xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="mb-3 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm  rounded-xl text-white bg-teal-500/90 hover:hover:bg-[#0C9A85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/register"
            className="text-[16px] text-blue-500 hover:text-indigo-500"
            onClick={(e) => {
              e.preventDefault()
              router.push('register', {
                onTransitionReady: () => pageAnimation('up'),
              })
            }}
          >
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
