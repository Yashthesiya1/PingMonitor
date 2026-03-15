"use client";

export function HowItWorksDiagram() {
  return (
    <svg
      viewBox="0 0 900 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-4xl mx-auto"
    >
      {/* ===== BACKGROUND ===== */}
      <rect width="900" height="340" rx="20" fill="hsl(240, 4.8%, 95.9%)" />

      {/* ===== LEFT: USER / DASHBOARD ===== */}
      {/* Dashboard card */}
      <rect x="40" y="70" width="180" height="200" rx="14" fill="white" stroke="hsl(240, 5.9%, 85%)" strokeWidth="1.5" />
      <rect x="40" y="70" width="180" height="40" rx="14" fill="hsl(245, 58%, 51%)" />
      <rect x="40" y="96" width="180" height="14" fill="hsl(245, 58%, 51%)" />
      {/* Dashboard title bar */}
      <circle cx="56" cy="90" r="4" fill="white" opacity="0.5" />
      <circle cx="68" cy="90" r="4" fill="white" opacity="0.5" />
      <circle cx="80" cy="90" r="4" fill="white" opacity="0.5" />
      <text x="130" y="93" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="system-ui">
        Dashboard
      </text>

      {/* Mini stat cards */}
      <rect x="52" y="120" width="72" height="36" rx="6" fill="hsl(160, 84%, 95%)" stroke="hsl(160, 84%, 80%)" strokeWidth="1" />
      <text x="88" y="134" textAnchor="middle" fill="hsl(160, 84%, 35%)" fontSize="8" fontWeight="600" fontFamily="system-ui">99.9%</text>
      <text x="88" y="148" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="7" fontFamily="system-ui">Uptime</text>

      <rect x="136" y="120" width="72" height="36" rx="6" fill="hsl(245, 58%, 96%)" stroke="hsl(245, 58%, 85%)" strokeWidth="1" />
      <text x="172" y="134" textAnchor="middle" fill="hsl(245, 58%, 45%)" fontSize="8" fontWeight="600" fontFamily="system-ui">42ms</text>
      <text x="172" y="148" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="7" fontFamily="system-ui">Response</text>

      {/* Mini chart bars */}
      <g>
        {[18, 22, 16, 24, 20, 26, 22, 28, 24, 20, 26, 30, 22, 28, 24].map((h, i) => (
          <rect
            key={i}
            x={56 + i * 10}
            y={200 - h}
            width="6"
            height={h}
            rx="2"
            fill="hsl(160, 84%, 39%)"
            opacity={0.6 + (i / 15) * 0.4}
          />
        ))}
      </g>

      {/* Chart label */}
      <text x="130" y="218" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="7" fontFamily="system-ui">
        Response Time (24h)
      </text>

      {/* Green status rows */}
      {[232, 248].map((y, i) => (
        <g key={i}>
          <rect x="52" y={y} width="156" height="14" rx="4" fill="hsl(160, 84%, 95%)" />
          <circle cx="62" cy={y + 7} r="3" fill="hsl(160, 84%, 39%)" />
          <text x="72" y={y + 10} fill="hsl(240, 10%, 20%)" fontSize="7" fontWeight="500" fontFamily="system-ui">
            {i === 0 ? "api.example.com" : "openai.status"}
          </text>
          <text x="196" y={y + 10} textAnchor="end" fill="hsl(160, 84%, 35%)" fontSize="7" fontWeight="600" fontFamily="system-ui">
            Up
          </text>
        </g>
      ))}

      {/* Label */}
      <text x="130" y="42" textAnchor="middle" fill="hsl(240, 10%, 25%)" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Your Dashboard
      </text>
      <text x="130" y="56" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="9" fontFamily="system-ui">
        Real-time results
      </text>

      {/* ===== CENTER: PINGMONITOR SERVER ===== */}
      {/* Server hexagon-ish shape */}
      <rect x="340" y="100" width="220" height="140" rx="20" fill="hsl(245, 58%, 51%)" />
      <rect x="340" y="100" width="220" height="140" rx="20" fill="url(#server-gradient)" />

      {/* Pulse rings animation */}
      <circle cx="450" cy="170" r="25" stroke="white" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" from="25" to="55" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="170" r="25" stroke="white" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" from="25" to="55" dur="2s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="2s" begin="0.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="450" cy="170" r="25" stroke="white" strokeWidth="1.5" opacity="0.3">
        <animate attributeName="r" from="25" to="55" dur="2s" begin="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.4" to="0" dur="2s" begin="1.4s" repeatCount="indefinite" />
      </circle>

      {/* Server icon */}
      <circle cx="450" cy="170" r="25" fill="white" opacity="0.15" />
      {/* Heartbeat line inside */}
      <path
        d="M430 170h5l3-8 4 16 4-12 3 5h5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Server text */}
      <text x="450" y="128" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui">
        PingMonitor
      </text>
      <text x="450" y="220" textAnchor="middle" fill="white" fontSize="9" opacity="0.8" fontFamily="system-ui">
        Checks every 1-60 min
      </text>

      {/* Labels */}
      <text x="450" y="72" textAnchor="middle" fill="hsl(240, 10%, 25%)" fontSize="13" fontWeight="700" fontFamily="system-ui">
        PingMonitor Server
      </text>
      <text x="450" y="86" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="9" fontFamily="system-ui">
        Automated checking
      </text>

      {/* ===== RIGHT: API ENDPOINTS ===== */}
      {/* Endpoint cards */}
      {[
        { y: 75, name: "Your API", icon: "🌐", status: "200 OK", color: "hsl(160, 84%, 39%)" },
        { y: 145, name: "OpenAI", icon: "🤖", status: "Operational", color: "hsl(160, 84%, 39%)" },
        { y: 215, name: "Supabase", icon: "⚡", status: "200 OK", color: "hsl(160, 84%, 39%)" },
      ].map((ep, i) => (
        <g key={i}>
          <rect x="660" y={ep.y} width="200" height="50" rx="12" fill="white" stroke="hsl(240, 5.9%, 85%)" strokeWidth="1.5" />
          <text x="690" y={ep.y + 24} fontSize="14">{ep.icon}</text>
          <text x="710" y={ep.y + 21} fill="hsl(240, 10%, 20%)" fontSize="11" fontWeight="600" fontFamily="system-ui">
            {ep.name}
          </text>
          <text x="710" y={ep.y + 36} fill={ep.color} fontSize="9" fontWeight="500" fontFamily="system-ui">
            {ep.status}
          </text>
          {/* Green dot */}
          <circle cx="842" cy={ep.y + 25} r="5" fill={ep.color} />
          <circle cx="842" cy={ep.y + 25} r="8" stroke={ep.color} strokeWidth="1" opacity="0.3" />
        </g>
      ))}

      {/* Label */}
      <text x="760" y="42" textAnchor="middle" fill="hsl(240, 10%, 25%)" fontSize="13" fontWeight="700" fontFamily="system-ui">
        Your Endpoints
      </text>
      <text x="760" y="56" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="9" fontFamily="system-ui">
        APIs, websites, AI services
      </text>

      {/* ===== ARROWS: LEFT (results back to dashboard) ===== */}
      {/* Arrow: Server → Dashboard */}
      <path d="M340 155 L230 155" stroke="hsl(160, 84%, 39%)" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#arrow-green)">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>
      <rect x="250" y="143" width="80" height="20" rx="6" fill="hsl(160, 84%, 95%)" stroke="hsl(160, 84%, 75%)" strokeWidth="1" />
      <text x="290" y="156" textAnchor="middle" fill="hsl(160, 84%, 30%)" fontSize="8" fontWeight="600" fontFamily="system-ui">
        ✓ Results
      </text>

      {/* Arrow: Server → Dashboard (lower) */}
      <path d="M340 190 L230 190" stroke="hsl(245, 58%, 51%)" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" markerEnd="url(#arrow-purple)">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="2s" repeatCount="indefinite" />
      </path>
      <rect x="250" y="180" width="80" height="20" rx="6" fill="hsl(245, 58%, 96%)" stroke="hsl(245, 58%, 85%)" strokeWidth="1" />
      <text x="290" y="193" textAnchor="middle" fill="hsl(245, 58%, 45%)" fontSize="8" fontWeight="600" fontFamily="system-ui">
        📊 Analytics
      </text>

      {/* ===== ARROWS: RIGHT (pings to endpoints) ===== */}
      {/* Arrow: Server → Endpoint 1 */}
      <path d="M560 145 L650 100" stroke="hsl(245, 58%, 51%)" strokeWidth="2" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Arrow: Server → Endpoint 2 */}
      <path d="M560 170 L650 170" stroke="hsl(245, 58%, 51%)" strokeWidth="2" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.2s" repeatCount="indefinite" />
      </path>

      {/* Arrow: Server → Endpoint 3 */}
      <path d="M560 195 L650 240" stroke="hsl(245, 58%, 51%)" strokeWidth="2" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.4s" repeatCount="indefinite" />
      </path>

      {/* Ping labels on arrows */}
      <rect x="585" y="88" width="50" height="18" rx="5" fill="hsl(245, 58%, 51%)" />
      <text x="610" y="100" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui">PING</text>

      <rect x="585" y="156" width="50" height="18" rx="5" fill="hsl(245, 58%, 51%)" />
      <text x="610" y="168" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui">PING</text>

      <rect x="585" y="224" width="50" height="18" rx="5" fill="hsl(245, 58%, 51%)" />
      <text x="610" y="236" textAnchor="middle" fill="white" fontSize="7" fontWeight="600" fontFamily="system-ui">PING</text>

      {/* ===== Bottom label ===== */}
      <text x="450" y="315" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="10" fontFamily="system-ui">
        Automated monitoring — no code required — results in real-time
      </text>

      {/* ===== DEFS ===== */}
      <defs>
        <linearGradient id="server-gradient" x1="340" y1="100" x2="560" y2="240">
          <stop stopColor="hsl(245, 70%, 58%)" />
          <stop offset="1" stopColor="hsl(245, 50%, 42%)" />
        </linearGradient>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(160, 84%, 39%)" />
        </marker>
        <marker id="arrow-purple" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(245, 58%, 51%)" />
        </marker>
      </defs>
    </svg>
  );
}
