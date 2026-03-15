"use client";

import { useAuth } from "@insforge/nextjs";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();
  const wasSignedIn = useRef(false);

  // Track if user was previously signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      wasSignedIn.current = true;
    }
  }, [isLoaded, isSignedIn]);

  // Auto-logout when token expires (was signed in, now isn't)
  useEffect(() => {
    if (!isLoaded) return;

    const isProtected = PROTECTED_PREFIXES.some((p) =>
      pathname.startsWith(p)
    );

    if (isProtected && wasSignedIn.current && isSignedIn === false) {
      signOut().then(() => {
        window.location.href = "/";
      });
    }
  }, [isLoaded, isSignedIn, pathname, signOut]);

  // Periodically check auth status by hitting our API
  useEffect(() => {
    const isProtected = PROTECTED_PREFIXES.some((p) =>
      pathname.startsWith(p)
    );
    if (!isProtected) return;

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

    // Check every 2 minutes
    const timer = setInterval(checkAuth, 2 * 60 * 1000);
    return () => clearInterval(timer);
  }, [pathname, signOut]);

  return <>{children}</>;
}
