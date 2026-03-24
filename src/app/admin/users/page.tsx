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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search, Users, MoreHorizontal, ShieldCheck, Ban, Trash2,
  ChevronLeft, ChevronRight,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  endpoints_count: number;
  credits: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (roleFilter !== "all") params.role = roleFilter;
      const res = await api.get("/api/v1/admin/users", { params });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(users.length / rowsPerPage));
  const paginated = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleAction = async (action: string, user: User) => {
    try {
      if (action === "make_admin") {
        await api.patch(`/api/v1/admin/users/${user.id}/role`, { role: "admin" });
        toast.success(`${user.name} is now an admin`);
      } else if (action === "suspend") {
        await api.patch(`/api/v1/admin/users/${user.id}/suspend`);
        toast.success(`${user.name} has been suspended`);
      } else if (action === "delete") {
        await api.delete(`/api/v1/admin/users/${user.id}`);
        toast.success(`${user.name} has been deleted`);
      }
      fetchUsers();
    } catch {
      toast.error(`Failed to ${action.replace("_", " ")} user`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Users<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage all platform users
        </p>
      </div>

      <Card className="rounded-xl">
        <CardContent className="p-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-muted-foreground">Total Users</span>
          <span className="text-lg font-bold ml-auto">{users.length}</span>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
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
              No users found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Name</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Email</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Role</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Endpoints</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Credits</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Status</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold">Joined</TableHead>
                      <TableHead className="text-[11px] uppercase tracking-wider font-semibold w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium text-sm">{user.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{user.endpoints_count}</TableCell>
                        <TableCell className="text-sm">{user.credits}</TableCell>
                        <TableCell>
                          <Badge
                            className={`text-[10px] ${
                              user.is_active
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                            variant="outline"
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAction("make_admin", user)}>
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("suspend", user)}>
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => setDeleteTarget(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone and will remove all their endpoints and data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteTarget) handleAction("delete", deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
