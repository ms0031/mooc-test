import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/callback",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for API routes that allow study mode
  if (
    pathname.startsWith("/api/questions") &&
    request.nextUrl.searchParams.get("mode") === "study"
  ) {
    return NextResponse.next();
  }

  // Verify authentication for protected routes
  const token = await getToken({ req: request });

  if (!token) {
    // Redirect to login for page requests
    if (!pathname.startsWith("/api/")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Return unauthorized for API requests
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }),
      {
        status: 401,
        headers: { "content-type": "application/json" },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
