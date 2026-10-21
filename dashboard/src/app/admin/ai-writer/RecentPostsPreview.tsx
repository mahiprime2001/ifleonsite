import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { formatDateTime } from "@/lib/format";

export async function RecentPostsPreview() {
  const aiPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.source, "ai"))
    .orderBy(desc(posts.createdAt))
    .limit(6);

  if (aiPosts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-2">
      <p className="text-sm font-medium">Recent AI posts</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {aiPosts.map((post) => (
          <Link
            key={post.id}
            href={`/admin/posts/${post.id}`}
            className="group card overflow-hidden p-4 transition-colors hover:bg-surface-2"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-medium text-sm leading-tight group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              <StatusBadge status={post.status} />
            </div>

            {post.excerpt && (
              <p className="text-xs text-muted mb-3 line-clamp-2">
                {post.excerpt}
              </p>
            )}

            {!post.excerpt && post.content && (
              <p className="text-xs text-muted mb-3 line-clamp-2">
                {post.content.replace(/<[^>]*>/g, "").slice(0, 150)}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-mono">/blog/{post.slug}</span>
              <span>·</span>
              <span>{post.viewCount} {post.viewCount === 1 ? "view" : "views"}</span>
              <span>·</span>
              <time dateTime={post.createdAt.toISOString()}>
                {formatDateTime(post.createdAt)}
              </time>
            </div>

            {post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-xs text-muted">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors =
    status === "published"
      ? "bg-accent-soft text-accent"
      : status === "draft"
        ? "bg-surface-2 text-muted"
        : "bg-surface-2 text-muted";

  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
