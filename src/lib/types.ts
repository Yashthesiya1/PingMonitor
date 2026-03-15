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
  created_at: string;
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
