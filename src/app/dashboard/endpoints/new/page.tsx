"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Activity,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { fetchWithAuth } from "@/lib/fetch-with-auth";
import { cn } from "@/lib/utils";
import { z } from "zod";
import {
  SERVICE_CATALOG,
  SERVICE_CATEGORIES,
  type ServiceEntry,
} from "@/lib/service-catalog";

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

type MonitorType = "http" | "status";

export default function NewEndpointPage() {
  const router = useRouter();

  // Monitor type
  const [monitorType, setMonitorType] = useState<MonitorType>("http");

  // HTTP fields
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");

  // Service status fields
  const [selectedService, setSelectedService] = useState<ServiceEntry | null>(
    null
  );
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceCategory, setServiceCategory] = useState("all");

  // Shared fields
  const [interval, setInterval] = useState(5);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPush, setNotifyPush] = useState(false);
  const [region, setRegion] = useState("auto");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredServices = SERVICE_CATALOG.filter((s) => {
    const matchesSearch =
      !serviceSearch.trim() ||
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory =
      serviceCategory === "all" || s.category === serviceCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectService = (service: ServiceEntry) => {
    setSelectedService(service);
    setName(service.name);
    setUrl(service.statusUrl);
  };

  const httpSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    url: z.string().url("Please enter a valid URL").refine((v) => v !== "https://", "Please enter a URL"),
  });

  const handleSubmit = async () => {
    const finalName = monitorType === "status" && selectedService
      ? selectedService.name
      : name.trim();
    const finalUrl = monitorType === "status" && selectedService
      ? selectedService.statusUrl
      : url.trim();

    if (monitorType === "status" && !selectedService) {
      setError("Please select a service to monitor");
      return;
    }

    if (monitorType === "http") {
      const result = httpSchema.safeParse({ name: finalName, url: finalUrl });
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetchWithAuth("/api/endpoints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          url: finalUrl,
          check_interval: interval,
          notify_email: notifyEmail,
          notify_sms: notifySms,
          notify_push: notifyPush,
          monitor_region: region,
          monitor_type: monitorType,
        }),
      });

      if (res.ok) {
        toast.success("Monitor created");
        router.push("/dashboard/endpoints");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create monitor");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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

      {/* Monitor type selector */}
      <Card className="rounded-xl mb-4">
        <CardContent className="p-5">
          <Label className="text-sm font-semibold">Monitor type</Label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setMonitorType("http");
                setSelectedService(null);
              }}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
                monitorType === "http"
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-muted-foreground/30"
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">HTTP / Website</p>
                <p className="text-xs text-muted-foreground">
                  Monitor any URL or API endpoint
                </p>
              </div>
              {monitorType === "http" && (
                <CheckSquare className="h-5 w-5 text-primary shrink-0" />
              )}
            </button>

            <button
              onClick={() => setMonitorType("status")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 text-left transition-all",
                monitorType === "status"
                  ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                  : "hover:border-muted-foreground/30"
              )}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Service Status</p>
                <p className="text-xs text-muted-foreground">
                  Monitor AI models, cloud services
                </p>
              </div>
              {monitorType === "status" && (
                <CheckSquare className="h-5 w-5 text-primary shrink-0" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* HTTP: Name & URL */}
      {monitorType === "http" && (
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
      )}

      {/* Service Status: Service catalog */}
      {monitorType === "status" && (
        <Card className="rounded-xl mb-4">
          <CardContent className="p-5">
            <Label className="text-sm font-semibold">
              Select a service to monitor
            </Label>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              We monitor the official status page — no API key required.
            </p>

            {/* Search & Category filter */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <Select
                value={serviceCategory}
                onValueChange={setServiceCategory}
              >
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                      isSelected
                        ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
                        : "hover:border-muted-foreground/30 hover:bg-muted/30"
                    )}
                  >
                    <span className="text-xl shrink-0">{service.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {service.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {service.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
              {filteredServices.length === 0 && (
                <div className="col-span-2 py-8 text-center text-sm text-muted-foreground">
                  No services match your search.
                </div>
              )}
            </div>

            {/* Selected service info */}
            {selectedService && (
              <div className="mt-4 rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedService.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedService.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">
                      {selectedService.statusUrl}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
            .
          </p>
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
          <Label className="text-sm font-semibold flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            Region to monitor from
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a region closest to your users.
          </p>
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
