"use client";

import { useAuth } from "@insforge/nextjs";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (!isProtected) {
      setAuthState("authenticated");
      return;
    }

    if (isSignedIn) {
      setAuthState("authenticated");
      return;
    }

    // isSignedIn is false — but this could be a false negative
    // (SDK hasn't synced cookie yet after login redirect)
    // Verify with a server-side call before kicking user out
    const verifyAuth = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          // Server says authenticated — SDK just hasn't caught up
          setAuthState("authenticated");
        } else {
          // Server confirms not authenticated
          setAuthState("unauthenticated");
        }
      } catch {
        // Network error — don't kick out
        setAuthState("unauthenticated");
      }
    };

    verifyAuth();
  }, [isLoaded, isSignedIn, isProtected]);

  // Redirect unauthenticated users
  useEffect(() => {
    if (authState === "unauthenticated" && isProtected) {
      window.location.href = "/sign-in";
    }
  }, [authState, isProtected]);

  // Periodic auth check (token expiry detection)
  useEffect(() => {
    if (authState !== "authenticated" || !isProtected) return;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.status === 401) {
          await signOut();
          window.location.href = "/sign-in";
        }
      } catch {
        // Network error — don't logout
      }
    };

    const timer = setInterval(checkAuth, 2 * 60 * 1000);
    return () => clearInterval(timer);
  }, [authState, isProtected, signOut]);

  // Show loading on protected routes while verifying
  if (isProtected && authState === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
