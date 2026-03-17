import { Mail, MessageSquare, Globe, Send, Hash, Users } from "lucide-react";

export interface ChannelTypeConfig {
  type: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
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
    description: "Receive notifications via email",
    fields: [],
  },
  {
    type: "slack",
    label: "Slack",
    icon: Hash,
    description: "Post alerts to a Slack channel",
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
    description: "Post alerts to a Discord channel",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        placeholder: "https://discord.com/api/webhooks/...",
        helpText: "Go to Channel Settings → Integrations → Webhooks",
      },
    ],
  },
  {
    type: "webhook",
    label: "Webhook",
    icon: Globe,
    description: "Send JSON payload to any URL",
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
  {
    type: "telegram",
    label: "Telegram",
    icon: Send,
    description: "Send alerts to a Telegram chat",
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
    description: "Post alerts to a Teams channel",
    fields: [
      {
        key: "webhook_url",
        label: "Webhook URL",
        placeholder: "https://outlook.office.com/webhook/...",
        helpText: "Add Incoming Webhook connector in your Teams channel",
      },
    ],
  },
];
