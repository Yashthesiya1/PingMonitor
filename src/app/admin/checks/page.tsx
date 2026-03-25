"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Check {
  id: string;
  endpoint_name: string;
  owner_email: string;
  status: string;
  http_code: number | null;
  response_time: number | null;
  error: string | null;
  checked_at: string;
}

export default function AdminChecksPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchChecks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await api.get("/api/v1/admin/checks", { params });
      setChecks(res.data);
    } catch {
      toast.error("Failed to load checks");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(checks.length / rowsPerPage));
  const paginated = checks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const httpCodeColor = (code: number | null) => {
    if (!code) return "text-muted-foreground";
    if (code >= 200 && code < 300) return "text-emerald-600";
    if (code >= 300 && code < 400) return "text-yellow-600";
    if (code >= 400 && code < 500) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Checks<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Recent health check results across all endpoints
        </p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="text-sm text-muted-foreground">Recent Checks</span>
          <span className="text-lg font-bold ml-auto">{checks.length}</span>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-end">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No checks found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Endpoint</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Owner</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">HTTP Code</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Response Time</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Error</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Checked At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell className="font-medium text-sm">{check.endpoint_name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{check.owner_email}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] ${
                              check.status === "up"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                            variant="outline"
                          >
                            <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                              check.status === "up" ? "bg-emerald-500" : "bg-red-500"
                            }`} />
                            {check.status === "up" ? "Up" : "Down"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-mono font-medium ${httpCodeColor(check.http_code)}`}>
                            {check.http_code ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm">
                          {check.response_time != null ? `${check.response_time}ms` : "—"}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="text-xs text-muted-foreground truncate block">
                            {check.error || "—"}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(check.checked_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rows per page</span>
                  <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
