import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { decryptSecret, encryptSecret, secretHint } from "@/lib/crypto";

/*
 * AI writer settings. Saved from the dashboard's Settings page into app_settings["ai"]
 * (API keys encrypted). Anything not set there falls back to env vars, then to defaults.
 */

export const PROVIDER_NAMES = ["gemini", "nvidia"] as const;
export type ProviderName = (typeof PROVIDER_NAMES)[number];

export const PROVIDER_INFO: Record<
  ProviderName,
  { label: string; defaultModel: string; defaultRpm: number; keyUrl: string; envKey: string; envModel: string }
> = {
  gemini: {
    label: "Google Gemini",
    defaultModel: "gemini-2.5-flash",
    // Free tier (AI Studio → Rate Limit): Flash models allow 5 requests/minute and 20 requests/day each.
    defaultRpm: 5,
    keyUrl: "https://aistudio.google.com/apikey",
    envKey: "GEMINI_API_KEY",
    envModel: "GEMINI_MODEL",
  },
  nvidia: {
    label: "NVIDIA",
    defaultModel: "meta/llama-3.3-70b-instruct",
    // build.nvidia.com free tier: 40 requests/minute.
    defaultRpm: 40,
    keyUrl: "https://build.nvidia.com",
    envKey: "NVIDIA_API_KEY",
    envModel: "NVIDIA_MODEL",
  },
};

/* 0 = no daily cap: the writer runs until the providers' own quotas run out. */
const DEFAULT_DAILY_LIMIT = 0;
const SETTINGS_KEY = "ai";

type StoredProvider = { enabled?: boolean; model?: string; backupModels?: string[]; rpm?: number; key?: string };
type StoredAi = { order?: string[]; dailyLimit?: number; autoPublish?: boolean; providers?: Partial<Record<ProviderName, StoredProvider>> };

export type ResolvedProvider = {
  name: ProviderName;
  label: string;
  enabled: boolean;
  model: string;
  /* Tried in order after `model` when it hits its limits; each model has its own quota. */
  backupModels: string[];
  /* model followed by backupModels. */
  models: string[];
  /* Requests per minute the dashboard allows itself to send to this provider. */
  rpm: number;
  apiKey: string | null;
  keySource: "dashboard" | "env" | null;
  keyHint: string | null;
  /* A key is stored but can't be decrypted (the server secret changed). */
  keyUnreadable: boolean;
};
/*
 * dailyLimit 0 = no daily cap (the providers' own quotas still apply).
 * autoPublish: AI posts go live straight away instead of waiting as drafts (on by default, at the owner's request).
 */
export type AiConfig = { dailyLimit: number; autoPublish: boolean; providers: ResolvedProvider[] };

function isProvider(name: string): name is ProviderName {
  return (PROVIDER_NAMES as readonly string[]).includes(name);
}

async function readStored(): Promise<StoredAi> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, SETTINGS_KEY)).limit(1);
  return (row?.value as StoredAi | undefined) ?? {};
}

/* The effective settings, providers in fallback order. Includes plaintext keys: server-side only. */
export async function getAiConfig(): Promise<AiConfig> {
  const stored = await readStored();
  const envOrder = (process.env.AI_PROVIDERS || "").split(",").map((s) => s.trim().toLowerCase());
  const order = [...(stored.order ?? envOrder), ...PROVIDER_NAMES].filter(isProvider);
  const unique = [...new Set(order)];

  const providers = unique.map((name): ResolvedProvider => {
    const info = PROVIDER_INFO[name];
    const saved = stored.providers?.[name] ?? {};
    const dashboardKey = saved.key ? decryptSecret(saved.key) : null;
    const envKey = process.env[info.envKey] || null;
    const apiKey = dashboardKey ?? envKey;
    const primary = saved.model || process.env[info.envModel] || info.defaultModel;
    const backupModels = [...new Set((saved.backupModels ?? []).filter((m) => m && m !== primary))];
    return {
      name,
      label: info.label,
      enabled: saved.enabled ?? true,
      model: primary,
      backupModels,
      models: [primary, ...backupModels],
      rpm: saved.rpm ?? info.defaultRpm,
      apiKey,
      keySource: dashboardKey ? "dashboard" : envKey ? "env" : null,
      keyHint: apiKey ? secretHint(apiKey) : null,
      keyUnreadable: Boolean(saved.key) && !dashboardKey,
    };
  });

  const envLimit = process.env.AI_DAILY_LIMIT;
  const dailyLimit = stored.dailyLimit ?? (envLimit !== undefined && envLimit !== "" ? Number(envLimit) : DEFAULT_DAILY_LIMIT);
  return { dailyLimit, autoPublish: stored.autoPublish ?? true, providers };
}

export type AiConfigUpdate = {
  order: ProviderName[];
  dailyLimit: number;
  autoPublish: boolean;
  providers: Record<
    ProviderName,
    { enabled: boolean; model: string; backupModels: string[]; rpm: number; /* undefined = keep, "" = remove */ newKey?: string }
  >;
};

export async function saveAiConfig(update: AiConfigUpdate) {
  const stored = await readStored();
  const providers: Partial<Record<ProviderName, StoredProvider>> = {};
  for (const name of PROVIDER_NAMES) {
    const next = update.providers[name];
    const previousKey = stored.providers?.[name]?.key;
    const key = next.newKey === undefined ? previousKey : next.newKey === "" ? undefined : encryptSecret(next.newKey);
    providers[name] = {
      enabled: next.enabled,
      model: next.model,
      backupModels: next.backupModels,
      rpm: next.rpm,
      ...(key ? { key } : {}),
    };
  }
  const value: StoredAi = { order: update.order, dailyLimit: update.dailyLimit, autoPublish: update.autoPublish, providers };
  await db
    .insert(appSettings)
    .values({ key: SETTINGS_KEY, value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } });
}
