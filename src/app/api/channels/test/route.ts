import { NextRequest, NextResponse } from "next/server";
import { auth } from "@insforge/nextjs/server";
import { createClient } from "@insforge/sdk";

export async function POST(request: NextRequest) {
  try {
    const { userId, token, user } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { channel_type, config } = body;

    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
      edgeFunctionToken: token ?? undefined,
    });

    const testPayload = {
      type: "endpoint_down" as const,
      endpoint_name: "Test Monitor",
      endpoint_url: "https://example.com",
      cause: "This is a test notification",
      checked_at: new Date().toLocaleString("en-US", { timeZone: "UTC" }) + " UTC",
    };

    if (channel_type === "email") {
      // Get email via RPC (user object from auth() may not have email)
      const { data: email } = await client.database.rpc("get_user_email", {
        p_user_id: userId,
      });
      if (!email) {
        return NextResponse.json({ error: "No email found" }, { status: 400 });
      }

      await client.emails.send({
        to: email,
        subject: "[TEST] PingMonitor Test Notification",
        html: `<div style="font-family:sans-serif;max-width:400px;margin:20px auto;padding:20px;border:1px solid #e5e5ea;border-radius:12px;">
          <h2 style="color:#6c5ce7;margin:0 0 12px;">Test Notification</h2>
          <p style="color:#333;margin:0 0 8px;">This is a test from PingMonitor.</p>
          <p style="color:#8e8ea0;font-size:13px;margin:0;">If you received this, your email channel is working correctly.</p>
        </div>`,
      });

      return NextResponse.json({ success: true });
    }

    if (["slack", "discord", "teams"].includes(channel_type)) {
      const webhookUrl = config?.webhook_url;
      if (!webhookUrl) {
        return NextResponse.json({ error: "Webhook URL required" }, { status: 400 });
      }

      const slackBody =
        channel_type === "discord"
          ? { content: `**[TEST] PingMonitor** — ${testPayload.endpoint_name} test notification. Your ${channel_type} channel is working.` }
          : { text: `[TEST] PingMonitor — ${testPayload.endpoint_name} test notification. Your ${channel_type} channel is working.` };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackBody),
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Webhook returned ${res.status}` }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (channel_type === "webhook") {
      const webhookUrl = config?.webhook_url;
      if (!webhookUrl) {
        return NextResponse.json({ error: "Webhook URL required" }, { status: 400 });
      }

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config?.headers ? JSON.parse(config.headers) : {}),
        },
        body: JSON.stringify({ event: "test", ...testPayload }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: `Webhook returned ${res.status}` }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    if (channel_type === "telegram") {
      const botToken = config?.bot_token;
      const chatId = config?.chat_id;
      if (!botToken || !chatId) {
        return NextResponse.json({ error: "Bot token and chat ID required" }, { status: 400 });
      }

      const text = `✅ *PingMonitor Test*\nThis is a test notification. Your Telegram channel is working.`;
      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        return NextResponse.json({ error: data.description || "Telegram API error" }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported channel type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Test failed" },
      { status: 500 }
    );
  }
}
