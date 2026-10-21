import { getAiConfig, type ProviderName, type ResolvedProvider } from "./config";

/*
 * AI text providers for the blog writer: Google Gemini and NVIDIA (build.nvidia.com, OpenAI-style API).
 * Keys, models and requests-per-minute come from the Settings page (lib/ai/config.ts).
 *
 * Limits are handled here, in-process (one dashboard container):
 * - a sliding-window limiter keeps each provider under its configured requests/minute;
 * - a 429 "slow down" puts the provider on a short cooldown (the provider's own retry delay if given)
 *   and the next provider is tried; a daily-quota 429 puts it on a long cooldown;
 * - when every provider is cooling down, callers can wait for the earliest one to come back.
 */

export type GenerateInput = { system: string; prompt: string };
export type GenerateResult = {
  provider: ProviderName;
  model: string;
  text: string;
  inputTokens: number | null;
  outputTokens: number | null;
};
type Credentials = { apiKey: string; model: string };
type CallOptions = { json: boolean; maxTokens: number; timeoutMs: number };

/* rate = per-minute limit hit; quota = daily/total quota used up; auth = key rejected; model = bad model name. */
export type FailureKind = "rate" | "quota" | "auth" | "model" | "other";

export class ProviderError extends Error {
  constructor(
    readonly provider: ProviderName,
    message: string,
    readonly kind: FailureKind = "other",
    readonly retryAfterMs: number | null = null,
  ) {
    super(`${provider}: ${message}`);
  }
}

/* Thrown when no provider could produce text. reason "quota" means every provider's quota is used up. */
export class AllProvidersFailed extends Error {
  constructor(
    message: string,
    readonly reason: "quota" | "rate" | "error" | "stopped",
  ) {
    super(message);
  }
}

/* Writing a full post on a free tier can take a few minutes; a connectivity test should not. */
const WRITE_TIMEOUT_MS = 180_000;
export const TEST_TIMEOUT_MS = 45_000;
const MAX_OUTPUT_TOKENS = 8192;
const MINUTE = 60_000;
const QUOTA_COOLDOWN_MS = 60 * MINUTE;
const ERROR_COOLDOWN_MS = MINUTE;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ---------- limits, kept in memory for this server process ---------- */

/* Keyed per provider model, e.g. "gemini:gemini-2.5-flash": Google applies limits to each model separately. */
const recentRequests = new Map<string, number[]>();
const cooldowns = new Map<string, { until: number; kind: FailureKind; reason: string }>();

/* Waits until sending one more request keeps the provider under `rpm` per minute, then records it. */
async function takeSlot(name: string, rpm: number, onWait?: (message: string) => void) {
  const limit = Math.max(1, rpm);
  for (;;) {
    const now = Date.now();
    const recent = (recentRequests.get(name) ?? []).filter((t) => now - t < MINUTE);
    if (recent.length < limit) {
      recent.push(now);
      recentRequests.set(name, recent);
      return;
    }
    const waitMs = recent[0] + MINUTE - now + 250;
    onWait?.(`Waiting ${Math.ceil(waitMs / 1000)}s to stay under ${name}'s ${limit} requests/minute`);
    await sleep(waitMs);
  }
}

function coolDown(name: string, kind: FailureKind, ms: number, reason: string) {
  cooldowns.set(name, { until: Date.now() + ms, kind, reason });
}

function activeCooldown(name: string) {
  const entry = cooldowns.get(name);
  if (!entry) return null;
  if (entry.until <= Date.now()) {
    cooldowns.delete(name);
    return null;
  }
  return entry;
}

/* For the AI writer page: which provider models are paused and until when. */
export function providerCooldowns() {
  return [...cooldowns.entries()]
    .filter(([name]) => activeCooldown(name))
    .map(([name, c]) => ({ name, kind: c.kind, until: c.until, reason: c.reason }));
}

/* ---------- HTTP ---------- */

function parseDelay(value: unknown): number | null {
  if (typeof value === "string") {
    const seconds = Number.parseFloat(value); // "37s", "37.5s" or "37"
    if (Number.isFinite(seconds)) return Math.round(seconds * 1000);
  }
  return null;
}

/* Readable error text plus its kind and retry delay. Never includes the API key. */
async function describeFailure(provider: ProviderName, res: Response) {
  const body = await res.text().catch(() => "");
  let detail = body.slice(0, 300);
  let retryAfterMs = parseDelay(res.headers.get("retry-after"));
  let daily = false;
  try {
    const json = JSON.parse(body);
    detail = json?.error?.message ?? json?.detail ?? json?.message ?? detail;
    // Gemini sends google.rpc.RetryInfo (retryDelay) and QuotaFailure (which quota) details.
    for (const d of json?.error?.details ?? []) {
      if (typeof d?.["@type"] === "string" && d["@type"].endsWith("RetryInfo")) retryAfterMs = parseDelay(d.retryDelay) ?? retryAfterMs;
      for (const v of d?.violations ?? []) if (/PerDay|per_day|daily/i.test(String(v?.quotaId ?? v?.quotaMetric ?? ""))) daily = true;
    }
  } catch {}
  if (/per day|daily/i.test(detail)) daily = true;

  if (res.status === 429) {
    return daily
      ? new ProviderError(provider, `daily quota used up (${detail})`, "quota", retryAfterMs)
      : new ProviderError(provider, `rate limit reached (${detail})`, "rate", retryAfterMs);
  }
  if (res.status === 401 || res.status === 403) return new ProviderError(provider, `API key rejected (${detail})`, "auth");
  if (res.status === 404) return new ProviderError(provider, `model not found — pick another on the Settings page (${detail})`, "model");
  return new ProviderError(provider, `HTTP ${res.status}: ${detail}`, "other");
}

/* fetch() with a timeout, turning timeouts and network failures into readable errors. */
async function send(provider: ProviderName, url: string, init: RequestInit, timeoutMs: number) {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new ProviderError(
        provider,
        `no answer within ${Math.round(timeoutMs / 1000)}s. The model is probably queued on the free tier or is a slow "reasoning" model; try a smaller or faster one.`,
      );
    }
    throw new ProviderError(provider, `could not reach the API (${error instanceof Error ? error.message : String(error)})`);
  }
}

/* The JSON shape we want back, in Gemini's schema format. NVIDIA models get it described in the prompt. */
const GEMINI_DRAFT_SCHEMA = {
  type: "OBJECT",
  properties: {
    topicReason: { type: "STRING" },
    title: { type: "STRING" },
    slug: { type: "STRING" },
    excerpt: { type: "STRING" },
    tags: { type: "ARRAY", items: { type: "STRING" } },
    seoTitle: { type: "STRING" },
    seoDescription: { type: "STRING" },
    content: { type: "STRING" },
  },
  required: ["topicReason", "title", "slug", "excerpt", "tags", "seoTitle", "seoDescription", "content"],
  propertyOrdering: ["topicReason", "title", "slug", "excerpt", "tags", "seoTitle", "seoDescription", "content"],
};

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";
const NVIDIA_BASE = "https://integrate.api.nvidia.com/v1";

async function gemini({ system, prompt }: GenerateInput, { apiKey, model }: Credentials, opts: CallOptions): Promise<GenerateResult> {
  // Gemma models (open models served through the same API) reject systemInstruction and JSON schema mode,
  // so the instructions go into the prompt and the JSON is parsed from plain text instead.
  const gemma = /^gemma/i.test(model);
  const res = await send(
    "gemini",
    `${GEMINI_BASE}/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        ...(gemma ? {} : { systemInstruction: { parts: [{ text: system }] } }),
        contents: [{ role: "user", parts: [{ text: gemma ? `${system}

---

${prompt}` : prompt }] }],
        generationConfig: {
          ...(opts.json && !gemma ? { responseMimeType: "application/json", responseSchema: GEMINI_DRAFT_SCHEMA } : {}),
          temperature: 1,
          maxOutputTokens: opts.maxTokens,
        },
      }),
    },
    opts.timeoutMs,
  );
  if (!res.ok) throw await describeFailure("gemini", res);

  const data = await res.json();
  const candidate = data?.candidates?.[0];
  const text: string = (candidate?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) {
    const reason = candidate?.finishReason ?? data?.promptFeedback?.blockReason ?? "empty response";
    throw new ProviderError("gemini", `no text returned (${reason})`);
  }
  return {
    provider: "gemini",
    model,
    text,
    inputTokens: data?.usageMetadata?.promptTokenCount ?? null,
    outputTokens: data?.usageMetadata?.candidatesTokenCount ?? null,
  };
}

async function nvidia({ system, prompt }: GenerateInput, { apiKey, model }: Credentials, opts: CallOptions): Promise<GenerateResult> {
  const res = await send(
    "nvidia",
    `${NVIDIA_BASE}/chat/completions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
        temperature: 0.9,
        max_tokens: opts.maxTokens,
      }),
    },
    opts.timeoutMs,
  );
  if (!res.ok) throw await describeFailure("nvidia", res);

  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new ProviderError("nvidia", `no text returned (${data?.choices?.[0]?.finish_reason ?? "empty"})`);
  return {
    provider: "nvidia",
    model,
    text,
    inputTokens: data?.usage?.prompt_tokens ?? null,
    outputTokens: data?.usage?.completion_tokens ?? null,
  };
}

const CALL = { gemini, nvidia };

function usable(p: ResolvedProvider): p is ResolvedProvider & { apiKey: string } {
  return p.enabled && Boolean(p.apiKey);
}

export type GenerateOptions = {
  /* Called with a human-readable status while waiting on limits. */
  onStatus?: (message: string) => void;
  /* How long in total to wait for a provider to come off cooldown before giving up. */
  maxWaitMs?: number;
  /* Return true to abandon a wait early (autopilot Stop button). */
  shouldStop?: () => Promise<boolean> | boolean;
};

/*
 * Tries each enabled provider in the configured order, respecting its requests/minute and any cooldown.
 * Throws AllProvidersFailed with reason "quota" when every provider's quota is used up.
 */
export async function generateWithFallback(input: GenerateInput, opts: GenerateOptions = {}): Promise<GenerateResult> {
  const providers = (await getAiConfig()).providers.filter(usable);
  // Every model of every provider, in order: main model, its backups, then the next provider.
  const candidates = providers.flatMap((p) => p.models.map((model) => ({ p, model, key: `${p.name}:${model}` })));
  if (candidates.length === 0) {
    throw new AllProvidersFailed("No AI provider is ready. Add an API key on the Settings page.", "error");
  }
  const maxWaitMs = opts.maxWaitMs ?? MINUTE;
  const startedWaiting = Date.now();
  const failures: string[] = [];

  for (;;) {
    for (const { p, model, key } of candidates) {
      if (activeCooldown(key)) continue;
      await takeSlot(key, p.rpm, opts.onStatus);
      opts.onStatus?.(`Writing with ${p.name} (${model})`);
      try {
        return await CALL[p.name](input, { apiKey: p.apiKey, model }, { json: true, maxTokens: MAX_OUTPUT_TOKENS, timeoutMs: WRITE_TIMEOUT_MS });
      } catch (error) {
        const e = error instanceof ProviderError ? error : new ProviderError(p.name, String(error));
        failures.push(`${model}: ${e.message}`);
        if (e.kind === "rate") coolDown(key, "rate", Math.max(e.retryAfterMs ?? 0, 15_000), e.message);
        else if (e.kind === "quota") coolDown(key, "quota", QUOTA_COOLDOWN_MS, e.message);
        else coolDown(key, e.kind, ERROR_COOLDOWN_MS, e.message);
      }
    }

    const states = candidates.map((c) => activeCooldown(c.key));
    if (states.every((c) => c?.kind === "quota")) {
      throw new AllProvidersFailed(`Every model's quota is used up. ${failures.slice(-candidates.length).join(" | ")}`, "quota");
    }
    if (states.some((c) => !c)) continue; // a cooldown expired meanwhile

    // Everyone is cooling down: wait for the first one that isn't quota-exhausted, if allowed.
    const next = Math.min(...states.filter((c) => c && c.kind !== "quota").map((c) => c!.until));
    const waitMs = Math.max(1000, next - Date.now());
    if (Date.now() - startedWaiting + waitMs > maxWaitMs) {
      const onlyLimits = states.every((c) => c?.kind === "rate" || c?.kind === "quota");
      throw new AllProvidersFailed(
        `All AI models are unavailable right now. ${failures.slice(-candidates.length).join(" | ")}`,
        onlyLimits ? "rate" : "error",
      );
    }
    opts.onStatus?.(`All models are paused — waiting ${Math.ceil(waitMs / 1000)}s`);
    for (let waited = 0; waited < waitMs; waited += 1000) {
      if (await opts.shouldStop?.()) throw new AllProvidersFailed("Stopped.", "stopped");
      await sleep(Math.min(1000, waitMs - waited));
    }
  }
}

/* A tiny request to check that a key and model work. */
export async function testProvider(name: ProviderName, credentials: Credentials) {
  const result = await CALL[name](
    { system: "You are a connectivity check.", prompt: "Reply with the single word: OK" },
    credentials,
    { json: false, maxTokens: 1024, timeoutMs: TEST_TIMEOUT_MS },
  );
  return result.text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim().slice(0, 80);
}

/* Models this key can use for text generation, for the Settings dropdown. */
export async function listModels(name: ProviderName, apiKey: string): Promise<string[]> {
  if (name === "gemini") {
    const res = await send("gemini", `${GEMINI_BASE}/models?pageSize=1000`, { headers: { "x-goog-api-key": apiKey } }, 20_000);
    if (!res.ok) throw await describeFailure("gemini", res);
    const data = await res.json();
    return (data?.models ?? [])
      .filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes("generateContent"))
      .map((m: { name: string }) => m.name.replace(/^models\//, ""))
      .filter((id: string) => !/embedding|imagen|veo|aqa|tts|image-generation/i.test(id))
      .sort();
  }

  const res = await send("nvidia", `${NVIDIA_BASE}/models`, { headers: { Authorization: `Bearer ${apiKey}` } }, 20_000);
  if (!res.ok) throw await describeFailure("nvidia", res);
  const data = await res.json();
  return (data?.data ?? [])
    .map((m: { id: string }) => m.id)
    // The catalogue also lists embedding, reranking, vision and safety models that can't write posts.
    .filter((id: string) => !/embed|rerank|clip|retriev|parse|guard|safety|reward|vlm|vision|paligemma|kosmos|deplot|neva|fuyu|nvclip|ocr/i.test(id))
    .sort();
}
