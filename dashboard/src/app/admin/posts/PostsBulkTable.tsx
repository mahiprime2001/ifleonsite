"use client";

import Link from "next/link";
import { useState } from "react";
import type { Post } from "@/db/schema";
import { archiveSelected, deleteSelected, republishSelected } from "./actions";

/* One row of the posts list. Dates arrive already formatted by the server, so both render the same text. */
export type PostListRow = {
  id: number;
  title: string;
  slug: string;
  status: Post["status"];
  source: Post["source"];
  viewCount: number;
  rating: number | null;
  isScheduled: boolean;
  publishedLabel: string;
  updatedLabel: string;
};

type BulkAction = "archive" | "delete" | "republish";

export function PostsBulkTable({ rows }: { rows: PostListRow[] }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [actionInProgress, setActionInProgress] = useState<BulkAction | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const toggleSelect = (id: number) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleSelectAll = () => setSelected(selected.size === rows.length ? new Set() : new Set(rows.map((r) => r.id)));

  async function handleBulkAction(action: BulkAction) {
    if (action === "delete" && !confirm(`Move ${selected.size} post(s) to Trash? You can restore them for 30 days.`)) return;
    setActionInProgress(action);
    setMessage(null);
    const formData = new FormData();
    for (const id of selected) formData.append("postId", String(id));

    try {
      const run = action === "archive" ? archiveSelected : action === "delete" ? deleteSelected : republishSelected;
      const result = await run(formData);
      if (result.success) {
        setSelected(new Set());
        const verb = action === "archive" ? "archived" : action === "delete" ? "moved to Trash" : "published";
        setMessage({ text: `${result.count} ${result.count === 1 ? "post" : "posts"} ${verb}.`, ok: true });
      } else {
        setMessage({ text: result.error ?? "Something went wrong.", ok: false });
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
      // The usual cause: the dashboard was redeployed after this page was opened, so the page's
      // server-action ids are stale. A reload fixes it.
      setMessage({
        text: "That didn't go through — the dashboard was probably updated since you opened this page. Reload the page (F5) and try again.",
        ok: false,
      });
    } finally {
      setActionInProgress(null);
    }
  }

  return (
    <>
      {selected.size > 0 && (
        <div className="card flex items-center justify-between gap-4 bg-surface-2 p-4">
          <p className="text-sm font-medium">
            {selected.size} {selected.size === 1 ? "post" : "posts"} selected
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => handleBulkAction("archive")} disabled={actionInProgress !== null} className="btn-secondary text-sm">
              {actionInProgress === "archive" ? "Archiving…" : "Archive"}
            </button>
            <button type="button" onClick={() => handleBulkAction("republish")} disabled={actionInProgress !== null} className="btn-secondary text-sm">
              {actionInProgress === "republish" ? "Publishing…" : "Publish"}
            </button>
            <button type="button" onClick={() => handleBulkAction("delete")} disabled={actionInProgress !== null} className="btn-danger text-sm">
              {actionInProgress === "delete" ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
      {message && (
        <p role="status" className={`text-sm ${message.ok ? "text-accent" : "text-danger"}`}>
          {message.text}
        </p>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="w-12 px-4 py-3 font-medium">
                <input
                  type="checkbox"
                  aria-label="Select all posts"
                  checked={selected.size === rows.length && rows.length > 0}
                  onChange={toggleSelectAll}
                  className="size-4 accent-green-600"
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
                    aria-label={`Select ${post.title}`}
                    checked={selected.has(post.id)}
                    onChange={() => toggleSelect(post.id)}
                    className="size-4 accent-green-600"
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
                <td className="px-4 py-3 text-xs whitespace-nowrap text-muted">{post.viewCount}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {post.rating === 1 && <span aria-label="Rated good">👍</span>}
                  {post.rating === -1 && <span aria-label="Rated bad">👎</span>}
                  {post.rating === null && <span className="text-xs text-muted">—</span>}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{post.publishedLabel}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted">{post.updatedLabel}</td>
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
