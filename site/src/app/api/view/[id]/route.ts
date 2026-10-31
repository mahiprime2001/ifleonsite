import { DASHBOARD_ORIGIN } from "@/lib/content";

/* POST /api/view/:id — counts a post view in the dashboard (which de-duplicates per visitor). */
export async function POST(request: Request, { params }: RouteContext<"/api/view/[id]">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Invalid post ID" }, { status: 400 });
  try {
    const res = await fetch(`${DASHBOARD_ORIGIN}/api/v1/posts/${id}/view`, {
      method: "POST",
      headers: { "X-Forwarded-For": request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown" },
      cache: "no-store",
    });
    return new Response(await res.text(), { status: res.status, headers: { "Content-Type": "application/json" } });
  } catch {
    return Response.json({ counted: false }, { status: 502 });
  }
}
