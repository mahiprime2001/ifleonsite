import { and, desc, eq, gt, ilike, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { PostsBulkTable } from "./PostsBulkTable";

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
      {/* The selectable table is a client component; dates are formatted here so server and browser match. */}
      <PostsBulkTable
        rows={rows.map(({ publishedAt, updatedAt, ...row }) => ({
          ...row,
          publishedLabel: formatDateTime(publishedAt),
          updatedLabel: formatDateTime(updatedAt),
        }))}
      />
    </div>
  );
}
