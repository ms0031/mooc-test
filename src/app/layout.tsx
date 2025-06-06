import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { Analyticsdb } from "@/components/Analytics";
import Navbar from "@/components/ui/Navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { ViewTransitions } from 'next-view-transitions'
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
  description: "An interactive testing platform for NPTEL/MOOC assessments.",
  keywords: [
    "MOOC",
    "psychology of learning",
    "sustainable development",
    "conservation economics",
    "online education",
    "test platform",
  ],
  authors: [{ name: "Mayank Shekhar" }],
  creator: "Mayank Shekhar",
  publisher: "Mayank Shekhar",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://mooctest.vercel.app"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MOOC Test Platform",
    description: "An interactive testing platform for NPTEL/MOOC assessments.",
    url: "/",
    siteName: "MOOC Test Platform",
    images: ["/og-image.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MOOC Test Platform",
    description: "An interactive testing platform for NPTEL/MOOC assessments.",
    images: ["/og-image.png"],
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
    <ViewTransitions>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <NextAuthProvider>
            <ThemeProvider>
              <Navbar />
              <main>{children}</main>
              <Script id="clarity-script" strategy="afterInteractive">
                {`
                  (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
                `}
        </Script>
              <footer className="text-center py-4 text-gray-200 text-sm bg-slate-950">
                <p>&copy; Mayank Shekhar</p>
              </footer>
              <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
              <Analyticsdb />
            </ThemeProvider>
          </NextAuthProvider>
        </ErrorBoundary>
      </body>
      </html>
    </ViewTransitions>
  );
}
