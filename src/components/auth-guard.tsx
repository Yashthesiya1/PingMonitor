"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (!isLoaded) return;

    if (isProtected) {
      if (isSignedIn) {
        setReady(true);
      } else {
        window.location.href = "/sign-in";
      }
    } else {
      setReady(true);
    }
  }, [isLoaded, isSignedIn, isProtected]);

  if (isProtected && !ready) {
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
