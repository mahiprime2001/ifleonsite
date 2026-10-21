import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";

/**
 * POST /api/v1/posts/:id/view — increment the view count for a post.
 * No authentication required; called from the public blog when a post is viewed.
 */
export async function POST(request: Request, { params }: RouteContext<"/api/v1/posts/[id]/view">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    // Increment viewCount for published posts
    const result = await db
      .update(posts)
      .set({ viewCount: sql`${posts.viewCount} + 1` })
      .where(eq(posts.id, id))
      .returning({ id: posts.id, viewCount: posts.viewCount });

    if (!result.length) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json({ id: result[0].id, viewCount: result[0].viewCount });
  } catch (error) {
    console.error("Failed to increment view count:", error);
    return Response.json({ error: "Failed to track view" }, { status: 500 });
  }
}
