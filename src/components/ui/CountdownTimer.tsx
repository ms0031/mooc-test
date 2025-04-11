"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

interface CountdownTimerProps {
  duration: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export default function CountdownTimer({
  duration,
  onTimeUp,
  className = "",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className={`font-mono text-lg ${className}`}>
      {formatDuration(timeLeft)}
    </div>
  );
}
