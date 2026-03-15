"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { EndpointCheck } from "@/lib/types";

interface UptimeChartProps {
  checks: EndpointCheck[];
}

export function UptimeChart({ checks }: UptimeChartProps) {
  const chartData = checks.map((check) => ({
    time: new Date(check.checked_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    responseTime: check.response_time_ms || 0,
    status: check.is_up ? 1 : 0,
  }));

  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="hsl(221.2, 83.2%, 53.3%)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="hsl(221.2, 83.2%, 53.3%)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-muted"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10 }}
            className="text-muted-foreground"
            tickLine={false}
            axisLine={false}
            unit="ms"
            width={50}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <p className="text-xs text-muted-foreground">
                      {payload[0]?.payload?.time}
                    </p>
                    <p className="text-sm font-medium">
                      {payload[0]?.value}ms
                    </p>
                    <p
                      className={`text-xs ${
                        payload[0]?.payload?.status
                          ? "text-emerald-500"
                          : "text-destructive"
                      }`}
                    >
                      {payload[0]?.payload?.status ? "Up" : "Down"}
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
            stroke="hsl(221.2, 83.2%, 53.3%)"
            fill="url(#responseGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
