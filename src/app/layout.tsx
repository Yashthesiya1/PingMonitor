import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { InsforgeProvider } from "./providers";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PingMonitor - API Endpoint Monitoring",
  description:
    "Monitor your API endpoints in real-time. Get instant alerts when your services go down.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <InsforgeProvider>{children}</InsforgeProvider>
      </body>
    </html>
  );
}
