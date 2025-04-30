"use client";
import { pageAnimation } from "@/utils/animations";
import { useTransitionRouter } from "next-view-transitions";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./Button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const isOnDashboard = pathname === "/dashboard";

  return (
    <nav className="bg-slate-950 relative">
      <div className="w-full min-h-full left-0 top-0 fixed opacity-20 pointer-events-none">
        <div className="w-[675px] h-[320px] absolute left-[-150px] top-[50px] bg-violet-700 rounded-full blur-[200px]"></div>
        <div className="w-[675px] h-[320px] absolute right-[-150px] bottom-[-100px] bg-violet-700 rounded-full blur-[200px]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  router.push('/', {
                    onTransitionReady: () => pageAnimation('down'),
                  })
                }}
                className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
              >
                <div className="justify-start">
                  <span className="text-white text-2xl font-bold font-raleway">
                    MOOC
                  </span>
                  <span className="text-teal-500 text-2xl font-bold font-raleway">
                    {" "}
                    TEST
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {!isOnDashboard && (
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/dashboard', {
                        onTransitionReady: () => pageAnimation('down'),
                      })
                    }}
                    className="text-sm"
                  >
                    Dashboard
                  </Button>
                )}
                {isOnDashboard && (
                  <Button
                  variant="subtle"
                  onClick={() => window.location.href = "https://github.com/ms0031/"}
                  className="text-sm py-3 px-2 flex rounded-3xl items-center gap-2"
                  aria-label="Navigate to dashboard"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 512 499.368"
                    aria-hidden="true"
                    focusable="false"
                    className="fill-current"
                  >
                    <path d="M256.003 0C114.555 0 0 114.555 0 256.003c0 113.286 73.28 208.961 175.038 242.865 12.796 2.247 17.586-5.433 17.586-12.153 0-6.077-.309-26.225-.309-47.686-64.313 11.844-80.941-15.674-86.058-30.055-2.896-7.37-15.359-30.1-26.269-36.177-8.948-4.808-21.752-16.652-.31-16.961 20.168-.309 34.574 18.564 39.382 26.244 23.038 38.732 59.839 27.828 74.555 21.101 2.227-16.627 8.947-27.828 16.318-34.239-56.968-6.386-116.467-28.471-116.467-126.399 0-27.827 9.907-50.866 26.225-68.787-2.562-6.41-11.51-32.655 2.562-67.853 0 0 21.436-6.72 70.409 26.244 20.483-5.767 42.227-8.638 63.998-8.638 21.751 0 43.52 2.896 63.997 8.638 48.973-33.279 70.39-26.244 70.39-26.244 14.09 35.192 5.117 61.443 2.562 67.853 16.318 17.921 26.244 40.625 26.244 68.787 0 98.237-59.84 119.988-116.801 126.399 9.282 8.014 17.277 23.373 17.277 47.371 0 34.238-.309 61.751-.309 70.389 0 6.721 4.808 14.735 17.586 12.179C438.739 464.964 512 368.955 512 256.003 512 114.555 397.445 0 256.003 0z"/>
                  </svg>
                </Button>
                )}
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
                onClick={(e) => {
                  e.preventDefault()
                  router.push('/login', {
                    onTransitionReady: () => pageAnimation('down'),
                  })
                }}
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
