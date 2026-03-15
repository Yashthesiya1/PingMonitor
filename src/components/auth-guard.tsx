"use client";

import { useAuth } from "@insforge/nextjs";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];
const PUBLIC_ROUTES = ["/"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hasEverBeenSignedIn = useRef(false);
  const initialLoadDone = useRef(false);

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  // Track if user has ever been signed in during this session
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      hasEverBeenSignedIn.current = true;
      initialLoadDone.current = true;
    }
    if (isLoaded && isSignedIn === false) {
      // Only mark initial load done after a small delay
      // to avoid false negatives during token sync
      const timer = setTimeout(() => {
        initialLoadDone.current = true;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!isLoaded || !initialLoadDone.current) return;

    if (isProtected && isSignedIn === false) {
      // If they were previously signed in, token expired — logout cleanly
      if (hasEverBeenSignedIn.current) {
        signOut().then(() => {
          window.location.href = "/";
        });
      } else {
        // Never signed in, just trying to access protected route
        router.replace("/");
      }
    }
  }, [isLoaded, isSignedIn, isProtected, signOut, router]);

  // Periodically check auth status on protected routes
  useEffect(() => {
    if (!isProtected || !isSignedIn) return;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          await signOut();
          window.location.href = "/";
        }
      } catch {
        // Network error, don't logout
      }
    };

    const timer = setInterval(checkAuth, 2 * 60 * 1000);
    return () => clearInterval(timer);
  }, [isProtected, isSignedIn, signOut]);

  // On protected routes, don't render children until auth is confirmed
  if (isProtected && (!isLoaded || isSignedIn !== true)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
