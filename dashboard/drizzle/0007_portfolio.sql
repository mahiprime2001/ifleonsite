CREATE TYPE "public"."portfolio_kind" AS ENUM('project', 'experience', 'education', 'skill', 'certification', 'achievement', 'photo');--> statement-breakpoint
CREATE TABLE "portfolio_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"kind" "portfolio_kind" NOT NULL,
	"slug" varchar(200),
	"title" varchar(300) NOT NULL,
	"subtitle" varchar(300),
	"location" varchar(120),
	"start_date" varchar(40),
	"end_date" varchar(40),
	"summary" text,
	"body" text,
	"image_url" text,
	"gallery" text[] DEFAULT '{}'::text[] NOT NULL,
	"url" text,
	"repo_url" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_entries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "portfolio_profile" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" varchar(120) DEFAULT '' NOT NULL,
	"headline" varchar(200) DEFAULT '' NOT NULL,
	"intro" text DEFAULT '' NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"location" varchar(120),
	"email" varchar(320),
	"phone" varchar(40),
	"availability" varchar(160),
	"photo_url" text,
	"resume_url" text,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seo_title" varchar(300),
	"seo_description" varchar(500),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "portfolio_entries_kind_sort_idx" ON "portfolio_entries" USING btree ("kind","sort_order");