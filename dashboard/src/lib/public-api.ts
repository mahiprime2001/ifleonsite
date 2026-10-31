import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { posts } from "@/db/schema";

/*
 * Shared bits of the public API (/api/public/* and the view counter): no API key, called from the
 * browser by ifleon.com, so CORS is limited to the site's own origins.
 */

const ALLOWED_ORIGINS = new Set(
  (process.env.PUBLIC_SITE_ORIGINS || "https://ifleon.com,https://www.ifleon.com,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

export function corsHeaders(request: Request, methods: string): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": `${methods}, OPTIONS`,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/* Nginx overwrites X-Forwarded-For with the real client IP, so it can't be spoofed through the proxy. */
export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/* What the public may see: published, not trashed, and not scheduled for later. */
export const isLivePost = () => and(eq(posts.status, "published"), isNull(posts.deletedAt), lte(posts.publishedAt, sql`now()`));

/* Browsers may reuse a public response briefly; new posts show up within a minute. */
export const PUBLIC_CACHE = "public, max-age=60, stale-while-revalidate=300";
