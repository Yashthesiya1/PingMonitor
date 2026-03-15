import { NextRequest, NextResponse } from "next/server";
import { auth } from "@insforge/nextjs/server";
import { createClient } from "@insforge/sdk";

async function getAuthClient() {
  const { userId, token } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const client = createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
    edgeFunctionToken: token ?? undefined,
  });

  return { client, userId };
}

export async function GET() {
  try {
    const { client, userId } = await getAuthClient();

    const { data, error } = await client.database
      .from("endpoints")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { client, userId } = await getAuthClient();

    const body = await request.json();
    const { name, url } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    // Check endpoint limit
    const { data: existing } = await client.database
      .from("endpoints")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    if (existing && existing.length >= 7) {
      return NextResponse.json(
        { error: "Maximum 7 endpoints allowed" },
        { status: 403 }
      );
    }

    const { data, error } = await client.database
      .from("endpoints")
      .insert([
        {
          user_id: userId,
          name,
          url,
          method: "GET",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure user profile exists
    const { data: profile } = await client.database
      .from("user_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile) {
      await client.database.from("user_profiles").insert([
        {
          user_id: userId,
          role: "user",
          credits: 100,
          max_endpoints: 7,
        },
      ]);
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
