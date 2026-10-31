import { and, arrayContains, desc } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { corsHeaders, isLivePost, PUBLIC_CACHE } from "@/lib/public-api";

/*
 * GET /api/public/posts — every live post for the blog list on ifleon.com, newest first, without
 * the body (fetch /api/public/posts/:slug for that). Optional ?tag=docker filters by tag.
 */

const MAX_POSTS = 1000;

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request, "GET") });
}

export async function GET(request: Request) {
  await connection();
  const headers = corsHeaders(request, "GET");
  const tag = new URL(request.url).searchParams.get("tag")?.trim().toLowerCase().slice(0, 50);

  try {
    const rows = await db
      .select({
        id: posts.id,
        slug: posts.slug,
        title: posts.title,
        excerpt: posts.excerpt,
        seoDescription: posts.seoDescription,
        coverImageUrl: posts.coverImageUrl,
        tags: posts.tags,
        authorName: posts.authorName,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        viewCount: posts.viewCount,
      })
      .from(posts)
      .where(tag ? and(isLivePost(), arrayContains(posts.tags, [tag])) : isLivePost())
      .orderBy(desc(posts.publishedAt), desc(posts.id))
      .limit(MAX_POSTS);

    return Response.json(
      {
        posts: rows.map(({ seoDescription, ...p }) => ({ ...p, excerpt: p.excerpt || seoDescription || "" })),
        total: rows.length,
      },
      { headers: { ...headers, "Cache-Control": PUBLIC_CACHE } },
    );
  } catch (error) {
    console.error("[public] failed to list posts:", error);
    return Response.json({ error: "Failed to load posts" }, { status: 500, headers });
  }
}
