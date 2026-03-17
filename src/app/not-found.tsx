import Link from "next/link";
import { PingMonitorLogo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <PingMonitorLogo size={48} className="mx-auto mb-6" />
        <h1 className="text-6xl font-extrabold text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-3">Page not found</h2>
        <p className="text-sm text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard/endpoints"
            className="inline-flex items-center justify-center rounded-lg border px-6 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
