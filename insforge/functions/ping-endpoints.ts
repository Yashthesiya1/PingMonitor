import { createClient } from "npm:@insforge/sdk";

interface EndpointRow {
  id: string;
  user_id: string;
  url: string;
  method: string;
  monitor_type: string;
  notify_email: boolean;
}

// Parse Atlassian Statuspage JSON format
function parseStatusPage(json: Record<string, unknown>): {
  indicator: string;
  description: string;
  isUp: boolean;
} {
  const status = json?.status as Record<string, string> | undefined;
  if (status?.indicator) {
    // Atlassian format: none = operational, minor/major/critical = issues
    const indicator = status.indicator;
    const description = status.description || indicator;
    return {
      indicator,
      description,
      isUp: indicator === "none" || indicator === "operational",
    };
  }

  // Google Cloud format: array of active incidents
  if (Array.isArray(json)) {
    return {
      indicator: json.length === 0 ? "none" : "major",
      description: json.length === 0 ? "All systems operational" : `${json.length} active incident(s)`,
      isUp: json.length === 0,
    };
  }

  return { indicator: "unknown", description: "Unknown format", isUp: false };
}

export default async function (req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const { data: endpoints, error: fetchError } = await client.database
      .rpc("get_active_endpoints");

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!endpoints || endpoints.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active endpoints to check", checked: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint: EndpointRow) => {
        const startTime = Date.now();
        let statusCode: number | null = null;
        let isUp = false;
        let errorMessage: string | null = null;
        let responseTimeMs: number | null = null;
        let statusIndicator: string | null = null;

        const isStatusMonitor = endpoint.monitor_type === "status";

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 15000);

          const response = await fetch(endpoint.url, {
            method: "GET",
            signal: controller.signal,
            headers: {
              "User-Agent": "PingMonitor/1.0",
              "Accept": "application/json",
            },
          });

          clearTimeout(timeout);
          responseTimeMs = Date.now() - startTime;
          statusCode = response.status;

          if (isStatusMonitor) {
            // Parse the status page JSON
            try {
              const json = await response.json();
              const parsed = parseStatusPage(json);
              isUp = parsed.isUp;
              statusIndicator = parsed.indicator;
              if (!isUp) {
                errorMessage = parsed.description;
              }
            } catch {
              // If we can't parse JSON but got a response, check HTTP status
              isUp = response.status >= 200 && response.status < 400;
              statusIndicator = isUp ? "none" : "major";
              errorMessage = isUp ? null : "Failed to parse status page";
            }
          } else {
            // HTTP monitor — standard check
            isUp = response.status >= 200 && response.status < 400;
          }
        } catch (err: unknown) {
          responseTimeMs = Date.now() - startTime;
          errorMessage = err instanceof Error ? err.message : "Unknown error";
          isUp = false;
          if (isStatusMonitor) statusIndicator = "critical";
        }

        await client.database.rpc("insert_check", {
          p_endpoint_id: endpoint.id,
          p_status_code: statusCode,
          p_response_time_ms: responseTimeMs,
          p_is_up: isUp,
          p_error_message: errorMessage,
          p_status_indicator: statusIndicator,
        });

        // --- Incident detection ---
        if (!isUp) {
          // Check if there's already an open incident
          const { data: openIncident } = await client.database
            .rpc("get_open_incident", { p_endpoint_id: endpoint.id });

          if (openIncident) {
            // Increment failure count
            await client.database.rpc("increment_incident_failures", {
              p_endpoint_id: endpoint.id,
            });
          } else {
            // Create new incident (first failure triggers it immediately for responsiveness)
            const { data: incidentId } = await client.database
              .rpc("create_incident", {
                p_endpoint_id: endpoint.id,
                p_user_id: endpoint.user_id,
                p_cause: errorMessage || `HTTP ${statusCode}`,
              });

            // Log notification
            if (endpoint.notify_email && incidentId) {
              await client.database.rpc("log_notification", {
                p_user_id: endpoint.user_id,
                p_endpoint_id: endpoint.id,
                p_incident_id: incidentId,
                p_channel: "email",
                p_event_type: "endpoint_down",
              });
            }
          }
        } else {
          // Endpoint is up — resolve any open incident
          const { data: openIncident } = await client.database
            .rpc("get_open_incident", { p_endpoint_id: endpoint.id });

          if (openIncident) {
            await client.database.rpc("resolve_incident", {
              p_endpoint_id: endpoint.id,
            });

            // Log recovery notification
            if (endpoint.notify_email) {
              await client.database.rpc("log_notification", {
                p_user_id: endpoint.user_id,
                p_endpoint_id: endpoint.id,
                p_incident_id: openIncident.id,
                p_channel: "email",
                p_event_type: "endpoint_recovered",
              });
            }
          }
        }

        return { endpoint_id: endpoint.id, is_up: isUp };
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;

    return new Response(
      JSON.stringify({
        message: `Checked ${successful}/${endpoints.length} endpoints`,
        checked: successful,
        total: endpoints.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
