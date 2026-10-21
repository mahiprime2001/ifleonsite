import { and, desc, eq, gt, ilike, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import React, { Suspense } from "react";
import { db } from "@/db";
import { posts, type Post } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { archiveSelected, deleteSelected, republishSelected } from "./actions";

export const metadata: Metadata = { title: "Posts" };

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

function statusCondition(filter: StatusFilter): SQL | undefined {
  const now = sql`now()`;
  switch (filter) {
    case "draft":
    case "archived":
      return eq(posts.status, filter);
    case "published":
      return and(eq(posts.status, "published"), or(isNull(posts.publishedAt), lte(posts.publishedAt, now)));
    case "scheduled":
      return and(eq(posts.status, "published"), gt(posts.publishedAt, now));
    default:
      return undefined;
  }
}

export default function PostsPage({ searchParams }: PageProps<"/admin/posts">) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-title">Posts</h1>
        <Link href="/admin/posts/new" className="btn-primary">
          New post
        </Link>
      </div>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <PostsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PostsTable({ searchParams }: Pick<PageProps<"/admin/posts">, "searchParams">) {
  await requireAdmin();
  const params = await searchParams;
  const q = (typeof params.q === "string" ? params.q : "").trim().slice(0, 100);
  const requested = typeof params.status === "string" ? params.status : "all";
  const status: StatusFilter = STATUS_FILTERS.some((f) => f.value === requested)
    ? (requested as StatusFilter)
    : "all";
  const filtering = q !== "" || status !== "all";

  // Escape LIKE wildcards so a search for "100%" means the literal text.
  const pattern = `%${q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const where = and(
    isNull(posts.deletedAt),
    q ? or(ilike(posts.title, pattern), ilike(posts.slug, pattern), ilike(posts.excerpt, pattern)) : undefined,
    statusCondition(status),
  );

  const rows = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      source: posts.source,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      viewCount: posts.viewCount,
      rating: posts.rating,
      // Decided by the database clock, so rendering stays pure.
      isScheduled: sql<boolean>`${posts.status} = 'published' and ${posts.publishedAt} > now()`,
    })
    .from(posts)
    .where(where)
    .orderBy(desc(posts.updatedAt))
    .limit(200);

  const filters = (
    <form method="get" className="flex flex-wrap gap-2">
      <input
        type="search"
        name="q"
        defaultValue={q}
        placeholder="Search title, slug or excerpt…"
        className="input max-w-sm flex-1"
      />
      <select name="status" defaultValue={status} className="input w-auto">
        {STATUS_FILTERS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-secondary">
        Search
      </button>
      {filtering && (
        <Link href="/admin/posts" className="self-center text-sm text-muted hover:underline">
          Clear
        </Link>
      )}
    </form>
  );

  if (rows.length === 0) {
    return (
      <div className="space-y-4">
        {filters}
        <div className="card p-10 text-center">
          <p className="font-medium">{filtering ? "No posts match" : "No posts yet"}</p>
          <p className="mt-1 text-sm text-muted">
            {filtering
              ? "Try a different search or status."
              : "Write your first post, or import them from WordPress later."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filters}
      {filtering && (
        <p className="text-sm text-muted">
          {rows.length} {rows.length === 1 ? "post" : "posts"} found
        </p>
      )}
      <PostsTableContent rows={rows} />
    </div>
  );
}

type PostRow = Awaited<
  ReturnType<typeof db.select>
> extends Promise<Array<infer T>>
  ? T
  : never;

function PostsTableContent({
  rows,
}: {
  rows: Array<{
    id: number;
    title: string;
    slug: string;
    status: Post["status"];
    source: Post["source"];
    publishedAt: Date | null;
    updatedAt: Date;
    viewCount: number;
    rating: number | null;
    isScheduled: boolean;
  }>;
}) {
  "use client";

  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [actionInProgress, setActionInProgress] = React.useState<"archive" | "delete" | "republish" | null>(null);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map((r) => r.id)));
    }
  };

  const handleBulkAction = async (action: "archive" | "delete" | "republish") => {
    setActionInProgress(action);
    const formData = new FormData();
    Array.from(selected).forEach((id) => {
      formData.append("postId", String(id));
    });

    try {
      const actionFn = action === "archive" ? archiveSelected : action === "delete" ? deleteSelected : republishSelected;
      const result = await actionFn(formData);

      if (result.success) {
        setSelected(new Set());
        // Optionally show a success message
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <>
      {selected.size > 0 && (
        <div className="card bg-surface-2 p-4 flex items-center justify-between gap-4">
          <p className="text-sm font-medium">
            {selected.size} {selected.size === 1 ? "post" : "posts"} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("archive")}
              disabled={actionInProgress !== null}
              className="btn-secondary text-sm"
            >
              {actionInProgress === "archive" ? "Archiving..." : "Archive"}
            </button>
            <button
              onClick={() => handleBulkAction("republish")}
              disabled={actionInProgress !== null}
              className="btn-secondary text-sm"
            >
              {actionInProgress === "republish" ? "Publishing..." : "Republish"}
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              disabled={actionInProgress !== null}
              className="btn-secondary text-sm text-red-400"
            >
              {actionInProgress === "delete" ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium w-12">
                <input
                  type="checkbox"
                  checked={selected.size === rows.length && rows.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-line"
                />
              </th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Publish date</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((post) => (
              <tr key={post.id} className={selected.has(post.id) ? "bg-surface-2" : "hover:bg-surface-2"}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="rounded border-line"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${post.id}`} className="font-medium hover:underline">
                    {post.title}
                  </Link>
                  <p className="font-mono text-xs text-muted">/blog/{post.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} scheduled={post.isScheduled} />
                </td>
                <td className="px-4 py-3 capitalize text-muted">{post.source}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted text-xs">{post.viewCount}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  {post.rating === 1 && <span>👍</span>}
                  {post.rating === -1 && <span>👎</span>}
                  {post.rating === null && <span className="text-xs text-muted">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDateTime(post.publishedAt)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDateTime(post.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusBadge({ status, scheduled }: { status: Post["status"]; scheduled: boolean }) {
  const [label, tone] = scheduled
    ? ["Scheduled", "bg-amber-400/15 text-amber-300"]
    : status === "published"
      ? ["Published", "bg-accent-soft text-accent"]
      : status === "draft"
        ? ["Draft", "bg-surface-2 text-muted"]
        : ["Archived", "bg-surface-2 text-muted line-through"];
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{label}</span>;
}
