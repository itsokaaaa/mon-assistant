import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname === "/login";
  const isAuthenticated = request.cookies.get("authenticated");
  const userRole = request.cookies.get("role");

  // Redirect unauthenticated users to /login
  if (!isAuthenticated && !isLoginPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && isLoginPage) {
    if (userRole?.value === "admin") {
      url.pathname = "/admin-dashboard";
    } else {
      url.pathname = "/user-dashboard";
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)"], // Apply middleware to all routes except _next and API
};