"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@insforge/nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Zap,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { cn } from "@/lib/utils";
import { CHANNEL_TYPES, type ChannelTypeConfig } from "@/lib/channel-config";
import type { NotificationChannel } from "@/lib/types";
import Link from "next/link";

export default function NotificationSettingsPage() {
  const { isLoaded } = useAuth();
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [loading, setLoading] = useState(true);

  // Add dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<ChannelTypeConfig | null>(null);
  const [channelName, setChannelName] = useState("");
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<NotificationChannel | null>(null);

  // Test
  const [testing, setTesting] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/channels");
      const { data } = await res.json();
      if (data) setChannels(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) fetchChannels();
  }, [isLoaded, fetchChannels]);

  const handleAdd = async () => {
    if (!selectedType || !channelName.trim()) return;

    // Validate required fields
    for (const field of selectedType.fields) {
      if (!configValues[field.key]?.trim()) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetchWithAuth("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_type: selectedType.type,
          name: channelName.trim(),
          config: configValues,
        }),
      });

      if (res.ok) {
        toast.success("Channel added");
        setShowAddDialog(false);
        resetForm();
        fetchChannels();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add channel");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (channel: NotificationChannel) => {
    await fetchWithAuth(`/api/channels/${channel.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !channel.is_active }),
    });
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channel.id ? { ...c, is_active: !c.is_active } : c
      )
    );
    toast.success(channel.is_active ? "Channel disabled" : "Channel enabled");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetchWithAuth(`/api/channels/${deleteTarget.id}`, { method: "DELETE" });
    setChannels((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Channel deleted");
  };

  const handleTest = async (channel: NotificationChannel) => {
    setTesting(channel.id);
    try {
      const res = await fetchWithAuth("/api/channels/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel_type: channel.channel_type,
          config: channel.config,
        }),
      });

      if (res.ok) {
        toast.success("Test notification sent!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Test failed");
      }
    } catch {
      toast.error("Test failed");
    } finally {
      setTesting(null);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setChannelName("");
    setConfigValues({});
  };

  const getChannelIcon = (type: string) => {
    const config = CHANNEL_TYPES.find((c) => c.type === type);
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  };

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Link
        href="/dashboard/notifications"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Notifications
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Notification Channels<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure where you receive alerts when monitors go down
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Channel
        </Button>
      </div>

      {/* Channels list */}
      {channels.length === 0 ? (
        <Card className="rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Zap className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium">No channels configured</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Add a notification channel to start receiving alerts
            </p>
            <Button
              className="gap-2"
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Your First Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {channels.map((channel) => (
            <Card
              key={channel.id}
              className={cn(
                "rounded-xl transition-all",
                !channel.is_active && "opacity-60"
              )}
            >
              <CardContent className="flex items-center gap-4 py-4 px-5">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
                    channel.is_active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {getChannelIcon(channel.channel_type)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">
                      {channel.name}
                    </p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {channel.channel_type.toUpperCase()}
                    </Badge>
                    {channel.is_active ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 border-emerald-200 bg-emerald-50 text-emerald-700"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {channel.channel_type === "email"
                      ? "Sends to your account email"
                      : channel.config?.webhook_url
                      ? channel.config.webhook_url.slice(0, 50) + "..."
                      : channel.channel_type === "telegram"
                      ? `Chat ID: ${channel.config?.chat_id || "—"}`
                      : "Configured"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => handleTest(channel)}
                    disabled={testing === channel.id || !channel.is_active}
                  >
                    {testing === channel.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Zap className="h-3 w-3" />
                    )}
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleToggle(channel)}
                  >
                    {channel.is_active ? "Disable" : "Enable"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteTarget(channel)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Channel Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        if (!open) resetForm();
        setShowAddDialog(open);
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Notification Channel</DialogTitle>
            <DialogDescription>
              Choose a channel type and configure it to receive alerts.
            </DialogDescription>
          </DialogHeader>

          {!selectedType ? (
            <div className="grid grid-cols-2 gap-3 py-2">
              {CHANNEL_TYPES.map((ct) => (
                <button
                  key={ct.type}
                  onClick={() => {
                    setSelectedType(ct);
                    setChannelName(ct.label);
                  }}
                  className="flex items-center gap-3 rounded-lg border p-4 text-left hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <ct.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{ct.label}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {ct.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {/* Back */}
              <button
                onClick={() => setSelectedType(null)}
                className="text-xs text-primary hover:underline"
              >
                ← Choose different type
              </button>

              {/* Selected type indicator */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <selectedType.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{selectedType.label}</span>
              </div>

              {/* Name */}
              <div>
                <Label className="text-sm font-medium">Channel Name</Label>
                <Input
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="e.g. My Slack #alerts"
                  className="mt-1.5"
                />
              </div>

              {/* Config fields */}
              {selectedType.fields.map((field) => (
                <div key={field.key}>
                  <Label className="text-sm font-medium">{field.label}</Label>
                  <Input
                    type={field.type || "text"}
                    value={configValues[field.key] || ""}
                    onChange={(e) =>
                      setConfigValues((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="mt-1.5 font-mono text-xs"
                  />
                  {field.helpText && (
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {field.helpText}
                    </p>
                  )}
                </div>
              ))}

              {selectedType.type === "email" && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                  Email notifications will be sent to your account email address.
                  No additional configuration needed.
                </p>
              )}
            </div>
          )}

          {selectedType && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={saving || !channelName.trim()}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Channel"
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? You will stop receiving notifications through this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
