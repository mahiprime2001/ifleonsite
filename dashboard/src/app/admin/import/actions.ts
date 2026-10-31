"use server";

import { refresh, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { importFromWordPress, type ImportReport } from "@/lib/wordpress-import";

export type ImportState = { report?: ImportReport; error?: string } | undefined;

export async function runImport(_prev: ImportState, formData: FormData): Promise<ImportState> {
  await requireAdmin();
  const options = {
    posts: formData.get("posts") === "on",
    testimonials: formData.get("testimonials") === "on",
    update: formData.get("update") === "on",
  };
  if (!options.posts && !options.testimonials) return { error: "Choose what to import." };
  try {
    const report = await importFromWordPress(options);
    revalidateTag("posts", "max");
    revalidateTag("testimonials", "max");
    refresh();
    return { report };
  } catch (error) {
    console.error("[import] WordPress import failed:", error);
    return { error: error instanceof Error ? error.message : "The import failed." };
  }
}
