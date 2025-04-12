"use client";

import { useEffect, useState } from "react";
import { formatDuration } from "@/lib/utils";

interface CountdownTimerProps {
  duration: number; // in seconds (now used as max duration)
  onTimeUp?: () => void;
  className?: string;
}

export default function CountdownTimer({
  duration,
  onTimeUp,
  className = "",
}: CountdownTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // Check if we've reached the maximum duration (if specified)
    if (duration > 0 && elapsedTime >= duration) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setElapsedTime((prev) => {
        const newTime = prev + 1;
        // If duration is specified and we've reached it, trigger onTimeUp
        if (duration > 0 && newTime >= duration) {
          clearInterval(timer);
          onTimeUp?.();
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [elapsedTime, duration, onTimeUp]);

  return (
    <div className={`font-mono text-2xl ${className}`}>
      {formatDuration(elapsedTime)}
    </div>
  );
}
