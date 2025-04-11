"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  // Render nothing until the component is mounted to prevent mismatches
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-teal-500">404</h1>
          <h2 className="mt-6 text-5xl font-extrabold text-gray-200">
            Page not found
          </h2>
          <p className="mt-2 text-2xl text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <div className="mt-6">
            <Button variant="destructive" onClick={goBack} className="mr-4">
              Go back
            </Button>
            <Link href="/">
              <Button variant="primary">Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
