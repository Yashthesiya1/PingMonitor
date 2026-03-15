"use client";

import { InsforgeBrowserProvider } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";
import { PreferencesProvider } from "@/lib/preferences";

export function InsforgeProvider({ children }: { children: React.ReactNode }) {
  return (
    <InsforgeBrowserProvider client={insforge} afterSignInUrl="/dashboard">
      <PreferencesProvider>{children}</PreferencesProvider>
    </InsforgeBrowserProvider>
  );
}
