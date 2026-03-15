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
  Menu,
} from "lucide-react";
import { AutoRedirectIfSignedIn } from "@/components/auto-redirect";
import { PingMonitorLogo, PingMonitorLogoMark } from "@/components/logo";
import { HowItWorksDiagram } from "@/components/how-it-works-diagram";
import { RoadmapTimeline } from "@/components/roadmap-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AutoRedirectIfSignedIn />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <PingMonitorLogo size={28} className="sm:w-8 sm:h-8" />
            <span className="text-[15px] sm:text-[17px] font-bold tracking-tight">
              PingMonitor
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Roadmap
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SignedOut>
              <SignInButton>
                <button className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/25">
                  Start Free
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard/endpoints"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/25"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] sm:h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/20 bg-primary/5 pl-1.5 pr-3 sm:pr-4 py-1 text-xs sm:text-sm mb-6 sm:mb-8">
              <span className="inline-flex items-center rounded-full bg-primary px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white">
                NEW
              </span>
              <span className="text-muted-foreground">
                AI Model monitoring is live
              </span>
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] sm:leading-[1.1]">
              Know when your
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                APIs go down
              </span>
              <br />
              before your users do
            </h1>

            <p className="mt-4 sm:mt-6 max-w-[560px] text-sm sm:text-lg text-muted-foreground leading-relaxed px-2">
              Monitor websites, APIs, and AI services in real-time. Get instant
              alerts, beautiful analytics, and peace of mind.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto">
              <SignedOut>
                <SignUpButton>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                    Start Monitoring — Free
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-foreground hover:bg-muted/50 transition-all">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard/endpoints"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </SignedIn>
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-8 sm:mt-10 text-xs sm:text-sm text-muted-foreground">
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
          <div className="mt-12 sm:mt-16 mx-auto max-w-5xl">
            <div className="rounded-xl border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b px-3 sm:px-4 py-2 sm:py-3 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="hidden sm:block rounded-md bg-background border px-4 py-1 text-xs text-muted-foreground font-mono">
                    ping.yashai.me/dashboard
                  </div>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-3 sm:p-6 bg-background/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {[
                    { label: "Total Endpoints", value: "7", sub: "0 slots remaining" },
                    { label: "Successful", value: "1,247", sub: "99.8% success rate", color: "text-emerald-600" },
                    { label: "Failed", value: "3", sub: "3 failed checks", color: "text-red-500" },
                    { label: "Avg Response", value: "45ms", sub: "Across all endpoints" },
                  ].map((card, i) => (
                    <div key={i} className="rounded-lg border bg-card p-2.5 sm:p-4">
                      <p className="text-[9px] sm:text-[11px] font-medium text-muted-foreground">{card.label}</p>
                      <p className={`text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 ${card.color || ""}`}>{card.value}</p>
                      <p className="text-[8px] sm:text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{card.sub}</p>
                    </div>
                  ))}
                </div>
                {/* Mock monitor rows */}
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    { name: "OpenAI", badge: "STATUS", status: "Operational", time: "32ms", pct: "100%" },
                    { name: "Supabase", badge: "HTTP", status: "Up 3 min", time: "54ms", pct: "99.9%" },
                    { name: "GitHub API", badge: "HTTP", status: "Up 1 min", time: "41ms", pct: "99.8%" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 rounded-lg border bg-card px-2.5 sm:px-4 py-2 sm:py-3">
                      <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{row.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[8px] sm:text-[10px] bg-muted rounded px-1 sm:px-1.5 py-0.5 font-medium text-muted-foreground">{row.badge}</span>
                          <span className="text-[9px] sm:text-[11px] text-muted-foreground hidden sm:inline">{row.status}</span>
                        </div>
                      </div>
                      <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{row.time}</span>
                        <div className="flex gap-[2px]">
                          {Array.from({ length: 12 }).map((_, j) => (
                            <div key={j} className="w-[3px] h-4 rounded-sm bg-emerald-500" />
                          ))}
                        </div>
                        <span className="text-emerald-600 font-medium">{row.pct}</span>
                      </div>
                      <span className="md:hidden text-[10px] text-emerald-600 font-semibold">{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wider">
              Features
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Everything you need to stay online
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-[500px] mx-auto px-4">
              Powerful monitoring tools designed for developers and teams who care about uptime.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Activity, title: "Real-Time Monitoring", desc: "Check your endpoints every 1 to 60 minutes. Know the moment something breaks." },
              { icon: BarChart3, title: "Beautiful Analytics", desc: "Response time charts, uptime trends, availability bars — data that tells a story." },
              { icon: Bell, title: "Instant Alerts", desc: "Get notified via email, SMS, or push when your services go down." },
              { icon: Globe, title: "Multi-Region", desc: "Monitor from multiple regions worldwide for accurate global latency data." },
              { icon: Zap, title: "AI Service Status", desc: "Track OpenAI, Anthropic, Gemini and 20+ services via official status pages. No API key needed." },
              { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and isolated. Row-level security ensures nobody else sees your monitors." },
            ].map((feature, i) => (
              <div key={i} className="group rounded-xl sm:rounded-2xl border bg-background p-5 sm:p-8 shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <div className="mb-3 sm:mb-5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="text-sm sm:text-[16px] font-semibold mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wider">
              Integrations
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Monitor the services you depend on
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-[500px] mx-auto px-4">
              One-click setup for 20+ popular services. No API keys required.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto px-2">
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
              <div key={i} className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border bg-background px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                <span className="text-sm sm:text-base">{service.icon}</span>
                {service.name}
              </div>
            ))}
          </div>

          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
            Plus any custom HTTP endpoint or API
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wider">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Simple, automated monitoring
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-[500px] mx-auto px-4">
              PingMonitor pings your APIs and services at the interval you choose, stores every result, and shows you everything in real-time.
            </p>
          </div>

          {/* SVG Diagram — hidden on small mobile, shown on sm+ */}
          <div className="hidden sm:block overflow-x-auto">
            <HowItWorksDiagram />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mt-10 sm:mt-16">
            {[
              { step: "1", title: "Add your endpoint", desc: "Paste a URL or pick from 20+ pre-built services. Set check interval and alert preferences." },
              { step: "2", title: "We ping automatically", desc: "Our server sends HTTP requests or checks official status pages at your chosen interval." },
              { step: "3", title: "See results instantly", desc: "Response times, uptime charts, and status history update in real-time. Get alerts when things break." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 sm:mb-5 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-primary text-white text-lg sm:text-xl font-bold shadow-lg shadow-primary/25">
                  {item.step}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wider">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            {/* Free tier */}
            <div className="rounded-xl sm:rounded-2xl border bg-background p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="mt-3 sm:mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                Perfect for personal projects
              </p>
              <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                {[
                  "7 monitors",
                  "1-minute check interval",
                  "Email notifications",
                  "24-hour data retention",
                  "Response time charts",
                  "AI service monitoring",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <SignedOut>
                <SignUpButton>
                  <button className="mt-6 sm:mt-8 w-full rounded-lg border border-primary text-primary py-2.5 text-sm font-semibold hover:bg-primary/5 transition-colors">
                    Get Started Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard/endpoints" className="mt-6 sm:mt-8 w-full inline-flex items-center justify-center rounded-lg border border-primary text-primary py-2.5 text-sm font-semibold hover:bg-primary/5 transition-colors">
                  Go to Dashboard
                </Link>
              </SignedIn>
            </div>

            {/* Pro tier */}
            <div className="rounded-xl sm:rounded-2xl border-2 border-primary bg-background p-6 sm:p-8 shadow-lg shadow-primary/10 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-4 py-1 text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-3 sm:mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold">$9</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                For teams and production apps
              </p>
              <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
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
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button disabled className="mt-6 sm:mt-8 w-full rounded-lg bg-primary text-white py-2.5 text-sm font-semibold opacity-50 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="border-t bg-muted/20 py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-semibold text-primary mb-2 sm:mb-3 uppercase tracking-wider">
              Roadmap
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              What&apos;s coming next
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-[500px] mx-auto px-4">
              We&apos;re building in public. Here&apos;s what&apos;s on our roadmap — and we ship fast.
            </p>
          </div>

          {/* SVG Timeline — hidden on small mobile */}
          <div className="hidden sm:block overflow-x-auto mb-12">
            <RoadmapTimeline />
          </div>

          {/* Mobile-friendly cards version */}
          <div className="grid grid-cols-1 sm:hidden gap-4">
            {[
              {
                phase: "v1.0",
                status: "Live",
                color: "bg-primary",
                items: ["HTTP Monitoring", "AI Service Status", "Real-time Charts", "Incident Detection", "Email Alerts"],
              },
              {
                phase: "Phase 2",
                status: "Next",
                color: "bg-orange-500",
                items: ["Public Status Pages", "Slack / Discord", "Webhook Integrations", "Recovery Alerts"],
              },
              {
                phase: "Phase 3",
                status: "Planned",
                color: "bg-muted-foreground",
                items: ["SSL Monitoring", "DNS Monitoring", "Keyword Checks", "Cron Heartbeats"],
              },
              {
                phase: "Phase 4",
                status: "Future",
                color: "bg-muted-foreground",
                items: ["Stripe Billing", "Team Management", "Public REST API", "AI Insights"],
              },
            ].map((phase, i) => (
              <div key={i} className="rounded-xl border bg-background p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`${phase.color} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>
                    {phase.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold">{phase.phase}</span>
                </div>
                <ul className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-emerald-500" : phase.color}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Detailed feature cards below timeline */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              {
                title: "Public Status Pages",
                desc: "Share a branded status page with your users. Custom domain support.",
                tag: "Phase 2",
                tagColor: "bg-orange-500",
              },
              {
                title: "SSL & DNS Monitoring",
                desc: "Track certificate expiry and DNS changes. Get alerts before they break.",
                tag: "Phase 3",
                tagColor: "bg-muted-foreground",
              },
              {
                title: "Team Collaboration",
                desc: "Invite team members, assign roles, and share monitors across your org.",
                tag: "Phase 4",
                tagColor: "bg-muted-foreground",
              },
              {
                title: "AI-Powered Insights",
                desc: "Anomaly detection, predictive alerts, and weekly AI summaries.",
                tag: "Phase 5",
                tagColor: "bg-muted-foreground",
              },
            ].map((card, i) => (
              <div key={i} className="rounded-xl border bg-background p-5 shadow-sm hover:shadow-md transition-shadow">
                <span className={`${card.tagColor} text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full`}>
                  {card.tag.toUpperCase()}
                </span>
                <h3 className="text-sm font-semibold mt-3 mb-1.5">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-gradient-to-b from-primary/5 to-background py-16 sm:py-24">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <PingMonitorLogoMark className="mx-auto mb-6 sm:mb-8 w-20 h-20 sm:w-[120px] sm:h-[120px]" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Ready to monitor with confidence?
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-[400px] mx-auto px-4">
            Set up your first monitor in under 30 seconds. Free forever for up to 7 endpoints.
          </p>
          <div className="mt-6 sm:mt-8">
            <SignedOut>
              <SignUpButton>
                <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 sm:px-10 py-3 sm:py-4 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Start Monitoring — Free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard/endpoints" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 sm:px-10 py-3 sm:py-4 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-10">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <PingMonitorLogo size={24} />
              <span className="text-sm font-semibold">PingMonitor</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#services" className="hover:text-foreground transition-colors">Services</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Built with InsForge</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
