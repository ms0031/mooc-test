import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments `req` with `req.nextauth.token`
  function middleware(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // --- Admin Route Protection ---
    if (pathname.startsWith("/admin")) {
      // If the user is authenticated BUT not an admin, redirect them away
      // (e.g., to the dashboard, assuming it's safe for non-admins)
      if (token && token.role !== "admin") {
        console.log("Middleware: Non-admin accessing /admin. Redirecting to /dashboard.");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // If the token is null/undefined here, the `authorized` callback below
      // should have already handled the redirect to login.
      // If they ARE an admin, allow the request by returning nothing (implicit next()).
      console.log("Middleware: Admin accessing /admin. Allowing.");
      return NextResponse.next(); // Explicitly allow if checks pass
    }

    // --- Other Protected Routes (like /dashboard) ---
    // If accessing dashboard or other protected routes (add more checks if needed)
    // and the user is authenticated (token exists), allow them.
    if (pathname.startsWith("/dashboard") && token) {
      console.log("Middleware: Authenticated user accessing /dashboard. Allowing.");
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      // This runs FIRST. If it returns false, the user is redirected
      // to the login page BEFORE the main middleware function runs.
      authorized: ({ token }) => {
          const isAuthorized = !!token; // Is the user logged in at all?
          console.log(`Middleware (authorized callback): Token exists? ${isAuthorized}`);
          return isAuthorized;
      }
    },
    // IMPORTANT: Define the login page URL.
    // withAuth will redirect here if `authorized` returns false.
    pages: {
      signIn: "/login",
    },
  }
);

// Matcher: Explicitly include the base /admin route
export const config = {
  matcher: [
    "/admin",          // Match the base admin route explicitly
    "/admin/:path*",   // Match all sub-routes under /admin
    "/dashboard",      // Match the base dashboard route
    "/dashboard/:path*", // Match all sub-routes under /dashboard
    "/test/real-test"
 ],
};
