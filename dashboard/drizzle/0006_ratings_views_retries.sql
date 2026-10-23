ALTER TABLE "ai_runs" ADD COLUMN IF NOT EXISTS "retry_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "rating" integer;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "view_count" integer DEFAULT 0 NOT NULL;