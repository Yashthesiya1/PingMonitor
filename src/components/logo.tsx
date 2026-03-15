export function PingMonitorLogo({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />

      {/* Pulse/heartbeat line */}
      <path
        d="M8 26h6l3-10 4 20 4-14 3 6h4l3-8 3 8h2"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Ping dot */}
      <circle cx="38" cy="28" r="3" fill="white" opacity="0.9" />
      <circle cx="38" cy="28" r="5.5" stroke="white" strokeWidth="1.5" opacity="0.4" />

      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="hsl(245, 70%, 58%)" />
          <stop offset="1" stopColor="hsl(245, 58%, 45%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PingMonitorLogoMark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring */}
      <circle cx="60" cy="60" r="56" stroke="url(#mark-gradient)" strokeWidth="2" opacity="0.2" />
      <circle cx="60" cy="60" r="46" stroke="url(#mark-gradient)" strokeWidth="1.5" opacity="0.1" />

      {/* Background */}
      <rect x="24" y="24" width="72" height="72" rx="18" fill="url(#mark-gradient)" />

      {/* Pulse line */}
      <path
        d="M36 62h8l4.5-15 6 30 6-21 4.5 9h6l4.5-12 4.5 12h3"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Ping dot with pulse rings */}
      <circle cx="83" cy="65" r="4" fill="white" />
      <circle cx="83" cy="65" r="7" stroke="white" strokeWidth="1.5" opacity="0.5" />
      <circle cx="83" cy="65" r="11" stroke="white" strokeWidth="1" opacity="0.2" />

      <defs>
        <linearGradient id="mark-gradient" x1="24" y1="24" x2="96" y2="96">
          <stop stopColor="hsl(245, 70%, 60%)" />
          <stop offset="1" stopColor="hsl(245, 58%, 42%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
