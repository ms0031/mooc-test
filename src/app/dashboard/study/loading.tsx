import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function StudyLoading() {
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
      <div className="relative z-10 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-9 w-1/3 bg-white/10 rounded-lg mb-3"></div>
            <div className="h-5 w-1/2 bg-white/10 rounded-lg mb-10"></div>

            {/* Category Selector Skeleton */}
            <div className="mb-8 px-2">
                <div className="h-6 w-24 bg-white/10 rounded-md mb-2"></div>
                <div className="h-16 w-full bg-white/5 rounded-full p-2 border border-white/15"></div>
            </div>

            {/* Accordion List Skeleton */}
            <div className="space-y-4 px-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-white/5 rounded-3xl border border-white/15"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
