"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@insforge/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  CreditCard,
  Globe,
  Calendar,
  LogOut,
  Shield,
} from "lucide-react";
import type { UserProfile } from "@/lib/types";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [endpointCount, setEndpointCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/endpoints").then((r) => r.json()),
    ])
      .then(([profileRes, endpointsRes]) => {
        if (profileRes.data) setProfile(profileRes.data);
        if (endpointsRes.data) setEndpointCount(endpointsRes.data.length);
      })
      .finally(() => setLoading(false));
  }, [isLoaded]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (!isLoaded || loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Profile Header */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-bold">
              {user?.profile?.name
                ? user.profile.name.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">
                  {user?.profile?.name || "User"}
                </h1>
                <Badge
                  variant={profile?.role === "admin" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {profile?.role || "user"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Member since{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Account Details
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="h-3 w-3" />
                Name
              </Label>
              <p className="text-sm font-medium">
                {user?.profile?.name || "Not set"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3 w-3" />
                Email
              </Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Role
              </Label>
              <p className="text-sm font-medium capitalize">
                {profile?.role || "user"}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                User ID
              </Label>
              <p className="text-sm font-mono text-muted-foreground">
                {user?.id?.slice(0, 16)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Credits */}
      <Card className="rounded-xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Usage & Credits
          </CardTitle>
          <CardDescription>
            Your current plan usage and available credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <CreditCard className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{profile?.credits ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Credits</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Globe className="h-5 w-5 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{endpointCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Endpoints</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Globe className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">
                {(profile?.max_endpoints ?? 7) - endpointCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Slots Remaining
              </p>
            </div>
          </div>

          <Separator className="my-5" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Endpoint Usage</p>
              <p className="text-sm text-muted-foreground">
                {endpointCount} / {profile?.max_endpoints ?? 7}
              </p>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${
                    (endpointCount / (profile?.max_endpoints ?? 7)) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
