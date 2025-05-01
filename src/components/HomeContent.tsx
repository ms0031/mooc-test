"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { pageAnimation } from "@/utils/animations";
import { Button } from "./ui/Button";
interface HomeContentProps {
  session: any;
}


export default function HomeContent({ session }: HomeContentProps) {
  const router = useTransitionRouter();
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
              <div className="rounded-md lg:px-0 md:px-0 px-5 shadow">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-teal-500 text-white hover:bg-[#0C9A85] transition-colors md:py-4 md:text-lg md:px-10"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/dashboard', {
                      onTransitionReady: () => pageAnimation('up'),
                    })
                  }}
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <div className="rounded-md lg:px-0 md:px-0 px-5 shadow">
                  <Link
                    href="/test/settings"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-teal-500/90 text-white hover:bg-[#0C9A85] transition-colors md:py-4 md:text-lg md:px-10"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/test/settings', {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                    }}
                  >
                    Take Test (Guest)
                  </Link>
                </div>
                <div className="mt-3 lg:px-0 md:px-0 px-5 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-[10px] bg-gray-200 text-gray-900 hover:bg-gray-100 transition-colors md:py-4 md:text-lg md:px-10"
                    onClick={(e) => {
                      e.preventDefault()
                      router.push('/login', {
                        onTransitionReady: () => pageAnimation('up'),
                      })
                    }}
                  >
                    Login / Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="max-w-xl mt-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-8 rounded-lg border-yellow-400 p-3">
            <div className="flex items-center">
              <div className="ml-3 flex-1/2">
                <p className="text-sm text-yellow-700 font-medium">
                  If you are facing any issues, use this proxy link instead.
                </p>
              </div>
              <Button
                variant="subtle"
                onClick={() => (window.location.href = "https://mooctest2.vercel.app/")}
                className="text-sm py-2 px-2.5 flex items-center gap-1 rounded-3xl hover:bg-yellow-100 transition-colors"
                aria-label="Navigate to proxy link"
              >
                <img
                  src="/favicon-32x32.png"
                  alt="Proxy Server Icon"
                  width="24"
                  height="24"
                  className="inline-block"
                />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 499.368"
                  aria-hidden="true"
                  focusable="false"
                  className="fill-current text-yellow-700"
                >
                  <path d="M256.003 0C114.555 0 0 114.555 0 256.003c0 113.286 73.28 208.961 175.038 242.865 12.796 2.247 17.586-5.433 17.586-12.153 0-6.077-.309-26.225-.309-47.686-64.313 11.844-80.941-15.674-86.058-30.055-2.896-7.37-15.359-30.1-26.269-36.177-8.948-4.808-21.752-16.652-.31-16.961 20.168-.309 34.574 18.564 39.382 26.244 23.038 38.732 59.839 27.828 74.555 21.101 2.227-16.627 8.947-27.828 16.318-34.239-56.968-6.386-116.467-28.471-116.467-126.399 0-27.827 9.907-50.866 26.225-68.787-2.562-6.41-11.51-32.655 2.562-67.853 0 0 21.436-6.72 70.409 26.244 20.483-5.767 42.227-8.638 63.998-8.638 21.751 0 43.52 2.896 63.997 8.638 48.973-33.279 70.39-26.244 70.39-26.244 14.09 35.192 5.117 61.443 2.562 67.853 16.318 17.921 26.244 40.625 26.244 68.787 0 98.237-59.84 119.988-116.801 126.399 9.282 8.014 17.277 23.373 17.277 47.371 0 34.238-.309 61.751-.309 70.389 0 6.721 4.808 14.735 17.586 12.179C438.739 464.964 512 368.955 512 256.003 512 114.555 397.445 0 256.003 0z" />
                </svg> */}
                
                Proxy Link
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-10">
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