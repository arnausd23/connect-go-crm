import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for an API route
  if (pathname.startsWith("/api/")) {
    // Create a new URL for the API request
    const url = new URL(
      pathname,
      "https://healthandfitnessconnect.com/connect"
    );

    // Return a rewrite to the new URL
    return NextResponse.rewrite(url);
  }
}

// Optionally, you can specify which routes this middleware applies to
export const config = {
  matcher: "/api/:path*",
};
