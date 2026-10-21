import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { createTestimonial } from "../actions";
import { TestimonialForm } from "../TestimonialForm";

export const metadata: Metadata = { title: "New testimonial" };

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/testimonials" className="text-sm text-muted hover:underline">
          ← Testimonials
        </Link>
        <h1 className="page-title mt-1">New testimonial</h1>
      </div>
      <Suspense fallback={<div className="card h-80 animate-pulse" />}>
        <NewTestimonialForm />
      </Suspense>
    </div>
  );
}

async function NewTestimonialForm() {
  await requireAdmin();
  return <TestimonialForm action={createTestimonial} submitLabel="Add testimonial" />;
}
