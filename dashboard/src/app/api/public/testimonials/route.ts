import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { corsHeaders, PUBLIC_CACHE } from "@/lib/public-api";

/* GET /api/public/testimonials — published testimonials in the dashboard's sort order. */

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request, "GET") });
}

export async function GET(request: Request) {
  await connection();
  const headers = corsHeaders(request, "GET");
  try {
    const rows = await db
      .select({
        id: testimonials.id,
        name: testimonials.name,
        role: testimonials.role,
        company: testimonials.company,
        quote: testimonials.quote,
        avatarUrl: testimonials.avatarUrl,
        rating: testimonials.rating,
      })
      .from(testimonials)
      .where(and(eq(testimonials.isPublished, true), isNull(testimonials.deletedAt)))
      .orderBy(asc(testimonials.sortOrder), desc(testimonials.createdAt))
      .limit(100);
    return Response.json({ testimonials: rows }, { headers: { ...headers, "Cache-Control": PUBLIC_CACHE } });
  } catch (error) {
    console.error("[public] failed to list testimonials:", error);
    return Response.json({ error: "Failed to load testimonials" }, { status: 500, headers });
  }
}
