export interface Endpoint {
  id: string;
  user_id: string;
  name: string;
  url: string;
  method: string;
  is_active: boolean;
  check_interval: number;
  notify_email: boolean;
  notify_sms: boolean;
  notify_push: boolean;
  monitor_region: string;
  monitor_type: "http" | "status";
  created_at: string;
  updated_at: string;
}

export interface EndpointCheck {
  id: string;
  endpoint_id: string;
  status_code: number | null;
  response_time_ms: number | null;
  is_up: boolean;
  error_message: string | null;
  status_indicator: string | null;
  checked_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  role: "user" | "admin";
  credits: number;
  max_endpoints: number;
  display_name: string | null;
  email: string | null;
  created_at: string;
}

export interface Incident {
  id: string;
  endpoint_id: string;
  user_id: string;
  started_at: string;
  resolved_at: string | null;
  is_resolved: boolean;
  cause: string | null;
  duration_seconds: number | null;
  consecutive_failures: number;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  endpoint_id: string;
  incident_id: string | null;
  channel: string;
  event_type: string;
  status: string;
  sent_at: string;
}

export interface NotificationChannel {
  id: string;
  user_id: string;
  channel_type: "email" | "slack" | "discord" | "webhook" | "telegram" | "teams";
  name: string;
  config: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total_users: number;
  total_endpoints: number;
  active_endpoints: number;
  total_checks_today: number;
  avg_response_time: number;
  uptime_percentage: number;
  total_credits: number;
}
