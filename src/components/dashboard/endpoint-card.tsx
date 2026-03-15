"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pause, Play, ExternalLink } from "lucide-react";
import type { Endpoint, EndpointCheck } from "@/lib/types";
import { UptimeChart } from "./uptime-chart";

interface EndpointCardProps {
  endpoint: Endpoint;
  checks: EndpointCheck[];
  onDelete: (id: string) => void;
  onToggle: (id: string, isActive: boolean) => void;
}

export function EndpointCard({
  endpoint,
  checks,
  onDelete,
  onToggle,
}: EndpointCardProps) {
  const [deleting, setDeleting] = useState(false);

  const latestCheck = checks.length > 0 ? checks[checks.length - 1] : null;
  const isUp = latestCheck?.is_up ?? null;

  const uptimePercentage =
    checks.length > 0
      ? (
          (checks.filter((c) => c.is_up).length / checks.length) *
          100
        ).toFixed(1)
      : "N/A";

  const avgResponseTime =
    checks.length > 0
      ? Math.round(
          checks.reduce((acc, c) => acc + (c.response_time_ms || 0), 0) /
            checks.filter((c) => c.response_time_ms).length || 0
        )
      : 0;

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(endpoint.id);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{endpoint.name}</CardTitle>
              {isUp === null ? (
                <Badge variant="secondary">Pending</Badge>
              ) : isUp ? (
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Up
                </Badge>
              ) : (
                <Badge variant="destructive">Down</Badge>
              )}
              {!endpoint.is_active && (
                <Badge variant="outline">Paused</Badge>
              )}
            </div>
            <CardDescription className="font-mono text-xs truncate">
              {endpoint.url}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggle(endpoint.id, !endpoint.is_active)}
            >
              {endpoint.is_active ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Uptime (24h)</p>
            <p className="text-lg font-semibold">
              {uptimePercentage}
              {uptimePercentage !== "N/A" && "%"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Response</p>
            <p className="text-lg font-semibold">{avgResponseTime}ms</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Checks (24h)</p>
            <p className="text-lg font-semibold">{checks.length}</p>
          </div>
        </div>

        {/* Chart */}
        {checks.length > 0 && <UptimeChart checks={checks} />}

        {checks.length === 0 && (
          <div className="flex items-center justify-center h-[120px] text-sm text-muted-foreground">
            No check data yet. Results will appear after the first check.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
