import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Loading() {
  return (
    <main className="min-h-screen relative">
      {/* Adds the keyframe animation for the bouncing dots */}
      <style>
        {`
          @keyframes bounce {
            0%, 70%, 100% {
              transform: translateY(0);
            }
            35% {
              transform: translateY(-15px);
            }
          }
          .bouncing-dot {
            animation: bounce 1.5s infinite ease-in-out;
          }
        `}
      </style>

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
      <div className="relative z-10 mt-[-80] flex min-h-screen flex-col items-center justify-center">
        {/* NEW: SVG Bouncing Dots Animation */}
        <div className="">
            <svg width="120" height="80" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg" fill="rgba(255, 255, 255, 0.7)">
                <circle className="bouncing-dot" cx="10" cy="10" r="5" style={{ animationDelay: '0s' }} />
                <circle className="bouncing-dot" cx="30" cy="10" r="5" style={{ animationDelay: '0.15s' }} />
                <circle className="bouncing-dot" cx="50" cy="10" r="5" style={{ animationDelay: '0.3s' }} />
            </svg>
        </div>
      </div>
    </main>
  );
}

