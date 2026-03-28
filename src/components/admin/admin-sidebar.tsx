"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PingMonitorLogo } from "@/components/logo";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Bell,
  LogOut,
  User,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

const navItems = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Endpoints", href: "/admin/endpoints", icon: Globe },
  { title: "Checks", href: "/admin/checks", icon: CheckCircle2 },
  { title: "Incidents", href: "/admin/incidents", icon: AlertTriangle },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success("Signed out");
    window.location.href = "/sign-in";
  };

  const userInitial = (user?.name || user?.email || "A").charAt(0).toUpperCase();

  return (
    <div className="flex h-screen w-[240px] flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-14 items-center gap-2.5 px-5 border-b">
        <PingMonitorLogo size={28} />
        <div>
          <span className="text-[15px] font-semibold block leading-tight">PingMonitor</span>
          <span className="text-[10px] text-primary font-medium uppercase tracking-wider">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-0.5">
          {navItems.map((item) => {
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
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="relative border-t p-3" ref={menuRef}>
        {showMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-1 rounded-xl border bg-card shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="py-1">
              <Link
                href="/admin"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                Profile
              </Link>
            </div>
            <div className="border-t py-1">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Log out
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors",
            showMenu ? "bg-muted" : "hover:bg-muted"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-[11px] truncate text-muted-foreground">{user?.email}</p>
          </div>
          <MoreVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
