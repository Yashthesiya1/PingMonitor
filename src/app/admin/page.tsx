"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Globe, CheckCircle2, AlertTriangle, Bell, Zap } from "lucide-react";
import api from "@/lib/api";

interface AdminStats {
  total_users: number;
  total_endpoints: number;
  active_endpoints: number;
  total_checks_today: number;
  avg_response_time: number;
  uptime_percentage: number;
  total_incidents: number;
  open_incidents: number;
  total_notifications_sent: number;
}

interface ActivityItem {
  type: string;
  description: string;
  timestamp: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/admin/stats"),
      api.get("/api/v1/admin/activity"),
    ])
      .then(([statsRes, activityRes]) => {
        setStats(statsRes.data);
        setActivity(activityRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[100px] rounded-xl" />)}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { label: "Endpoints", value: stats?.total_endpoints || 0, icon: Globe, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active", value: stats?.active_endpoints || 0, icon: Zap, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Checks Today", value: stats?.total_checks_today || 0, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Open Incidents", value: stats?.open_incidents || 0, icon: AlertTriangle, color: stats?.open_incidents ? "text-red-600" : "text-muted-foreground", bg: stats?.open_incidents ? "bg-red-500/10" : "bg-muted" },
    { label: "Notifications", value: stats?.total_notifications_sent || 0, icon: Bell, color: "text-orange-600", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard<span className="text-primary">.</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, i) => (
          <Card key={i} className="rounded-xl">
            <CardContent className="p-4 text-center">
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Platform Uptime</CardTitle>
            <CardDescription>Today&apos;s overall success rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className={`text-4xl font-bold ${(stats?.uptime_percentage || 0) >= 99 ? "text-emerald-600" : (stats?.uptime_percentage || 0) >= 90 ? "text-yellow-600" : "text-red-600"}`}>
                {stats?.uptime_percentage || 0}%
              </div>
              <div className="flex-1">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${stats?.uptime_percentage || 0}%` }} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-lg font-semibold">{stats?.avg_response_time || 0}ms</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Incidents</p>
                <p className="text-lg font-semibold">{stats?.total_incidents || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full shrink-0 ${
                      item.type === "signup" ? "bg-blue-500/10" : item.type === "endpoint" ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}>
                      {item.type === "signup" ? <Users className="h-3.5 w-3.5 text-blue-600" /> :
                       item.type === "endpoint" ? <Globe className="h-3.5 w-3.5 text-emerald-600" /> :
                       <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{item.description}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] shrink-0">{item.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
