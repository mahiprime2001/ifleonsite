CREATE TABLE "ai_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar(20) NOT NULL,
	"provider" varchar(40),
	"model" varchar(120),
	"hint" text,
	"post_id" integer,
	"title" varchar(300),
	"input_tokens" integer,
	"output_tokens" integer,
	"duration_ms" integer,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ai_runs_created_at_idx" ON "ai_runs" USING btree ("created_at");