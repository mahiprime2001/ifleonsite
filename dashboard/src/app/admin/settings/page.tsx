import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAiConfig, PROVIDER_INFO } from "@/lib/ai/config";
import { requireAdmin } from "@/lib/auth";
import { SettingsForm, type ProviderView } from "./SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          AI providers for the AI writer. Keys are stored encrypted on the server and never shown again in full.
        </p>
      </div>
      <Suspense fallback={<div className="card h-96 animate-pulse" />}>
        <AiSettings />
      </Suspense>
    </div>
  );
}

async function AiSettings() {
  await requireAdmin();
  await connection(); // settings fall back to env, read at request time
  const config = await getAiConfig();
  // Strip the plaintext key before anything reaches the browser.
  const providers: ProviderView[] = config.providers.map((p) => ({
    name: p.name,
    label: p.label,
    keyUrl: PROVIDER_INFO[p.name].keyUrl,
    enabled: p.enabled,
    model: p.model,
    backupModels: p.backupModels,
    rpm: p.rpm,
    keySource: p.keySource,
    keyHint: p.keyHint,
    keyUnreadable: p.keyUnreadable,
  }));
  return <SettingsForm providers={providers} dailyLimit={config.dailyLimit} autoPublish={config.autoPublish} />;
}
