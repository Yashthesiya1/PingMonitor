"use client";

import { AuthProvider } from "@/lib/auth-context";
import { PreferencesProvider } from "@/lib/preferences";
import { AuthGuard } from "@/components/auth-guard";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AuthGuard>{children}</AuthGuard>
      </PreferencesProvider>
    </AuthProvider>
  );
}
