"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preferences } = usePreferences();
  const isFloating = preferences.sidebarStyle === "floating";
  const isInset = preferences.sidebarStyle === "inset";

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        isFloating && "p-2 gap-2",
        isInset && "bg-muted/30"
      )}
    >
      <div
        className={cn(
          isFloating && "rounded-xl border shadow-sm overflow-hidden",
          isInset && "m-2 rounded-xl border shadow-sm overflow-hidden"
        )}
      >
        <Sidebar />
      </div>
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          isFloating && "rounded-xl border shadow-sm",
          isInset && "my-2 mr-2 rounded-xl border shadow-sm overflow-hidden"
        )}
      >
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div
            className={cn(
              preferences.pageLayout === "centered" && "max-w-6xl mx-auto"
            )}
          >
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
