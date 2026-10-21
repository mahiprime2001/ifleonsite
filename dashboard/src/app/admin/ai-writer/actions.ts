"use server";

import { refresh, revalidateTag } from "next/cache";
import { latestJob, startAutopilot, stopAutopilot } from "@/lib/ai/autopilot";
import { providerCooldowns } from "@/lib/ai/providers";
import { writeAiDraft, type WriteResult } from "@/lib/ai/writer";
import { requireAdmin } from "@/lib/auth";

export type WriterState = WriteResult | undefined;

export async function generateDraft(_prev: WriterState, formData: FormData): Promise<WriterState> {
  await requireAdmin();
  const hint = String(formData.get("hint") ?? "").trim().slice(0, 1000) || null;
  const result = await writeAiDraft(hint);
  if (result.ok) revalidateTag("posts", "max");
  refresh(); // updates the run history and daily counter
  return result;
}

export type AutopilotState = { error?: string } | undefined;

export async function startAutopilotAction(_prev: AutopilotState, formData: FormData): Promise<AutopilotState> {
  await requireAdmin();
  const hint = String(formData.get("hint") ?? "").trim().slice(0, 1000) || null;
  const max = Number(formData.get("maxPosts") || 0);
  const maxPosts = Number.isInteger(max) && max > 0 ? Math.min(max, 1000) : null;
  const result = await startAutopilot(hint, maxPosts);
  refresh();
  return result.ok ? {} : { error: result.error };
}

export async function stopAutopilotAction() {
  await requireAdmin();
  await stopAutopilot();
  refresh();
}

/* Polled by the page every few seconds while the autopilot runs. */
export async function autopilotStatus() {
  await requireAdmin();
  const job = await latestJob();
  return {
    job: job && {
      id: job.id,
      status: job.status,
      postsCreated: job.postsCreated,
      failures: job.failures,
      maxPosts: job.maxPosts,
      activity: job.activity,
      lastPostId: job.lastPostId,
      lastError: job.lastError,
      stopReason: job.stopReason,
      startedAt: job.startedAt.toISOString(),
      endedAt: job.endedAt?.toISOString() ?? null,
    },
    cooldowns: providerCooldowns().map((c) => ({ name: c.name, kind: c.kind, secondsLeft: Math.ceil((c.until - Date.now()) / 1000) })),
  };
}
