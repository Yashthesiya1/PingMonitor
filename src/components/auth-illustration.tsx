"use client";

export function AuthIllustration() {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[380px]"
    >
      {/* Dashboard card */}
      <rect x="10" y="10" width="380" height="220" rx="16" fill="white" fillOpacity="0.1" stroke="white" strokeOpacity="0.15" strokeWidth="1" />

      {/* Header bar */}
      <rect x="10" y="10" width="380" height="36" rx="16" fill="white" fillOpacity="0.08" />
      <circle cx="30" cy="28" r="4" fill="white" fillOpacity="0.3" />
      <circle cx="42" cy="28" r="4" fill="white" fillOpacity="0.3" />
      <circle cx="54" cy="28" r="4" fill="white" fillOpacity="0.3" />
      <rect x="150" y="22" width="100" height="12" rx="6" fill="white" fillOpacity="0.08" />

      {/* Stat cards row */}
      <rect x="24" y="58" width="82" height="50" rx="8" fill="white" fillOpacity="0.08" />
      <text x="34" y="78" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="system-ui">Uptime</text>
      <text x="34" y="98" fill="white" fontSize="16" fontWeight="700" fontFamily="system-ui">99.9%</text>

      <rect x="116" y="58" width="82" height="50" rx="8" fill="white" fillOpacity="0.08" />
      <text x="126" y="78" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="system-ui">Response</text>
      <text x="126" y="98" fill="white" fontSize="16" fontWeight="700" fontFamily="system-ui">42ms</text>

      <rect x="208" y="58" width="82" height="50" rx="8" fill="white" fillOpacity="0.08" />
      <text x="218" y="78" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="system-ui">Monitors</text>
      <text x="218" y="98" fill="white" fontSize="16" fontWeight="700" fontFamily="system-ui">7</text>

      <rect x="300" y="58" width="76" height="50" rx="8" fill="white" fillOpacity="0.08" />
      <text x="310" y="78" fill="white" fillOpacity="0.5" fontSize="8" fontFamily="system-ui">Incidents</text>
      <text x="310" y="98" fill="white" fontSize="16" fontWeight="700" fontFamily="system-ui">0</text>

      {/* Chart area */}
      <rect x="24" y="120" width="352" height="96" rx="8" fill="white" fillOpacity="0.05" />

      {/* Chart grid lines */}
      <line x1="24" y1="140" x2="376" y2="140" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="24" y1="160" x2="376" y2="160" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="24" y1="180" x2="376" y2="180" stroke="white" strokeOpacity="0.06" strokeWidth="1" />
      <line x1="24" y1="200" x2="376" y2="200" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

      {/* Chart line (response times) */}
      <path
        d="M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150;M40 180 L65 175 L90 178 L115 168 L140 172 L165 165 L190 170 L215 160 L240 167 L265 155 L290 162 L315 150 L340 158 L365 145;M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Chart gradient fill */}
      <path
        d="M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150 L365 210 L40 210 Z"
        fill="url(#chart-fill)"
        opacity="0.3"
      >
        <animate
          attributeName="d"
          values="M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150 L365 210 L40 210 Z;M40 180 L65 175 L90 178 L115 168 L140 172 L165 165 L190 170 L215 160 L240 167 L265 155 L290 162 L315 150 L340 158 L365 145 L365 210 L40 210 Z;M40 185 L65 178 L90 182 L115 170 L140 175 L165 168 L190 172 L215 165 L240 170 L265 160 L290 165 L315 155 L340 162 L365 150 L365 210 L40 210 Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>

      {/* Monitor rows at bottom */}
      <g opacity="0.5">
        <circle cx="40" cy="130" r="3" fill="#4ade80" />
        <rect x="50" y="126" width="50" height="8" rx="4" fill="white" fillOpacity="0.15" />
        <rect x="108" y="126" width="24" height="8" rx="4" fill="#4ade80" fillOpacity="0.3" />
      </g>

      <defs>
        <linearGradient id="chart-fill" x1="200" y1="150" x2="200" y2="210">
          <stop stopColor="white" stopOpacity="0.2" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
