"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@insforge/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  MoreHorizontal,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { Endpoint, EndpointCheck } from "@/lib/types";

export default function EndpointsPage() {
  const { isLoaded } = useAuth();
  const router = useRouter();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [checksMap, setChecksMap] = useState<Record<string, EndpointCheck[]>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Endpoint | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchEndpoints = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/endpoints");
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
        const res = await fetchWithAuth(`/api/endpoints/${id}/checks`);
        const { data } = await res.json();
        results[id] = data || [];
      })
    );
    setChecksMap(results);
  }, []);

  const refreshAll = useCallback(async () => {
    const res = await fetchWithAuth("/api/endpoints");
    const { data } = await res.json();
    if (data) {
      setEndpoints(data);
      const ids = data.map((e: Endpoint) => e.id);
      if (ids.length > 0) {
        const results: Record<string, EndpointCheck[]> = {};
        await Promise.all(
          ids.map(async (id: string) => {
            const r = await fetchWithAuth(`/api/endpoints/${id}/checks`);
            const json = await r.json();
            results[id] = json.data || [];
          })
        );
        setChecksMap(results);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoaded) refreshAll();
  }, [isLoaded, refreshAll]);

  // Auto-refresh based on shortest endpoint interval
  useEffect(() => {
    if (endpoints.length === 0) return;
    const shortestInterval = Math.min(
      ...endpoints.map((e) => e.check_interval || 1)
    );
    const ms = shortestInterval * 60 * 1000;
    const timer = setInterval(refreshAll, ms);
    return () => clearInterval(timer);
  }, [endpoints, refreshAll]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(`delete-${deleteTarget.id}`);
    try {
      await fetchWithAuth(`/api/endpoints/${deleteTarget.id}`, { method: "DELETE" });
      setEndpoints((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      toast.success("Monitor deleted");
    } finally {
      setDeleteTarget(null);
      setMenuOpen(null);
      setActionLoading(null);
    }
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    setActionLoading(`toggle-${id}`);
    await fetchWithAuth(`/api/endpoints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: isActive }),
    });
    setEndpoints((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_active: isActive } : e))
    );
    setMenuOpen(null);
    setActionLoading(null);
    toast.success(isActive ? "Monitor resumed" : "Monitor paused");
  };

  // Stats
  const upCount = endpoints.filter((e) => {
    const checks = checksMap[e.id];
    return checks?.length && checks[checks.length - 1].is_up;
  }).length;
  const downCount = endpoints.filter((e) => {
    const checks = checksMap[e.id];
    return checks?.length && !checks[checks.length - 1].is_up;
  }).length;
  const pausedCount = endpoints.filter((e) => !e.is_active).length;

  const allChecks = Object.values(checksMap).flat();
  const uptimePercent =
    allChecks.length > 0
      ? ((allChecks.filter((c) => c.is_up).length / allChecks.length) * 100).toFixed(0)
      : "N/A";
  const incidentCount = allChecks.filter((c) => !c.is_up).length;

  const filtered = endpoints.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.url.toLowerCase().includes(search.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Monitors<span className="text-primary">.</span>
          </h1>
          <Link href="/dashboard/endpoints/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {filtered.length} / {endpoints.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name or URL"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 w-[220px] text-sm"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5" />
              Down first
            </Button>
          </div>
        </div>

        {/* Endpoints list */}
        <div className="space-y-2">
          {filtered.length === 0 && endpoints.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <CheckCircle2 className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">No monitors yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Add your first endpoint to start monitoring
                </p>
                <Link href="/dashboard/endpoints/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Monitor
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="rounded-xl">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No monitors match your search.
              </CardContent>
            </Card>
          ) : (
            filtered.map((endpoint) => {
              const checks = checksMap[endpoint.id] || [];
              const latestCheck = checks.length
                ? checks[checks.length - 1]
                : null;
              const isUp = latestCheck?.is_up ?? null;
              const uptimePct =
                checks.length > 0
                  ? Math.round(
                      (checks.filter((c) => c.is_up).length / checks.length) *
                        100
                    )
                  : null;

              // Time since last check
              const lastCheckTime = latestCheck
                ? getTimeAgo(latestCheck.checked_at)
                : null;

              // Mini bar chart (last 30 checks)
              const recentChecks = checks.slice(-30);

              return (
                <Card
                  key={endpoint.id}
                  className="rounded-xl hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/endpoints/${endpoint.id}`)
                  }
                >
                  <CardContent className="flex items-center gap-4 py-3 px-4">
                    {/* Status dot */}
                    <div className="shrink-0">
                      {!endpoint.is_active ? (
                        <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
                      ) : isUp === null ? (
                        <div className="h-3 w-3 rounded-full bg-muted-foreground/30 animate-pulse" />
                      ) : isUp ? (
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      ) : (
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                      )}
                    </div>

                    {/* Name & info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {endpoint.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 h-4 font-normal"
                        >
                          {endpoint.monitor_type === "status"
                            ? "STATUS"
                            : "HTTP"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {!endpoint.is_active
                            ? "Paused"
                            : isUp === null
                            ? "Pending"
                            : isUp
                            ? `Up ${lastCheckTime || ""}`
                            : `Down ${lastCheckTime || ""}`}
                        </span>
                      </div>
                    </div>

                    {/* Interval */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{endpoint.check_interval} min</span>
                    </div>

                    {/* Mini uptime bars */}
                    <div className="flex items-center gap-[2px] shrink-0">
                      {recentChecks.length > 0 ? (
                        recentChecks.map((c, i) => (
                          <div
                            key={i}
                            className={`w-[3px] h-4 rounded-[1px] ${
                              c.is_up ? "bg-emerald-500" : "bg-red-500"
                            }`}
                          />
                        ))
                      ) : (
                        Array.from({ length: 15 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-[3px] h-4 rounded-[1px] bg-muted"
                          />
                        ))
                      )}
                    </div>

                    {/* Uptime percentage */}
                    <div className="text-xs font-medium w-12 text-right shrink-0">
                      {uptimePct !== null ? (
                        <span
                          className={
                            uptimePct >= 90
                              ? "text-emerald-600"
                              : uptimePct >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {uptimePct}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Actions menu */}
                    <div
                      className="relative shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setMenuOpen(
                            menuOpen === endpoint.id ? null : endpoint.id
                          )
                        }
                        className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menuOpen === endpoint.id && (
                        <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border bg-card shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                          <button
                            onClick={() =>
                              handleToggle(endpoint.id, !endpoint.is_active)
                            }
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted transition-colors"
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
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(endpoint);
                              setMenuOpen(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-destructive hover:bg-muted transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Right sidebar stats */}
      <div className="w-full lg:w-[240px] shrink-0 space-y-4 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:space-y-4">
        {/* Current status */}
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-4">
              Current status<span className="text-primary">.</span>
            </h3>
            <div className="flex justify-center mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  downCount > 0
                    ? "bg-red-500"
                    : upCount > 0
                    ? "bg-emerald-500"
                    : "bg-muted"
                } text-white`}
              >
                {downCount > 0 ? (
                  <span className="text-lg font-bold">!</span>
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold">{downCount}</p>
                <p className="text-[11px] text-muted-foreground">Down</p>
              </div>
              <div>
                <p className="text-lg font-bold">{upCount}</p>
                <p className="text-[11px] text-muted-foreground">Up</p>
              </div>
              <div>
                <p className="text-lg font-bold">{pausedCount}</p>
                <p className="text-[11px] text-muted-foreground">Paused</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Using {endpoints.length} of 7 monitors.
            </p>
          </CardContent>
        </Card>

        {/* Last 24 hours */}
        <Card className="rounded-xl">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3">
              Last 24 hours<span className="text-primary">.</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p
                  className={`text-lg font-bold ${
                    uptimePercent !== "N/A" && Number(uptimePercent) >= 90
                      ? "text-emerald-600"
                      : "text-foreground"
                  }`}
                >
                  {uptimePercent}
                  {uptimePercent !== "N/A" && "%"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Overall uptime
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {allChecks.length > 0 ? "N/A" : "N/A"}
                </p>
                <p className="text-[11px] text-muted-foreground">MTBF</p>
              </div>
              <div>
                <p className="text-lg font-bold">
                  {incidentCount === 0 ? "1d" : "<1d"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Without inc.
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">{incidentCount}</p>
                <p className="text-[11px] text-muted-foreground">Incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete monitor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This will permanently remove the monitor and all its check
              history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs = Math.floor(diff / 1000);
  if (secs < 60) return `${secs} sec`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min, ${secs % 60} sec`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ${mins % 60}m`;
}
