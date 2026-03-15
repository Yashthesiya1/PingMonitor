"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import type { EndpointCheck } from "@/lib/types";

type SortField = "checked_at" | "status_code" | "response_time_ms" | "is_up";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "up" | "down";

interface ChecksDataTableProps {
  checks: EndpointCheck[];
}

export function ChecksDataTable({ checks }: ChecksDataTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("checked_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  // Filter & sort
  const processed = useMemo(() => {
    let data = [...checks];

    // Status filter
    if (statusFilter === "up") data = data.filter((c) => c.is_up);
    if (statusFilter === "down") data = data.filter((c) => !c.is_up);

    // Search (by status code, error message, time)
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (c) =>
          (c.status_code?.toString() || "").includes(q) ||
          (c.error_message || "").toLowerCase().includes(q) ||
          new Date(c.checked_at).toLocaleString().toLowerCase().includes(q) ||
          (c.is_up ? "up" : "down").includes(q)
      );
    }

    // Sort
    data.sort((a, b) => {
      let aVal: number, bVal: number;
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
        default:
          return 0;
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [checks, search, sortField, sortDir, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(processed.length / perPage));
  const paged = processed.slice(page * perPage, (page + 1) * perPage);

  // Reset page if out of bounds
  if (page >= totalPages && page > 0) setPage(totalPages - 1);

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent Checks
            </CardTitle>
            <CardDescription>
              {processed.length} total check
              {processed.length !== 1 ? "s" : ""} recorded
            </CardDescription>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 max-w-[260px]">
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
              setStatusFilter(v as StatusFilter);
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
        </div>
      </CardHeader>

      <CardContent>
        {checks.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No checks recorded yet.
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
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
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
  );
}
