"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
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
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
} from "lucide-react";
import api from "@/lib/api";
import type { Endpoint, NotificationLog } from "@/lib/types";

type SortField = "sent_at" | "event_type" | "channel";
type SortDir = "asc" | "desc";

interface NotificationWithEndpoint extends NotificationLog {
  endpoint_name: string;
}

export default function NotificationsPage() {
  const { isLoaded } = useAuth();
  const [notifications, setNotifications] = useState<
    NotificationWithEndpoint[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [sortField, setSortField] = useState<SortField>("sent_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [eventFilter, setEventFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const [notiRes, epRes] = await Promise.all([
        api.get("/api/v1/notifications/history"),
        api.get("/api/v1/endpoints"),
      ]);

      const epMap: Record<string, string> = {};
      (epRes.data || []).forEach((ep: Endpoint) => {
        epMap[ep.id] = ep.name;
      });

      const enriched: NotificationWithEndpoint[] = (
        notiRes.data || []
      ).map((n: NotificationLog) => ({
        ...n,
        endpoint_name: epMap[n.endpoint_id] || "Deleted monitor",
      }));

      setNotifications(enriched);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) fetchData();
  }, [isLoaded, fetchData]);

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
    let data = [...notifications];

    if (eventFilter === "down")
      data = data.filter((n) => n.event_type === "endpoint_down");
    if (eventFilter === "recovered")
      data = data.filter((n) => n.event_type === "endpoint_recovered");

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (n) =>
          n.endpoint_name.toLowerCase().includes(q) ||
          n.channel.toLowerCase().includes(q) ||
          n.event_type.toLowerCase().includes(q) ||
          new Date(n.sent_at).toLocaleString().toLowerCase().includes(q)
      );
    }

    data.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case "sent_at":
          aVal = new Date(a.sent_at).getTime();
          bVal = new Date(b.sent_at).getTime();
          break;
        case "event_type":
          aVal = a.event_type;
          bVal = b.event_type;
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "channel":
          aVal = a.channel;
          bVal = b.channel;
          return sortDir === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        default:
          return 0;
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return data;
  }, [notifications, search, sortField, sortDir, eventFilter]);

  const totalPages = Math.max(1, Math.ceil(processed.length / perPage));
  const paged = processed.slice(page * perPage, (page + 1) * perPage);
  if (page >= totalPages && page > 0) setPage(totalPages - 1);

  // Stats
  const downCount = notifications.filter(
    (n) => n.event_type === "endpoint_down"
  ).length;
  const recoveredCount = notifications.filter(
    (n) => n.event_type === "endpoint_recovered"
  ).length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Notifications<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            History of all alerts sent for your monitors
          </p>
        </div>
        <Link href="/dashboard/notifications/settings">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Channels
          </Button>
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Total sent</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{downCount}</p>
              <p className="text-xs text-muted-foreground">Down alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{recoveredCount}</p>
              <p className="text-xs text-muted-foreground">Recovery alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DataTable */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Notification History
          </CardTitle>
          <CardDescription>
            {processed.length} notification{processed.length !== 1 ? "s" : ""}
            {eventFilter !== "all" || search ? " (filtered)" : ""}
          </CardDescription>

          <div className="flex items-center gap-2 pt-2">
            <div className="relative flex-1 max-w-[260px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <Select
              value={eventFilter}
              onValueChange={(v) => {
                setEventFilter(v);
                setPage(0);
              }}
            >
              <SelectTrigger className="w-[150px] h-9">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="down">Down Alerts</SelectItem>
                <SelectItem value="recovered">Recovery Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <Bell className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Notifications will appear here when your monitors go down or
                recover.
              </p>
            </div>
          ) : processed.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No notifications match your filters.
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent bg-muted/40">
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                        Endpoint
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("event_type")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          Event
                          <SortIcon field="event_type" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("channel")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors"
                        >
                          Channel
                          <SortIcon field="channel" />
                        </button>
                      </TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/70">
                        Status
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("sent_at")}
                          className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors ml-auto"
                        >
                          Sent At
                          <SortIcon field="sent_at" />
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paged.map((n) => (
                      <TableRow key={n.id}>
                        <TableCell className="text-sm font-medium">
                          {n.endpoint_name}
                        </TableCell>
                        <TableCell>
                          {n.event_type === "endpoint_down" ? (
                            <Badge
                              variant="outline"
                              className="gap-1 border-red-200 bg-red-50 text-red-700 text-xs"
                            >
                              <XCircle className="h-3 w-3" />
                              Down
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700 text-xs"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Recovered
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {n.channel === "email" ? (
                              <Mail className="h-3.5 w-3.5" />
                            ) : n.channel === "sms" ? (
                              <MessageSquare className="h-3.5 w-3.5" />
                            ) : (
                              <Bell className="h-3.5 w-3.5" />
                            )}
                            <span className="capitalize">{n.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs capitalize"
                          >
                            {n.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(n.sent_at).toLocaleString()}
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-2">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(0)}>
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage(page - 1)}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
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
