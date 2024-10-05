import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const adminCookie = req.cookies.get("admin");

  // If the cookie does not exist and the user is not on the login page, redirect to login
  if (!adminCookie && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the cookie exists and the user is on the login page, redirect to home
  if (adminCookie && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Specify routes to apply middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
