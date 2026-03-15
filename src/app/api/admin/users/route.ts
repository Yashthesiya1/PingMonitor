import { NextResponse } from "next/server";
import { auth } from "@insforge/nextjs/server";
import { createClient } from "@insforge/sdk";

export async function GET() {
  try {
    const { userId, token } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
      edgeFunctionToken: token ?? undefined,
    });

    // Check admin role
    const { data: profile } = await client.database
      .from("user_profiles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all user profiles with their endpoint counts
    const { data: users, error } = await client.database
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get endpoint counts per user
    const { data: endpoints } = await client.database
      .from("endpoints")
      .select("user_id");

    const endpointCounts: Record<string, number> = {};
    endpoints?.forEach((ep: { user_id: string }) => {
      endpointCounts[ep.user_id] = (endpointCounts[ep.user_id] || 0) + 1;
    });

    const usersWithCounts = users?.map(
      (u: { user_id: string; [key: string]: unknown }) => ({
        ...u,
        endpoint_count: endpointCounts[u.user_id] || 0,
      })
    );

    return NextResponse.json({ data: usersWithCounts });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
