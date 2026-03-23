import { Mail, MessageSquare, Globe, Send, Hash, Users, Phone } from "lucide-react";

export interface ChannelTypeConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bgColor: string;
  fields: {
    key: string;
    label: string;
    placeholder: string;
    type?: string;
    helpText?: string;
  }[];
}

export const CHANNEL_TYPES: ChannelTypeConfig[] = [
  {
    type: "email",
    label: "Email",
    icon: Mail,
    description: "Get notified via email when your endpoints go down or recover",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    fields: [],
  },
  {
    type: "slack",
    label: "Slack",
    icon: Hash,
    description: "Send alerts to any Slack channel using Incoming Webhooks",
    color: "text-[#E01E5A]",
    bgColor: "bg-[#E01E5A]/10",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        placeholder: "https://hooks.slack.com/services/...",
        helpText: "Create an Incoming Webhook in your Slack app settings",
      },
    ],
  },
  {
    type: "discord",
    label: "Discord",
    icon: MessageSquare,
    description: "Post alerts to a Discord channel via webhook",
    color: "text-[#5865F2]",
    bgColor: "bg-[#5865F2]/10",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        placeholder: "https://discord.com/api/webhooks/...",
        helpText: "Channel Settings → Integrations → Webhooks → Copy URL",
      },
    ],
  },
  {
    type: "telegram",
    label: "Telegram",
    icon: Send,
    description: "Receive instant alerts in your Telegram chat or group",
    color: "text-[#0088CC]",
    bgColor: "bg-[#0088CC]/10",
    fields: [
      {
        key: "bot_token",
        label: "Bot Token",
        placeholder: "123456:ABC-DEF...",
        helpText: "Get from @BotFather on Telegram",
      },
      {
        key: "chat_id",
        label: "Chat ID",
        placeholder: "-1001234567890",
        helpText: "Your group or user chat ID",
      },
    ],
  },
  {
    type: "teams",
    label: "Microsoft Teams",
    icon: Users,
    description: "Post alerts to a Microsoft Teams channel",
    color: "text-[#6264A7]",
    bgColor: "bg-[#6264A7]/10",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        placeholder: "https://outlook.office.com/webhook/...",
        helpText: "Add Incoming Webhook connector in your Teams channel",
      },
    ],
  },
  {
    type: "sms",
    label: "SMS",
    icon: Phone,
    description: "Receive SMS alerts on your phone number",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    fields: [
      {
        key: "phone_number",
        label: "Phone Number",
        placeholder: "+1234567890",
        helpText: "Include country code (e.g. +91 for India)",
      },
    ],
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: Globe,
    description: "Send JSON payload to any custom URL endpoint",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    fields: [
      {
        key: "webhook_url",
        label: "URL",
        placeholder: "https://your-api.com/webhook",
      },
      {
        key: "headers",
        label: "Custom Headers (JSON)",
        placeholder: '{"Authorization": "Bearer ..."}',
        helpText: "Optional — add authentication headers",
      },
    ],
  },
];
