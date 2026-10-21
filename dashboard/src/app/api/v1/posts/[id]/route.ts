import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { authenticate, jsonError } from "@/lib/api-keys";

/* GET /api/v1/posts/:id — read one post. Requires an API key with "posts:read". */
export async function GET(request: Request, { params }: RouteContext<"/api/v1/posts/[id]">) {
  const auth = await authenticate(request, "posts:read");
  if (!auth.ok) return auth.response;

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return jsonError(404, "Post not found.");

  const [post] = await db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      tags: posts.tags,
      coverImageUrl: posts.coverImageUrl,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      status: posts.status,
      source: posts.source,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
    })
    .from(posts)
    .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
    .limit(1);
  if (!post) return jsonError(404, "Post not found.");

  return Response.json(post);
}
