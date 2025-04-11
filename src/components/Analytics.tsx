"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const logPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            params: Object.fromEntries(searchParams.entries()),
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        // Silently fail analytics
        console.error("Analytics error:", error);
      }
    };

    logPageView();
  }, [pathname, searchParams]);

  return null;
}
