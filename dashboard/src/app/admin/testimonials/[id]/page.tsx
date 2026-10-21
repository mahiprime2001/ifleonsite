import { and, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { DeleteButton } from "../../posts/DeleteButton";
import { deleteTestimonial, updateTestimonial } from "../actions";
import { TestimonialForm } from "../TestimonialForm";

export const metadata: Metadata = { title: "Edit testimonial" };

export default function EditTestimonialPage({ params }: PageProps<"/admin/testimonials/[id]">) {
  return (
    <div className="space-y-6">
      <Link href="/admin/testimonials" className="text-sm text-muted hover:underline">
        ← Testimonials
      </Link>
      <Suspense fallback={<div className="card h-80 animate-pulse" />}>
        <EditTestimonial params={params} />
      </Suspense>
    </div>
  );
}

async function EditTestimonial({ params }: Pick<PageProps<"/admin/testimonials/[id]">, "params">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [t] = await db
    .select()
    .from(testimonials)
    .where(and(eq(testimonials.id, id), isNull(testimonials.deletedAt)))
    .limit(1);
  if (!t) notFound();

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="page-title">{t.name}</h1>
        <DeleteButton
          action={deleteTestimonial.bind(null, t.id)}
          confirmMessage="Move this testimonial to Trash? You can restore it for 30 days."
        />
      </div>
      <TestimonialForm
        key={t.id}
        action={updateTestimonial.bind(null, t.id)}
        submitLabel="Save changes"
        initial={{
          name: t.name,
          role: t.role ?? "",
          company: t.company ?? "",
          quote: t.quote,
          avatarUrl: t.avatarUrl ?? "",
          rating: t.rating ? String(t.rating) : "",
          isPublished: t.isPublished,
        }}
      />
    </>
  );
}
