import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@insforge/nextjs";
import { Activity, BarChart3, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <span className="text-[17px] font-semibold">PingMonitor</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-6 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="h-3.5 w-3.5" />
          Real-time monitoring every 60 seconds
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Monitor Your APIs
          <br />
          <span className="text-primary">With Confidence</span>
        </h1>
        <p className="max-w-[560px] text-lg text-muted-foreground leading-relaxed">
          Keep track of your API endpoints in real-time. Get instant visibility
          into uptime, response times, and performance.
        </p>
        <div className="flex gap-3 mt-2">
          <SignedOut>
            <SignUpButton>
              <button className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm">
                Start Monitoring — Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary/90 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-7 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">
              Real-Time Monitoring
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your endpoints are checked every minute. Know instantly when
              something goes down.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-7 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">
              Beautiful Analytics
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visualize uptime, response times, and status history with clear,
              interactive charts.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-7 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-[15px] font-semibold mb-2">
              Up to 7 Endpoints
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monitor up to 7 API endpoints per account. Perfect for small teams
              and indie developers.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span className="font-medium">PingMonitor</span>
          </div>
          <p>Built with InsForge</p>
        </div>
      </footer>
    </div>
  );
}
