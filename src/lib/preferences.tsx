"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePreset = "default" | "ocean" | "sunset" | "emerald";
export type ThemeMode = "light" | "dark" | "system";
export type PageLayout = "centered" | "full-width";
export type NavbarBehavior = "sticky" | "scroll";
export type SidebarStyle = "inset" | "sidebar" | "floating";
export type SidebarCollapse = "icon" | "offcanvas";

export interface Preferences {
  themePreset: ThemePreset;
  font: string;
  themeMode: ThemeMode;
  pageLayout: PageLayout;
  navbarBehavior: NavbarBehavior;
  sidebarStyle: SidebarStyle;
  sidebarCollapse: SidebarCollapse;
}

const defaultPreferences: Preferences = {
  themePreset: "default",
  font: "Inter",
  themeMode: "light",
  pageLayout: "centered",
  navbarBehavior: "sticky",
  sidebarStyle: "inset",
  sidebarCollapse: "icon",
};

const STORAGE_KEY = "pingmonitor-preferences";

interface PreferencesContextType {
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  updatePreference: () => {},
  resetPreferences: () => {},
});

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    }
  }, [preferences, loaded]);

  // Apply theme mode
  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (preferences.themeMode === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(isDark ? "dark" : "light");
    } else {
      root.classList.add(preferences.themeMode);
    }
  }, [preferences.themeMode, loaded]);

  // Apply theme preset colors
  useEffect(() => {
    if (!loaded) return;
    const root = document.documentElement;

    const presets: Record<ThemePreset, { primary: string; accent: string }> = {
      default: { primary: "245 58% 51%", accent: "245 58% 96%" },
      ocean: { primary: "210 100% 45%", accent: "210 100% 95%" },
      sunset: { primary: "25 95% 53%", accent: "25 95% 95%" },
      emerald: { primary: "160 84% 39%", accent: "160 84% 95%" },
    };

    const preset = presets[preferences.themePreset];
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--accent", preset.accent);
    root.style.setProperty("--ring", preset.primary);
    root.style.setProperty(
      "--sidebar-accent",
      preset.accent
    );
    root.style.setProperty(
      "--sidebar-accent-foreground",
      preset.primary
    );
  }, [preferences.themePreset, loaded]);

  // Apply font
  useEffect(() => {
    if (!loaded) return;
    document.body.style.fontFamily = `${preferences.font}, sans-serif`;
  }, [preferences.font, loaded]);

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    const root = document.documentElement;
    root.style.removeProperty("--primary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--ring");
    root.style.removeProperty("--sidebar-accent");
    root.style.removeProperty("--sidebar-accent-foreground");
    document.body.style.fontFamily = "";
  };

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreference, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
