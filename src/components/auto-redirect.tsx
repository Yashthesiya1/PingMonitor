"use client";

import { useAuth } from "@insforge/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AutoRedirectIfSignedIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard/endpoints");
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}
