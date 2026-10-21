"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { generateDraft, type WriterState } from "./actions";

export function WriterForm({ disabled, disabledReason }: { disabled: boolean; disabledReason?: string }) {
  const [state, formAction, pending] = useActionState<WriterState, FormData>(generateDraft, undefined);
  // Controlled so the note survives a failed run (React 19 resets uncontrolled fields).
  const [hint, setHint] = useState("");

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <label className="block">
        <span className="label">Note for the writer (optional)</span>
        <textarea
          name="hint"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          rows={3}
          maxLength={1000}
          className="input mt-1"
          placeholder="Leave empty and the AI picks its own topic. Or nudge it, e.g. “a debugging story about a memory leak in Node.js”."
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending || disabled} className="btn-primary">
          {pending ? "Writing… (this can take a minute or two)" : "Write one post now"}
        </button>
        {disabled && disabledReason && <p className="text-sm text-amber-300">{disabledReason}</p>}
      </div>

      {state && !pending && state.ok && (
        <div className="rounded-lg border border-accent/40 bg-accent-soft p-4 text-sm">
          <p className="font-medium text-accent">
            {state.published ? "Published" : "Draft created"}: {state.title}
          </p>
          {state.topicReason && <p className="mt-1 text-muted">Why this topic: {state.topicReason}</p>}
          <p className="mt-1 text-xs text-muted">
            Written by {state.provider} · {state.model}
          </p>
          <Link href={`/admin/posts/${state.postId}`} className="btn-secondary mt-3">
            {state.published ? "Open the post" : "Review the draft"}
          </Link>
        </div>
      )}
      {state && !pending && !state.ok && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
