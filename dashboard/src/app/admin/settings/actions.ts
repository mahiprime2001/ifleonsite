"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { getAiConfig, PROVIDER_NAMES, saveAiConfig, type ProviderName } from "@/lib/ai/config";
import { listModels, testProvider } from "@/lib/ai/providers";
import { requireAdmin } from "@/lib/auth";

const providerName = z.enum(PROVIDER_NAMES);
// Model ids look like "gemini-2.5-flash" or "meta/llama-3.3-70b-instruct".
const modelId = z.string().trim().min(1, "Choose a model").max(150).regex(/^[\w.\-/:]+$/, "Invalid model name");
// Keys are pasted by hand; keep them to a sane printable shape.
const apiKey = z.string().trim().max(400).regex(/^[\x21-\x7e]*$/, "API key contains invalid characters");

const settingsInput = z.object({
  order: z.array(providerName).length(PROVIDER_NAMES.length),
  // 0 = no daily cap.
  dailyLimit: z.coerce.number().int().min(0, "Daily limit can't be negative").max(10000),
  autoPublish: z.boolean(),
  providers: z.record(
    providerName,
    z.object({
      enabled: z.boolean(),
      model: modelId,
      backupModels: z.array(modelId).max(10, "At most 10 backup models").default([]),
      rpm: z.coerce.number().int().min(1, "Requests per minute must be at least 1").max(1000),
      newKey: apiKey.optional(),
      removeKey: z.boolean().optional(),
    }),
  ),
});

export type SaveSettingsState = { ok?: boolean; error?: string } | undefined;

export async function saveSettings(_prev: SaveSettingsState, formData: FormData): Promise<SaveSettingsState> {
  await requireAdmin();
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("payload") ?? ""));
  } catch {
    return { error: "Could not read the form." };
  }
  const parsed = settingsInput.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  if (new Set(parsed.data.order).size !== PROVIDER_NAMES.length) return { error: "Invalid provider order." };

  const providers = {} as Parameters<typeof saveAiConfig>[0]["providers"];
  for (const name of PROVIDER_NAMES) {
    const p = parsed.data.providers[name];
    if (!p) return { error: `Missing settings for ${name}.` };
    providers[name] = {
      enabled: p.enabled,
      model: p.model,
      backupModels: p.backupModels,
      rpm: p.rpm,
      newKey: p.removeKey ? "" : p.newKey ? p.newKey : undefined,
    };
  }
  await saveAiConfig({
    order: parsed.data.order,
    dailyLimit: parsed.data.dailyLimit,
    autoPublish: parsed.data.autoPublish,
    providers,
  });
  refresh();
  return { ok: true };
}

/* Uses a key typed into the form (not saved yet) if given, otherwise the saved one. */
async function resolveKey(name: ProviderName, typedKey?: string) {
  const typed = typedKey ? apiKey.safeParse(typedKey) : null;
  if (typed?.success && typed.data) return typed.data;
  const saved = (await getAiConfig()).providers.find((p) => p.name === name);
  return saved?.apiKey ?? null;
}

export async function fetchModels(
  name: string,
  typedKey?: string,
): Promise<{ ok: true; models: string[] } | { ok: false; error: string }> {
  await requireAdmin();
  const provider = providerName.safeParse(name);
  if (!provider.success) return { ok: false, error: "Unknown provider." };
  const key = await resolveKey(provider.data, typedKey);
  if (!key) return { ok: false, error: "Add an API key first." };
  try {
    return { ok: true, models: await listModels(provider.data, key) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not load models." };
  }
}

export async function runProviderTest(
  name: string,
  model: string,
  typedKey?: string,
): Promise<{ ok: true; reply: string; ms: number } | { ok: false; error: string; ms: number }> {
  await requireAdmin();
  const provider = providerName.safeParse(name);
  const chosen = modelId.safeParse(model);
  if (!provider.success || !chosen.success) return { ok: false, error: "Choose a provider and model first.", ms: 0 };
  const key = await resolveKey(provider.data, typedKey);
  if (!key) return { ok: false, error: "Add an API key first.", ms: 0 };
  const started = Date.now();
  try {
    const reply = await testProvider(provider.data, { apiKey: key, model: chosen.data });
    return { ok: true, reply, ms: Date.now() - started };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Test failed.", ms: Date.now() - started };
  }
}
