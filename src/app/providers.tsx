"use client";

import { InsforgeBrowserProvider } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";
import { PreferencesProvider } from "@/lib/preferences";
import { AuthGuard } from "@/components/auth-guard";

export function InsforgeProvider({ children }: { children: React.ReactNode }) {
  return (
    <InsforgeBrowserProvider client={insforge} afterSignInUrl="/dashboard">
      <PreferencesProvider>
        <AuthGuard>{children}</AuthGuard>
      </PreferencesProvider>
    </InsforgeBrowserProvider>
  );
}
