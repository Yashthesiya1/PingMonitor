import { createClient } from "npm:@insforge/sdk";

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
    // Use RPC to bypass RLS and get all active endpoints
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

    // Ping each endpoint
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint: { id: string; url: string; method: string }) => {
        const startTime = Date.now();
        let statusCode: number | null = null;
        let isUp = false;
        let errorMessage: string | null = null;
        let responseTimeMs: number | null = null;

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(endpoint.url, {
            method: endpoint.method || "GET",
            signal: controller.signal,
            headers: {
              "User-Agent": "PingMonitor/1.0",
            },
          });

          clearTimeout(timeout);

          responseTimeMs = Date.now() - startTime;
          statusCode = response.status;
          isUp = response.status >= 200 && response.status < 400;
        } catch (err: unknown) {
          responseTimeMs = Date.now() - startTime;
          errorMessage = err instanceof Error ? err.message : "Unknown error";
          isUp = false;
        }

        // Use RPC to bypass RLS and insert check result
        await client.database.rpc("insert_check", {
          p_endpoint_id: endpoint.id,
          p_status_code: statusCode,
          p_response_time_ms: responseTimeMs,
          p_is_up: isUp,
          p_error_message: errorMessage,
        });

        return {
          endpoint_id: endpoint.id,
          is_up: isUp,
          response_time_ms: responseTimeMs,
          status_code: statusCode,
        };
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;

    return new Response(
      JSON.stringify({
        message: `Checked ${successful}/${endpoints.length} endpoints`,
        checked: successful,
        total: endpoints.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: unknown) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
