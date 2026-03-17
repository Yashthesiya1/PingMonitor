/**
 * Wrapper around fetch that auto-redirects to home on 401 (expired token).
 */
export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 401) {
    // Token expired — redirect to home
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    throw new Error("Unauthorized");
  }

  return res;
}
