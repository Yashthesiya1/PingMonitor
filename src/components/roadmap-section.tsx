"use client";

export function RoadmapTimeline() {
  return (
    <svg
      viewBox="0 0 900 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-4xl mx-auto"
    >
      {/* Background */}
      <rect width="900" height="420" rx="20" fill="hsl(240, 4.8%, 95.9%)" />

      {/* Main timeline line */}
      <line x1="80" y1="210" x2="820" y2="210" stroke="hsl(245, 58%, 51%)" strokeWidth="3" strokeLinecap="round" opacity="0.2" />

      {/* Animated progress glow */}
      <line x1="80" y1="210" x2="320" y2="210" stroke="hsl(245, 58%, 51%)" strokeWidth="3" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </line>

      {/* === PHASE 1: CURRENT (Completed) === */}
      <g>
        {/* Node */}
        <circle cx="140" cy="210" r="22" fill="hsl(245, 58%, 51%)" />
        <circle cx="140" cy="210" r="28" stroke="hsl(245, 58%, 51%)" strokeWidth="2" opacity="0.3" />
        {/* Checkmark */}
        <path d="M130 210l6 6 14-14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Card above */}
        <rect x="70" y="50" width="140" height="130" rx="12" fill="white" stroke="hsl(245, 58%, 85%)" strokeWidth="1.5" />
        <rect x="70" y="50" width="140" height="32" rx="12" fill="hsl(245, 58%, 51%)" />
        <rect x="70" y="70" width="140" height="12" fill="hsl(245, 58%, 51%)" />
        <text x="140" y="71" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">v1.0 — LIVE</text>

        {/* Features */}
        <circle cx="86" cy="100" r="3" fill="hsl(160, 84%, 39%)" />
        <text x="96" y="103" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">HTTP Monitoring</text>
        <circle cx="86" cy="116" r="3" fill="hsl(160, 84%, 39%)" />
        <text x="96" y="119" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">AI Service Status</text>
        <circle cx="86" cy="132" r="3" fill="hsl(160, 84%, 39%)" />
        <text x="96" y="135" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Real-time Charts</text>
        <circle cx="86" cy="148" r="3" fill="hsl(160, 84%, 39%)" />
        <text x="96" y="151" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Incident Detection</text>
        <circle cx="86" cy="164" r="3" fill="hsl(160, 84%, 39%)" />
        <text x="96" y="167" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Email Alerts</text>

        {/* Connector line */}
        <line x1="140" y1="180" x2="140" y2="188" stroke="hsl(245, 58%, 51%)" strokeWidth="2" />
      </g>

      {/* === PHASE 2: IN PROGRESS === */}
      <g>
        <circle cx="320" cy="210" r="22" fill="white" stroke="hsl(245, 58%, 51%)" strokeWidth="3" />
        {/* Gear/building icon */}
        <circle cx="320" cy="210" r="8" stroke="hsl(245, 58%, 51%)" strokeWidth="2" fill="none">
          <animateTransform attributeName="transform" type="rotate" from="0 320 210" to="360 320 210" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="210" r="3" fill="hsl(245, 58%, 51%)" />

        {/* Card below */}
        <rect x="250" y="250" width="140" height="140" rx="12" fill="white" stroke="hsl(245, 58%, 85%)" strokeWidth="1.5" />
        <rect x="250" y="250" width="140" height="32" rx="12" fill="hsl(25, 95%, 53%)" />
        <rect x="250" y="270" width="140" height="12" fill="hsl(25, 95%, 53%)" />
        <text x="320" y="271" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">PHASE 2 — NEXT</text>

        <circle cx="266" cy="300" r="3" fill="hsl(25, 95%, 53%)" />
        <text x="276" y="303" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Public Status Pages</text>
        <circle cx="266" cy="316" r="3" fill="hsl(25, 95%, 53%)" />
        <text x="276" y="319" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Slack / Discord Hooks</text>
        <circle cx="266" cy="332" r="3" fill="hsl(25, 95%, 53%)" />
        <text x="276" y="335" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Webhook Integrations</text>
        <circle cx="266" cy="348" r="3" fill="hsl(25, 95%, 53%)" />
        <text x="276" y="351" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Notification Cooldown</text>
        <circle cx="266" cy="364" r="3" fill="hsl(25, 95%, 53%)" />
        <text x="276" y="367" fill="hsl(240, 10%, 25%)" fontSize="8" fontFamily="system-ui">Recovery Alerts</text>

        <line x1="320" y1="232" x2="320" y2="250" stroke="hsl(25, 95%, 53%)" strokeWidth="2" strokeDasharray="4 3" />
      </g>

      {/* === PHASE 3: PLANNED === */}
      <g>
        <circle cx="500" cy="210" r="22" fill="white" stroke="hsl(240, 5.9%, 80%)" strokeWidth="2" />
        <text x="500" y="215" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="14" fontWeight="700" fontFamily="system-ui">3</text>

        {/* Card above */}
        <rect x="430" y="50" width="140" height="130" rx="12" fill="white" stroke="hsl(240, 5.9%, 88%)" strokeWidth="1.5" />
        <rect x="430" y="50" width="140" height="32" rx="12" fill="hsl(240, 3.8%, 46%)" />
        <rect x="430" y="70" width="140" height="12" fill="hsl(240, 3.8%, 46%)" />
        <text x="500" y="71" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">PHASE 3 — PLANNED</text>

        <circle cx="446" cy="100" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="456" y="103" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">SSL Monitoring</text>
        <circle cx="446" cy="116" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="456" y="119" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">DNS Monitoring</text>
        <circle cx="446" cy="132" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="456" y="135" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Keyword Checks</text>
        <circle cx="446" cy="148" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="456" y="151" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Cron Heartbeats</text>
        <circle cx="446" cy="164" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="456" y="167" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Multi-step API Tests</text>

        <line x1="500" y1="180" x2="500" y2="188" stroke="hsl(240, 5.9%, 80%)" strokeWidth="2" strokeDasharray="4 3" />
      </g>

      {/* === PHASE 4: FUTURE === */}
      <g>
        <circle cx="680" cy="210" r="22" fill="white" stroke="hsl(240, 5.9%, 80%)" strokeWidth="2" />
        <text x="680" y="215" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="14" fontWeight="700" fontFamily="system-ui">4</text>

        {/* Card below */}
        <rect x="610" y="250" width="140" height="130" rx="12" fill="white" stroke="hsl(240, 5.9%, 88%)" strokeWidth="1.5" />
        <rect x="610" y="250" width="140" height="32" rx="12" fill="hsl(240, 3.8%, 46%)" />
        <rect x="610" y="270" width="140" height="12" fill="hsl(240, 3.8%, 46%)" />
        <text x="680" y="271" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">PHASE 4 — FUTURE</text>

        <circle cx="626" cy="300" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="636" y="303" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Stripe Billing</text>
        <circle cx="626" cy="316" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="636" y="319" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Team Management</text>
        <circle cx="626" cy="332" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="636" y="335" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Public REST API</text>
        <circle cx="626" cy="348" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="636" y="351" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">Data Export (CSV)</text>
        <circle cx="626" cy="364" r="3" fill="hsl(240, 3.8%, 70%)" />
        <text x="636" y="367" fill="hsl(240, 3.8%, 46%)" fontSize="8" fontFamily="system-ui">AI Insights</text>

        <line x1="680" y1="232" x2="680" y2="250" stroke="hsl(240, 5.9%, 80%)" strokeWidth="2" strokeDasharray="4 3" />
      </g>

      {/* Arrow at end */}
      <path d="M810 210l10-5v10z" fill="hsl(240, 5.9%, 80%)" />

      {/* Bottom label */}
      <text x="450" y="408" textAnchor="middle" fill="hsl(240, 3.8%, 46%)" fontSize="10" fontFamily="system-ui">
        Building in public — new features shipping every week
      </text>
    </svg>
  );
}
