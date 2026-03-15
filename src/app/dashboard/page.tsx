"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@insforge/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EndpointCard } from "@/components/dashboard/endpoint-card";
import { AddEndpointDialog } from "@/components/dashboard/add-endpoint-dialog";
import { Activity, ArrowUp, ArrowDown, Clock } from "lucide-react";
import type { Endpoint, EndpointCheck } from "@/lib/types";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
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
    if (isLoaded && user) {
      fetchEndpoints();
    }
  }, [isLoaded, user, fetchEndpoints]);

  useEffect(() => {
    if (endpoints.length > 0) {
      fetchChecks(endpoints.map((e) => e.id));
    }
  }, [endpoints, fetchChecks]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEndpoints();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchEndpoints]);

  const handleAddEndpoint = async (ep: {
    name: string;
    url: string;
  }) => {
    const res = await fetch("/api/endpoints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ep),
    });
    if (res.ok) {
      fetchEndpoints();
    } else {
      const { error } = await res.json();
      alert(error || "Failed to add endpoint");
    }
  };

  const handleDeleteEndpoint = async (id: string) => {
    await fetch(`/api/endpoints/${id}`, { method: "DELETE" });
    setEndpoints((prev) => prev.filter((e) => e.id !== id));
  };

  const handleToggleEndpoint = async (id: string, isActive: boolean) => {
    await fetch(`/api/endpoints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: isActive }),
    });
    setEndpoints((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_active: isActive } : e))
    );
  };

  // Compute stats
  const allChecks = Object.values(checksMap).flat();
  const totalUp = allChecks.filter((c) => c.is_up).length;
  const totalDown = allChecks.filter((c) => !c.is_up).length;
  const avgResponse =
    allChecks.length > 0
      ? Math.round(
          allChecks.reduce((acc, c) => acc + (c.response_time_ms || 0), 0) /
            allChecks.filter((c) => c.response_time_ms).length || 0
        )
      : 0;

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your API endpoints in real-time
          </p>
        </div>
        <AddEndpointDialog
          onAdd={handleAddEndpoint}
          disabled={endpoints.length >= 7}
        />
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Endpoints
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endpoints.length}</div>
            <p className="text-xs text-muted-foreground">
              {7 - endpoints.length} slots remaining
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Up</CardTitle>
            <ArrowUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{totalUp}</div>
            <p className="text-xs text-muted-foreground">checks passed (24h)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Down</CardTitle>
            <ArrowDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {totalDown}
            </div>
            <p className="text-xs text-muted-foreground">
              checks failed (24h)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponse}ms</div>
            <p className="text-xs text-muted-foreground">
              average response time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoints list */}
      {endpoints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">No endpoints yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first API endpoint to start monitoring
            </p>
            <AddEndpointDialog onAdd={handleAddEndpoint} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {endpoints.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              checks={checksMap[endpoint.id] || []}
              onDelete={handleDeleteEndpoint}
              onToggle={handleToggleEndpoint}
            />
          ))}
        </div>
      )}
    </div>
  );
}
