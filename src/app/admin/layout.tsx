"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { ErrorBoundary } from "@/components/error-boundary";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { preferences } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFloating = preferences.sidebarStyle === "floating";
  const isInset = preferences.sidebarStyle === "inset";

  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden",
        isFloating && "lg:p-2 lg:gap-2",
        isInset && "bg-muted/30"
      )}
    >
      <div
        className={cn(
          "hidden lg:block shrink-0",
          isFloating && "rounded-xl border shadow-sm overflow-hidden",
          isInset && "m-2 rounded-xl border shadow-sm overflow-hidden"
        )}
      >
        <Sidebar onNavigate={() => {}} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[260px]">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden min-w-0",
          isFloating && "lg:rounded-xl lg:border lg:shadow-sm",
          isInset && "lg:my-2 lg:mr-2 lg:rounded-xl lg:border lg:shadow-sm overflow-hidden"
        )}
      >
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
