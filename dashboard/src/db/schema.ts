import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/*
 * A post is "scheduled" when status is published and publishedAt is in the future,
 * so there's no separate scheduled state to keep in sync.
 */
export const postStatus = pgEnum("post_status", ["draft", "published", "archived"]);

/* Where a piece of content came from: typed in the dashboard, drafted by AI, or imported from WordPress. */
export const contentSource = pgEnum("content_source", ["manual", "ai", "wordpress"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 300 }).notNull(),
    excerpt: text("excerpt"),
    /* Markdown. The public site already renders markdown with react-markdown. */
    content: text("content").notNull().default(""),
    coverImageUrl: text("cover_image_url"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    status: postStatus("status").notNull().default("draft"),
    source: contentSource("source").notNull().default("manual"),
    seoTitle: varchar("seo_title", { length: 300 }),
    seoDescription: varchar("seo_description", { length: 500 }),
    authorName: varchar("author_name", { length: 120 }).notNull().default("IFLEON"),
    /* Original WordPress post id, so the import can be re-run without duplicates. */
    wpId: integer("wp_id").unique(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    /* Set when moved to Trash; purged permanently after TRASH_DAYS (lib/trash.ts). */
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    /* User feedback: null (no rating), 1 (thumbs up), -1 (thumbs down). Used to improve topic selection. */
    rating: integer("rating"),
    /* Number of times this post has been viewed. */
    viewCount: integer("view_count").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("posts_status_published_at_idx").on(t.status, t.publishedAt)],
);

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  role: varchar("role", { length: 120 }),
  company: varchar("company", { length: 120 }),
  quote: text("quote").notNull(),
  avatarUrl: text("avatar_url"),
  rating: integer("rating"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  wpId: integer("wp_id").unique(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
  ...timestamps,
});

/* GitHub repos shown on the site. `github` caches the last API response so pages don't hit GitHub per visit. */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  repoFullName: varchar("repo_full_name", { length: 200 }).notNull().unique(),
  isVisible: boolean("is_visible").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  titleOverride: varchar("title_override", { length: 200 }),
  summaryOverride: text("summary_override"),
  demoUrl: text("demo_url"),
  github: jsonb("github"),
  syncedAt: timestamp("synced_at", { withTimezone: true }),
  ...timestamps,
});

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 40 }),
    subject: varchar("subject", { length: 300 }),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("contact_messages_created_at_idx").on(t.createdAt)],
);

/*
 * Keys for the HTTP API (/api/v1). Only a SHA-256 hash of each key is stored; the key itself is
 * shown once when created. `prefix` is the first characters, kept so keys can be told apart.
 */
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  prefix: varchar("prefix", { length: 16 }).notNull(),
  keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
  /* e.g. posts:create, posts:publish, posts:read */
  scopes: text("scopes").array().notNull().default(sql`'{}'::text[]`),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* One row per AI writer run: which provider/model, what it cost in tokens, and what came out. */
export const aiRuns = pgTable(
  "ai_runs",
  {
    id: serial("id").primaryKey(),
    /* success | error | duplicate (rejected as too close to an existing post) */
    status: varchar("status", { length: 20 }).notNull(),
    provider: varchar("provider", { length: 40 }),
    model: varchar("model", { length: 120 }),
    hint: text("hint"),
    postId: integer("post_id"),
    title: varchar("title", { length: 300 }),
    inputTokens: integer("input_tokens"),
    outputTokens: integer("output_tokens"),
    durationMs: integer("duration_ms"),
    error: text("error"),
    /* Number of times this draft was retried before success or final failure. */
    retryCount: integer("retry_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ai_runs_created_at_idx").on(t.createdAt)],
);

/*
 * AI autopilot jobs: keep writing drafts one after another until stopped, a post limit is reached,
 * or every provider's quota is used up. At most one job is "running" at a time (lib/ai/autopilot.ts).
 */
export const aiJobs = pgTable("ai_jobs", {
  id: serial("id").primaryKey(),
  /* running | stopping | stopped | finished | failed */
  status: varchar("status", { length: 20 }).notNull(),
  hint: text("hint"),
  maxPosts: integer("max_posts"),
  postsCreated: integer("posts_created").notNull().default(0),
  failures: integer("failures").notNull().default(0),
  /* What the job is doing right now, e.g. "Writing draft 4" or "Waiting 30s for gemini's rate limit". */
  activity: text("activity"),
  lastPostId: integer("last_post_id"),
  lastError: text("last_error"),
  stopReason: text("stop_reason"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

/* Dashboard settings as JSON per key (e.g. "ai"). Secrets inside are encrypted (lib/crypto.ts). */
export const appSettings = pgTable("app_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

/*
 * Portfolio (mahendra.ifleon.com). The profile is a single row (id 1); everything else shown on the
 * portfolio is a portfolio entry, told apart by `kind` (lib/portfolio.ts says which fields each kind uses).
 */
export const portfolioProfile = pgTable("portfolio_profile", {
  id: integer("id").primaryKey().default(1),
  name: varchar("name", { length: 120 }).notNull().default(""),
  headline: varchar("headline", { length: 200 }).notNull().default(""),
  /* One or two sentences under the name. */
  intro: text("intro").notNull().default(""),
  /* Markdown, for the About section. */
  bio: text("bio").notNull().default(""),
  location: varchar("location", { length: 120 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 40 }),
  /* e.g. "Open to freelance work"; empty hides the badge. */
  availability: varchar("availability", { length: 160 }),
  photoUrl: text("photo_url"),
  resumeUrl: text("resume_url"),
  /* [{ label: "GitHub", url: "https://github.com/…" }, …] in display order. */
  links: jsonb("links").$type<{ label: string; url: string }[]>().notNull().default([]),
  seoTitle: varchar("seo_title", { length: 300 }),
  seoDescription: varchar("seo_description", { length: 500 }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const portfolioKind = pgEnum("portfolio_kind", [
  "project",
  "experience",
  "education",
  "skill",
  "certification",
  "achievement",
  "photo",
]);

export const portfolioEntries = pgTable(
  "portfolio_entries",
  {
    id: serial("id").primaryKey(),
    kind: portfolioKind("kind").notNull(),
    /* Projects only: the address of the project's own page. */
    slug: varchar("slug", { length: 200 }).unique(),
    title: varchar("title", { length: 300 }).notNull(),
    /* Company, school, issuer, or a skill's group, depending on the kind. */
    subtitle: varchar("subtitle", { length: 300 }),
    location: varchar("location", { length: 120 }),
    /* Free text such as "2023-06" or "Jun 2023", so partial dates work. Empty end date means "Present". */
    startDate: varchar("start_date", { length: 40 }),
    endDate: varchar("end_date", { length: 40 }),
    summary: text("summary"),
    /* Markdown. */
    body: text("body"),
    imageUrl: text("image_url"),
    gallery: text("gallery").array().notNull().default(sql`'{}'::text[]`),
    url: text("url"),
    repoUrl: text("repo_url"),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("portfolio_entries_kind_sort_idx").on(t.kind, t.sortOrder)],
);

export type PortfolioEntry = typeof portfolioEntries.$inferSelect;
export type PortfolioKind = (typeof portfolioKind.enumValues)[number];

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
