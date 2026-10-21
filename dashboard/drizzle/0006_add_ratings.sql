-- Add rating column to posts table for user feedback on generated content
ALTER TABLE "posts" ADD COLUMN "rating" integer;
-- rating values: null (no rating), 1 (thumbs up), -1 (thumbs down)
