import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const isLoginPage = url.pathname === "/login";
  const isAuthenticated = request.cookies.has("authenticated");

  // Redirige les utilisateurs non authentifiés vers /login
  if (!isAuthenticated && !isLoginPage) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si un utilisateur est authentifié et essaie d'accéder à /login, redirige vers /
  if (isAuthenticated && isLoginPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)"], // Applique le middleware à toutes les pages sauf _next et API routes
};