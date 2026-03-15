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
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">PingMonitor</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container flex flex-col items-center justify-center gap-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground">
          <Zap className="mr-1 h-3 w-3" />
          Real-time monitoring every 60 seconds
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Monitor Your APIs
          <br />
          <span className="text-primary">With Confidence</span>
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground">
          Keep track of your API endpoints in real-time. Get instant visibility
          into uptime, response times, and performance — all in one dashboard.
        </p>
        <div className="flex gap-4">
          <SignedOut>
            <SignUpButton>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Start Monitoring — Free
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <Activity className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Real-Time Monitoring
            </h3>
            <p className="text-sm text-muted-foreground">
              Your endpoints are checked every minute. Know instantly when
              something goes down.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <BarChart3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Beautiful Analytics
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualize uptime, response times, and status history with clear,
              interactive charts.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <Shield className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Up to 7 Endpoints
            </h3>
            <p className="text-sm text-muted-foreground">
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
            <Activity className="h-4 w-4" />
            <span>PingMonitor</span>
          </div>
          <p>Built with InsForge</p>
        </div>
      </footer>
    </div>
  );
}
