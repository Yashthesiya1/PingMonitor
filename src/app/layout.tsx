import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InsforgeProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

const siteUrl = "https://pingmonitor.yashai.me";

export const viewport: Viewport = {
  themeColor: "#6c5ce7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PingMonitor - Monitor APIs, Websites & AI Services in Real-Time",
    template: "%s | PingMonitor",
  },
  description:
    "Free uptime monitoring for APIs, websites, and AI services. Get instant alerts when your endpoints go down. Monitor OpenAI, Anthropic, Supabase, GitHub and 20+ services with 1-minute checks.",
  keywords: [
    "API monitoring",
    "uptime monitoring",
    "website monitoring",
    "endpoint monitoring",
    "AI model monitoring",
    "OpenAI status",
    "Anthropic status",
    "Gemini status",
    "Supabase monitoring",
    "GitHub monitoring",
    "API health check",
    "uptime tracker",
    "response time monitoring",
    "downtime alerts",
    "service status monitoring",
    "ping monitor",
    "website uptime checker",
    "API uptime",
    "real-time monitoring",
    "free monitoring tool",
    "SaaS monitoring",
    "cloud service monitoring",
    "HTTP monitoring",
    "status page monitor",
  ],
  authors: [{ name: "PingMonitor" }],
  creator: "PingMonitor",
  publisher: "PingMonitor",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "PingMonitor",
    title: "PingMonitor - Monitor APIs, Websites & AI Services in Real-Time",
    description:
      "Free uptime monitoring for APIs, websites, and AI services. 1-minute checks, instant alerts, beautiful dashboards. Monitor OpenAI, Supabase, GitHub and 20+ services.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PingMonitor - API Endpoint Monitoring Dashboard",
        type: "image/svg+xml",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "PingMonitor - Monitor APIs, Websites & AI Services in Real-Time",
    description:
      "Free uptime monitoring with 1-minute checks. Track OpenAI, Supabase, GitHub and 20+ services. Instant alerts when things go down.",
    images: ["/og-image.svg"],
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon-192.svg", type: "image/svg+xml" },
    ],
  },

  // Manifest
  manifest: "/site.webmanifest",

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Alternate
  alternates: {
    canonical: siteUrl,
  },

  // Category
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data — JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PingMonitor",
              url: siteUrl,
              description:
                "Free uptime monitoring for APIs, websites, and AI services. Monitor endpoints with 1-minute checks and instant alerts.",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "120",
              },
              featureList: [
                "API uptime monitoring",
                "1-minute check intervals",
                "AI service status monitoring",
                "Real-time response time charts",
                "Email and push notifications",
                "Multi-region monitoring",
                "OpenAI, Anthropic, Supabase status tracking",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <InsforgeProvider>{children}</InsforgeProvider>
      </body>
    </html>
  );
}
