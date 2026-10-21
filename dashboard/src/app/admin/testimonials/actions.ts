"use server";

import { and, asc, eq, isNull, max } from "drizzle-orm";
import { refresh, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

/* A testimonial that hasn't been moved to Trash. */
const live = (id: number) => and(eq(testimonials.id, id), isNull(testimonials.deletedAt));

export type TestimonialFormState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; saved?: boolean }
  | undefined;

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

const testimonialInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  role: nullableText(120),
  company: nullableText(120),
  quote: z.string().trim().min(1, "Quote is required").max(2000),
  avatarUrl: z
    .union([z.literal(""), z.url("Must be a full URL, e.g. https://…")])
    .transform((v) => (v === "" ? null : v)),
  rating: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(5)])
    .transform((v) => (v === "" ? null : v)),
  isPublished: z.enum(["true", "false"]).transform((v) => v === "true"),
});

function parse(formData: FormData) {
  const result = testimonialInput.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      ok: false as const,
      state: {
        error: "Fix the highlighted fields.",
        fieldErrors: z.flattenError(result.error).fieldErrors,
      } satisfies TestimonialFormState,
    };
  }
  return { ok: true as const, values: result.data };
}

export async function createTestimonial(
  _prev: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) return parsed.state;

  // New testimonials go to the end of the list.
  const [{ last }] = await db
    .select({ last: max(testimonials.sortOrder) })
    .from(testimonials)
    .where(isNull(testimonials.deletedAt));
  await db.insert(testimonials).values({ ...parsed.values, sortOrder: (last ?? -1) + 1 });

  revalidateTag("testimonials", "max");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: number,
  _prev: TestimonialFormState,
  formData: FormData,
): Promise<TestimonialFormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) return parsed.state;

  await db.update(testimonials).set(parsed.values).where(live(id));
  revalidateTag("testimonials", "max");
  refresh();
  return { saved: true };
}

/* Moves the testimonial to Trash (kept 30 days, restorable). */
export async function deleteTestimonial(id: number) {
  await requireAdmin();
  await db.update(testimonials).set({ deletedAt: new Date() }).where(live(id));
  revalidateTag("testimonials", "max");
  redirect("/admin/testimonials");
}

export async function setTestimonialPublished(id: number, isPublished: boolean) {
  await requireAdmin();
  await db.update(testimonials).set({ isPublished }).where(live(id));
  revalidateTag("testimonials", "max");
  refresh();
}

/* Moves one testimonial up or down and renumbers the whole list, so gaps and ties never build up. */
export async function moveTestimonial(id: number, direction: "up" | "down") {
  await requireAdmin();
  await db.transaction(async (tx) => {
    const rows = await tx
      .select({ id: testimonials.id })
      .from(testimonials)
      .where(isNull(testimonials.deletedAt))
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
    const order = rows.map((r) => r.id);
    const from = order.indexOf(id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= order.length) return;

    [order[from], order[to]] = [order[to], order[from]];
    for (const [index, rowId] of order.entries()) {
      await tx.update(testimonials).set({ sortOrder: index }).where(eq(testimonials.id, rowId));
    }
  });
  revalidateTag("testimonials", "max");
  refresh();
}
