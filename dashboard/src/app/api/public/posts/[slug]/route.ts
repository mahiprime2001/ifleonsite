import { and, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { markdownToHtml } from "@/lib/markdown/html";
import { corsHeaders, isLivePost, PUBLIC_CACHE } from "@/lib/public-api";

/*
 * GET /api/public/posts/:slug — one live post with its body rendered to HTML (callouts, highlighted
 * code), plus the SEO fields the site puts in <head>. Drafts, scheduled and trashed posts are a 404.
 */

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request, "GET") });
}

export async function GET(request: Request, { params }: RouteContext<"/api/public/posts/[slug]">) {
  await connection();
  const headers = corsHeaders(request, "GET");
  const slug = (await params).slug.slice(0, 200);

  try {
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), isLivePost()))
      .limit(1);
    if (!post) return Response.json({ error: "Post not found" }, { status: 404, headers });

    const words = post.content.split(/\s+/).filter(Boolean).length;
    return Response.json(
      {
        post: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || post.seoDescription || "",
          contentHtml: await markdownToHtml(post.content),
          coverImageUrl: post.coverImageUrl,
          tags: post.tags,
          authorName: post.authorName,
          seoTitle: post.seoTitle || post.title,
          seoDescription: post.seoDescription || post.excerpt || "",
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          viewCount: post.viewCount,
          readingMinutes: Math.max(1, Math.round(words / 220)),
        },
      },
      { headers: { ...headers, "Cache-Control": PUBLIC_CACHE } },
    );
  } catch (error) {
    console.error("[public] failed to load a post:", error);
    return Response.json({ error: "Failed to load the post" }, { status: 500, headers });
  }
}
