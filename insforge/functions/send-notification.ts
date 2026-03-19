import { createClient } from "npm:@insforge/sdk";

interface NotificationPayload {
  type: "endpoint_down" | "endpoint_recovered";
  endpoint_name: string;
  endpoint_url: string;
  user_email: string;
  user_id: string;
  incident_id: string;
  cause?: string;
  duration?: string;
  checked_at: string;
}

interface ChannelRow {
  id: string;
  channel_type: string;
  name: string;
  config: Record<string, string>;
}

function buildSlackMessage(payload: NotificationPayload): string {
  if (payload.type === "endpoint_down") {
    return `:red_circle: *[DOWN] ${payload.endpoint_name}*\nURL: ${payload.endpoint_url}\nCause: ${payload.cause || "Unreachable"}\nDetected: ${payload.checked_at}`;
  }
  return `:large_green_circle: *[RECOVERED] ${payload.endpoint_name}*\nURL: ${payload.endpoint_url}\nDowntime: ${payload.duration || "< 1 min"}\nRecovered: ${payload.checked_at}`;
}

function buildDiscordMessage(payload: NotificationPayload): string {
  if (payload.type === "endpoint_down") {
    return `🔴 **[DOWN] ${payload.endpoint_name}**\nURL: ${payload.endpoint_url}\nCause: ${payload.cause || "Unreachable"}\nDetected: ${payload.checked_at}`;
  }
  return `🟢 **[RECOVERED] ${payload.endpoint_name}**\nURL: ${payload.endpoint_url}\nDowntime: ${payload.duration || "< 1 min"}\nRecovered: ${payload.checked_at}`;
}

function buildTelegramMessage(payload: NotificationPayload): string {
  if (payload.type === "endpoint_down") {
    return `🔴 *\\[DOWN\\] ${payload.endpoint_name}*\nURL: ${payload.endpoint_url}\nCause: ${payload.cause || "Unreachable"}\nDetected: ${payload.checked_at}`;
  }
  return `🟢 *\\[RECOVERED\\] ${payload.endpoint_name}*\nURL: ${payload.endpoint_url}\nDowntime: ${payload.duration || "< 1 min"}\nRecovered: ${payload.checked_at}`;
}

function buildWebhookPayload(payload: NotificationPayload): Record<string, unknown> {
  return {
    event: payload.type,
    endpoint: { name: payload.endpoint_name, url: payload.endpoint_url },
    incident_id: payload.incident_id,
    cause: payload.cause || null,
    duration: payload.duration || null,
    checked_at: payload.checked_at,
  };
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

    // Get all active channels for this user
    const { data: channels } = await client.database
      .rpc("get_user_channels", { p_user_id: payload.user_id });

    const results: { channel: string; success: boolean; error?: string }[] = [];

    // Only send if user has configured channels — no auto-fallback
    if (!channels || channels.length === 0) {
      return new Response(
        JSON.stringify({ success: true, channels: [], message: "No channels configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const channelList: ChannelRow[] = channels;

    for (const channel of channelList) {
      try {
        switch (channel.channel_type) {
          case "email": {
            const subject = payload.type === "endpoint_down"
              ? `[DOWN] ${payload.endpoint_name} is not responding`
              : `[RECOVERED] ${payload.endpoint_name} is back up`;
            const html = payload.type === "endpoint_down"
              ? getDownEmailHtml(payload)
              : getRecoveryEmailHtml(payload);

            await client.emails.send({ to: payload.user_email, subject, html });
            results.push({ channel: "email", success: true });
            break;
          }

          case "slack": {
            const url = channel.config?.webhook_url;
            if (url) {
              await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: buildSlackMessage(payload) }),
              });
              results.push({ channel: "slack", success: true });
            }
            break;
          }

          case "discord": {
            const url = channel.config?.webhook_url;
            if (url) {
              await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: buildDiscordMessage(payload) }),
              });
              results.push({ channel: "discord", success: true });
            }
            break;
          }

          case "teams": {
            const url = channel.config?.webhook_url;
            if (url) {
              await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: buildSlackMessage(payload) }),
              });
              results.push({ channel: "teams", success: true });
            }
            break;
          }

          case "telegram": {
            const botToken = channel.config?.bot_token;
            const chatId = channel.config?.chat_id;
            if (botToken && chatId) {
              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: buildTelegramMessage(payload),
                  parse_mode: "MarkdownV2",
                }),
              });
              results.push({ channel: "telegram", success: true });
            }
            break;
          }

          case "webhook": {
            const url = channel.config?.webhook_url;
            if (url) {
              const headers: Record<string, string> = { "Content-Type": "application/json" };
              if (channel.config?.headers) {
                try { Object.assign(headers, JSON.parse(channel.config.headers)); } catch {}
              }
              await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(buildWebhookPayload(payload)),
              });
              results.push({ channel: "webhook", success: true });
            }
            break;
          }
        }
      } catch (err: unknown) {
        results.push({
          channel: channel.channel_type,
          success: false,
          error: err instanceof Error ? err.message : "Failed",
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, channels: results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
