"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

export function AutoRedirectIfSignedIn() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "/dashboard/endpoints";
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
