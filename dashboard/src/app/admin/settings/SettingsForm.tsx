"use client";

import { useActionState, useEffect, useState } from "react";
import { fetchModels, runProviderTest, saveSettings, type SaveSettingsState } from "./actions";

/* What the page passes in. Never contains a key, only a hint like "…a1b2". */
export type ProviderView = {
  name: "gemini" | "nvidia";
  label: string;
  keyUrl: string;
  enabled: boolean;
  model: string;
  backupModels: string[];
  rpm: number;
  keySource: "dashboard" | "env" | null;
  keyHint: string | null;
  keyUnreadable: boolean;
};

type ProviderState = Omit<ProviderView, "rpm"> & { rpm: string; newKey: string; removeKey: boolean };

type ModelList = { status: "idle" | "loading" | "ready" | "error"; models: string[]; error?: string };
type TestResult = { status: "idle" | "running" | "ok" | "error"; text?: string; startedAt?: number };

const CUSTOM = "__custom__";

export function SettingsForm({
  providers: initial,
  dailyLimit: initialLimit,
  autoPublish: initialAutoPublish,
}: {
  providers: ProviderView[];
  dailyLimit: number;
  autoPublish: boolean;
}) {
  const [state, formAction, pending] = useActionState<SaveSettingsState, FormData>(saveSettings, undefined);
  const [providers, setProviders] = useState<ProviderState[]>(() =>
    initial.map((p) => ({ ...p, rpm: String(p.rpm), newKey: "", removeKey: false })),
  );
  const [dailyLimit, setDailyLimit] = useState(String(initialLimit));
  const [autoPublish, setAutoPublish] = useState(initialAutoPublish);
  // Providers with a saved key start out loading their model list.
  const [models, setModels] = useState<Record<string, ModelList>>(() =>
    Object.fromEntries(initial.map((p) => [p.name, { status: p.keyHint ? "loading" : "idle", models: [] }])),
  );
  const [tests, setTests] = useState<Record<string, TestResult>>({});
  const [custom, setCustom] = useState<Record<string, boolean>>({});

  const update = (name: string, patch: Partial<ProviderState>) =>
    setProviders((list) => list.map((p) => (p.name === name ? { ...p, ...patch } : p)));

  const toList = (result: Awaited<ReturnType<typeof fetchModels>>): ModelList =>
    result.ok ? { status: "ready", models: result.models } : { status: "error", models: [], error: result.error };

  async function loadModels(name: string, typedKey?: string) {
    setModels((m) => ({ ...m, [name]: { status: "loading", models: m[name]?.models ?? [] } }));
    const result = await fetchModels(name, typedKey || undefined);
    setModels((m) => ({ ...m, [name]: toList(result) }));
  }

  // Providers with a saved key already start in the "loading" state; fetch their lists once.
  useEffect(() => {
    let active = true;
    for (const p of initial) {
      if (!p.keyHint) continue;
      fetchModels(p.name).then((result) => {
        if (active) setModels((m) => ({ ...m, [p.name]: toList(result) }));
      });
    }
    return () => {
      active = false;
    };
    // Runs once on mount; later loads are triggered by the "Load models" button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function test(p: ProviderState) {
    setTests((t) => ({ ...t, [p.name]: { status: "running", startedAt: Date.now() } }));
    const result = await runProviderTest(p.name, p.model, p.newKey || undefined);
    const seconds = (result.ms / 1000).toFixed(1);
    setTests((t) => ({
      ...t,
      [p.name]: result.ok
        ? { status: "ok", text: `Works — answered in ${seconds}s. Reply: “${result.reply}”` }
        : { status: "error", text: `${result.error} (after ${seconds}s)` },
    }));
  }

  // While any test runs, tick once a second so the button can show how long it has waited.
  const [now, setNow] = useState(0);
  const anyRunning = Object.values(tests).some((t) => t.status === "running");
  useEffect(() => {
    if (!anyRunning) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [anyRunning]);
  const waited = (t?: TestResult) => (t?.startedAt && now > t.startedAt ? Math.floor((now - t.startedAt) / 1000) : 0);

  /* Backup models: tried in order after the main model runs out of quota. */
  function setBackups(name: string, change: (list: string[]) => string[]) {
    setProviders((list) => list.map((p) => (p.name === name ? { ...p, backupModels: change(p.backupModels) } : p)));
  }
  function moveBackup(name: string, index: number, delta: number) {
    setBackups(name, (list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  const [typedBackup, setTypedBackup] = useState<Record<string, string>>({});

  function move(index: number, delta: number) {
    setProviders((list) => {
      const next = [...list];
      const target = index + delta;
      if (target < 0 || target >= next.length) return list;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  const payload = JSON.stringify({
    order: providers.map((p) => p.name),
    dailyLimit,
    autoPublish,
    providers: Object.fromEntries(
      providers.map((p) => [
        p.name,
        { enabled: p.enabled, model: p.model, backupModels: p.backupModels, rpm: p.rpm, newKey: p.newKey || undefined, removeKey: p.removeKey || undefined },
      ]),
    ),
  });

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="payload" value={payload} />

      {providers.map((p, index) => {
        const list = models[p.name] ?? { status: "idle", models: [] };
        const options = list.models.includes(p.model) || !p.model ? list.models : [p.model, ...list.models];
        const showCustom = custom[p.name] || list.status === "error" || (list.status === "idle" && !p.keyHint);
        const testResult = tests[p.name];
        return (
          <section key={p.name} className={`card space-y-4 p-5 ${p.enabled ? "" : "opacity-70"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${p.label} up`} className="px-1 text-xs text-muted disabled:opacity-30">
                  ▲
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === providers.length - 1} aria-label={`Move ${p.label} down`} className="px-1 text-xs text-muted disabled:opacity-30">
                  ▼
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {index + 1}. {p.label}
                </p>
                <p className="text-xs text-muted">
                  {index === 0 ? "Tried first." : "Used if the providers above fail or hit their limit."}{" "}
                  <a href={p.keyUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Get a free key
                  </a>
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={p.enabled}
                  onChange={(e) => update(p.name, { enabled: e.target.checked })}
                  className="size-4 accent-green-600"
                />
                Enabled
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="label">API key</span>
                  {p.keyHint && !p.removeKey ? (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                      ✓ Key saved <code className="font-mono">{p.keyHint}</code>
                      {p.keySource === "env" ? " (from .env)" : ""}
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">No key saved</span>
                  )}
                </div>
                {p.keyHint && !p.removeKey && (
                  <p className="mt-1 text-xs text-muted">The key is hidden for safety. Paste a new one only if you want to replace it.</p>
                )}
                {p.keyUnreadable && (
                  <p className="mt-1 text-xs text-amber-300">The stored key can&apos;t be read any more (server secret changed). Paste it again.</p>
                )}
                <input
                  type="password"
                  autoComplete="off"
                  value={p.newKey}
                  onChange={(e) => update(p.name, { newKey: e.target.value, removeKey: false })}
                  placeholder={p.keyHint ? "Leave empty to keep the saved key" : "Paste your API key"}
                  className="input mt-1 font-mono text-sm"
                />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => loadModels(p.name, p.newKey)}
                    disabled={!p.newKey && !p.keyHint}
                    className="btn-secondary px-3 py-1.5 text-xs"
                  >
                    {list.status === "loading" ? "Loading models…" : "Load models"}
                  </button>
                  {p.keySource === "dashboard" && (
                    <label className="flex items-center gap-1.5 text-xs text-muted">
                      <input
                        type="checkbox"
                        checked={p.removeKey}
                        onChange={(e) => update(p.name, { removeKey: e.target.checked, newKey: "" })}
                        className="size-3.5 accent-red-600"
                      />
                      Remove saved key
                    </label>
                  )}
                </div>
              </div>

              <div>
                <span className="label">Model</span>
                {!showCustom && (
                  <select
                    value={p.model}
                    onChange={(e) => {
                      if (e.target.value === CUSTOM) setCustom((c) => ({ ...c, [p.name]: true }));
                      else update(p.name, { model: e.target.value });
                    }}
                    disabled={list.status === "loading"}
                    className="input mt-1 font-mono text-sm"
                  >
                    {list.status === "loading" && options.length === 0 && <option>Loading…</option>}
                    {options.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value={CUSTOM}>Type a model name…</option>
                  </select>
                )}
                {showCustom && (
                  <input
                    value={p.model}
                    onChange={(e) => update(p.name, { model: e.target.value })}
                    placeholder="e.g. gemini-2.5-flash"
                    className="input mt-1 font-mono text-sm"
                  />
                )}
                <p className="mt-1 text-xs text-muted">
                  {list.status === "ready" && `${list.models.length} models available for this key.`}
                  {list.status === "error" && <span className="text-danger">{list.error}</span>}
                  {list.status === "idle" && "Add a key and click “Load models” to pick from a list."}
                  {custom[p.name] && list.status === "ready" && (
                    <button type="button" onClick={() => setCustom((c) => ({ ...c, [p.name]: false }))} className="ml-2 text-accent hover:underline">
                      Back to the list
                    </button>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => test(p)}
                  disabled={(!p.newKey && !p.keyHint) || testResult?.status === "running"}
                  className="btn-secondary mt-2 px-3 py-1.5 text-xs"
                >
                  {testResult?.status === "running" ? `Testing… ${waited(testResult)}s (max 45s)` : "Test this key + model"}
                </button>
                {testResult?.status === "running" && waited(testResult) >= 10 && (
                  <p className="mt-1 text-xs text-amber-300">
                    Still waiting — free models are often queued. Small models (e.g. gemini-2.5-flash, meta/llama-3.1-8b-instruct) answer fastest.
                  </p>
                )}
                <div className="mt-4">
                  <span className="label">Backup models</span>
                  <p className="text-xs text-muted">
                    Tried in this order when the main model hits its limit. Each model has its own daily quota, so more
                    backups mean more posts per day.
                  </p>
                  {p.backupModels.length > 0 && (
                    <ol className="mt-2 space-y-1">
                      {p.backupModels.map((m, i) => (
                        <li key={m} className="flex items-center gap-2 rounded-md bg-surface-2 px-2 py-1 text-xs">
                          <span className="w-4 text-muted">{i + 2}.</span>
                          <code className="min-w-0 flex-1 truncate font-mono">{m}</code>
                          <button type="button" onClick={() => moveBackup(p.name, i, -1)} disabled={i === 0} aria-label={`Move ${m} up`} className="px-1 text-muted disabled:opacity-30">▲</button>
                          <button type="button" onClick={() => moveBackup(p.name, i, 1)} disabled={i === p.backupModels.length - 1} aria-label={`Move ${m} down`} className="px-1 text-muted disabled:opacity-30">▼</button>
                          <button type="button" onClick={() => setBackups(p.name, (list) => list.filter((x) => x !== m))} aria-label={`Remove ${m}`} className="px-1 text-danger">✕</button>
                        </li>
                      ))}
                    </ol>
                  )}
                  {list.status === "ready" ? (
                    <select
                      value=""
                      onChange={(e) => {
                        const m = e.target.value;
                        if (m) setBackups(p.name, (l) => (l.includes(m) || m === p.model ? l : [...l, m]));
                      }}
                      className="input mt-2 font-mono text-xs"
                    >
                      <option value="">+ Add a backup model…</option>
                      {list.models
                        .filter((m) => m !== p.model && !p.backupModels.includes(m))
                        .map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={typedBackup[p.name] ?? ""}
                        onChange={(e) => setTypedBackup((t) => ({ ...t, [p.name]: e.target.value }))}
                        placeholder="Model name, e.g. gemma-4-31b-it"
                        className="input font-mono text-xs"
                      />
                      <button
                        type="button"
                        className="btn-secondary px-3 py-1.5 text-xs"
                        onClick={() => {
                          const m = (typedBackup[p.name] ?? "").trim();
                          if (m) setBackups(p.name, (l) => (l.includes(m) || m === p.model ? l : [...l, m]));
                          setTypedBackup((t) => ({ ...t, [p.name]: "" }));
                        }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                <label className="mt-3 block max-w-[220px]">
                  <span className="label">Requests per minute</span>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={p.rpm}
                    onChange={(e) => update(p.name, { rpm: e.target.value })}
                    className="input mt-1"
                  />
                  <span className="mt-1 block text-xs text-muted">
                    Per model. The writer never sends more than this. Use your plan&apos;s limit (NVIDIA free: 40; Gemini free Flash: 5).
                  </span>
                </label>
                {testResult?.text && (
                  <p className={`mt-1 text-xs ${testResult.status === "ok" ? "text-accent" : "text-danger"}`}>{testResult.text}</p>
                )}
              </div>
            </div>
          </section>
        );
      })}

      <section className="card space-y-2 p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={autoPublish}
            onChange={(e) => setAutoPublish(e.target.checked)}
            className="mt-1 size-4 accent-green-600"
          />
          <span>
            <span className="label">Publish AI posts immediately</span>
            <span className="block text-xs text-muted">
              On: posts written by the AI writer and autopilot go live right away. Off: they wait as drafts for you to review.
              Unreviewed AI content at scale can hurt search rankings, so skim new posts now and then.
            </span>
          </span>
        </label>
      </section>

      <section className="card space-y-2 p-5">
        <label className="block max-w-xs">
          <span className="label">Daily limit</span>
          <input
            type="number"
            min={0}
            max={10000}
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="input mt-1"
          />
        </label>
        <p className="text-xs text-muted">Maximum AI writer runs in any 24 hours. Set 0 for no cap: the autopilot then runs until the providers&apos; own quotas run out.</p>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : "Save settings"}
        </button>
        {state?.ok && !pending && <p className="text-sm text-accent">Saved.</p>}
        {state?.error && !pending && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
