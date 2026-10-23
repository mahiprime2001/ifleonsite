import { and, eq, isNull, sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/Markdown";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { deletePost } from "../actions";
import { DeleteButton } from "../DeleteButton";
import { RatingButtons } from "../RatingButtons";

export const metadata: Metadata = { title: "Post preview" };

/* Read-only preview of a post, rendered the way readers will see it. Editing is one click away. */
export default function PostPreviewPage({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="text-sm text-muted hover:underline">
        ← Posts
      </Link>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <Preview params={params} />
      </Suspense>
    </div>
  );
}

async function Preview({ params }: Pick<PageProps<"/admin/posts/[id]">, "params">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImageUrl: posts.coverImageUrl,
      tags: posts.tags,
      status: posts.status,
      source: posts.source,
      seoTitle: posts.seoTitle,
      seoDescription: posts.seoDescription,
      authorName: posts.authorName,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      viewCount: posts.viewCount,
      rating: posts.rating,
      // Decided by the database clock, so rendering stays pure.
      isScheduled: sql<boolean>`${posts.status} = 'published' and ${posts.publishedAt} > now()`,
    })
    .from(posts)
    .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
    .limit(1);
  if (!post) notFound();

  const statusLabel = post.isScheduled ? "Scheduled" : post.status === "published" ? "Published" : post.status === "draft" ? "Draft" : "Archived";
  const statusTone =
    post.isScheduled
      ? "bg-amber-400/15 text-amber-300"
      : post.status === "published"
        ? "bg-accent-soft text-accent"
        : "bg-surface-2 text-muted";
  const words = post.content.trim() ? post.content.trim().split(/\s+/).length : 0;
  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.seoDescription || post.excerpt || "";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <article className="min-w-0 space-y-6">
        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusTone}`}>{statusLabel}</span>
          <span className="text-xs text-muted capitalize">Source: {post.source}</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link href={`/admin/posts/${post.id}/edit`} className="btn-primary">
              ✎ Edit post
            </Link>
            <DeleteButton
              action={deletePost.bind(null, post.id)}
              confirmMessage="Move this post to Trash? It leaves the website now, and you can restore it for 30 days."
            />
          </div>
        </div>

        {/* The post, as readers see it */}
        <div className="card overflow-hidden">
          {post.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- cover can be on any host
            <img src={post.coverImageUrl} alt="" className="max-h-80 w-full object-cover" />
          )}
          <div className="space-y-4 p-6 md:p-10">
            <h1 className="font-serif text-3xl font-medium leading-tight md:text-4xl">{post.title}</h1>
            <p className="text-sm text-muted">
              {post.authorName} · {post.publishedAt ? formatDateTime(post.publishedAt) : "Not published yet"} · {Math.max(1, Math.round(words / 220))} min read
            </p>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {post.excerpt && <p className="text-lg leading-relaxed text-muted">{post.excerpt}</p>}
            <div className="prose prose-invert prose-headings:font-serif max-w-none">
              {post.content.trim() ? <Markdown>{post.content}</Markdown> : <p className="text-muted">This post has no content yet.</p>}
            </div>
          </div>
        </div>
      </article>

      {/* Side panel: details, feedback, search preview */}
      <aside className="space-y-4">
        <div className="card space-y-2 p-4 text-sm">
          <p className="font-medium">Details</p>
          <p className="text-muted">
            URL: <code className="font-mono text-xs">/blog/{post.slug}</code>
          </p>
          <p className="text-muted">Views: {post.viewCount}</p>
          <p className="text-muted">Words: {words.toLocaleString("en-IN")}</p>
          <p className="text-muted">Last updated: {formatDateTime(post.updatedAt)}</p>
        </div>

        <div className="card p-4">
          <RatingButtons postId={post.id} initialRating={post.rating} />
        </div>

        <div className="card space-y-1 p-4">
          <p className="text-sm font-medium">Google search preview</p>
          <p className="truncate text-xs text-muted">ifleon.com › blog › {post.slug}</p>
          <p className="text-base leading-snug text-[#8ab4f8]">{seoTitle.length > 60 ? `${seoTitle.slice(0, 60)}…` : seoTitle}</p>
          <p className="text-xs leading-relaxed text-muted">
            {seoDescription ? (seoDescription.length > 160 ? `${seoDescription.slice(0, 160)}…` : seoDescription) : "No description — add an SEO description or excerpt."}
          </p>
        </div>

        <Link href={`/admin/posts/${post.id}/edit`} className="btn-secondary w-full">
          ✎ Edit post
        </Link>
      </aside>
    </div>
  );
}
