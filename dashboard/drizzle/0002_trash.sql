ALTER TABLE "contact_messages" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "deleted_at" timestamp with time zone;