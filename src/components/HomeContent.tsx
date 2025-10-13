"use client";
import { useTransitionRouter } from "next-view-transitions";
import Link from "next/link";
import { pageAnimation } from "@/utils/animations";
import { Button } from "./ui/Button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

interface HomeContentProps {
  session: any;
}

export default function HomeContent({ session }: HomeContentProps) {
  const router = useTransitionRouter();
  return (
    <main className="min-h-screen relative">
      {/* Background Animation - Fixed positioning */}
      <BackgroundGradientAnimation 
        gradientBackgroundStart="rgb(2, 6, 23)" 
        gradientBackgroundEnd="rgb(2, 6, 23)" 
          firstColor="20, 90, 100"       // Darkest Teal
          secondColor="50, 40, 130"      // Deep Indigo
          thirdColor="80, 60, 110"       // Muted Purple
          fourthColor="30, 80, 70"       // Forest Green
          fifthColor="120, 80, 40"       // Muted Amber
        interactive={false}
        containerClassName="fixed inset-0 -z-10"
      />

      {/* Content - Relative positioning to stay above background */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            <span className="block mb-2">Master Your Knowledge with</span>
            <span className="text-[#0FAE96]">Interactive Tests</span>
          </h1>
          <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto mb-8">
            Test your understanding of Conservation Economics and Psychology of Learning through
            our comprehensive tests. Track your progress and improve
            your knowledge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <div>
                <Link
                  href="/dashboard"
                  className="inline-block px-5 py-3 bg-teal-500/15 text-white rounded-3xl hover:bg-teal-600 transition-colors font-medium backdrop-blur-sm p-6 border border-teal-500/25"
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
                <div>
                  <Link
                    href="/test/settings"
                    className="inline-block px-5 py-3 bg-teal-500/15 text-white hover:bg-teal-600 transition-colors font-medium rounded-3xl backdrop-blur-sm p-6 border border-teal-500/25"
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
                <div>
                  <Link
                    href="/login"
                    className="inline-block px-5 py-3 bg-white/15 text-white rounded-3xl hover:bg-white/20 transition-colors backdrop-blur-sm font-medium  p-6 border border-white/15"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 ">
          <div className="w-fit mx-auto bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 p-6 border border-white/15">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div>
                <p className="text-gray-300 text-sm">
                  If you are facing any issues, use this proxy link instead.
                </p>
              </div>
              <Button
                variant="glassYellow"
                size="card"
                onClick={() => (window.location.href = "https://mooctest2.vercel.app/")}
                className="text-sm py-2 px-4 flex items-center gap-2 rounded-3xl"
                aria-label="Navigate to proxy link"
              >
                <img
                  src="/favicon-32x32.png"
                  alt="Proxy Server Icon"
                  width="24"
                  height="24"
                />
                Proxy Link
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Error Analysis</h3>
              <div className="h-px w-20 bg-white/20"></div>
              <p className="text-gray-300 text-center">
                View a collection of your most frequently wrong answers to focus your revision where it matters most.
              </p>
            </div>
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Smart Practice Modes</h3>
              <div className="h-px w-20 bg-white/20"></div>
              <p className="text-gray-300 text-center">
                Choose between Study Mode (see answers instantly) or Test Mode. Perfect for both learning and revision.
              </p>
            </div>
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Smart Randomization</h3>
              <div className="h-px w-20 bg-white/20"></div>
              <p className="text-gray-300 text-center">
                Add variety to your practice with shuffled questions from all weeks and randomized answer options for a fresh experience every time.
              </p>
            </div>
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Progress Tracking</h3>
              <div className="h-px w-20 bg-white/20"></div>
              <p className="text-gray-300 text-center">
                Monitor your performance and identify areas for improvement.
              </p>
            </div>
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Tests History</h3>
              <div className="h-px w-20 bg-white/20"></div>
              <p className="text-gray-300 text-center">
                Check your performance history with a clean, visual progress graph and detailed session stats.
              </p>
            </div>
            <div className="px-6 py-8 bg-white/5 rounded-3xl backdrop-blur-sm backdrop-brightness-80 border border-white/20 flex flex-col justify-center items-center gap-3 overflow-hidden hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-medium text-white">Focused Week Testing</h3>
              <div className="h-px w-20 bg-white/20"></div>
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