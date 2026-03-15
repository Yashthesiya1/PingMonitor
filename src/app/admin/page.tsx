"use client";

import { useEffect, useState } from "react";
import { useUser } from "@insforge/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Activity,
  Zap,
  TrendingUp,
  Clock,
  CreditCard,
} from "lucide-react";
import type { AdminStats } from "@/lib/types";

interface UserRow {
  id: string;
  user_id: string;
  role: string;
  credits: number;
  max_endpoints: number;
  created_at: string;
  endpoint_count: number;
}

export default function AdminPage() {
  const { isLoaded } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/users").then((r) => r.json()),
    ])
      .then(([statsRes, usersRes]) => {
        if (statsRes.error) {
          setError(statsRes.error);
          return;
        }
        setStats(statsRes.data);
        setUsers(usersRes.data || []);
      })
      .catch(() => setError("Failed to load admin data"))
      .finally(() => setLoading(false));
  }, [isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="max-w-md rounded-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive font-medium">Access Denied</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error === "Forbidden"
                ? "You don't have admin access."
                : error}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-4">
        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <Users className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">{stats?.total_users || 0}</p>
            <div className="mt-3 text-xs text-muted-foreground">
              Registered on the platform
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Endpoints
              </p>
              <Activity className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.total_endpoints || 0}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-emerald-500" />
              <span>{stats?.active_endpoints || 0} active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Checks Today
              </p>
              <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.total_checks_today || 0}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                Avg {Math.round(stats?.avg_response_time || 0)}ms response
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Credits
              </p>
              <CreditCard className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats?.total_credits || 0}
            </p>
            <div className="mt-3 text-xs text-muted-foreground">
              Across all users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Uptime */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Platform Uptime (Today)
          </CardTitle>
          <CardDescription>
            Overall success rate across all monitored endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-4xl font-bold text-emerald-600">
              {stats?.uptime_percentage || 0}%
            </div>
            <div className="flex-1">
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${stats?.uptime_percentage || 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Users</CardTitle>
          <CardDescription>
            All registered users and their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  User ID
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                  Role
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                  Credits
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                  Endpoints
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                  Max
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No users yet
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">
                      {u.user_id.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.role === "admin" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {u.credits}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.endpoint_count}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {u.max_endpoints}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
