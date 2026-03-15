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

interface ResponseChartProps {
  checks: EndpointCheck[];
}

export function ResponseChart({ checks }: ResponseChartProps) {
  // Group checks by hour for a cleaner chart
  const grouped: Record<string, { total: number; sum: number; up: number }> =
    {};

  checks.forEach((check) => {
    const date = new Date(check.checked_at);
    const key = `${date.getMonth() + 1}/${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:00`;
    if (!grouped[key]) {
      grouped[key] = { total: 0, sum: 0, up: 0 };
    }
    grouped[key].total += 1;
    grouped[key].sum += check.response_time_ms || 0;
    grouped[key].up += check.is_up ? 1 : 0;
  });

  const chartData = Object.entries(grouped).map(([time, data]) => ({
    time,
    avgResponse: data.total > 0 ? Math.round(data.sum / data.total) : 0,
    checks: data.total,
    upRate: data.total > 0 ? Math.round((data.up / data.total) * 100) : 0,
  }));

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
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
            interval="preserveStartEnd"
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
              if (active && payload && payload.length) {
                const data = payload[0]?.payload;
                return (
                  <div className="rounded-lg border bg-card px-3 py-2 shadow-lg">
                    <p className="text-xs font-medium">{data?.time}</p>
                    <div className="mt-1 space-y-0.5">
                      <p className="text-xs text-muted-foreground">
                        Avg Response:{" "}
                        <span className="font-medium text-foreground">
                          {data?.avgResponse}ms
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Checks:{" "}
                        <span className="font-medium text-foreground">
                          {data?.checks}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uptime:{" "}
                        <span
                          className={`font-medium ${
                            data?.upRate >= 90
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {data?.upRate}%
                        </span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="avgResponse"
            stroke="hsl(245, 58%, 51%)"
            fill="url(#chartGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
