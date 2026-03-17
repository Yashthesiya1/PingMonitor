import { createClient } from "npm:@insforge/sdk";

interface WeeklySummary {
  user_id: string;
  user_email: string;
  total_endpoints: number;
  total_checks: number;
  total_up: number;
  total_down: number;
  uptime_pct: number;
  avg_response: number;
  total_incidents: number;
}

function getWeeklySummaryHtml(data: WeeklySummary): string {
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
    month: "short", day: "numeric",
  });
  const weekEnd = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const uptimeColor = data.uptime_pct >= 99 ? "#22c55e" : data.uptime_pct >= 90 ? "#f59e0b" : "#ef4444";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;border:1px solid #e5e5ea;overflow:hidden;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6c5ce7,#4a3db0);padding:28px 32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">PingMonitor</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Weekly Summary</p>
    </div>

    <!-- Period -->
    <div style="background:#f8f8fa;border-bottom:1px solid #e5e5ea;padding:12px 32px;text-align:center;">
      <span style="color:#8e8ea0;font-size:13px;">${weekStart} — ${weekEnd}</span>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 20px;font-size:18px;color:#1a1a2e;">Your week at a glance</h2>

      <!-- Uptime highlight -->
      <div style="text-align:center;margin-bottom:28px;">
        <div style="display:inline-block;width:100px;height:100px;border-radius:50%;border:4px solid ${uptimeColor};line-height:92px;text-align:center;">
          <span style="font-size:28px;font-weight:800;color:${uptimeColor};">${data.uptime_pct}%</span>
        </div>
        <p style="margin:10px 0 0;color:#8e8ea0;font-size:13px;">Overall Uptime</p>
      </div>

      <!-- Stats grid -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:12px;text-align:center;border:1px solid #e5e5ea;border-radius:8px;">
            <div style="font-size:24px;font-weight:700;color:#1a1a2e;">${data.total_endpoints}</div>
            <div style="font-size:11px;color:#8e8ea0;margin-top:4px;">Monitors</div>
          </td>
          <td style="padding:12px;text-align:center;border:1px solid #e5e5ea;">
            <div style="font-size:24px;font-weight:700;color:#1a1a2e;">${data.total_checks.toLocaleString()}</div>
            <div style="font-size:11px;color:#8e8ea0;margin-top:4px;">Total Checks</div>
          </td>
          <td style="padding:12px;text-align:center;border:1px solid #e5e5ea;">
            <div style="font-size:24px;font-weight:700;color:#1a1a2e;">${data.avg_response}ms</div>
            <div style="font-size:11px;color:#8e8ea0;margin-top:4px;">Avg Response</div>
          </td>
        </tr>
      </table>

      <!-- Results -->
      <div style="background:#f8f8fa;border-radius:8px;padding:16px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Successful checks</td>
            <td style="padding:6px 0;color:#22c55e;font-size:13px;text-align:right;font-weight:600;">${data.total_up.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Failed checks</td>
            <td style="padding:6px 0;color:${data.total_down > 0 ? '#ef4444' : '#1a1a2e'};font-size:13px;text-align:right;font-weight:600;">${data.total_down}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Incidents</td>
            <td style="padding:6px 0;color:${data.total_incidents > 0 ? '#ef4444' : '#1a1a2e'};font-size:13px;text-align:right;font-weight:600;">${data.total_incidents}</td>
          </tr>
        </table>
      </div>

      <a href="https://ping.yashai.me/dashboard/metrics" style="display:inline-block;background:#6c5ce7;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
        View Full Metrics
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e5ea;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#8e8ea0;font-size:12px;">
        Sent every Monday at 9:00 AM UTC. You can manage notification preferences in your dashboard.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default async function (req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const client = createClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    anonKey: Deno.env.get("ANON_KEY"),
  });

  try {
    const { data: summaries, error } = await client.database
      .rpc("get_weekly_summary_data");

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!summaries || summaries.length === 0) {
      return new Response(
        JSON.stringify({ message: "No users to send summaries to", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;

    for (const summary of summaries as WeeklySummary[]) {
      // Skip users with no endpoints
      if (summary.total_endpoints === 0) continue;

      try {
        const html = getWeeklySummaryHtml(summary);

        await client.emails.send({
          to: summary.user_email,
          subject: `PingMonitor Weekly: ${summary.uptime_pct}% uptime, ${summary.total_checks} checks`,
          html,
        });

        sent++;
      } catch {
        // Continue to next user if one fails
      }
    }

    return new Response(
      JSON.stringify({ message: `Sent ${sent} weekly summaries`, sent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
