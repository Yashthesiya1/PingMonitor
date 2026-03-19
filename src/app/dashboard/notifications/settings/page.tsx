"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@insforge/nextjs";
import {
  Card,
  CardContent,
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
import { ArrowLeft, Loader2, Zap, Unplug } from "lucide-react";
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

  // Connect dialog
  const [connectType, setConnectType] = useState<ChannelTypeConfig | null>(null);
  const [channelName, setChannelName] = useState("");
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Disconnect dialog
  const [disconnectTarget, setDisconnectTarget] = useState<NotificationChannel | null>(null);

  // Testing
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

  const getConnectedChannel = (type: string): NotificationChannel | undefined => {
    return channels.find((c) => c.channel_type === type);
  };

  const handleConnect = async () => {
    if (!connectType || !channelName.trim()) return;

    for (const field of connectType.fields) {
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
          channel_type: connectType.type,
          name: channelName.trim(),
          config: configValues,
        }),
      });

      if (res.ok) {
        toast.success(`${connectType.label} connected`);
        setConnectType(null);
        resetForm();
        fetchChannels();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to connect");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!disconnectTarget) return;
    await fetchWithAuth(`/api/channels/${disconnectTarget.id}`, { method: "DELETE" });
    setChannels((prev) => prev.filter((c) => c.id !== disconnectTarget.id));
    setDisconnectTarget(null);
    toast.success("Channel disconnected");
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

  const openConnect = (ct: ChannelTypeConfig) => {
    setConnectType(ct);
    setChannelName(ct.label);
    setConfigValues({});
  };

  const resetForm = () => {
    setConnectType(null);
    setChannelName("");
    setConfigValues({});
  };

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[140px] rounded-xl" />
          ))}
        </div>
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

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Notification Channels<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your tools to receive alerts when monitors go down
        </p>
      </div>

      {/* Channel cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHANNEL_TYPES.map((ct) => {
          const connected = getConnectedChannel(ct.type);
          const Icon = ct.icon;

          return (
            <Card
              key={ct.type}
              className={cn(
                "rounded-xl transition-all",
                connected
                  ? "border-emerald-200 bg-emerald-50/30"
                  : "hover:border-muted-foreground/20"
              )}
            >
              <CardContent className="p-5">
                {/* Top row: icon + status */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      ct.bgColor
                    )}
                  >
                    <Icon className={cn("h-5 w-5", ct.color)} />
                  </div>
                  {connected && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-emerald-300 bg-emerald-100 text-emerald-700 text-[10px]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Connected
                    </Badge>
                  )}
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold mb-1">{ct.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {ct.description}
                </p>

                {/* Action buttons */}
                {connected ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1 gap-1.5"
                      onClick={() => handleTest(connected)}
                      disabled={testing === connected.id}
                    >
                      {testing === connected.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Zap className="h-3 w-3" />
                      )}
                      Test
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs flex-1 gap-1.5 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => setDisconnectTarget(connected)}
                    >
                      <Unplug className="h-3 w-3" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full text-xs gap-1.5"
                    size="sm"
                    onClick={() => openConnect(ct)}
                  >
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connect Dialog */}
      <Dialog
        open={!!connectType}
        onOpenChange={(open) => {
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-md">
          {connectType && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      connectType.bgColor
                    )}
                  >
                    <connectType.icon
                      className={cn("h-5 w-5", connectType.color)}
                    />
                  </div>
                  <div>
                    <DialogTitle>
                      Connect {connectType.label}
                    </DialogTitle>
                    <DialogDescription className="text-xs mt-0.5">
                      {connectType.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-sm font-medium">Channel Name</Label>
                  <Input
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder={`My ${connectType.label}`}
                    className="mt-1.5"
                  />
                </div>

                {connectType.fields.map((field) => (
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

                {connectType.type === "email" && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                    Email notifications are sent to your account email. No
                    extra configuration needed.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConnect}
                  disabled={saving || !channelName.trim()}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation */}
      <AlertDialog
        open={!!disconnectTarget}
        onOpenChange={(open) => !open && setDisconnectTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect channel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect{" "}
              <span className="font-semibold text-foreground">
                {disconnectTarget?.name}
              </span>
              ? You will stop receiving notifications through this channel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
