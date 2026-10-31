import { z } from "zod";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { clientIp, corsHeaders } from "@/lib/public-api";
import { allowAttempt } from "@/lib/rate-limit";

/*
 * POST /api/public/contact — the contact forms on ifleon.com. Saves the message to the dashboard's
 * Messages page. Spam guards: 5 messages per visitor (IP) per 15 minutes, a size cap, and a hidden
 * "website" field that people leave empty but bots fill in (those get a fake success and are dropped).
 */

const MAX_BODY_BYTES = 20_000;

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

const contactInput = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(200),
  email: z.email("Please enter a valid email address.").max(320),
  phone: optional(40),
  company: optional(120),
  service: optional(200),
  message: z.string().trim().min(1, "Please write a message.").max(5000, "Please keep the message under 5000 characters."),
  website: z.string().optional(),
});

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request, "POST") });
}

export async function POST(request: Request) {
  const headers = corsHeaders(request, "POST");
  const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status, headers });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail(413, "The message is too long.");
  const body = await request.json().catch(() => undefined);
  if (body === undefined) return fail(400, "Invalid request.");

  const parsed = contactInput.safeParse(body);
  if (!parsed.success) return fail(400, parsed.error.issues.map((i) => i.message).join(" "));
  const input = parsed.data;

  if (input.website) return Response.json({ ok: true }, { headers }); // honeypot filled: a bot
  if (!allowAttempt(`contact:${clientIp(request)}`)) {
    return fail(429, "Too many messages from your connection. Please try again in 15 minutes, or email info@ifleon.com.");
  }

  try {
    await db.insert(contactMessages).values({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.service,
      message: input.company ? `Company: ${input.company}\n\n${input.message}` : input.message,
    });
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error("[public] failed to save a contact message:", error);
    return fail(500, "Something went wrong. Please try again, or email info@ifleon.com.");
  }
}
