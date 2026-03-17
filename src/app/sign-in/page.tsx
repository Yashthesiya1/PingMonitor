"use client";

import { useState } from "react";
import { useAuth } from "@insforge/nextjs";
import Link from "next/link";
import { PingMonitorLogo } from "@/components/logo";
import { AuthIllustration } from "@/components/auth-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignInPage() {
  const { signIn, isLoaded, isSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already signed in
  if (isLoaded && isSignedIn) {
    window.location.href = "/dashboard/endpoints";
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn(email.trim(), password);

      if (result && "error" in result && result.error) {
        setError(result.error);
      } else {
        window.location.href = "/dashboard/endpoints";
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <PingMonitorLogo size={28} />
            </div>
            <span className="text-xl font-bold text-white">PingMonitor</span>
          </div>
        </div>

        {/* Dashboard illustration */}
        <div className="relative z-10">
          <AuthIllustration />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            Know when your APIs
            <br />
            go down before
            <br />
            your users do.
          </h1>
          <p className="text-white/70 text-sm max-w-md">
            Monitor websites, APIs, and AI services in real-time. Get instant alerts across email, Slack, Discord, and more.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-8">
          <div>
            <p className="text-2xl font-bold text-white">20+</p>
            <p className="text-xs text-white/60">Services</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">1min</p>
            <p className="text-xs text-white/60">Check interval</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-xs text-white/60">Alert channels</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <PingMonitorLogo size={32} />
            <span className="text-lg font-bold">PingMonitor</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-xs text-muted-foreground text-center mt-8">
            <Link href="/" className="hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
