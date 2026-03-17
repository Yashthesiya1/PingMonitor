import { InsforgeMiddleware } from "@insforge/nextjs/middleware";

export default InsforgeMiddleware({
  baseUrl:
    process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ||
    "https://s927cvm2.ap-southeast.insforge.app",
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/api/auth",
    "/api/auth/(.*)",
  ],
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard/endpoints",
  useBuiltInAuth: false,
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|sitemap.xml|robots.txt|site.webmanifest).*)",
  ],
};
