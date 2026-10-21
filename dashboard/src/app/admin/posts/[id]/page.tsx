import { and, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { autosavePost, deletePost, updatePost } from "../actions";
import { DeleteButton } from "../DeleteButton";
import { PostForm } from "../PostForm";
import { RatingButtons } from "../RatingButtons";

export const metadata: Metadata = { title: "Edit post" };

export default function EditPostPage({ params }: PageProps<"/admin/posts/[id]">) {
  return (
    <div className="space-y-6">
      <Link href="/admin/posts" className="text-sm text-muted hover:underline">
        ← Posts
      </Link>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <EditPost params={params} />
      </Suspense>
    </div>
  );
}

async function EditPost({ params }: Pick<PageProps<"/admin/posts/[id]">, "params">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, id), isNull(posts.deletedAt)))
    .limit(1);
  if (!post) notFound();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="page-title">{post.title}</h1>
          <p className="mt-1 text-sm text-muted">
            Created {formatDateTime(post.createdAt)} · Updated {formatDateTime(post.updatedAt)} · Source:{" "}
            <span className="capitalize">{post.source}</span>
          </p>
        </div>
        <DeleteButton
          action={deletePost.bind(null, post.id)}
          confirmMessage="Move this post to Trash? It leaves the website now, and you can restore it for 30 days."
        />
      </div>
      <div className="card p-4">
        <RatingButtons postId={post.id} initialRating={post.rating} />
      </div>
      {/* key resets the form state when navigating between posts */}
      <PostForm
        key={post.id}
        action={updatePost.bind(null, post.id)}
        autosave={autosavePost.bind(null, post.id)}
        submitLabel="Save changes"
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          coverImageUrl: post.coverImageUrl ?? "",
          tags: post.tags.join(", "),
          status: post.status,
          publishedAt: post.publishedAt?.toISOString() ?? "",
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
        }}
      />
    </>
  );
}
