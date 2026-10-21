"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { autopilotStatus, startAutopilotAction, stopAutopilotAction, type AutopilotState } from "./actions";

type Status = Awaited<ReturnType<typeof autopilotStatus>>;

const POLL_MS = 4000;

export function AutopilotPanel({ initial, disabled, disabledReason }: { initial: Status; disabled: boolean; disabledReason?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initial);
  const [startState, startAction, starting] = useActionState<AutopilotState, FormData>(startAutopilotAction, undefined);
  // Controlled so a failed start keeps what was typed (React 19 resets uncontrolled fields).
  const [hint, setHint] = useState("");
  const [maxPosts, setMaxPosts] = useState("");
  const [stopping, setStopping] = useState(false);

  const job = status.job;
  const active = job?.status === "running" || job?.status === "stopping";
  const lastCount = useRef(job?.postsCreated ?? 0);

  // While a job is active, poll its progress; refresh the page when a new draft lands.
  useEffect(() => {
    if (!active && !starting) return;
    const timer = setInterval(async () => {
      const next = await autopilotStatus();
      setStatus(next);
      if ((next.job?.postsCreated ?? 0) !== lastCount.current) {
        lastCount.current = next.job?.postsCreated ?? 0;
        router.refresh();
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [active, starting, router]);

  // After Start, fetch the new job immediately rather than waiting for the first poll.
  useEffect(() => {
    if (starting) return;
    let alive = true;
    autopilotStatus().then((next) => alive && setStatus(next));
    return () => {
      alive = false;
    };
  }, [starting]);

  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium">Autopilot</p>
          <p className="text-sm text-muted">
            Keeps writing new posts one after another, with no time limit, until you stop it. When one model or API hits its
            limit it switches to the next automatically; if every quota is used up it pauses and carries on by itself once the
            quota resets. It runs on the server, so you can close this page.
          </p>
        </div>
        {active && (
          <span className="flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            {job?.status === "stopping" ? "Stopping…" : "Running"}
          </span>
        )}
      </div>

      {active && job ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Posts written" value={`${job.postsCreated}${job.maxPosts ? ` / ${job.maxPosts}` : ""}`} />
            <Stat label="Failed attempts" value={String(job.failures)} />
            <Stat label="Started" value={new Date(job.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />
          </div>
          {job.activity && <p className="text-sm">{job.activity}</p>}
          {status.cooldowns.length > 0 && (
            <ul className="space-y-0.5 text-xs text-amber-300">
              {status.cooldowns.map((c) => (
                <li key={c.name}>
                  {c.name}: {c.kind === "quota" ? "daily quota used up" : c.kind === "rate" ? "per-minute limit reached" : "error"} — paused{" "}
                  {c.secondsLeft >= 120 ? `${Math.round(c.secondsLeft / 60)} min` : `${c.secondsLeft}s`}
                </li>
              ))}
            </ul>
          )}
          {job.lastError && <p className="text-xs text-danger">Last error: {job.lastError}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-danger"
              disabled={stopping || job.status === "stopping"}
              onClick={async () => {
                setStopping(true);
                await stopAutopilotAction();
                setStatus(await autopilotStatus());
                setStopping(false);
              }}
            >
              {job.status === "stopping" ? "Stopping…" : "Stop autopilot"}
            </button>
            {job.lastPostId && (
              <Link href={`/admin/posts/${job.lastPostId}`} className="btn-secondary">
                Open latest post
              </Link>
            )}
          </div>
        </div>
      ) : (
        <form action={startAction} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
            <label className="block">
              <span className="label">Note for every post (optional)</span>
              <input
                name="hint"
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                maxLength={1000}
                placeholder="Empty = the AI chooses each topic"
                className="input mt-1"
              />
            </label>
            <label className="block">
              <span className="label">Stop after</span>
              <input
                name="maxPosts"
                type="number"
                min={1}
                max={1000}
                value={maxPosts}
                onChange={(e) => setMaxPosts(e.target.value)}
                placeholder="No limit"
                className="input mt-1"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={disabled || starting}>
              {starting ? "Starting…" : "Start autopilot"}
            </button>
            {disabled && disabledReason && <p className="text-sm text-amber-300">{disabledReason}</p>}
            {startState?.error && <p className="text-sm text-danger">{startState.error}</p>}
          </div>
          {job && job.stopReason && (
            <p className="text-xs text-muted">
              Last run ({new Date(job.startedAt).toLocaleString()}): {job.postsCreated} post{job.postsCreated === 1 ? "" : "s"} —{" "}
              {job.stopReason}
            </p>
          )}
        </form>
      )}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-2 px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
