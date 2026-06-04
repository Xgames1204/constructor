import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;

  const isProtected =
    path.startsWith("/dashboard") || path.startsWith("/editor");

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (
    isLoggedIn &&
    (path === "/auth/login" || path === "/auth/register") &&
    !req.nextUrl.searchParams.get("registered")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/auth/:path*"],
};
