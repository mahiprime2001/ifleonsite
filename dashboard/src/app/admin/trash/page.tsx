import { type AnyColumn, desc, isNotNull, sql } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/db";
import { contactMessages, posts, testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { TRASH_DAYS, type TrashKind } from "@/lib/trash";
import { DeleteButton } from "../posts/DeleteButton";
import { deleteForever, emptyTrash, restoreItem } from "./actions";

export const metadata: Metadata = { title: "Trash" };

type TrashRow = { kind: TrashKind; id: number; label: string; detail: string | null; deletedAt: Date; daysLeft: number };

const KIND_LABEL: Record<TrashKind, string> = { post: "Post", testimonial: "Testimonial", message: "Message" };

export default function TrashPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">Trash</h1>
        <p className="mt-1 text-sm text-muted">
          Deleted posts, testimonials and messages stay here for {TRASH_DAYS} days, then they&apos;re removed for good.
        </p>
      </div>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <TrashList />
      </Suspense>
    </div>
  );
}

/* Whole days until the purge, computed by the database clock so rendering stays pure. */
function daysLeft(deletedAt: AnyColumn) {
  return sql<number>`greatest(0, ceil(extract(epoch from (${deletedAt} + make_interval(days => ${TRASH_DAYS}) - now())) / 86400))::int`;
}

async function TrashList() {
  await requireAdmin();
  const [postRows, testimonialRows, messageRows] = await Promise.all([
    db
      .select({ id: posts.id, label: posts.title, detail: posts.slug, deletedAt: posts.deletedAt, daysLeft: daysLeft(posts.deletedAt) })
      .from(posts)
      .where(isNotNull(posts.deletedAt)),
    db
      .select({
        id: testimonials.id,
        label: testimonials.name,
        detail: testimonials.company,
        deletedAt: testimonials.deletedAt,
        daysLeft: daysLeft(testimonials.deletedAt),
      })
      .from(testimonials)
      .where(isNotNull(testimonials.deletedAt)),
    db
      .select({
        id: contactMessages.id,
        label: contactMessages.subject,
        detail: contactMessages.email,
        deletedAt: contactMessages.deletedAt,
        daysLeft: daysLeft(contactMessages.deletedAt),
      })
      .from(contactMessages)
      .where(isNotNull(contactMessages.deletedAt))
      .orderBy(desc(contactMessages.deletedAt)),
  ]);

  const rows: TrashRow[] = [
    ...postRows.map((r) => ({ ...r, kind: "post" as const })),
    ...testimonialRows.map((r) => ({ ...r, kind: "testimonial" as const })),
    ...messageRows.map((r) => ({ ...r, label: r.label || "(no subject)", kind: "message" as const })),
  ]
    .map((r) => ({ ...r, deletedAt: r.deletedAt! }))
    .sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());

  if (rows.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-medium">Trash is empty</p>
        <p className="mt-1 text-sm text-muted">Things you delete will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">
          {rows.length} {rows.length === 1 ? "item" : "items"}
        </p>
        <DeleteButton
          action={emptyTrash}
          label="Empty trash"
          confirmMessage={`Permanently delete all ${rows.length} item(s) in Trash? This can't be undone.`}
        />
      </div>
      <ul className="card divide-y divide-line">
        {rows.map((r) => (
          <li key={`${r.kind}-${r.id}`} className="flex flex-wrap items-center gap-4 p-4">
            <span className="w-24 shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-center text-xs text-muted">
              {KIND_LABEL[r.kind]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.label}</p>
              <p className="text-xs text-muted">
                {r.detail && <>{r.detail} · </>}
                Deleted {formatDateTime(r.deletedAt)} ·{" "}
                <span className={r.daysLeft <= 3 ? "text-amber-300" : ""}>
                  {r.daysLeft === 0 ? "removed at the next clean-up" : `removed in ${r.daysLeft} day${r.daysLeft === 1 ? "" : "s"}`}
                </span>
              </p>
            </div>
            <form action={restoreItem.bind(null, r.kind, r.id)}>
              <button type="submit" className="btn-secondary">
                Restore
              </button>
            </form>
            <DeleteButton
              action={deleteForever.bind(null, r.kind, r.id)}
              label="Delete forever"
              confirmMessage={`Permanently delete “${r.label}”? This can't be undone.`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
