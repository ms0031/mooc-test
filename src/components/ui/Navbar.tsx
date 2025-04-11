"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./Button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <nav className=" bg-slate-950 ">
    <div className="w-[1440px] left-0 top-0 absolute opacity-30 pointer-events-none">
    <div className="w-[675px] h-80 left-[202px] top-[190px] absolute bg-violet-700 rounded-full blur-[200px]"></div>
    <div className="w-[675px] h-80 left-[800px] top-[190px] absolute bg-violet-700  rounded-full blur-[200px]"></div>
    </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              <div className="justify-start"><span className="text-white text-2xl font-bold font-raleway">MOOC</span><span className="text-teal-500 text-2xl font-bold font-raleway"> TEST</span></div>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="primary"
                  onClick={() => router.push("/dashboard")}
                  className="text-sm"
                >
                  Dashboard
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={() => router.push("/login")}
                className="text-sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}