import { and, count, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { contactMessages, posts, projects, testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <h1 className="page-title">Overview</h1>
      <Suspense fallback={<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{SKELETON}</div>}>
        <Stats />
      </Suspense>
    </div>
  );
}

const SKELETON = Array.from({ length: 4 }, (_, i) => <div key={i} className="card h-24 animate-pulse" />);

async function Stats() {
  await requireAdmin();
  const [postRows, [testimonialCount], [projectCount], [unreadCount]] = await Promise.all([
    db
      .select({ status: posts.status, value: count() })
      .from(posts)
      .where(isNull(posts.deletedAt))
      .groupBy(posts.status),
    db.select({ value: count() }).from(testimonials).where(isNull(testimonials.deletedAt)),
    db.select({ value: count() }).from(projects).where(eq(projects.isVisible, true)),
    db
      .select({ value: count() })
      .from(contactMessages)
      .where(and(eq(contactMessages.isRead, false), isNull(contactMessages.deletedAt))),
  ]);
  const byStatus = Object.fromEntries(postRows.map((r) => [r.status, r.value]));

  const cards = [
    { label: "Published posts", value: byStatus.published ?? 0, href: "/admin/posts" },
    { label: "Drafts", value: byStatus.draft ?? 0, href: "/admin/posts" },
    { label: "Testimonials", value: testimonialCount.value, href: "/admin/testimonials" },
    { label: "Visible projects", value: projectCount.value },
    { label: "Unread messages", value: unreadCount.value, href: "/admin/messages?filter=unread" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const body = (
          <>
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">{card.value}</p>
          </>
        );
        return card.href ? (
          <Link key={card.label} href={card.href} className="card p-5 hover:border-accent">
            {body}
          </Link>
        ) : (
          <div key={card.label} className="card p-5">
            {body}
          </div>
        );
      })}
    </div>
  );
}
