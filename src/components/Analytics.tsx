"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function AnalyticsContent() {
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
        console.error("Analytics error:", error);
      }
    };

    logPageView();
  }, [pathname, searchParams]);

  return null;
}

export function Analyticsdb() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
