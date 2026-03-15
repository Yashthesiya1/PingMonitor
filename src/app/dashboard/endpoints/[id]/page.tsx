"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { ChecksDataTable } from "@/components/dashboard/checks-data-table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Clock,
  Globe,
  CheckCircle2,
  XCircle,
  Activity,
  TrendingUp,
  Zap,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  Mail,
  MessageSquare,
  Bell,
  MapPin,
  Copy,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { Endpoint, EndpointCheck } from "@/lib/types";

export default function EndpointDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [checks, setChecks] = useState<EndpointCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [epRes, checksRes] = await Promise.all([
        fetchWithAuth("/api/endpoints"),
        fetchWithAuth(`/api/endpoints/${id}/checks`),
      ]);
      const epData = await epRes.json();
      const checksData = await checksRes.json();

      const ep = epData.data?.find((e: Endpoint) => e.id === id);
      if (ep) setEndpoint(ep);
      if (checksData.data) setChecks(checksData.data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh based on endpoint's check interval
  useEffect(() => {
    const intervalMinutes = endpoint?.check_interval || 1;
    const ms = intervalMinutes * 60 * 1000;
    const timer = setInterval(fetchData, ms);
    return () => clearInterval(timer);
  }, [fetchData, endpoint?.check_interval]);

  const handleToggle = async () => {
    if (!endpoint) return;
    await fetchWithAuth(`/api/endpoints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !endpoint.is_active }),
    });
    setEndpoint((prev) =>
      prev ? { ...prev, is_active: !prev.is_active } : null
    );
  };

  const handleDelete = async () => {
    await fetchWithAuth(`/api/endpoints/${id}`, { method: "DELETE" });
    window.location.href = "/dashboard/endpoints";
  };

  const handleCopyUrl = () => {
    if (endpoint) {
      navigator.clipboard.writeText(endpoint.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="max-w-5xl mx-auto">
        <Card className="rounded-xl">
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Monitor not found.
            </p>
            <Link href="/dashboard/endpoints">
              <Button variant="outline" className="mt-4">
                Back to Monitors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compute stats
  const latestCheck = checks.length ? checks[checks.length - 1] : null;
  const isUp = latestCheck?.is_up ?? null;
  const upChecks = checks.filter((c) => c.is_up).length;
  const uptimePercent =
    checks.length > 0 ? ((upChecks / checks.length) * 100).toFixed(1) : "N/A";
  const avgResponse =
    checks.length > 0
      ? Math.round(
          checks.reduce((a, c) => a + (c.response_time_ms || 0), 0) /
            checks.filter((c) => c.response_time_ms).length || 0
        )
      : 0;
  const minResponse = checks.length
    ? Math.min(
        ...checks.filter((c) => c.response_time_ms).map((c) => c.response_time_ms!)
      )
    : 0;
  const maxResponse = checks.length
    ? Math.max(
        ...checks.filter((c) => c.response_time_ms).map((c) => c.response_time_ms!)
      )
    : 0;
  const incidents = checks.filter((c) => !c.is_up).length;

  // Chart data — each check is a data point
  const responseChartData = checks.map((c) => {
    const d = new Date(c.checked_at);
    return {
      time: d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      responseTime: c.response_time_ms || 0,
      statusCode: c.status_code || 0,
      isUp: c.is_up,
    };
  });

  // Uptime bar data — last 30 checks
  const uptimeBars = checks.slice(-60).map((c, i) => ({
    index: i,
    value: c.response_time_ms || 0,
    isUp: c.is_up,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard/endpoints"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Monitors
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {!endpoint.is_active ? (
              <div className="h-4 w-4 rounded-full bg-muted-foreground/30" />
            ) : isUp === null ? (
              <div className="h-4 w-4 rounded-full bg-muted-foreground/30 animate-pulse" />
            ) : isUp ? (
              <div className="h-4 w-4 rounded-full bg-emerald-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-red-500" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{endpoint.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-1 text-xs text-muted-foreground font-mono hover:text-foreground transition-colors"
              >
                {endpoint.url}
                <Copy className="h-3 w-3" />
              </button>
              {copied && (
                <span className="text-xs text-emerald-600">Copied!</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={endpoint.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Visit
            </Button>
          </a>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleToggle}
          >
            {endpoint.is_active ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Resume
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Status
              </p>
              {isUp === null ? (
                <Activity className="h-4 w-4 text-muted-foreground animate-pulse" />
              ) : isUp ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-xl font-bold">
              {!endpoint.is_active
                ? "Paused"
                : isUp === null
                ? "Pending"
                : isUp
                ? "Up"
                : "Down"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {latestCheck
                ? `Last check ${getTimeAgo(latestCheck.checked_at)}`
                : "No checks yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Uptime (24h)
              </p>
              <TrendingUp className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p
              className={`text-xl font-bold ${
                uptimePercent !== "N/A" && Number(uptimePercent) >= 90
                  ? "text-emerald-600"
                  : uptimePercent !== "N/A" && Number(uptimePercent) < 50
                  ? "text-red-600"
                  : ""
              }`}
            >
              {uptimePercent}
              {uptimePercent !== "N/A" && "%"}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {upChecks} / {checks.length} checks passed
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Avg Response
              </p>
              <Zap className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-xl font-bold">{avgResponse}ms</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {minResponse}ms min / {maxResponse}ms max
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Incidents
              </p>
              <XCircle className="h-4 w-4 text-muted-foreground/50" />
            </div>
            <p className="text-xl font-bold">{incidents}</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Failed checks in 24h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Uptime timeline bars */}
      <Card className="rounded-xl mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Availability
          </CardTitle>
          <CardDescription>
            Each bar represents a single check — green is up, red is down
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uptimeBars.length > 0 ? (
            <div className="flex items-end gap-[2px] h-12">
              {uptimeBars.map((bar, i) => (
                <div
                  key={i}
                  className={`flex-1 min-w-[3px] max-w-[6px] rounded-t-sm transition-all ${
                    bar.isUp ? "bg-emerald-500" : "bg-red-500"
                  }`}
                  style={{
                    height: `${
                      bar.value > 0
                        ? Math.max(
                            20,
                            Math.min(
                              100,
                              (bar.value / (maxResponse || 1)) * 100
                            )
                          )
                        : 20
                    }%`,
                  }}
                  title={`${bar.isUp ? "Up" : "Down"} — ${bar.value}ms`}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-12 text-xs text-muted-foreground">
              No check data yet
            </div>
          )}
          <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
            <span>24 hours ago</span>
            <span>Now</span>
          </div>
        </CardContent>
      </Card>

      {/* Response time chart */}
      <Card className="rounded-xl mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Response Time
          </CardTitle>
          <CardDescription>
            Average response time per hour over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          {responseChartData.length > 0 ? (
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseChartData}>
                  <defs>
                    <linearGradient
                      id="detailGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(245, 58%, 51%)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(245, 58%, 51%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(240, 5.9%, 90%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 11, fill: "hsl(240, 3.8%, 46.1%)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "hsl(240, 3.8%, 46.1%)" }}
                    tickLine={false}
                    axisLine={false}
                    unit="ms"
                    width={55}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0]?.payload;
                        return (
                          <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
                            <p className="font-medium">{d?.time}</p>
                            <p className="text-muted-foreground mt-1">
                              Response:{" "}
                              <span className="text-foreground font-medium">
                                {d?.responseTime}ms
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Status:{" "}
                              <span
                                className={`font-medium ${
                                  d?.isUp
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {d?.isUp ? "Up" : "Down"}
                                {d?.statusCode ? ` (${d.statusCode})` : ""}
                              </span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="responseTime"
                    stroke="hsl(245, 58%, 51%)"
                    fill="url(#detailGradient)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(245, 58%, 51%)" }}
                    activeDot={{ r: 5, fill: "hsl(245, 58%, 51%)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
              No response data yet. Checks will appear here after the first
              ping.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monitor configuration */}
      <Card className="rounded-xl mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Globe className="h-3 w-3" /> URL
              </p>
              <p className="text-sm font-mono">{endpoint.url}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Check Interval
              </p>
              <p className="text-sm">
                Every {endpoint.check_interval} minute
                {endpoint.check_interval !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Region
              </p>
              <p className="text-sm capitalize">
                {endpoint.monitor_region === "auto"
                  ? "Auto-select"
                  : endpoint.monitor_region}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3 w-3" /> Method
              </p>
              <p className="text-sm">{endpoint.method}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-xs text-muted-foreground mb-2">
                Notifications
              </p>
              <div className="flex items-center gap-3">
                <Badge
                  variant={endpoint.notify_email ? "default" : "secondary"}
                  className="gap-1 text-xs"
                >
                  <Mail className="h-3 w-3" />
                  Email {endpoint.notify_email ? "On" : "Off"}
                </Badge>
                <Badge
                  variant={endpoint.notify_sms ? "default" : "secondary"}
                  className="gap-1 text-xs"
                >
                  <MessageSquare className="h-3 w-3" />
                  SMS {endpoint.notify_sms ? "On" : "Off"}
                </Badge>
                <Badge
                  variant={endpoint.notify_push ? "default" : "secondary"}
                  className="gap-1 text-xs"
                >
                  <Bell className="h-3 w-3" />
                  Push {endpoint.notify_push ? "On" : "Off"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent checks datatable */}
      <ChecksDataTable checks={checks} />
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
