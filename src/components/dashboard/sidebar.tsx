"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useAuth } from "@insforge/nextjs";
import { PingMonitorLogo } from "@/components/logo";
import {
  Activity,
  BarChart3,
  Globe,
  Shield,
  List,
  Bell,
  MoreVertical,
  User,
  LogOut,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { UserProfile } from "@/lib/types";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWithAuth("/api/profile")
      .then((res) => res.json())
      .then(({ data }) => {
        if (data) setProfile(data as UserProfile);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    window.location.href = "/";
  };

  const isAdmin = profile?.role === "admin";

  const navGroups: NavGroup[] = [
    {
      items: [
        { title: "Endpoints", href: "/dashboard/endpoints", icon: Globe },
        { title: "Checks", href: "/dashboard/checks", icon: List },
        { title: "Metrics", href: "/dashboard/metrics", icon: BarChart3 },
        { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
      ],
    },
    ...(isAdmin
      ? [
          {
            label: "Admin",
            items: [
              { title: "Overview", href: "/admin", icon: Shield },
            ],
          },
        ]
      : []),
  ];

  const userName = profile?.display_name || user?.profile?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-[240px] flex-col bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <PingMonitorLogo size={28} />
        <span className="text-[15px] font-semibold text-[hsl(var(--sidebar-foreground))]">
          PingMonitor
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group, gi) => (
          <div key={gi} className={cn(gi > 0 && "mt-5")}>
            {group.label && (
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-[hsl(var(--sidebar-foreground))]/70 hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="relative border-t border-[hsl(var(--sidebar-border))] p-3 mb-3" ref={menuRef}>
        {/* User menu popup */}
        {showUserMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl border bg-card shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden">
            {/* User info header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/dashboard/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Account
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Billing
              </Link>
            </div>

            <div className="border-t py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Log out
              </button>
            </div>
          </div>
        )}

        {/* User button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors",
            showUserMenu
              ? "bg-[hsl(var(--sidebar-accent))]"
              : "hover:bg-[hsl(var(--sidebar-accent))]"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-medium truncate text-[hsl(var(--sidebar-foreground))]">
              {userName}
            </p>
            <p className="text-[11px] truncate text-muted-foreground">
              {profile?.email || user?.email}
            </p>
          </div>
          <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
