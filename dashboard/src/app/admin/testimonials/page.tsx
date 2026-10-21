import { asc, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { moveTestimonial, setTestimonialPublished } from "./actions";

export const metadata: Metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Testimonials</h1>
          <p className="mt-1 text-sm text-muted">Shown on the website in this order.</p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary">
          New testimonial
        </Link>
      </div>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <TestimonialList />
      </Suspense>
    </div>
  );
}

async function TestimonialList() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(testimonials)
    .where(isNull(testimonials.deletedAt))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));

  if (rows.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-medium">No testimonials yet</p>
        <p className="mt-1 text-sm text-muted">Add one, or import them from WordPress later.</p>
      </div>
    );
  }

  return (
    <ul className="card divide-y divide-line">
      {rows.map((t, index) => (
        <li key={t.id} className="flex items-start gap-4 p-4">
          <div className="flex flex-col gap-1">
            <form action={moveTestimonial.bind(null, t.id, "up")}>
              <button
                type="submit"
                disabled={index === 0}
                aria-label={`Move ${t.name} up`}
                className="rounded px-2 text-muted hover:bg-surface-2 disabled:opacity-30"
              >
                ▲
              </button>
            </form>
            <form action={moveTestimonial.bind(null, t.id, "down")}>
              <button
                type="submit"
                disabled={index === rows.length - 1}
                aria-label={`Move ${t.name} down`}
                className="rounded px-2 text-muted hover:bg-surface-2 disabled:opacity-30"
              >
                ▼
              </button>
            </form>
          </div>

          <div className="min-w-0 flex-1">
            <Link href={`/admin/testimonials/${t.id}`} className="font-medium hover:underline">
              {t.name}
            </Link>
            <span className="text-sm text-muted">
              {[t.role, t.company].filter(Boolean).length > 0 && " · "}
              {[t.role, t.company].filter(Boolean).join(", ")}
              {t.rating ? ` · ${"★".repeat(t.rating)}` : ""}
            </span>
            <p className="mt-1 line-clamp-2 text-sm text-muted">“{t.quote}”</p>
          </div>

          <form action={setTestimonialPublished.bind(null, t.id, !t.isPublished)}>
            <button
              type="submit"
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                t.isPublished ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"
              }`}
              title={t.isPublished ? "Click to hide from the website" : "Click to show on the website"}
            >
              {t.isPublished ? "Visible" : "Hidden"}
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}
