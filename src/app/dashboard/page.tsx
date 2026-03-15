"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@insforge/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseChart } from "@/components/dashboard/response-chart";
import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Globe,
  ArrowRight,
  Trash2,
  Plus,
} from "lucide-react";
import type { Endpoint, EndpointCheck } from "@/lib/types";

export default function DashboardPage() {
  const { isLoaded } = useAuth();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [checksMap, setChecksMap] = useState<Record<string, EndpointCheck[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const fetchEndpoints = useCallback(async () => {
    try {
      const res = await fetch("/api/endpoints");
      const { data } = await res.json();
      if (data) setEndpoints(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChecks = useCallback(async (endpointIds: string[]) => {
    const results: Record<string, EndpointCheck[]> = {};
    await Promise.all(
      endpointIds.map(async (id) => {
        const res = await fetch(`/api/endpoints/${id}/checks`);
        const { data } = await res.json();
        results[id] = data || [];
      })
    );
    setChecksMap(results);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      fetchEndpoints();
    }
  }, [isLoaded, fetchEndpoints]);

  useEffect(() => {
    if (endpoints.length > 0) {
      fetchChecks(endpoints.map((e) => e.id));
    }
  }, [endpoints, fetchChecks]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEndpoints();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchEndpoints]);

  const handleDeleteEndpoint = async (id: string) => {
    await fetch(`/api/endpoints/${id}`, { method: "DELETE" });
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
    setChecksMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // Stats
  const allChecks = Object.values(checksMap).flat();
  const totalUp = allChecks.filter((c) => c.is_up).length;
  const totalDown = allChecks.filter((c) => !c.is_up).length;
  const successRate =
    allChecks.length > 0
      ? ((totalUp / allChecks.length) * 100).toFixed(1)
      : "0";
  const activeEndpoints = endpoints.filter((e) => e.is_active).length;

  // Recent checks (last 20 across all endpoints)
  const recentChecks = allChecks
    .sort(
      (a, b) =>
        new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime()
    )
    .slice(0, 20);

  // Map endpoint_id to endpoint for display
  const endpointMap = Object.fromEntries(endpoints.map((e) => [e.id, e]));

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards — HookFlow style */}
      <div className="grid gap-4 grid-cols-4">
        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Endpoints
              </p>
              <Globe className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">{endpoints.length}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>
                {7 - endpoints.length} slots remaining
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Max 7 endpoints per account
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Successful
              </p>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">{totalUp}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              <span>{successRate}% success rate</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully reached in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Failed
              </p>
              <XCircle className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">{totalDown}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <XCircle className="h-3 w-3 text-destructive" />
              <span>{totalDown} failed checks</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Failed checks in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Active Monitors
              </p>
              <Activity className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="mt-2 text-3xl font-bold">{activeEndpoints}</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>
                {endpoints.length} endpoint
                {endpoints.length !== 1 ? "s" : ""},{" "}
                {activeEndpoints} active
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Currently being monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Chart — like Event Deliveries */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Response Times
            </CardTitle>
            <CardDescription>
              Endpoint response times over the last 24 hours
            </CardDescription>
          </div>
          <Link href="/dashboard/endpoints/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Add Monitor
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {allChecks.length > 0 ? (
            <ResponseChart checks={allChecks} />
          ) : (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
              No check data yet. Add an endpoint to start monitoring.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Checks Table — like Recent Events */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Checks
            </CardTitle>
            <CardDescription>
              Latest status checks across all endpoints
            </CardDescription>
          </div>
          {endpoints.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {recentChecks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">No checks yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first endpoint to start monitoring
              </p>
              <div className="mt-4">
                <Link href="/dashboard/endpoints/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Monitor
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                    Endpoint
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                    URL
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                    Status
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                    HTTP
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                    Response
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                    Checked
                  </TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentChecks.map((check) => {
                  const ep = endpointMap[check.endpoint_id];
                  return (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium text-sm">
                        {ep?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono max-w-[200px] truncate">
                        {ep?.url}
                      </TableCell>
                      <TableCell>
                        {check.is_up ? (
                          <Badge
                            variant="outline"
                            className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 text-xs"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Up
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 border-red-200 bg-red-50 text-red-700 text-xs"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Down
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`text-xs font-mono font-medium ${
                            check.status_code && check.status_code < 400
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {check.status_code || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {check.response_time_ms
                          ? `${check.response_time_ms}ms`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {getTimeAgo(check.checked_at)}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDeleteEndpoint(check.endpoint_id)}
                          className="p-1 rounded text-muted-foreground/50 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
