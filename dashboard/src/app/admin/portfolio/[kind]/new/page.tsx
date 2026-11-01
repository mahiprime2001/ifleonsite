import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { ENTRY_KINDS, kindFromSegment } from "@/lib/portfolio";
import { createEntry } from "../../actions";
import { EntryForm } from "../../EntryForm";

export const metadata: Metadata = { title: "New · Portfolio" };

export default function NewEntryPage({ params }: PageProps<"/admin/portfolio/[kind]/new">) {
  return (
    <Suspense fallback={<div className="card h-80 animate-pulse" />}>
      <NewEntry params={params} />
    </Suspense>
  );
}

async function NewEntry({ params }: Pick<PageProps<"/admin/portfolio/[kind]/new">, "params">) {
  await requireAdmin();
  const segment = (await params).kind;
  const kind = kindFromSegment(segment);
  if (!kind) notFound();
  const config = ENTRY_KINDS[kind];

  return (
    <div className="space-y-4">
      <div>
        <Link href={`/admin/portfolio/${segment}`} className="text-sm text-muted hover:underline">
          ← {config.plural}
        </Link>
        <h2 className="mt-1 text-xl font-medium">New {config.singular}</h2>
      </div>
      <EntryForm kind={kind} action={createEntry.bind(null, kind)} submitLabel={`Add ${config.singular}`} />
    </div>
  );
}
