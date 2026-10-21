"use server";

import { and, eq, isNull } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { generateApiKey, type Scope } from "@/lib/api-keys";
import { requireAdmin } from "@/lib/auth";

export type CreateKeyState = { error?: string; key?: string; name?: string } | undefined;

const createKeyInput = z.object({
  name: z.string().trim().min(1, "Give the key a name, e.g. “AI writer”.").max(120),
  allowPublish: z.literal("on").optional(),
  allowRead: z.literal("on").optional(),
});

/* Creates a key and returns it once. Only its hash is stored, so it can't be shown again. */
export async function createApiKey(_prev: CreateKeyState, formData: FormData): Promise<CreateKeyState> {
  await requireAdmin();
  const parsed = createKeyInput.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const scopes: Scope[] = ["posts:create"];
  if (parsed.data.allowPublish) scopes.push("posts:publish");
  if (parsed.data.allowRead) scopes.push("posts:read");

  const { key, prefix, keyHash } = generateApiKey();
  await db.insert(apiKeys).values({ name: parsed.data.name, prefix, keyHash, scopes });
  refresh();
  return { key, name: parsed.data.name };
}

export async function revokeApiKey(id: number) {
  await requireAdmin();
  await db
    .update(apiKeys)
    .set({ revokedAt: new Date() })
    .where(and(eq(apiKeys.id, id), isNull(apiKeys.revokedAt)));
  refresh();
}
