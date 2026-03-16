"use client";

import { useState } from "react";
import { useAuth } from "@insforge/nextjs";
import Link from "next/link";
import { PingMonitorLogo } from "@/components/logo";
import { AuthIllustration } from "@/components/auth-illustration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const { signUp, signIn, isLoaded, isSignedIn } = useAuth();
  const [name, setName] = useState("");
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
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signUp(email.trim(), password);

      if (result && "error" in result && result.error) {
        setError(result.error);
      } else {
        // Auto sign in after signup
        const signInResult = await signIn(email.trim(), password);
        if (signInResult && "error" in signInResult && signInResult.error) {
          // Signup succeeded but auto-login failed — redirect to sign-in
          window.location.href = "/sign-in";
        } else {
          window.location.href = "/dashboard/endpoints";
        }
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
          <h1 className="text-3xl font-bold text-white leading-tight mb-6">
            Start monitoring
            <br />
            in 30 seconds.
          </h1>
          <div className="space-y-3">
            {[
              "7 free monitors included",
              "1-minute check intervals",
              "20+ pre-built service monitors",
              "Email, Slack, Discord alerts",
              "No credit card required",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-white/80 shrink-0" />
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-white/50">
            Trusted by developers worldwide
          </p>
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

          <h2 className="text-2xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-8">
            Get started with free monitoring today
          </p>

          {error && (
            <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              {password.length > 0 && password.length < 6 && (
                <p className="text-xs text-destructive">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By creating an account, you agree to our Terms of Service.
          </p>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-medium hover:underline"
            >
              Sign in
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
