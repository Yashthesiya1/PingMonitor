"use client";

import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

export function AutoRedirectIfSignedIn() {
  const { isLoaded, isSignedIn, user } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = user?.role === "admin" ? "/admin" : "/dashboard/endpoints";
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}
