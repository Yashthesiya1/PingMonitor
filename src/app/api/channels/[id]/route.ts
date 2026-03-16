import { NextRequest, NextResponse } from "next/server";
import { auth } from "@insforge/nextjs/server";
import { createClient } from "@insforge/sdk";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, token } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
      edgeFunctionToken: token ?? undefined,
    });

    const body = await request.json();

    const { data, error } = await client.database
      .from("notification_channels")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data?.[0] });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, token } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = createClient({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
      edgeFunctionToken: token ?? undefined,
    });

    const { error } = await client.database
      .from("notification_channels")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
