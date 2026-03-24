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
  Bell, Mail, MessageSquare, Webhook, ChevronLeft, ChevronRight,
} from "lucide-react";

interface Notification {
  id: string;
  user_email: string;
  endpoint_name: string;
  channel: string;
  event: string;
  status: string;
  sent_at: string;
}

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  slack: MessageSquare,
  webhook: Webhook,
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/notifications", {
        params: { limit: 100 },
      });
      setNotifications(res.data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(notifications.length / rowsPerPage));
  const paginated = notifications.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Notifications<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Alert notifications sent across the platform
        </p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-600" />
          <span className="text-sm text-muted-foreground">Total Notifications</span>
          <span className="text-lg font-bold ml-auto">{notifications.length}</span>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No notifications found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">User</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Endpoint</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Channel</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Event</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Sent At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((notif) => {
                      const ChannelIcon = channelIcons[notif.channel] || Bell;
                      return (
                        <TableRow key={notif.id}>
                          <TableCell className="text-sm text-muted-foreground">{notif.user_email}</TableCell>
                          <TableCell className="font-medium text-sm">{notif.endpoint_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <ChannelIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs capitalize">{notif.channel}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[10px] ${
                                notif.event === "down"
                                  ? "bg-red-500/10 text-red-600 border-red-500/20"
                                  : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              }`}
                              variant="outline"
                            >
                              {notif.event === "down" ? "Down" : "Recovered"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-[10px] ${
                                notif.status === "sent"
                                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 border-red-500/20"
                              }`}
                              variant="outline"
                            >
                              {notif.status === "sent" ? "Sent" : "Failed"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(notif.sent_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
