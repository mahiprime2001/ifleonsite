import { API_BASE } from "@/lib/content";

/*
 * POST /api/contact — the site's contact forms. Forwarded to the dashboard, which validates, rate-limits
 * and stores the message (dashboard/src/app/api/public/contact). The visitor's IP is passed along so
 * the dashboard's per-visitor limit still applies.
 */
export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > 20_000) return Response.json({ ok: false, error: "The message is too long." }, { status: 413 });
  try {
    const res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-For": clientIp(request) },
      body,
      cache: "no-store",
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[contact] dashboard unreachable:", error);
    return Response.json({ ok: false, error: "Something went wrong. Please try again, or email info@ifleon.com." }, { status: 502 });
  }
}

/* Nginx in front of the site overwrites X-Forwarded-For with the real client IP. */
function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
