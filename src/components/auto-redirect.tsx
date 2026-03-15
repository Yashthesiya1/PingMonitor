"use client";

import { useAuth } from "@insforge/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AutoRedirectIfSignedIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Small delay to let auth state fully settle after login callback
    const timer = setTimeout(() => {
      setChecked(true);
      if (isSignedIn) {
        router.replace("/dashboard/endpoints");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn, router]);

  return null;
}
