"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Menu } from "lucide-react";
import { PreferencesPanel } from "./preferences-panel";
import { usePreferences } from "@/lib/preferences";
import { cn } from "@/lib/utils";

export function DashboardHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const [time, setTime] = useState(new Date());
  const [showPrefs, setShowPrefs] = useState(false);
  const { preferences } = usePreferences();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header
      className={cn(
        "z-10 flex h-14 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6",
        preferences.navbarBehavior === "sticky" && "sticky top-0"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">Ctrl</span>J
          </kbd>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <span>{formattedDate}</span>
          <span className="font-mono">{formattedTime}</span>
          <span className="text-xs">UTC</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              showPrefs
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
          {showPrefs && (
            <PreferencesPanel onClose={() => setShowPrefs(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
