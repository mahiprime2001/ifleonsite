import { and, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { portfolioEntries } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ENTRY_KINDS, kindFromSegment } from "@/lib/portfolio";
import { DeleteButton } from "../../../posts/DeleteButton";
import { deleteEntry, updateEntry } from "../../actions";
import { EntryForm } from "../../EntryForm";

export const metadata: Metadata = { title: "Edit · Portfolio" };

export default function EditEntryPage({ params }: PageProps<"/admin/portfolio/[kind]/[id]">) {
  return (
    <Suspense fallback={<div className="card h-80 animate-pulse" />}>
      <EditEntry params={params} />
    </Suspense>
  );
}

async function EditEntry({ params }: Pick<PageProps<"/admin/portfolio/[kind]/[id]">, "params">) {
  await requireAdmin();
  const { kind: segment, id: rawId } = await params;
  const kind = kindFromSegment(segment);
  const id = Number(rawId);
  if (!kind || !Number.isInteger(id) || id <= 0) notFound();

  const [e] = await db
    .select()
    .from(portfolioEntries)
    .where(and(eq(portfolioEntries.id, id), eq(portfolioEntries.kind, kind), isNull(portfolioEntries.deletedAt)))
    .limit(1);
  if (!e) notFound();
  const config = ENTRY_KINDS[kind];

  return (
    <div className="space-y-4">
      <Link href={`/admin/portfolio/${segment}`} className="text-sm text-muted hover:underline">
        ← {config.plural}
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-medium">{e.title || `Untitled ${config.singular}`}</h2>
        <DeleteButton
          action={deleteEntry.bind(null, e.id)}
          confirmMessage={`Move this ${config.singular} to Trash? You can restore it for 30 days.`}
        />
      </div>
      <EntryForm
        key={e.id}
        kind={kind}
        action={updateEntry.bind(null, e.id)}
        submitLabel="Save changes"
        initial={{
          title: e.title,
          slug: e.slug ?? "",
          subtitle: e.subtitle ?? "",
          location: e.location ?? "",
          startDate: e.startDate ?? "",
          endDate: e.endDate ?? "",
          summary: e.summary ?? "",
          body: e.body ?? "",
          imageUrl: e.imageUrl ?? "",
          gallery: e.gallery,
          url: e.url ?? "",
          repoUrl: e.repoUrl ?? "",
          tags: e.tags.join(", "),
          isFeatured: e.isFeatured,
          isPublished: e.isPublished,
        }}
      />
    </div>
  );
}
