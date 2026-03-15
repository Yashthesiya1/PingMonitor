"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Globe,
  CheckSquare,
  Square,
  Mail,
  MessageSquare,
  Phone,
  Bell,
  MapPin,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { cn } from "@/lib/utils";

const INTERVALS = [
  { value: 1, label: "1m" },
  { value: 5, label: "5m" },
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 60, label: "1h" },
];

const REGIONS = [
  { value: "auto", label: "Default (auto-select)", flag: "🌐" },
  { value: "us-east", label: "US East (Virginia)", flag: "🇺🇸" },
  { value: "us-west", label: "US West (Oregon)", flag: "🇺🇸" },
  { value: "eu-west", label: "Europe (Ireland)", flag: "🇪🇺" },
  { value: "ap-south", label: "Asia Pacific (Mumbai)", flag: "🇮🇳" },
  { value: "ap-southeast", label: "Asia Pacific (Singapore)", flag: "🇸🇬" },
];

export default function NewEndpointPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [interval, setInterval] = useState(5);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPush, setNotifyPush] = useState(false);
  const [region, setRegion] = useState("auto");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !url.trim() || url === "https://") {
      setError("Please enter a name and URL");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetchWithAuth("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          check_interval: interval,
          notify_email: notifyEmail,
          notify_sms: notifySms,
          notify_push: notifyPush,
          monitor_region: region,
        }),
      });

      if (res.ok) {
        router.push("/dashboard/endpoints");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create monitor");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/endpoints"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Monitoring
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Add single monitor<span className="text-primary">.</span>
      </h1>

      {/* Monitor type */}
      <Card className="rounded-xl mb-4">
        <CardContent className="p-5">
          <Label className="text-sm font-semibold">Monitor type</Label>
          <div className="mt-3 flex items-center gap-3 rounded-lg border p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                HTTP / website monitoring
              </p>
              <p className="text-xs text-muted-foreground">
                Use HTTP(S) monitor to monitor your website, API endpoint, or
                anything running on HTTP.
              </p>
            </div>
            <CheckSquare className="h-5 w-5 text-primary shrink-0" />
          </div>
        </CardContent>
      </Card>

      {/* URL & Name */}
      <Card className="rounded-xl mb-4">
        <CardContent className="p-5 space-y-5">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Friendly name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Supabase, GitHub, My API"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="url" className="text-sm font-semibold">
              URL to monitor
            </Label>
            <Input
              id="url"
              placeholder="https://"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-2 font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl mb-4">
        <CardContent className="p-5">
          <Label className="text-sm font-semibold">
            How will we notify you?
          </Label>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <NotifyOption
              icon={Mail}
              label="E-mail"
              description="Notification via email"
              checked={notifyEmail}
              onChange={setNotifyEmail}
            />
            <NotifyOption
              icon={MessageSquare}
              label="SMS"
              description="Text message alerts"
              checked={notifySms}
              onChange={setNotifySms}
            />
            <NotifyOption
              icon={Phone}
              label="Voice call"
              description="Phone call alerts"
              checked={false}
              onChange={() => {}}
              disabled
            />
            <NotifyOption
              icon={Bell}
              label="Push"
              description="Push notifications"
              checked={notifyPush}
              onChange={setNotifyPush}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            You can set up additional notification channels later in settings.
          </p>
        </CardContent>
      </Card>

      {/* Monitor interval */}
      <Card className="rounded-xl mb-4">
        <CardContent className="p-5">
          <Label className="text-sm font-semibold">Monitor interval</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Your monitor will be checked every{" "}
            <span className="font-semibold text-primary">
              {interval} minute{interval !== 1 ? "s" : ""}
            </span>
            . We recommend at least 1-minute checks for critical services.
          </p>

          {/* Interval slider */}
          <div className="mt-5">
            <div className="relative">
              <div className="flex h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-200"
                  style={{
                    width: `${
                      (INTERVALS.findIndex((i) => i.value === interval) /
                        (INTERVALS.length - 1)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={INTERVALS.length - 1}
                value={INTERVALS.findIndex((i) => i.value === interval)}
                onChange={(e) =>
                  setInterval(INTERVALS[Number(e.target.value)].value)
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {/* Thumb indicator */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-primary border-2 border-background shadow-sm pointer-events-none transition-all duration-200"
                style={{
                  left: `${
                    (INTERVALS.findIndex((i) => i.value === interval) /
                      (INTERVALS.length - 1)) *
                    100
                  }%`,
                }}
              />
            </div>
            {/* Labels */}
            <div className="flex justify-between mt-2">
              {INTERVALS.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setInterval(item.value)}
                  className={cn(
                    "text-xs transition-colors",
                    interval === item.value
                      ? "text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Region */}
      <Card className="rounded-xl mb-6">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                Region to monitor from
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a region closest to your users for accurate latency
                measurements.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.flag} {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-auto px-8 py-2.5"
        size="lg"
      >
        {submitting ? "Creating..." : "Create monitor"}
      </Button>
    </div>
  );
}

function NotifyOption({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left transition-colors",
        checked
          ? "border-primary/40 bg-primary/5"
          : "border-border hover:border-muted-foreground/30",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center gap-2">
        {checked ? (
          <CheckSquare className="h-4 w-4 text-primary" />
        ) : (
          <Square className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-tight">
        {description}
      </p>
    </button>
  );
}
