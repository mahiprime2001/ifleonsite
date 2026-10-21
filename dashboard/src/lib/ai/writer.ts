import { count, desc, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { aiRuns, posts } from "@/db/schema";
import { isUniqueViolation } from "@/lib/db-errors";
import { slugify } from "@/lib/slug";
import { getAiConfig } from "./config";
import { AllProvidersFailed, generateWithFallback, type GenerateOptions, type GenerateResult } from "./providers";

/*
 * The AI blog writer. The model picks its own topic (projects, debugging stories, DevOps, cloud,
 * AI, security, tutorials...), is shown every existing post so it doesn't repeat one, and writes
 * tags/excerpt/SEO fields itself. Saved as published or as a draft, per the autoPublish setting.
 */

const MAX_ATTEMPTS = 3;
const SIMILARITY_LIMIT = 0.6;
const MAX_RETRIES = 2;
const RETRY_DELAYS_MS = [5000, 15000]; // Exponential backoff: 5s, 15s

const SYSTEM_PROMPT = `You write blog posts for IFLEON, an IT consultancy from India that works on AI, DevOps, cloud engineering, cybersecurity and software projects.

You choose the topic yourself. Anything a practising engineer would find genuinely useful is fair game, for example:
- a debugging story: a real-feeling bug, how it was tracked down, and the fix
- lessons from building or running a project (deployments, migrations, scaling, outages)
- a practical tutorial or checklist (CI/CD, Docker, Kubernetes, cloud cost, monitoring, security hardening)
- applied AI for businesses: what works, what doesn't, how to start safely
- engineering opinions with clear reasoning (tool choices, trade-offs, architecture)

Rules:
- Pick a topic that is clearly different from every existing post you are shown. Rewording an existing title or covering the same idea from the same angle is not allowed.
- Be honest. Do not invent named clients, real company names, quotes, awards or precise statistics. If you use an example scenario, write it as an illustration ("Say a team...", "In a typical setup...").
- Write for developers, founders and IT managers. Plain, direct language. No hype, no filler intros like "In today's fast-paced world".
- Content is Markdown: start directly with the body (no H1 title), use ## and ### headings, short paragraphs and lists. Aim for 900-1600 words. Use these formats where they genuinely help the reader (not all in every post):
  - Code: fenced code blocks ALWAYS with a language tag (\`\`\`bash, \`\`\`ts, \`\`\`python, \`\`\`yaml, \`\`\`dockerfile, \`\`\`sql...). Readers get a Copy button, so keep each block complete and runnable; put explanations in the text, not as long comments.
  - Callout boxes, written as a blockquote whose first line is a marker:
    > [!TIP]
    > A shortcut or good practice.
    Markers: [!NOTE] background info, [!TIP] helpful advice, [!IMPORTANT] must-know, [!WARNING] risks or common mistakes, [!CAUTION] things that can break production or lose data. Use 1-3 per post, never back to back.
  - Tables for comparisons (| Option | Pros | Cons |), and "- [ ] item" checklists for step lists the reader will follow.
- End with a short practical takeaway section. Do not add a sales pitch beyond, at most, one closing sentence that IFLEON can help.
- tags: 3-6 short lowercase tags. Reuse existing tags from the list you are given when they fit; add new ones only when needed.
- slug: lowercase words joined by hyphens, under 80 characters.
- seoTitle: up to 60 characters. seoDescription: 120-155 characters, a plain summary.
- excerpt: one or two sentences, under 250 characters.
- topicReason: one sentence on why this topic, and how it differs from the existing posts.

Reply with ONLY a JSON object with exactly these keys: topicReason, title, slug, excerpt, tags (array of strings), seoTitle, seoDescription, content. No text before or after the JSON.`;

const draftSchema = z.object({
  topicReason: z.string().trim().max(600).catch(""),
  title: z.string().trim().min(8).max(160),
  slug: z.string().trim().max(160).catch(""),
  excerpt: z.string().trim().min(20).max(500),
  tags: z.array(z.string().trim().min(1).max(40)).min(1).max(10),
  seoTitle: z.string().trim().max(160).catch(""),
  seoDescription: z.string().trim().max(400).catch(""),
  content: z.string().trim().min(1200, "post is too short"),
});
type Draft = z.infer<typeof draftSchema>;

/* Pulls the JSON object out of a model reply (handles ```json fences and <think> blocks). */
function parseDraft(text: string): { ok: true; draft: Draft } | { ok: false; reason: string } {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return { ok: false, reason: "reply did not contain a JSON object" };
  let json: unknown;
  try {
    json = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return { ok: false, reason: "reply was not valid JSON" };
  }
  const result = draftSchema.safeParse(json);
  if (!result.success) {
    const issue = result.error.issues[0];
    return { ok: false, reason: `invalid field "${issue?.path.join(".")}": ${issue?.message}` };
  }
  return { ok: true, draft: result.data };
}

const STOPWORDS = new Set(
  "a an and are as at be by do does for from how i in is it its my of on or our the to vs we what when why with you your".split(" "),
);

function titleWords(title: string) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOPWORDS.has(w)),
  );
}

/* Word-overlap (Jaccard) between two titles, 0..1. */
function similarity(a: string, b: string) {
  const wa = titleWords(a);
  const wb = titleWords(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared / (wa.size + wb.size - shared);
}

type ExistingPost = { title: string; slug: string; tags: string[] };

function findDuplicate(draft: Draft, existing: ExistingPost[]) {
  const slug = slugify(draft.slug || draft.title);
  return existing.find((p) => p.slug === slug || similarity(p.title, draft.title) >= SIMILARITY_LIMIT) ?? null;
}

function buildPrompt(existing: ExistingPost[], hint: string | null, feedback: string[], wellRatedTopics: string[] = []) {
  const tagCounts = new Map<string, number>();
  for (const p of existing) for (const t of p.tags) if (t !== "demo") tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  const tags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);

  const lines = [
    existing.length > 0
      ? `Existing posts (do NOT repeat or reword any of these):\n${existing.map((p) => `- ${p.title}`).join("\n")}`
      : "There are no posts yet, so any good topic works.",
    tags.length > 0 ? `Existing tags you can reuse: ${tags.join(", ")}` : "",
    wellRatedTopics.length > 0
      ? `Topics that readers particularly liked (focus on these if relevant): ${wellRatedTopics.join(", ")}`
      : "",
    hint ? `The editor left this optional note about what to write (follow it if it makes sense):\n${hint}` : "Choose the topic entirely yourself.",
    ...feedback,
    "Write the post now. Reply with only the JSON object.",
  ];
  return lines.filter(Boolean).join("\n\n");
}

function cleanTags(tags: string[]) {
  return [...new Set(tags.map((t) => slugify(t)).filter(Boolean))].slice(0, 6);
}

export async function aiRunsInLast24h() {
  const [row] = await db
    .select({ value: count() })
    .from(aiRuns)
    .where(gte(aiRuns.createdAt, sql`now() - interval '24 hours'`));
  return row.value;
}

/* Get tags from well-rated posts (rating = 1, thumbs up). Used to inform topic selection. */
async function getWellRatedTopics(): Promise<string[]> {
  const rated = await db
    .select({ tags: posts.tags })
    .from(posts)
    .where(eq(posts.rating, 1))
    .orderBy(desc(posts.createdAt))
    .limit(20);

  const tagCounts = new Map<string, number>();
  for (const post of rated) {
    for (const tag of post.tags) {
      if (tag !== "demo") tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  return [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag]) => tag);
}

/*
 * Why a run failed, so the autopilot knows whether to keep going:
 * limit = dashboard's own daily cap; quota = every provider's quota used up; rate = providers busy;
 * stopped = Stop was pressed while waiting; duplicate/error = this draft failed, the next may work.
 */
export type FailReason = "limit" | "quota" | "rate" | "stopped" | "duplicate" | "error";

export type WriteResult =
  | { ok: true; postId: number; title: string; provider: string; model: string; topicReason: string; published: boolean }
  | { ok: false; error: string; reason: FailReason };

export async function writeAiDraft(hint: string | null, opts: GenerateOptions = {}): Promise<WriteResult> {
  const { dailyLimit, autoPublish } = await getAiConfig();
  if (dailyLimit > 0 && (await aiRunsInLast24h()) >= dailyLimit) {
    return {
      ok: false,
      reason: "limit",
      error: `Daily limit reached (${dailyLimit} runs in 24 hours). Raise it or set it to 0 on the Settings page.`,
    };
  }

  const started = Date.now();
  // Trashed posts count too: if you deleted a topic, the writer shouldn't bring it back.
  const existing: ExistingPost[] = await db
    .select({ title: posts.title, slug: posts.slug, tags: posts.tags })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(400);

  const wellRatedTopics = await getWellRatedTopics();

  let inputTokens = 0;
  let outputTokens = 0;
  let last: GenerateResult | null = null;
  let lastProblem = "";
  let status: "error" | "duplicate" = "error";
  let reason: FailReason = "error";
  let retryCount = 0;
  const feedback: string[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      last = await generateWithFallback({ system: SYSTEM_PROMPT, prompt: buildPrompt(existing, hint, feedback, wellRatedTopics) }, opts);
    } catch (error) {
      lastProblem = error instanceof Error ? error.message : String(error);
      reason = error instanceof AllProvidersFailed ? error.reason : "error";
      // Pressing Stop isn't a failed run; don't log it.
      if (reason === "stopped") return { ok: false, reason, error: "Stopped." };

      // Retry with exponential backoff on generation failure
      if (retryCount < MAX_RETRIES) {
        const delayMs = RETRY_DELAYS_MS[retryCount];
        console.log(`Generation failed, retrying after ${delayMs}ms (attempt ${attempt + 1}/${MAX_ATTEMPTS})...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        retryCount++;
        continue;
      }
      break; // every retry exhausted; retrying further won't help
    }
    inputTokens += last.inputTokens ?? 0;
    outputTokens += last.outputTokens ?? 0;

    const parsed = parseDraft(last.text);
    if (!parsed.ok) {
      lastProblem = parsed.reason;
      status = "error";
      reason = "error";
      feedback.push(`Your previous reply could not be used (${parsed.reason}). Reply with only a valid JSON object this time.`);
      continue;
    }

    const duplicate = findDuplicate(parsed.draft, existing);
    if (duplicate) {
      lastProblem = `"${parsed.draft.title}" is too close to the existing post "${duplicate.title}"`;
      status = "duplicate";
      reason = "duplicate";
      feedback.push(`Your previous idea "${parsed.draft.title}" is too close to the existing post "${duplicate.title}". Pick a clearly different topic.`);
      continue;
    }

    const postId = await savePost(parsed.draft, autoPublish);
    await db.insert(aiRuns).values({
      status: "success",
      provider: last.provider,
      model: last.model,
      hint,
      postId,
      title: parsed.draft.title,
      inputTokens,
      outputTokens,
      durationMs: Date.now() - started,
      retryCount,
    });
    return {
      ok: true,
      postId,
      title: parsed.draft.title,
      provider: last.provider,
      model: last.model,
      topicReason: parsed.draft.topicReason,
      published: autoPublish,
    };
  }

  await db.insert(aiRuns).values({
    status,
    provider: last?.provider ?? null,
    model: last?.model ?? null,
    hint,
    inputTokens: inputTokens || null,
    outputTokens: outputTokens || null,
    durationMs: Date.now() - started,
    error: lastProblem.slice(0, 2000),
    retryCount,
  });
  return { ok: false, reason, error: lastProblem || "The AI writer could not produce a draft." };
}

/* Saves with a unique slug (adds -2, -3... if taken, including by posts in Trash). Published now, or as a draft. */
async function savePost(draft: Draft, publish: boolean) {
  const base = slugify(draft.slug || draft.title).slice(0, 120) || "post";
  for (let n = 1; n <= 20; n++) {
    try {
      const [row] = await db
        .insert(posts)
        .values({
          slug: n === 1 ? base : `${base}-${n}`,
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          tags: cleanTags(draft.tags),
          seoTitle: draft.seoTitle || null,
          seoDescription: draft.seoDescription || null,
          status: publish ? "published" : "draft",
          publishedAt: publish ? new Date() : null,
          source: "ai",
        })
        .returning({ id: posts.id });
      return row.id;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
  throw new Error("Could not find a free slug for the AI post.");
}
