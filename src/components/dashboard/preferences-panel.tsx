"use client";

import { useEffect, useRef } from "react";
import {
  usePreferences,
  type ThemePreset,
  type ThemeMode,
  type PageLayout,
  type NavbarBehavior,
  type SidebarStyle,
  type SidebarCollapse,
} from "@/lib/preferences";
import { cn } from "@/lib/utils";

interface PreferencesPanelProps {
  onClose: () => void;
}

const themePresets: { value: ThemePreset; label: string; color: string }[] = [
  { value: "default", label: "Default", color: "bg-[hsl(245,58%,51%)]" },
  { value: "ocean", label: "Ocean", color: "bg-[hsl(210,100%,45%)]" },
  { value: "sunset", label: "Sunset", color: "bg-[hsl(25,95%,53%)]" },
  { value: "emerald", label: "Emerald", color: "bg-[hsl(160,84%,39%)]" },
];

const fonts = ["Inter", "System", "Mono"];

export function PreferencesPanel({ onClose }: PreferencesPanelProps) {
  const { preferences, updatePreference, resetPreferences } = usePreferences();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-[280px] rounded-xl border bg-card shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold">Preferences</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize your dashboard layout preferences.
        </p>
      </div>

      <div className="p-4 space-y-5">
        {/* Theme Preset */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Theme Preset
          </label>
          <div className="mt-2 relative">
            <select
              value={preferences.themePreset}
              onChange={(e) =>
                updatePreference("themePreset", e.target.value as ThemePreset)
              }
              className="w-full appearance-none rounded-lg border bg-background px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {themePresets.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <div
              className={cn(
                "absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full",
                themePresets.find((p) => p.value === preferences.themePreset)
                  ?.color
              )}
            />
          </div>
        </div>

        {/* Font */}
        <div>
          <label className="text-xs font-medium text-foreground">Fonts</label>
          <select
            value={preferences.font}
            onChange={(e) => updatePreference("font", e.target.value)}
            className="mt-2 w-full appearance-none rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Mode */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Theme Mode
          </label>
          <ToggleGroup
            options={["Light", "Dark", "System"]}
            value={preferences.themeMode}
            onChange={(v) =>
              updatePreference("themeMode", v.toLowerCase() as ThemeMode)
            }
          />
        </div>

        {/* Page Layout */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Page Layout
          </label>
          <ToggleGroup
            options={["Centered", "Full Width"]}
            value={
              preferences.pageLayout === "full-width"
                ? "Full Width"
                : "Centered"
            }
            onChange={(v) =>
              updatePreference(
                "pageLayout",
                v === "Full Width"
                  ? "full-width"
                  : ("centered" as PageLayout)
              )
            }
          />
        </div>

        {/* Navbar Behavior */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Navbar Behavior
          </label>
          <ToggleGroup
            options={["Sticky", "Scroll"]}
            value={
              preferences.navbarBehavior === "sticky" ? "Sticky" : "Scroll"
            }
            onChange={(v) =>
              updatePreference(
                "navbarBehavior",
                v.toLowerCase() as NavbarBehavior
              )
            }
          />
        </div>

        {/* Sidebar Style */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Sidebar Style
          </label>
          <ToggleGroup
            options={["Inset", "Sidebar", "Floating"]}
            value={
              preferences.sidebarStyle.charAt(0).toUpperCase() +
              preferences.sidebarStyle.slice(1)
            }
            onChange={(v) =>
              updatePreference(
                "sidebarStyle",
                v.toLowerCase() as SidebarStyle
              )
            }
          />
        </div>

        {/* Sidebar Collapse Mode */}
        <div>
          <label className="text-xs font-medium text-foreground">
            Sidebar Collapse Mode
          </label>
          <ToggleGroup
            options={["Icon", "OffCanvas"]}
            value={
              preferences.sidebarCollapse === "icon" ? "Icon" : "OffCanvas"
            }
            onChange={(v) =>
              updatePreference(
                "sidebarCollapse",
                v.toLowerCase() === "offcanvas"
                  ? "offcanvas"
                  : ("icon" as SidebarCollapse)
              )
            }
          />
        </div>
      </div>

      {/* Reset */}
      <div className="border-t p-4">
        <button
          onClick={resetPreferences}
          className="w-full rounded-lg border py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Restore Defaults
        </button>
      </div>
    </div>
  );
}

function ToggleGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mt-2 flex rounded-lg border bg-muted/50 p-0.5">
      {options.map((opt) => {
        const isActive =
          opt.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              "flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
