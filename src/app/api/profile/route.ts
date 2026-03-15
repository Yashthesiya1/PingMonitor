import { NextRequest, NextResponse } from "next/server";
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

    // Try to get existing profile
    const { data: profile } = await client.database
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (profile) {
      return NextResponse.json({ data: profile });
    }

    // Auto-create profile on first visit
    const { data: newProfile, error } = await client.database
      .from("user_profiles")
      .insert([
        {
          user_id: userId,
          role: "user",
          credits: 100,
          max_endpoints: 7,
        },
      ])
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: newProfile });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, token } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
      edgeFunctionToken: token ?? undefined,
    });

    const body = await request.json();
    const { name } = body;

    if (name !== undefined) {
      const { error } = await client.database
        .from("user_profiles")
        .update({ display_name: name })
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
