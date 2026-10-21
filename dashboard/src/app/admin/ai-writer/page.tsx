import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { db } from "@/db";
import { aiRuns, posts } from "@/db/schema";
import { getAiConfig } from "@/lib/ai/config";
import { aiRunsInLast24h } from "@/lib/ai/writer";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { autopilotStatus } from "./actions";
import { ApiUsageChartContainer } from "./ApiUsageChartContainer";
import { AutopilotPanel } from "./AutopilotPanel";
import { RecentPostsPreview } from "./RecentPostsPreview";
import { TopicsCoverageMapContainer } from "./TopicsCoverageMapContainer";
import { WriterForm } from "./WriterForm";

export const metadata: Metadata = { title: "AI writer" };

export default function AiWriterPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">AI writer</h1>
        <p className="mt-1 text-sm text-muted">
          The AI chooses a fresh topic — projects, debugging stories, DevOps, cloud, AI, security — avoiding everything
          already written. Whether posts go live immediately or wait as drafts is set on the Settings page.
        </p>
      </div>
      <Suspense fallback={<div className="card h-72 animate-pulse" />}>
        <Writer />
      </Suspense>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  success: "bg-accent-soft text-accent",
  duplicate: "bg-amber-400/15 text-amber-300",
  error: "bg-red-500/15 text-danger",
};

async function getWellRatedPosts() {
  return db
    .select({ id: posts.id, title: posts.title, tags: posts.tags })
    .from(posts)
    .where(eq(posts.rating, 1))
    .orderBy(desc(posts.createdAt))
    .limit(10);
}

async function Writer() {
  await requireAdmin();
  await connection(); // provider settings can fall back to env, read at request time
  const [config, used, runs, wellRatedPosts] = await Promise.all([
    getAiConfig(),
    aiRunsInLast24h(),
    db.select().from(aiRuns).orderBy(desc(aiRuns.createdAt)).limit(20),
    getWellRatedPosts(),
  ]);
  const providers = config.providers.map((p) => ({
    name: p.name,
    label: p.label,
    model: p.model,
    ready: p.enabled && Boolean(p.apiKey),
    note: !p.enabled ? "turned off" : p.apiKey ? null : "no API key",
  }));
  const ready = providers.some((p) => p.ready);
  const DAILY_LIMIT = config.dailyLimit;
  const limitReached = DAILY_LIMIT > 0 && used >= DAILY_LIMIT;
  const autopilot = await autopilotStatus();
  const disabledReason = !ready
    ? "Add an API key on the Settings page to enable the writer."
    : limitReached
      ? "Daily limit reached. Raise it (or set 0 for no cap) in Settings."
      : undefined;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Providers (tried in this order)</p>
            <Link href="/admin/settings" className="text-xs text-accent hover:underline">
              Change in Settings
            </Link>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {providers.map((p, i) => (
              <li key={p.name} className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${p.ready ? "bg-accent" : "bg-surface-2"}`} />
                <span>
                  {i + 1}. {p.label}
                </span>
                <span className="font-mono text-xs text-muted">{p.model}</span>
                {p.note && <span className="text-xs text-amber-300">{p.note}</span>}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium">Usage</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {used}{" "}
            <span className="text-base font-normal text-muted">
              {DAILY_LIMIT > 0 ? `/ ${DAILY_LIMIT} runs in the last 24 hours` : "runs in the last 24 hours (no daily cap)"}
            </span>
          </p>
        </div>
      </div>

      <AutopilotPanel initial={autopilot} disabled={!ready || limitReached} disabledReason={disabledReason} />

      <WriterForm disabled={!ready || limitReached} disabledReason={disabledReason} />

      <section className="space-y-2">
        <p className="text-sm font-medium">API usage (24h)</p>
        <Suspense fallback={<div className="card h-96 animate-pulse" />}>
          <ApiUsageChartContainer />
        </Suspense>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium">Topics coverage</p>
        <Suspense fallback={<div className="card h-96 animate-pulse" />}>
          <TopicsCoverageMapContainer />
        </Suspense>
      </section>

      <Suspense fallback={<div className="card h-32 animate-pulse" />}>
        <RecentPostsPreview />
      </Suspense>

      {wellRatedPosts.length > 0 && (
        <section className="space-y-2">
          <p className="text-sm font-medium">Well-rated topics (👍)</p>
          <div className="card p-4">
            <p className="text-sm text-muted mb-2">
              The AI will prioritize these topics when generating new posts. Topics readers particularly enjoyed:
            </p>
            <div className="flex flex-wrap gap-2">
              {wellRatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/posts/${p.id}`}
                  className="inline-block rounded-full bg-accent-soft px-3 py-1 text-xs text-accent hover:underline"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {runs.length > 0 && (
        <section className="space-y-2">
          <p className="text-sm font-medium">Recent runs</p>
          <ul className="card divide-y divide-line">
            {runs.map((run) => (
              <li key={run.id} className="flex flex-wrap items-start gap-3 p-4 text-sm">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[run.status] ?? ""}`}>
                  {run.status}
                  {run.retryCount > 0 && ` (${run.retryCount} ${run.retryCount === 1 ? "retry" : "retries"})`}
                </span>
                <div className="min-w-0 flex-1">
                  {run.postId && run.title ? (
                    <Link href={`/admin/posts/${run.postId}`} className="font-medium hover:underline">
                      {run.title}
                    </Link>
                  ) : (
                    <p className="text-danger">{run.error}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted">
                    {formatDateTime(run.createdAt)}
                    {run.provider && ` · ${run.provider} ${run.model ?? ""}`}
                    {run.inputTokens != null && ` · ${run.inputTokens.toLocaleString("en-IN")} in / ${(run.outputTokens ?? 0).toLocaleString("en-IN")} out tokens`}
                    {run.durationMs != null && ` · ${Math.round(run.durationMs / 1000)}s`}
                  </p>
                  {run.hint && <p className="mt-0.5 text-xs text-muted">Note: {run.hint}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
