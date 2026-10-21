import { and, desc, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage({ searchParams }: PageProps<"/admin/messages">) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Messages</h1>
        <p className="mt-1 text-sm text-muted">Sent through the contact form on the website.</p>
      </div>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <Inbox searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Inbox({ searchParams }: Pick<PageProps<"/admin/messages">, "searchParams">) {
  await requireAdmin();
  const unreadOnly = (await searchParams).filter === "unread";

  const rows = await db
    .select({
      id: contactMessages.id,
      name: contactMessages.name,
      email: contactMessages.email,
      subject: contactMessages.subject,
      message: contactMessages.message,
      isRead: contactMessages.isRead,
      createdAt: contactMessages.createdAt,
    })
    .from(contactMessages)
    .where(and(isNull(contactMessages.deletedAt), unreadOnly ? eq(contactMessages.isRead, false) : undefined))
    .orderBy(desc(contactMessages.createdAt))
    .limit(200);

  return (
    <div className="space-y-4">
      <div className="flex gap-1 text-sm">
        {[
          { href: "/admin/messages", label: "All", active: !unreadOnly },
          { href: "/admin/messages?filter=unread", label: "Unread", active: unreadOnly },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 ${tab.active ? "bg-surface-2 font-medium" : "text-muted hover:bg-surface-2"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="font-medium">{unreadOnly ? "No unread messages" : "No messages yet"}</p>
          <p className="mt-1 text-sm text-muted">
            Messages appear here once the website contact form is connected to the dashboard.
          </p>
        </div>
      ) : (
        <ul className="card divide-y divide-line">
          {rows.map((m) => (
            <li key={m.id}>
              <Link href={`/admin/messages/${m.id}`} className="flex gap-4 p-4 hover:bg-surface-2">
                <span
                  aria-label={m.isRead ? "Read" : "Unread"}
                  className={`mt-2 size-2 shrink-0 rounded-full ${m.isRead ? "" : "bg-accent"}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className={m.isRead ? "" : "font-semibold"}>
                      {m.name} <span className="text-sm font-normal text-muted">{m.email}</span>
                    </p>
                    <p className="text-xs whitespace-nowrap text-muted">{formatDateTime(m.createdAt)}</p>
                  </div>
                  {m.subject && <p className={`text-sm ${m.isRead ? "" : "font-medium"}`}>{m.subject}</p>}
                  <p className="line-clamp-1 text-sm text-muted">{m.message}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
