import { and, eq, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { DeleteButton } from "../../posts/DeleteButton";
import { deleteMessage, markMessageUnread, setMessageRead } from "../actions";
import { MarkAsRead } from "../MarkAsRead";

export const metadata: Metadata = { title: "Message" };

export default function MessagePage({ params }: PageProps<"/admin/messages/[id]">) {
  return (
    <div className="space-y-6">
      <Link href="/admin/messages" className="text-sm text-muted hover:underline">
        ← Messages
      </Link>
      <Suspense fallback={<div className="card h-64 animate-pulse" />}>
        <Message params={params} />
      </Suspense>
    </div>
  );
}

async function Message({ params }: Pick<PageProps<"/admin/messages/[id]">, "params">) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [m] = await db
    .select()
    .from(contactMessages)
    .where(and(eq(contactMessages.id, id), isNull(contactMessages.deletedAt)))
    .limit(1);
  if (!m) notFound();

  const replySubject = encodeURIComponent(`Re: ${m.subject || "Your message to IFLEON"}`);

  return (
    <div className="max-w-3xl space-y-4">
      {!m.isRead && <MarkAsRead action={setMessageRead.bind(null, m.id, true)} />}

      <div className="card space-y-4 p-6">
        <div>
          <h1 className="page-title">{m.subject || "Message"}</h1>
          <p className="mt-2 text-sm">
            <span className="font-medium">{m.name}</span>{" "}
            <a href={`mailto:${m.email}`} className="text-accent hover:underline">
              {m.email}
            </a>
            {m.phone && (
              <>
                {" · "}
                <a href={`tel:${m.phone}`} className="text-accent hover:underline">
                  {m.phone}
                </a>
              </>
            )}
          </p>
          <p className="text-xs text-muted">{formatDateTime(m.createdAt)}</p>
        </div>
        <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a href={`mailto:${m.email}?subject=${replySubject}`} className="btn-primary">
          Reply by email
        </a>
        <form action={markMessageUnread.bind(null, m.id)}>
          <button type="submit" className="btn-secondary">
            Mark as unread
          </button>
        </form>
        <DeleteButton action={deleteMessage.bind(null, m.id)} confirmMessage="Move this message to Trash? You can restore it for 30 days." />
      </div>
    </div>
  );
}
