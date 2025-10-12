import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function LoginLoading() {
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
      <div className="relative z-10 flex min-h-screen items-center justify-center py-12 px-4">
        {/* Skeleton card mimicking the final login page design */}
        <div className="w-full max-w-md animate-pulse space-y-8 bg-black/20 rounded-3xl border border-white/15 backdrop-blur-xl p-8 shadow-2xl">
          
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center">
              <div className="bg-white/10 h-24 w-24 rounded-full"></div>
            </div>
            <div className="h-8 w-3/4 bg-white/10 rounded-lg mx-auto"></div>
          </div>

          {/* Social Sign-in and Separator Skeleton */}
          <div className="space-y-4">
            <div className="h-12 w-full bg-white/10 rounded-xl"></div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <div className="h-5 w-32 bg-slate-900/50 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Form Skeleton - Adjusted for Login Page (2 inputs) */}
          <div className="space-y-4">
            <div className="h-12 w-full bg-white/10 rounded-xl"></div>
            <div className="h-12 w-full bg-white/10 rounded-xl"></div>
          </div>
          
          {/* Buttons Skeleton */}
          <div className="space-y-4 text-center">
            <div className="h-12 w-32 bg-white/10 rounded-full mx-auto"></div>
            <div className="h-12 w-48 bg-white/10 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
