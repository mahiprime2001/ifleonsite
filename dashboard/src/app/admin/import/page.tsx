import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { importStatus } from "@/lib/wordpress-import";
import { ImportForm } from "./ImportForm";

export const metadata: Metadata = { title: "Import" };

export default function ImportPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="page-title">Import from WordPress</h1>
        <p className="mt-1 text-sm text-muted">
          Copies your blog posts and testimonials from the WordPress site into the dashboard. WordPress itself is not changed.
          Images are downloaded to the VPS and post URLs (slugs) are kept the same. Safe to run again: anything already imported is
          skipped unless you choose to update it.
        </p>
      </div>
      <Suspense fallback={<div className="card h-24 animate-pulse" />}>
        <Status />
      </Suspense>
      <ImportForm />
    </div>
  );
}

async function Status() {
  await requireAdmin();
  await connection(); // live counts from WordPress at request time
  const s = await importStatus();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card p-4">
        <p className="text-sm text-muted">Posts</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {s.importedPosts} <span className="text-base font-normal text-muted">/ {s.wpPosts ?? "?"} on WordPress</span>
        </p>
      </div>
      <div className="card p-4">
        <p className="text-sm text-muted">Testimonials</p>
        <p className="mt-1 text-2xl font-semibold tabular-nums">
          {s.importedTestimonials} <span className="text-base font-normal text-muted">/ {s.wpTestimonials ?? "?"} on WordPress</span>
        </p>
      </div>
      <p className="text-xs text-muted sm:col-span-2">
        Source: {s.source}
        {s.wpPosts === null && " — couldn't reach the WordPress site right now."}
      </p>
    </div>
  );
}
