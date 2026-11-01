import { and, asc, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { type PortfolioEntry, portfolioEntries, type PortfolioKind } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { ENTRY_KINDS, kindFromSegment } from "@/lib/portfolio";
import { moveEntry, setEntryPublished } from "../actions";
import { PhotoUploader } from "../PhotoUploader";

export async function generateMetadata({ params }: PageProps<"/admin/portfolio/[kind]">): Promise<Metadata> {
  const kind = kindFromSegment((await params).kind);
  return { title: kind ? `${ENTRY_KINDS[kind].plural} · Portfolio` : "Portfolio" };
}

export default function PortfolioKindPage({ params }: PageProps<"/admin/portfolio/[kind]">) {
  return (
    <Suspense fallback={<div className="card h-64 animate-pulse" />}>
      <KindList params={params} />
    </Suspense>
  );
}

async function KindList({ params }: Pick<PageProps<"/admin/portfolio/[kind]">, "params">) {
  await requireAdmin();
  const segment = (await params).kind;
  const kind = kindFromSegment(segment);
  if (!kind) notFound();
  const config = ENTRY_KINDS[kind];

  const rows = await db
    .select()
    .from(portfolioEntries)
    .where(and(eq(portfolioEntries.kind, kind), isNull(portfolioEntries.deletedAt)))
    .orderBy(asc(portfolioEntries.sortOrder), asc(portfolioEntries.id));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted">{config.description}</p>
        <div className="flex gap-2">
          {kind === "photo" && <PhotoUploader />}
          <Link href={`/admin/portfolio/${segment}/new`} className={kind === "photo" ? "btn-secondary" : "btn-primary"}>
            New {config.singular}
          </Link>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium">No {config.plural.toLowerCase()} yet</p>
          <p className="mt-1 text-sm text-muted">
            {kind === "photo" ? "Upload a few photos to get started." : `Add your first ${config.singular}.`}
          </p>
        </div>
      ) : kind === "photo" ? (
        <PhotoGrid rows={rows} segment={segment} />
      ) : (
        <EntryList rows={rows} segment={segment} kind={kind} />
      )}
    </div>
  );
}

function detailLine(kind: PortfolioKind, e: PortfolioEntry) {
  const end = e.endDate || (kind === "certification" ? "no expiry" : "Present");
  const dates = e.startDate ? (kind === "achievement" ? e.startDate : `${e.startDate} – ${end}`) : null;
  return [e.subtitle, e.location, dates].filter(Boolean).join(" · ");
}

function MoveButtons({ entry, index, count }: { entry: PortfolioEntry; index: number; count: number }) {
  const name = entry.title || "this photo";
  return (
    <>
      <form action={moveEntry.bind(null, entry.id, "up")}>
        <button type="submit" disabled={index === 0} aria-label={`Move ${name} up`} className="rounded px-2 text-muted hover:bg-surface-2 disabled:opacity-30">
          ▲
        </button>
      </form>
      <form action={moveEntry.bind(null, entry.id, "down")}>
        <button type="submit" disabled={index === count - 1} aria-label={`Move ${name} down`} className="rounded px-2 text-muted hover:bg-surface-2 disabled:opacity-30">
          ▼
        </button>
      </form>
    </>
  );
}

function VisibilityToggle({ entry }: { entry: PortfolioEntry }) {
  return (
    <form action={setEntryPublished.bind(null, entry.id, !entry.isPublished)}>
      <button
        type="submit"
        className={`rounded-full px-3 py-1 text-xs font-medium ${entry.isPublished ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"}`}
        title={entry.isPublished ? "Click to hide from the site" : "Click to show on the site"}
      >
        {entry.isPublished ? "Visible" : "Hidden"}
      </button>
    </form>
  );
}

function EntryList({ rows, segment, kind }: { rows: PortfolioEntry[]; segment: string; kind: PortfolioKind }) {
  return (
    <ul className="card divide-y divide-line">
      {rows.map((e, index) => {
        const detail = detailLine(kind, e);
        return (
          <li key={e.id} className="flex items-start gap-4 p-4">
            <div className="flex flex-col gap-1">
              <MoveButtons entry={e} index={index} count={rows.length} />
            </div>
            {e.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host
              <img src={e.imageUrl} alt="" className="size-14 shrink-0 rounded-md border border-line object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/admin/portfolio/${segment}/${e.id}`} className="font-medium hover:underline">
                {e.title}
              </Link>
              {e.isFeatured && <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-accent">Featured</span>}
              {detail && <p className="text-sm text-muted">{detail}</p>}
              {e.summary && <p className="mt-1 line-clamp-2 text-sm text-muted">{e.summary}</p>}
              {e.tags.length > 0 && <p className="mt-1 truncate text-xs text-muted">{e.tags.join(" · ")}</p>}
            </div>
            <VisibilityToggle entry={e} />
          </li>
        );
      })}
    </ul>
  );
}

function PhotoGrid({ rows, segment }: { rows: PortfolioEntry[]; segment: string }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {rows.map((e, index) => (
        <li key={e.id} className="card overflow-hidden">
          <Link href={`/admin/portfolio/${segment}/${e.id}`} className="block">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host */}
            <img src={e.imageUrl ?? ""} alt={e.summary ?? ""} className="aspect-[4/3] w-full object-cover" />
          </Link>
          <div className="space-y-2 p-3">
            <Link href={`/admin/portfolio/${segment}/${e.id}`} className="block truncate text-sm hover:underline">
              {e.title || <span className="text-muted">Add a caption</span>}
              {e.isFeatured && <span className="ml-2 text-xs text-accent">Featured</span>}
            </Link>
            <div className="flex items-center justify-between">
              <span className="flex">
                <MoveButtons entry={e} index={index} count={rows.length} />
              </span>
              <VisibilityToggle entry={e} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
