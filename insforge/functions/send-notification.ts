import { createClient } from "npm:@insforge/sdk";

interface NotificationPayload {
  type: "endpoint_down" | "endpoint_recovered";
  endpoint_name: string;
  endpoint_url: string;
  user_email: string;
  incident_id: string;
  cause?: string;
  duration?: string;
  checked_at: string;
}

function getDownEmailHtml(payload: NotificationPayload): string {
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
    </div>

    <!-- Alert banner -->
    <div style="background:#fef2f2;border-bottom:1px solid #fecaca;padding:16px 32px;text-align:center;">
      <span style="display:inline-block;background:#ef4444;color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Endpoint Down</span>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:18px;color:#1a1a2e;">
        ${payload.endpoint_name} is down
      </h2>
      <p style="margin:0 0 24px;color:#8e8ea0;font-size:14px;">
        We detected that your endpoint is not responding.
      </p>

      <div style="background:#f8f8fa;border-radius:8px;padding:16px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">URL</td>
            <td style="padding:6px 0;color:#1a1a2e;font-size:13px;text-align:right;font-family:monospace;">${payload.endpoint_url}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Cause</td>
            <td style="padding:6px 0;color:#ef4444;font-size:13px;text-align:right;">${payload.cause || "Unreachable"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Detected at</td>
            <td style="padding:6px 0;color:#1a1a2e;font-size:13px;text-align:right;">${payload.checked_at}</td>
          </tr>
        </table>
      </div>

      <a href="https://ping.yashai.me/dashboard/endpoints" style="display:inline-block;background:#6c5ce7;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
        View Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e5ea;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#8e8ea0;font-size:12px;">
        You're receiving this because you have email notifications enabled for this monitor.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function getRecoveryEmailHtml(payload: NotificationPayload): string {
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
    </div>

    <!-- Recovery banner -->
    <div style="background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:16px 32px;text-align:center;">
      <span style="display:inline-block;background:#22c55e;color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;">Recovered</span>
    </div>

    <!-- Content -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:18px;color:#1a1a2e;">
        ${payload.endpoint_name} is back up
      </h2>
      <p style="margin:0 0 24px;color:#8e8ea0;font-size:14px;">
        Your endpoint has recovered and is responding normally.
      </p>

      <div style="background:#f8f8fa;border-radius:8px;padding:16px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">URL</td>
            <td style="padding:6px 0;color:#1a1a2e;font-size:13px;text-align:right;font-family:monospace;">${payload.endpoint_url}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Downtime</td>
            <td style="padding:6px 0;color:#1a1a2e;font-size:13px;text-align:right;">${payload.duration || "< 1 minute"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#8e8ea0;font-size:13px;">Recovered at</td>
            <td style="padding:6px 0;color:#1a1a2e;font-size:13px;text-align:right;">${payload.checked_at}</td>
          </tr>
        </table>
      </div>

      <a href="https://ping.yashai.me/dashboard/endpoints" style="display:inline-block;background:#6c5ce7;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">
        View Dashboard
      </a>
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #e5e5ea;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#8e8ea0;font-size:12px;">
        You're receiving this because you have email notifications enabled for this monitor.
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

  try {
    const payload: NotificationPayload = await req.json();

    const client = createClient({
      baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
      anonKey: Deno.env.get("ANON_KEY"),
    });

    const subject =
      payload.type === "endpoint_down"
        ? `[DOWN] ${payload.endpoint_name} is not responding`
        : `[RECOVERED] ${payload.endpoint_name} is back up`;

    const html =
      payload.type === "endpoint_down"
        ? getDownEmailHtml(payload)
        : getRecoveryEmailHtml(payload);

    const { error } = await client.emails.send({
      to: payload.user_email,
      subject,
      html,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed to send email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
