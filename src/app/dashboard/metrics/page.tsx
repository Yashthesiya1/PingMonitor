"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { Endpoint, EndpointCheck } from "@/lib/types";

interface EndpointWithChecks {
  endpoint: Endpoint;
  checks: EndpointCheck[];
}

export default function MetricsPage() {
  const { isLoaded } = useAuth();
  const [data, setData] = useState<EndpointWithChecks[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    try {
      const epRes = await fetchWithAuth("/api/endpoints");
      const { data: eps } = await epRes.json();
      if (!eps) return;

      const results: EndpointWithChecks[] = [];
      await Promise.all(
        eps.map(async (ep: Endpoint) => {
          const r = await fetchWithAuth(`/api/endpoints/${ep.id}/checks`);
          const { data: checks } = await r.json();
          results.push({ endpoint: ep, checks: checks || [] });
        })
      );
      setData(results);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) refreshAll();
  }, [isLoaded, refreshAll]);

  useEffect(() => {
    if (data.length === 0) return;
    const shortest = Math.min(
      ...data.map((d) => d.endpoint.check_interval || 1)
    );
    const timer = setInterval(refreshAll, shortest * 60 * 1000);
    return () => clearInterval(timer);
  }, [data, refreshAll]);

  const allChecks = useMemo(() => data.flatMap((d) => d.checks), [data]);

  // Global stats
  const totalChecks = allChecks.length;
  const totalUp = allChecks.filter((c) => c.is_up).length;
  const totalDown = allChecks.filter((c) => !c.is_up).length;
  const overallUptime =
    totalChecks > 0 ? ((totalUp / totalChecks) * 100).toFixed(1) : "N/A";
  const avgResponse =
    totalChecks > 0
      ? Math.round(
          allChecks.reduce((a, c) => a + (c.response_time_ms || 0), 0) /
            (allChecks.filter((c) => c.response_time_ms).length || 1)
        )
      : 0;
  const fastestCheck =
    allChecks.length > 0
      ? Math.min(
          ...allChecks
            .filter((c) => c.response_time_ms)
            .map((c) => c.response_time_ms!)
        )
      : 0;
  const slowestCheck =
    allChecks.length > 0
      ? Math.max(
          ...allChecks
            .filter((c) => c.response_time_ms)
            .map((c) => c.response_time_ms!)
        )
      : 0;

  // Uptime trend chart — each check as a running average
  const uptimeTrendData = useMemo(() => {
    const sorted = [...allChecks].sort(
      (a, b) =>
        new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
    );
    let upCount = 0;
    return sorted.map((c, i) => {
      if (c.is_up) upCount++;
      return {
        time: new Date(c.checked_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        uptime: Math.round((upCount / (i + 1)) * 100),
      };
    });
  }, [allChecks]);

  // Response time trend — each check
  const responseTrendData = useMemo(() => {
    return [...allChecks]
      .sort(
        (a, b) =>
          new Date(a.checked_at).getTime() - new Date(b.checked_at).getTime()
      )
      .map((c) => ({
        time: new Date(c.checked_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        responseTime: c.response_time_ms || 0,
        isUp: c.is_up,
      }));
  }, [allChecks]);

  // Checks per hour bar chart
  const checksPerHour = useMemo(() => {
    const hours: Record<string, { up: number; down: number }> = {};
    allChecks.forEach((c) => {
      const h = new Date(c.checked_at)
        .getHours()
        .toString()
        .padStart(2, "0") + ":00";
      if (!hours[h]) hours[h] = { up: 0, down: 0 };
      if (c.is_up) hours[h].up++;
      else hours[h].down++;
    });
    return Object.entries(hours)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, d]) => ({ hour, up: d.up, down: d.down }));
  }, [allChecks]);

  // Per-endpoint stats table
  const endpointStats = useMemo(() => {
    return data
      .map(({ endpoint, checks }) => {
        const up = checks.filter((c) => c.is_up).length;
        const total = checks.length;
        const uptime = total > 0 ? ((up / total) * 100).toFixed(1) : "N/A";
        const avg =
          total > 0
            ? Math.round(
                checks.reduce((a, c) => a + (c.response_time_ms || 0), 0) /
                  (checks.filter((c) => c.response_time_ms).length || 1)
              )
            : 0;
        const lastCheck = checks.length
          ? checks[checks.length - 1]
          : null;
        return {
          id: endpoint.id,
          name: endpoint.name,
          url: endpoint.url,
          is_active: endpoint.is_active,
          uptime,
          avg,
          total,
          up,
          down: total - up,
          isUp: lastCheck?.is_up ?? null,
        };
      })
      .sort((a, b) => {
        if (a.uptime === "N/A") return 1;
        if (b.uptime === "N/A") return -1;
        return Number(a.uptime) - Number(b.uptime);
      });
  }, [data]);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[80px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Metrics<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Performance analytics across all your monitors
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1.5" />
            <p
              className={`text-xl font-bold ${
                overallUptime !== "N/A" && Number(overallUptime) >= 90
                  ? "text-emerald-600"
                  : ""
              }`}
            >
              {overallUptime}{overallUptime !== "N/A" && "%"}
            </p>
            <p className="text-[11px] text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <Activity className="h-5 w-5 mx-auto text-muted-foreground mb-1.5" />
            <p className="text-xl font-bold">{totalChecks}</p>
            <p className="text-[11px] text-muted-foreground">Total Checks</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-500 mb-1.5" />
            <p className="text-xl font-bold text-emerald-600">{totalUp}</p>
            <p className="text-[11px] text-muted-foreground">Passed</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-500 mb-1.5" />
            <p className="text-xl font-bold text-red-600">{totalDown}</p>
            <p className="text-[11px] text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-primary mb-1.5" />
            <p className="text-xl font-bold">{avgResponse}ms</p>
            <p className="text-[11px] text-muted-foreground">Avg Response</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 mx-auto text-yellow-500 mb-1.5" />
            <p className="text-xl font-bold">{fastestCheck}ms</p>
            <p className="text-[11px] text-muted-foreground">Fastest</p>
          </CardContent>
        </Card>
      </div>

      {/* Uptime Trend */}
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Uptime Trend
          </CardTitle>
          <CardDescription>
            Running uptime percentage over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uptimeTrendData.length > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeTrendData}>
                  <defs>
                    <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,5.9%,90%)" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} width={45} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
                          <p className="font-medium">{payload[0]?.payload?.time}</p>
                          <p className="text-emerald-600 font-medium">{payload[0]?.value}% uptime</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Area type="monotone" dataKey="uptime" stroke="hsl(160, 84%, 39%)" fill="url(#uptimeGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
              No data yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Time Trend + Checks Per Hour side by side */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Response Time
            </CardTitle>
            <CardDescription>Per-check response time</CardDescription>
          </CardHeader>
          <CardContent>
            {responseTrendData.length > 0 ? (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={responseTrendData}>
                    <defs>
                      <linearGradient id="respGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(245,58%,51%)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(245,58%,51%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,5.9%,90%)" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} unit="ms" width={50} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0]?.payload;
                        return (
                          <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
                            <p className="font-medium">{d?.time}</p>
                            <p>{d?.responseTime}ms</p>
                            <p className={d?.isUp ? "text-emerald-600" : "text-red-600"}>{d?.isUp ? "Up" : "Down"}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Area type="monotone" dataKey="responseTime" stroke="hsl(245,58%,51%)" fill="url(#respGrad)" strokeWidth={2} dot={{ r: 2, fill: "hsl(245,58%,51%)" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Checks Per Hour
            </CardTitle>
            <CardDescription>Distribution of checks by hour</CardDescription>
          </CardHeader>
          <CardContent>
            {checksPerHour.length > 0 ? (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={checksPerHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,5.9%,90%)" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(240,3.8%,46.1%)" }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const d = payload[0]?.payload;
                        return (
                          <div className="rounded-lg border bg-card px-3 py-2 shadow-lg text-xs">
                            <p className="font-medium">{d?.hour}</p>
                            <p className="text-emerald-600">{d?.up} up</p>
                            <p className="text-red-600">{d?.down} down</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="up" fill="hsl(160, 84%, 39%)" radius={[3, 3, 0, 0]} stackId="a" />
                    <Bar dataKey="down" fill="hsl(0, 84%, 60%)" radius={[3, 3, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Per-endpoint comparison table */}
      <Card className="rounded-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Endpoint Comparison
          </CardTitle>
          <CardDescription>
            Uptime and performance per endpoint (sorted by uptime, worst first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {endpointStats.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No endpoints to compare.
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-muted/40">
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                      Endpoint
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 w-[80px]">
                      Status
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                      Uptime
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                      Avg Response
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                      Checks
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                      Passed
                    </TableHead>
                    <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70 text-right">
                      Failed
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpointStats.map((ep) => (
                    <TableRow key={ep.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{ep.name}</p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                            {ep.url}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {!ep.is_active ? (
                          <Badge variant="outline" className="text-xs">
                            Paused
                          </Badge>
                        ) : ep.isUp === null ? (
                          <Badge variant="secondary" className="text-xs">
                            Pending
                          </Badge>
                        ) : ep.isUp ? (
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
                          className={`text-sm font-semibold ${
                            ep.uptime !== "N/A" && Number(ep.uptime) >= 99
                              ? "text-emerald-600"
                              : ep.uptime !== "N/A" && Number(ep.uptime) >= 90
                              ? "text-yellow-600"
                              : ep.uptime !== "N/A"
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {ep.uptime}
                          {ep.uptime !== "N/A" && "%"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {ep.avg}ms
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {ep.total}
                      </TableCell>
                      <TableCell className="text-right text-sm text-emerald-600">
                        {ep.up}
                      </TableCell>
                      <TableCell className="text-right text-sm text-red-600">
                        {ep.down}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
