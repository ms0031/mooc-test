import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Analyticsdb } from "@/components/Analytics";
import Navbar from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOOC Test Platform",
  description:
    "An interactive learning and testing platform for psychology and learning theory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <NextAuthProvider>
            <ThemeProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Analytics />
              <Analyticsdb />
            </ThemeProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
