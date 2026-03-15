import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@insforge/nextjs";
import {
  Activity,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Bell,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { AutoRedirectIfSignedIn } from "@/components/auto-redirect";
import { PingMonitorLogo, PingMonitorLogoMark } from "@/components/logo";
import { HowItWorksDiagram } from "@/components/how-it-works-diagram";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <AutoRedirectIfSignedIn />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PingMonitorLogo size={32} />
            <span className="text-[17px] font-bold tracking-tight">
              PingMonitor
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#services"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30">
                  Start Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard/endpoints"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="container pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 pl-1.5 pr-4 py-1 text-sm mb-8">
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
                NEW
              </span>
              <span className="text-muted-foreground">
                AI Model status monitoring is live
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1]">
              Know when your
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                APIs go down
              </span>
              <br />
              before your users do
            </h1>

            <p className="mt-6 max-w-[620px] text-lg text-muted-foreground leading-relaxed">
              Monitor websites, APIs, and AI services in real-time. Get instant
              alerts, beautiful analytics, and peace of mind — all in one
              dashboard.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center gap-4 mt-10">
              <SignedOut>
                <SignUpButton>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                    Start Monitoring — Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-border px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard/endpoints"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SignedIn>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                7 free monitors
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                1-minute checks
              </div>
            </div>
          </div>

          {/* Dashboard preview mockup */}
          <div className="mt-16 mx-auto max-w-5xl">
            <div className="rounded-xl border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="rounded-md bg-background border px-4 py-1 text-xs text-muted-foreground font-mono">
                    app.pingmonitor.io/dashboard
                  </div>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 bg-background/50">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      label: "Total Endpoints",
                      value: "7",
                      sub: "0 slots remaining",
                    },
                    {
                      label: "Successful",
                      value: "1,247",
                      sub: "99.8% success rate",
                      color: "text-emerald-600",
                    },
                    {
                      label: "Failed",
                      value: "3",
                      sub: "3 failed checks",
                      color: "text-red-500",
                    },
                    {
                      label: "Avg Response",
                      value: "45ms",
                      sub: "Across all endpoints",
                    },
                  ].map((card, i) => (
                    <div
                      key={i}
                      className="rounded-lg border bg-card p-4"
                    >
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {card.label}
                      </p>
                      <p
                        className={`text-2xl font-bold mt-1 ${
                          card.color || ""
                        }`}
                      >
                        {card.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {card.sub}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mock monitor rows */}
                <div className="space-y-2">
                  {[
                    {
                      name: "OpenAI",
                      badge: "STATUS",
                      status: "Operational",
                      time: "32ms",
                      pct: "100%",
                    },
                    {
                      name: "Supabase",
                      badge: "HTTP",
                      status: "Up 3 min",
                      time: "54ms",
                      pct: "99.9%",
                    },
                    {
                      name: "GitHub API",
                      badge: "HTTP",
                      status: "Up 1 min",
                      time: "41ms",
                      pct: "99.8%",
                    },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{row.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] bg-muted rounded px-1.5 py-0.5 font-medium text-muted-foreground">
                            {row.badge}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {row.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{row.time}</span>
                        <div className="flex gap-[2px]">
                          {Array.from({ length: 12 }).map((_, j) => (
                            <div
                              key={j}
                              className="w-[3px] h-4 rounded-sm bg-emerald-500"
                            />
                          ))}
                        </div>
                        <span className="text-emerald-600 font-medium">
                          {row.pct}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/20 py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Features
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay online
            </h2>
            <p className="mt-4 text-muted-foreground max-w-[500px] mx-auto">
              Powerful monitoring tools designed for developers and teams who
              care about uptime.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Activity,
                title: "Real-Time Monitoring",
                desc: "Check your endpoints every 1 to 60 minutes. Know the moment something breaks.",
              },
              {
                icon: BarChart3,
                title: "Beautiful Analytics",
                desc: "Response time charts, uptime trends, availability bars — data that tells a story.",
              },
              {
                icon: Bell,
                title: "Instant Alerts",
                desc: "Get notified via email, SMS, or push when your services go down.",
              },
              {
                icon: Globe,
                title: "Multi-Region",
                desc: "Monitor from multiple regions worldwide for accurate global latency data.",
              },
              {
                icon: Zap,
                title: "AI Service Status",
                desc: "Track OpenAI, Anthropic, Gemini and 20+ services via official status pages. No API key needed.",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your data is encrypted and isolated. Row-level security ensures nobody else sees your monitors.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-[16px] font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services we monitor */}
      <section id="services" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Integrations
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Monitor the services you depend on
            </h2>
            <p className="mt-4 text-muted-foreground max-w-[500px] mx-auto">
              One-click setup for 20+ popular services. We track their official
              status pages — no API keys required.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              { icon: "🤖", name: "OpenAI" },
              { icon: "🧠", name: "Anthropic" },
              { icon: "✨", name: "Gemini" },
              { icon: "🌀", name: "Mistral" },
              { icon: "⚡", name: "Groq" },
              { icon: "🤗", name: "Hugging Face" },
              { icon: "🐙", name: "GitHub" },
              { icon: "▲", name: "Vercel" },
              { icon: "⚡", name: "Supabase" },
              { icon: "☁️", name: "Cloudflare" },
              { icon: "🍃", name: "MongoDB" },
              { icon: "💳", name: "Stripe" },
              { icon: "📱", name: "Twilio" },
              { icon: "🔥", name: "Firebase" },
              { icon: "🌐", name: "Netlify" },
              { icon: "🌊", name: "DigitalOcean" },
            ].map((service, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                <span className="text-base">{service.icon}</span>
                {service.name}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Plus any custom HTTP endpoint or API
          </p>
        </div>
      </section>

      {/* How it works — Visual diagram */}
      <section className="border-t bg-muted/20 py-24">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              How it works
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, automated monitoring
            </h2>
            <p className="mt-4 text-muted-foreground max-w-[500px] mx-auto">
              PingMonitor pings your APIs and services at the interval you
              choose, stores every result, and shows you everything in
              real-time.
            </p>
          </div>

          {/* SVG Diagram */}
          <HowItWorksDiagram />

          {/* Steps below diagram */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            {[
              {
                step: "1",
                title: "Add your endpoint",
                desc: "Paste a URL or pick from 20+ pre-built services. Set check interval and alert preferences.",
              },
              {
                step: "2",
                title: "We ping automatically",
                desc: "Our server sends HTTP requests or checks official status pages at your chosen interval.",
              },
              {
                step: "3",
                title: "See results instantly",
                desc: "Response times, uptime charts, and status history update in real-time. Get alerts when things break.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white text-xl font-bold shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
              Pricing
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="rounded-2xl border bg-white p-8 shadow-sm">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Perfect for personal projects
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "7 monitors",
                  "1-minute check interval",
                  "Email notifications",
                  "24-hour data retention",
                  "Response time charts",
                  "AI service monitoring",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <SignedOut>
                <SignUpButton>
                  <button className="mt-8 w-full rounded-lg border border-primary text-primary py-2.5 text-sm font-semibold hover:bg-primary/5 transition-colors">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard/endpoints"
                  className="mt-8 w-full inline-flex items-center justify-center rounded-lg border border-primary text-primary py-2.5 text-sm font-semibold hover:bg-primary/5 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>

            {/* Pro tier */}
            <div className="rounded-2xl border-2 border-primary bg-white p-8 shadow-lg shadow-primary/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                For teams and production apps
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "50 monitors",
                  "30-second check interval",
                  "Email, SMS & push alerts",
                  "90-day data retention",
                  "Multi-region monitoring",
                  "Status pages",
                  "Team members",
                  "Webhook integrations",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="mt-8 w-full rounded-lg bg-primary text-white py-2.5 text-sm font-semibold opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-background py-24">
        <div className="container text-center">
          <PingMonitorLogoMark className="mx-auto mb-8" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to monitor with confidence?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-[400px] mx-auto">
            Set up your first monitor in under 30 seconds. Free forever for up
            to 7 endpoints.
          </p>
          <div className="mt-8">
            <SignedOut>
              <SignUpButton>
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Start Monitoring — Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard/endpoints"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <PingMonitorLogo size={24} />
              <span className="text-sm font-semibold">PingMonitor</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#services" className="hover:text-foreground transition-colors">
                Services
              </a>
              <a href="#pricing" className="hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with InsForge
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
