import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { clientIp, corsHeaders as publicCors, isLivePost } from "@/lib/public-api";

/*
 * POST /api/v1/posts/:id/view — count one view of a post. Public (no API key): the blog on
 * ifleon.com calls it when someone opens a post.
 *
 * - Only live, published posts count (not drafts, scheduled or trashed posts), and the answer is the
 *   same either way, so the endpoint can't be used to probe which post ids exist.
 * - Each visitor (IP) counts once per post per 30 minutes, so reloads and scripts can't inflate counts.
 * - CORS allows the public site's origins to call it from the browser.
 */

const DEDUPE_MS = 30 * 60_000;
const recentViews = new Map<string, number>();

const corsHeaders = (request: Request) => publicCors(request, "POST");

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

function alreadyCounted(key: string) {
  const now = Date.now();
  // Keep the map small: drop old entries now and then.
  if (recentViews.size > 50_000) {
    for (const [k, t] of recentViews) if (now - t > DEDUPE_MS) recentViews.delete(k);
  }
  const last = recentViews.get(key);
  if (last && now - last < DEDUPE_MS) return true;
  recentViews.set(key, now);
  return false;
}

export async function POST(request: Request, { params }: RouteContext<"/api/v1/posts/[id]/view">) {
  const headers = corsHeaders(request);
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Invalid post ID" }, { status: 400, headers });
  }

  const ip = clientIp(request);
  if (alreadyCounted(`${ip}:${id}`)) {
    return Response.json({ counted: false }, { headers });
  }

  try {
    const updated = await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(and(eq(posts.id, id), isLivePost()))
      .returning({ id: posts.id });
    return Response.json({ counted: updated.length > 0 }, { headers });
  } catch (error) {
    console.error("[views] failed to count a view:", error);
    return Response.json({ error: "Failed to track view" }, { status: 500, headers });
  }
}
