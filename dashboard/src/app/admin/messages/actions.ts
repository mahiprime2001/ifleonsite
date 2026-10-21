"use server";

import { and, eq, isNull } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

const live = (id: number) => and(eq(contactMessages.id, id), isNull(contactMessages.deletedAt));

export async function setMessageRead(id: number, isRead: boolean) {
  await requireAdmin();
  await db.update(contactMessages).set({ isRead }).where(live(id));
  refresh();
}

/* Goes back to the inbox: staying on the message page would mark it read again on load. */
export async function markMessageUnread(id: number) {
  await requireAdmin();
  await db.update(contactMessages).set({ isRead: false }).where(live(id));
  redirect("/admin/messages");
}

/* Moves the message to Trash (kept 30 days, restorable). */
export async function deleteMessage(id: number) {
  await requireAdmin();
  await db.update(contactMessages).set({ deletedAt: new Date() }).where(live(id));
  redirect("/admin/messages");
}
