"use server";

import { and, asc, eq, isNull, max } from "drizzle-orm";
import { refresh, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { portfolioEntries, portfolioProfile, type PortfolioKind } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { isUniqueViolation } from "@/lib/db-errors";
import { ENTRY_KINDS, type EntryField, PORTFOLIO_TAG } from "@/lib/portfolio";
import { slugify } from "@/lib/slug";

export type PortfolioFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; saved?: boolean }
  | undefined;

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const optionalUrl = z
  .union([z.literal(""), z.url("Must be a full URL, e.g. https://…")])
  .transform((v) => (v === "" ? null : v));

const checkbox = z.enum(["true", "false"]).transform((v) => v === "true");

function invalid(error: z.ZodError): PortfolioFormState {
  return { error: "Fix the highlighted fields.", fieldErrors: z.flattenError(error).fieldErrors };
}

/* ---------- Profile ---------- */

const linksInput = z.string().transform((v, ctx) => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(v || "[]");
  } catch {
    ctx.addIssue({ code: "custom", message: "Invalid links" });
    return z.NEVER;
  }
  const result = z
    .array(z.object({ label: z.string().trim().max(60), url: z.string().trim().max(500) }))
    .max(20)
    .safeParse(parsed);
  if (!result.success) {
    ctx.addIssue({ code: "custom", message: "Invalid links" });
    return z.NEVER;
  }
  const links = result.data.filter((l) => l.label || l.url);
  for (const link of links) {
    if (!link.label || !z.url().safeParse(link.url).success) {
      ctx.addIssue({ code: "custom", message: "Each link needs a name and a full URL (https://… or mailto:…)." });
      return z.NEVER;
    }
  }
  return links;
});

const profileInput = z.object({
  name: z.string().trim().min(1, "Your name is required").max(120),
  headline: z.string().trim().max(200),
  intro: z.string().trim().max(1000),
  bio: z.string().max(20_000),
  location: nullableText(120),
  email: z
    .union([z.literal(""), z.email("Not a valid email address")])
    .transform((v) => (v === "" ? null : v)),
  phone: nullableText(40),
  availability: nullableText(160),
  photoUrl: optionalUrl,
  resumeUrl: optionalUrl,
  links: linksInput,
  seoTitle: nullableText(300),
  seoDescription: nullableText(500),
});

export async function saveProfile(_prev: PortfolioFormState, formData: FormData): Promise<PortfolioFormState> {
  await requireAdmin();
  const result = profileInput.safeParse(Object.fromEntries(formData));
  if (!result.success) return invalid(result.error);

  await db
    .insert(portfolioProfile)
    .values({ id: 1, ...result.data })
    .onConflictDoUpdate({ target: portfolioProfile.id, set: result.data });
  revalidateTag(PORTFOLIO_TAG, "max");
  refresh();
  return { saved: true };
}

/* ---------- Entries (projects, experience, skills, photos, …) ---------- */

/* Server-action arguments come from the browser, so the kind is checked before use. */
function checkKind(kind: string): PortfolioKind {
  if (!Object.hasOwn(ENTRY_KINDS, kind)) throw new Error("Unknown portfolio section.");
  return kind as PortfolioKind;
}

const live = (id: number) => and(eq(portfolioEntries.id, id), isNull(portfolioEntries.deletedAt));

const entryInput = z.object({
  title: z.string().trim().max(300),
  slug: z.string().trim().max(200),
  subtitle: nullableText(300),
  location: nullableText(120),
  startDate: nullableText(40),
  endDate: nullableText(40),
  summary: nullableText(2000),
  body: nullableText(100_000),
  imageUrl: optionalUrl,
  url: optionalUrl,
  repoUrl: optionalUrl,
  gallery: z.string().transform((v, ctx) => {
    const urls = v
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length > 30 || urls.some((u) => !z.url().safeParse(u).success)) {
      ctx.addIssue({ code: "custom", message: "Up to 30 images, each a full URL." });
      return z.NEVER;
    }
    return urls;
  }),
  tags: z.string().transform((v) =>
    v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 30),
  ),
  isFeatured: checkbox,
  isPublished: checkbox,
});

/* Every field, so a form that leaves some out (they don't apply to its kind) still parses. */
const BLANK_ENTRY: Record<keyof z.input<typeof entryInput>, string> = {
  title: "",
  slug: "",
  subtitle: "",
  location: "",
  startDate: "",
  endDate: "",
  summary: "",
  body: "",
  imageUrl: "",
  url: "",
  repoUrl: "",
  gallery: "",
  tags: "",
  isFeatured: "false",
  isPublished: "true",
};

function parseEntry(kind: PortfolioKind, formData: FormData) {
  const result = entryInput.safeParse({ ...BLANK_ENTRY, ...Object.fromEntries(formData) });
  if (!result.success) return { ok: false as const, state: invalid(result.error) };

  const v = result.data;
  const has = (field: EntryField) => ENTRY_KINDS[kind].fields.includes(field);
  const fieldErrors: Record<string, string[]> = {};
  if (kind !== "photo" && !v.title) fieldErrors.title = ["This is required"];
  if (kind === "photo" && !v.imageUrl) fieldErrors.imageUrl = ["Upload a photo"];
  const slug = has("slug") ? slugify(v.slug || v.title) : null;
  if (has("slug") && !slug) fieldErrors.slug = ["Use letters or numbers"];
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false as const, state: { error: "Fix the highlighted fields.", fieldErrors } satisfies PortfolioFormState };
  }

  // Fields this kind doesn't use are cleared, so nothing hidden lingers in the data.
  return {
    ok: true as const,
    values: {
      title: v.title,
      slug,
      subtitle: has("subtitle") ? v.subtitle : null,
      location: has("location") ? v.location : null,
      startDate: has("dates") ? v.startDate : null,
      endDate: has("dates") ? v.endDate : null,
      summary: has("summary") ? v.summary : null,
      body: has("body") ? v.body : null,
      imageUrl: has("image") ? v.imageUrl : null,
      gallery: has("gallery") ? v.gallery : [],
      url: has("url") ? v.url : null,
      repoUrl: has("repoUrl") ? v.repoUrl : null,
      tags: has("tags") ? v.tags : [],
      isFeatured: has("featured") ? v.isFeatured : false,
      isPublished: v.isPublished,
    },
  };
}

const slugTaken: PortfolioFormState = {
  error: "Fix the highlighted fields.",
  fieldErrors: { slug: ["Another project (maybe one in Trash) already uses this address"] },
};

async function nextSortOrder(kind: PortfolioKind) {
  const [{ last }] = await db
    .select({ last: max(portfolioEntries.sortOrder) })
    .from(portfolioEntries)
    .where(and(eq(portfolioEntries.kind, kind), isNull(portfolioEntries.deletedAt)));
  return (last ?? -1) + 1;
}

export async function createEntry(kind: string, _prev: PortfolioFormState, formData: FormData): Promise<PortfolioFormState> {
  await requireAdmin();
  const k = checkKind(kind);
  const parsed = parseEntry(k, formData);
  if (!parsed.ok) return parsed.state;

  try {
    // New entries go to the end of their list.
    await db.insert(portfolioEntries).values({ ...parsed.values, kind: k, sortOrder: await nextSortOrder(k) });
  } catch (error) {
    if (isUniqueViolation(error)) return slugTaken;
    throw error;
  }
  revalidateTag(PORTFOLIO_TAG, "max");
  redirect(`/admin/portfolio/${ENTRY_KINDS[k].segment}`);
}

export async function updateEntry(id: number, _prev: PortfolioFormState, formData: FormData): Promise<PortfolioFormState> {
  await requireAdmin();
  const [row] = await db.select({ kind: portfolioEntries.kind }).from(portfolioEntries).where(live(id)).limit(1);
  if (!row) return { error: "This entry no longer exists." };
  const parsed = parseEntry(row.kind, formData);
  if (!parsed.ok) return parsed.state;

  try {
    await db.update(portfolioEntries).set(parsed.values).where(live(id));
  } catch (error) {
    if (isUniqueViolation(error)) return slugTaken;
    throw error;
  }
  revalidateTag(PORTFOLIO_TAG, "max");
  refresh();
  return { saved: true };
}

/* Moves the entry to Trash (kept 30 days, restorable). */
export async function deleteEntry(id: number) {
  await requireAdmin();
  const [row] = await db
    .update(portfolioEntries)
    .set({ deletedAt: new Date() })
    .where(live(id))
    .returning({ kind: portfolioEntries.kind });
  revalidateTag(PORTFOLIO_TAG, "max");
  redirect(`/admin/portfolio/${row ? ENTRY_KINDS[row.kind].segment : "projects"}`);
}

export async function setEntryPublished(id: number, isPublished: boolean) {
  await requireAdmin();
  await db.update(portfolioEntries).set({ isPublished }).where(live(id));
  revalidateTag(PORTFOLIO_TAG, "max");
  refresh();
}

/* Moves one entry up or down within its kind and renumbers that list, so gaps and ties never build up. */
export async function moveEntry(id: number, direction: "up" | "down") {
  await requireAdmin();
  await db.transaction(async (tx) => {
    const [row] = await tx.select({ kind: portfolioEntries.kind }).from(portfolioEntries).where(live(id)).limit(1);
    if (!row) return;
    const rows = await tx
      .select({ id: portfolioEntries.id })
      .from(portfolioEntries)
      .where(and(eq(portfolioEntries.kind, row.kind), isNull(portfolioEntries.deletedAt)))
      .orderBy(asc(portfolioEntries.sortOrder), asc(portfolioEntries.id));
    const order = rows.map((r) => r.id);
    const from = order.indexOf(id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= order.length) return;

    [order[from], order[to]] = [order[to], order[from]];
    for (const [index, rowId] of order.entries()) {
      await tx.update(portfolioEntries).set({ sortOrder: index }).where(eq(portfolioEntries.id, rowId));
    }
  });
  revalidateTag(PORTFOLIO_TAG, "max");
  refresh();
}

/* Adds freshly uploaded photos in one go (the Photos page's bulk upload); captions can be added after. */
export async function addPhotos(urls: string[]) {
  await requireAdmin();
  const result = z.array(z.url()).min(1).max(50).safeParse(urls);
  if (!result.success) throw new Error("Invalid photo list.");

  const start = await nextSortOrder("photo");
  await db
    .insert(portfolioEntries)
    .values(result.data.map((imageUrl, i) => ({ kind: "photo" as const, title: "", imageUrl, sortOrder: start + i })));
  revalidateTag(PORTFOLIO_TAG, "max");
  refresh();
}
