"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Globe, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Endpoint {
  id: string;
  name: string;
  url: string;
  owner_email: string;
  type: string;
  interval: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminEndpointsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchEndpoints = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await api.get("/api/v1/admin/endpoints", { params });
      setEndpoints(res.data);
    } catch {
      toast.error("Failed to load endpoints");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(endpoints.length / rowsPerPage));
  const paginated = endpoints.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Endpoints<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All monitored endpoints across the platform
        </p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Total Endpoints</span>
          <span className="text-lg font-bold ml-auto">{endpoints.length}</span>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or URL..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
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
              No endpoints found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">URL</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Owner</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Type</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Interval</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((ep) => (
                      <TableRow key={ep.id}>
                        <TableCell className="font-medium text-sm">{ep.name}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="font-mono text-xs text-muted-foreground truncate block">
                            {ep.url}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ep.owner_email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {ep.type?.toUpperCase() || "HTTP"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{ep.interval}s</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] ${
                              ep.is_active
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                            variant="outline"
                          >
                            {ep.is_active ? "Active" : "Paused"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(ep.created_at).toLocaleDateString()}
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
