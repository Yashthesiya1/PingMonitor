import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // No server-side auth check needed — auth is handled by
  // client-side AuthGuard + axios interceptor with JWT tokens
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|sitemap.xml|robots.txt|site.webmanifest).*)",
  ],
};
