import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { aiJobs } from "@/db/schema";
import { writeAiDraft } from "./writer";

/*
 * AI autopilot: writes posts one after another, in the background of this server process, with no
 * time limit. It runs until
 * - you press Stop,
 * - the optional post limit is reached, or
 * - several posts in a row fail with real errors (so a broken key can't loop forever).
 * Limits never stop it: per-minute limits are waited out by the provider layer, and when every
 * model's daily quota (or the dashboard's daily cap) is used up it pauses and retries until the
 * quota resets, then carries on.
 * The job's state lives in ai_jobs, so the page can show progress and a restart resumes the job.
 */

const MAX_FAILURES_IN_A_ROW = 5;
const PAUSE_BETWEEN_POSTS_MS = 5_000;
/* How long one post may wait for rate-limited providers before the job pauses. */
const MAX_WAIT_PER_POST_MS = 30 * 60_000;
/* When every quota is used up, check again this often (Gemini's daily quota resets at midnight Pacific). */
const QUOTA_RETRY_MS = 30 * 60_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* The loop running in this process, if any. Only one job runs at a time. */
let loopFor: number | null = null;

export type AutopilotJob = typeof aiJobs.$inferSelect;

export async function latestJob(): Promise<AutopilotJob | null> {
  const [job] = await db.select().from(aiJobs).orderBy(desc(aiJobs.id)).limit(1);
  return job ?? null;
}

async function update(id: number, values: Partial<AutopilotJob>) {
  await db.update(aiJobs).set({ ...values, updatedAt: new Date() }).where(eq(aiJobs.id, id));
}

async function finish(id: number, status: "stopped" | "finished" | "failed", stopReason: string) {
  await update(id, { status, stopReason, activity: null, endedAt: new Date() });
}

async function statusOf(id: number) {
  const [row] = await db.select({ status: aiJobs.status }).from(aiJobs).where(eq(aiJobs.id, id)).limit(1);
  return row?.status ?? "stopped";
}

export async function startAutopilot(hint: string | null, maxPosts: number | null) {
  const [active] = await db.select({ id: aiJobs.id }).from(aiJobs).where(inArray(aiJobs.status, ["running", "stopping"])).limit(1);
  if (active) return { ok: false as const, error: "Autopilot is already running." };

  const [job] = await db
    .insert(aiJobs)
    .values({ status: "running", hint, maxPosts, activity: "Starting…" })
    .returning({ id: aiJobs.id });
  launch(job.id);
  return { ok: true as const };
}

export async function stopAutopilot() {
  const [active] = await db.select().from(aiJobs).where(inArray(aiJobs.status, ["running", "stopping"])).limit(1);
  if (!active) return;
  if (loopFor === active.id) {
    // The loop notices within about a second (it checks between steps and while waiting).
    await update(active.id, { status: "stopping", activity: "Stopping…" });
  } else {
    await finish(active.id, "stopped", "Stopped by you.");
  }
}

/* Called once at server start: carry on with a job that was running before a restart. */
export async function resumeAutopilot() {
  const active = await db.select().from(aiJobs).where(inArray(aiJobs.status, ["running", "stopping"]));
  for (const job of active) {
    if (job.status === "stopping") await finish(job.id, "stopped", "Stopped by you.");
    else if (loopFor === null) {
      await update(job.id, { activity: "Resumed after a server restart" });
      launch(job.id);
    } else {
      await finish(job.id, "stopped", "Another autopilot job took over.");
    }
  }
}

function launch(id: number) {
  if (loopFor !== null) return;
  loopFor = id;
  run(id)
    .catch(async (error) => {
      const message = error instanceof Error ? error.message : String(error);
      await finish(id, "failed", `Crashed: ${message}`).catch(() => {});
    })
    .finally(() => {
      loopFor = null;
    });
}

async function run(id: number) {
  let failuresInARow = 0;
  const stopRequested = async () => (await statusOf(id)) !== "running";

  for (;;) {
    const [job] = await db.select().from(aiJobs).where(eq(aiJobs.id, id)).limit(1);
    if (!job || job.status !== "running") return job && finish(id, "stopped", "Stopped by you.");
    if (job.maxPosts && job.postsCreated >= job.maxPosts) {
      return finish(id, "finished", `Done: wrote the ${job.maxPosts} posts you asked for.`);
    }

    const number = job.postsCreated + 1;
    await update(id, { activity: `Writing draft ${number}…` });

    // Status updates from the provider layer (e.g. "Waiting 20s for gemini's limit"), at most every 2s.
    let lastWrite = 0;
    const onStatus = (message: string) => {
      const now = Date.now();
      if (now - lastWrite < 2000) return;
      lastWrite = now;
      void update(id, { activity: `Draft ${number}: ${message}` });
    };

    const result = await writeAiDraft(job.hint, { onStatus, maxWaitMs: MAX_WAIT_PER_POST_MS, shouldStop: stopRequested });

    if (result.ok) {
      failuresInARow = 0;
      await update(id, {
        postsCreated: job.postsCreated + 1,
        lastPostId: result.postId,
        lastError: null,
        activity: `Post ${number} ${result.published ? "published" : "saved as a draft"}: “${result.title}”`,
      });
    } else if (result.reason === "stopped") {
      return finish(id, "stopped", "Stopped by you.");
    } else if (result.reason === "quota" || result.reason === "limit" || result.reason === "rate") {
      // Out of quota (or still rate limited after a long wait): pause, then try again. Not a failure.
      const resumeAt = new Date(Date.now() + QUOTA_RETRY_MS).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: process.env.DISPLAY_TIMEZONE || "Asia/Kolkata",
      });
      const why =
        result.reason === "quota"
          ? "Every model's daily quota is used up"
          : result.reason === "limit"
            ? "The dashboard's daily limit is reached"
            : "All models are still rate limited";
      await update(id, { lastError: result.error, activity: `Paused: ${why}. Trying again at ${resumeAt}.` });
      for (let waited = 0; waited < QUOTA_RETRY_MS; waited += 5000) {
        if (await stopRequested()) break;
        await sleep(5000);
      }
      continue;
    } else {
      failuresInARow += 1;
      await update(id, { failures: job.failures + 1, lastError: result.error, activity: `Draft ${number} failed; trying again` });
      if (failuresInARow >= MAX_FAILURES_IN_A_ROW) {
        return finish(id, "failed", `Stopped after ${MAX_FAILURES_IN_A_ROW} failed posts in a row. Last error: ${result.error}`);
      }
    }

    // A short breather between drafts, ending early if Stop is pressed.
    for (let waited = 0; waited < PAUSE_BETWEEN_POSTS_MS; waited += 1000) {
      if (await stopRequested()) break;
      await sleep(1000);
    }
  }
}
