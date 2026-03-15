import { createClient } from "@insforge/sdk";
import { auth } from "@insforge/nextjs/server";

export async function createServerClient() {
  const { token } = await auth();

  return createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL!,
    edgeFunctionToken: token ?? undefined,
  });
}
