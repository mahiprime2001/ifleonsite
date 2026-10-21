CREATE TYPE "public"."content_source" AS ENUM('manual', 'ai', 'wordpress');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"phone" varchar(40),
	"subject" varchar(300),
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"title" varchar(300) NOT NULL,
	"excerpt" text,
	"content" text DEFAULT '' NOT NULL,
	"cover_image_url" text,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"source" "content_source" DEFAULT 'manual' NOT NULL,
	"seo_title" varchar(300),
	"seo_description" varchar(500),
	"author_name" varchar(120) DEFAULT 'IFLEON' NOT NULL,
	"wp_id" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug"),
	CONSTRAINT "posts_wp_id_unique" UNIQUE("wp_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_full_name" varchar(200) NOT NULL,
	"is_visible" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"title_override" varchar(200),
	"summary_override" text,
	"demo_url" text,
	"github" jsonb,
	"synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_repo_full_name_unique" UNIQUE("repo_full_name")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(120),
	"company" varchar(120),
	"quote" text NOT NULL,
	"avatar_url" text,
	"rating" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"wp_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_wp_id_unique" UNIQUE("wp_id")
);
--> statement-breakpoint
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "posts_status_published_at_idx" ON "posts" USING btree ("status","published_at");