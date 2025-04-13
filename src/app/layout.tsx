import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Analyticsdb } from "@/components/Analytics";
import Navbar from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/react";
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
  description: "An interactive testing platform for nptel/mooc test",
  keywords: ["MOOC", "psychology of learning", "sustainable development", "conservation economics","online education", "test platform"],
  authors: [{ name: "Mayank Shekhar" }],
  creator: "Mayank Shekhar",
  publisher: "Mayank Shekhar",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://mooctest.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MOOC Test Platform",
    description: "An interactive testing platform for nptel/mooc test",
    url: "/",
    siteName: "MOOC Test Platform",
    images: ["/og-image.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOOC Test Platform",
    description: "An interactive testing platform for nptel/mooc test",
    images: ['/og-image.png'],
    creator: "@mayankshekhar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "google-site-verification-code",
  },
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
              <main>{children}</main>
              <footer className="text-center py-4 text-gray-200 text-sm bg-slate-950">
                <p>&copy; Mayank Shekhar</p>
              </footer>
              <Analytics />
              <Analyticsdb />
            </ThemeProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
