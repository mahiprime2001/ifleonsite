import { desc } from "drizzle-orm";
import type { Metadata } from "next";
import { Suspense } from "react";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { SCOPES, type Scope } from "@/lib/api-keys";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { DeleteButton } from "../posts/DeleteButton";
import { revokeApiKey } from "./actions";
import { CreateKeyForm } from "./CreateKeyForm";

export const metadata: Metadata = { title: "API keys" };

const EXAMPLE = `curl -X POST https://dashboard.ifleon.com/api/v1/posts \\
  -H "Authorization: Bearer ifl_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My post title",
    "content": "## Hello\\n\\nWritten in **Markdown**.",
    "excerpt": "One-line summary",
    "tags": ["devops", "ai"]
  }'`;

export default function ApiKeysPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">API keys</h1>
        <p className="mt-1 text-sm text-muted">
          Let scripts and AI tools create posts through the API. New posts arrive as drafts for you to review.
        </p>
      </div>

      <Suspense fallback={<div className="card h-56 animate-pulse" />}>
        <Keys />
      </Suspense>

      <section className="card space-y-3 p-5">
        <p className="font-medium">How to use it</p>
        <pre className="overflow-x-auto rounded-lg bg-background p-4 font-mono text-xs leading-relaxed">{EXAMPLE}</pre>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
          <li>
            <code>POST /api/v1/posts</code> — required: <code>title</code>. Optional: <code>content</code> (Markdown),{" "}
            <code>slug</code>, <code>excerpt</code>, <code>tags</code>, <code>coverImageUrl</code>, <code>seoTitle</code>,{" "}
            <code>seoDescription</code>, <code>source</code> (<code>&quot;ai&quot;</code> or <code>&quot;manual&quot;</code>).
          </li>
          <li>
            <code>status</code> defaults to <code>&quot;draft&quot;</code>. <code>&quot;published&quot;</code> (with an optional
            future <code>publishedAt</code> to schedule) needs a key with publishing allowed.
          </li>
          <li>Without a slug, one is made from the title and kept unique automatically.</li>
          <li>
            <code>GET /api/v1/posts/:id</code> reads a post back (needs “Read posts”). Limit: 60 requests per minute per key.
          </li>
        </ul>
      </section>
    </div>
  );
}

async function Keys() {
  await requireAdmin();
  const rows = await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));

  return (
    <div className="space-y-6">
      <CreateKeyForm />
      {rows.length > 0 && (
        <ul className="card divide-y divide-line">
          {rows.map((key) => (
            <li key={key.id} className={`flex flex-wrap items-center gap-4 p-4 ${key.revokedAt ? "opacity-50" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {key.name}{" "}
                  <code className="ml-1 font-mono text-xs text-muted">{key.prefix}…</code>
                  {key.revokedAt && <span className="ml-2 text-xs text-danger">Revoked</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  {key.scopes.map((scope) => (
                    <span key={scope} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">
                      {SCOPES[scope as Scope] ?? scope}
                    </span>
                  ))}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Created {formatDateTime(key.createdAt)} · Last used{" "}
                  {key.lastUsedAt ? formatDateTime(key.lastUsedAt) : "never"}
                  {key.revokedAt && ` · Revoked ${formatDateTime(key.revokedAt)}`}
                </p>
              </div>
              {!key.revokedAt && (
                <DeleteButton
                  action={revokeApiKey.bind(null, key.id)}
                  label="Revoke"
                  confirmMessage={`Revoke “${key.name}”? Anything using it will stop working immediately.`}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
