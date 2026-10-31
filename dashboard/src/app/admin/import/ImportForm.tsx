"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { runImport, type ImportState } from "./actions";

export function ImportForm() {
  const [state, formAction, pending] = useActionState<ImportState, FormData>(runImport, undefined);
  // Controlled so the choices survive a failed run (React 19 resets uncontrolled fields).
  const [choice, setChoice] = useState({ posts: true, testimonials: true, update: false });
  const toggle = (key: keyof typeof choice) => setChoice((c) => ({ ...c, [key]: !c[key] }));
  const report = state?.report;

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <fieldset className="space-y-2 text-sm">
        <legend className="label mb-1">What to import</legend>
        {(
          [
            ["posts", "Blog posts (with their images, tags and SEO fields)"],
            ["testimonials", "Testimonials"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2">
            <input type="checkbox" name={key} checked={choice[key]} onChange={() => toggle(key)} className="size-4 accent-green-600" />
            {label}
          </label>
        ))}
        <label className="flex items-start gap-2 pt-2">
          <input type="checkbox" name="update" checked={choice.update} onChange={() => toggle("update")} className="mt-0.5 size-4 accent-green-600" />
          <span>
            Update items that were already imported
            <span className="block text-xs text-muted">
              Off: already-imported items are skipped, so your edits here are kept. On: they&apos;re overwritten with the WordPress version.
            </span>
          </span>
        </label>
      </fieldset>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Importing… (downloading posts and images, about a minute)" : "Import from WordPress"}
      </button>

      {state?.error && !pending && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}

      {report && !pending && (
        <div className="space-y-2 rounded-lg border border-line bg-surface-2 p-4 text-sm">
          <p className="font-medium text-accent">Import finished</p>
          <p>
            <b>Posts:</b> {report.posts.found} found on WordPress — {report.posts.created} imported, {report.posts.updated} updated,{" "}
            {report.posts.skipped} already here.
          </p>
          <p>
            <b>Testimonials:</b> {report.testimonials.found} found — {report.testimonials.created} imported, {report.testimonials.updated} updated,{" "}
            {report.testimonials.skipped} already here.
          </p>
          <p>
            <b>Images:</b> {report.images.downloaded} downloaded to the VPS
            {report.images.failed.length > 0 && `, ${report.images.failed.length} kept as original links`}.
          </p>
          {[...report.notes, ...report.posts.failed, ...report.testimonials.failed, ...report.images.failed].length > 0 && (
            <ul className="list-disc space-y-0.5 pl-5 text-xs text-muted">
              {report.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              {[...report.posts.failed, ...report.testimonials.failed].map((f) => (
                <li key={f} className="text-danger">
                  Failed: {f}
                </li>
              ))}
              {report.images.failed.map((f) => (
                <li key={f} className="text-amber-300">
                  Image not downloaded: {f}
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-3 pt-1">
            <Link href="/admin/posts" className="btn-secondary text-xs">
              View posts
            </Link>
            <Link href="/admin/testimonials" className="btn-secondary text-xs">
              View testimonials
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
