"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PingMonitorLogo } from "@/components/logo";
import {
  LayoutDashboard,
  Users,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const { user } = useAuth();

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

      {/* Back to dashboard */}
      <div className="border-t p-3">
        <Link
          href="/dashboard/endpoints"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="mt-2 px-2.5">
          <p className="text-xs font-medium truncate">{user?.name || user?.email}</p>
          <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
