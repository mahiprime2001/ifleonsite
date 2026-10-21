"use client";

import { useActionState, useState } from "react";
import { createApiKey, type CreateKeyState } from "./actions";

export function CreateKeyForm() {
  const [state, formAction, pending] = useActionState<CreateKeyState, FormData>(createApiKey, undefined);
  // Controlled so a failed submit doesn't clear what was typed (React 19 resets uncontrolled fields).
  const [name, setName] = useState("");
  const [allowPublish, setAllowPublish] = useState(false);
  const [allowRead, setAllowRead] = useState(true);
  const [copied, setCopied] = useState(false);

  if (state?.key) {
    return (
      <div className="card space-y-3 border-accent p-5">
        <p className="font-medium">Key “{state.name}” created</p>
        <p className="text-sm text-amber-300">
          Copy it now. It won&apos;t be shown again; if you lose it, revoke it and create a new one.
        </p>
        <div className="flex gap-2">
          <code className="input flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap select-all">{state.key}</code>
          <button
            type="button"
            className="btn-primary"
            onClick={async () => {
              await navigator.clipboard.writeText(state.key!);
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button type="button" onClick={() => window.location.reload()} className="text-sm text-muted hover:underline">
          Done
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="card space-y-4 p-5">
      <p className="font-medium">New API key</p>
      <label className="block">
        <span className="label">Name</span>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={120}
          placeholder="e.g. AI writer"
          className="input mt-1"
        />
      </label>
      <fieldset className="space-y-2 text-sm">
        <legend className="label mb-1">Permissions</legend>
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" checked disabled className="size-4 accent-green-600" />
          Create draft posts (always on)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowRead"
            checked={allowRead}
            onChange={(e) => setAllowRead(e.target.checked)}
            className="size-4 accent-green-600"
          />
          Read posts
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowPublish"
            checked={allowPublish}
            onChange={(e) => setAllowPublish(e.target.checked)}
            className="size-4 accent-green-600"
          />
          Publish posts directly <span className="text-muted">(skips your review — leave off for AI writers)</span>
        </label>
      </fieldset>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Creating…" : "Create key"}
      </button>
    </form>
  );
}
