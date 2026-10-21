CREATE TABLE "ai_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" varchar(20) NOT NULL,
	"hint" text,
	"max_posts" integer,
	"posts_created" integer DEFAULT 0 NOT NULL,
	"failures" integer DEFAULT 0 NOT NULL,
	"activity" text,
	"last_post_id" integer,
	"last_error" text,
	"stop_reason" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
