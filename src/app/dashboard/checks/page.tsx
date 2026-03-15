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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import type { Endpoint, EndpointCheck } from "@/lib/types";

type SortField = "checked_at" | "status_code" | "response_time_ms" | "is_up" | "endpoint";
type SortDir = "asc" | "desc";

interface CheckWithEndpoint extends EndpointCheck {
  endpoint_name: string;
  endpoint_url: string;
}

export default function ChecksPage() {
  const { isLoaded } = useAuth();
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [allChecks, setAllChecks] = useState<CheckWithEndpoint[]>([]);
  const [loading, setLoading] = useState(true);

  // DataTable state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [sortField, setSortField] = useState<SortField>("checked_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [endpointFilter, setEndpointFilter] = useState("all");

  const refreshAll = useCallback(async () => {
    try {
      const epRes = await fetchWithAuth("/api/endpoints");
      const { data: eps } = await epRes.json();
      if (!eps) return;
      setEndpoints(eps);

      const epMap = Object.fromEntries(
        eps.map((e: Endpoint) => [e.id, e])
      );

      const checksResults: CheckWithEndpoint[] = [];
      await Promise.all(
        eps.map(async (ep: Endpoint) => {
          const r = await fetchWithAuth(`/api/endpoints/${ep.id}/checks`);
          const { data } = await r.json();
          if (data) {
            data.forEach((c: EndpointCheck) => {
              checksResults.push({
                ...c,
                endpoint_name: ep.name,
                endpoint_url: ep.url,
              });
            });
          }
        })
      );
      setAllChecks(checksResults);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) refreshAll();
  }, [isLoaded, refreshAll]);

  useEffect(() => {
    if (endpoints.length === 0) return;
    const shortest = Math.min(...endpoints.map((e) => e.check_interval || 1));
    const timer = setInterval(refreshAll, shortest * 60 * 1000);
    return () => clearInterval(timer);
  }, [endpoints, refreshAll]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  const processed = useMemo(() => {
    let data = [...allChecks];

    if (statusFilter === "up") data = data.filter((c) => c.is_up);
    if (statusFilter === "down") data = data.filter((c) => !c.is_up);

    if (endpointFilter !== "all") {
      data = data.filter((c) => c.endpoint_id === endpointFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.endpoint_name.toLowerCase().includes(q) ||
          c.endpoint_url.toLowerCase().includes(q) ||
          (c.status_code?.toString() || "").includes(q) ||
          (c.error_message || "").toLowerCase().includes(q) ||
          new Date(c.checked_at).toLocaleString().toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case "checked_at":
          aVal = new Date(a.checked_at).getTime();
          bVal = new Date(b.checked_at).getTime();
          break;
        case "status_code":
          aVal = a.status_code || 0;
          bVal = b.status_code || 0;
          break;
        case "response_time_ms":
          aVal = a.response_time_ms || 0;
          bVal = b.response_time_ms || 0;
          break;
        case "is_up":
          aVal = a.is_up ? 1 : 0;
          bVal = b.is_up ? 1 : 0;
          break;
        case "endpoint":
          aVal = a.endpoint_name.toLowerCase();
          bVal = b.endpoint_name.toLowerCase();
          return sortDir === "asc"
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal);
        default:
          return 0;
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return data;
  }, [allChecks, search, sortField, sortDir, statusFilter, endpointFilter]);

  const totalPages = Math.max(1, Math.ceil(processed.length / perPage));
  const paged = processed.slice(page * perPage, (page + 1) * perPage);
  if (page >= totalPages && page > 0) setPage(totalPages - 1);

  // Summary stats
  const totalUp = allChecks.filter((c) => c.is_up).length;
  const totalDown = allChecks.filter((c) => !c.is_up).length;
  const avgResponse =
    allChecks.length > 0
      ? Math.round(
          allChecks.reduce((a, c) => a + (c.response_time_ms || 0), 0) /
            (allChecks.filter((c) => c.response_time_ms).length || 1)
        )
      : 0;

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[80px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Checks<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          All status checks across your monitored endpoints
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUp}</p>
              <p className="text-xs text-muted-foreground">Passed checks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDown}</p>
              <p className="text-xs text-muted-foreground">Failed checks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgResponse}ms</p>
              <p className="text-xs text-muted-foreground">Avg response</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                All Checks
              </CardTitle>
              <CardDescription>
                {processed.length} check{processed.length !== 1 ? "s" : ""}{" "}
                {statusFilter !== "all" || endpointFilter !== "all" || search
                  ? "(filtered)"
                  : "total"}
              </CardDescription>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-[280px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search checks..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[130px] h-9">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="up">Up Only</SelectItem>
                <SelectItem value="down">Down Only</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={endpointFilter}
              onValueChange={(v) => {
                setEndpointFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[180px] h-9">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Endpoints</SelectItem>
                {endpoints.map((ep) => (
                  <SelectItem key={ep.id} value={ep.id}>
                    {ep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {allChecks.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No checks recorded yet. Add an endpoint and wait for the first
              ping.
            </div>
          ) : processed.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No checks match your filters.
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/40">
                      <TableHead>
                        <button
                          onClick={() => handleSort("endpoint")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          Endpoint
                          <SortIcon field="endpoint" />
                        </button>
                      </TableHead>
                      <TableHead className="w-[90px]">
                        <button
                          onClick={() => handleSort("is_up")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          Status
                          <SortIcon field="is_up" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("status_code")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors ml-auto"
                        >
                          HTTP
                          <SortIcon field="status_code" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("response_time_ms")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors ml-auto"
                        >
                          Response
                          <SortIcon field="response_time_ms" />
                        </button>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                        Error
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("checked_at")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors ml-auto"
                        >
                          Checked At
                          <SortIcon field="checked_at" />
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">
                              {check.endpoint_name}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[180px]">
                              {check.endpoint_url}
                            </p>
                          </div>
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
                        <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                          {check.error_message || "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(check.checked_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Rows per page</span>
                  <Select
                    value={perPage.toString()}
                    onValueChange={(v) => {
                      setPerPage(Number(v));
                      setPage(0);
                    }}
                  >
                    <SelectTrigger className="h-8 w-[65px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === 0}
                    onClick={() => setPage(0)}
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(totalPages - 1)}
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
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
