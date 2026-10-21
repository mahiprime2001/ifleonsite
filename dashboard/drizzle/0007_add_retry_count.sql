-- Add retryCount column to aiRuns table to track how many times a draft was retried
ALTER TABLE "ai_runs" ADD COLUMN "retry_count" integer DEFAULT 0 NOT NULL;
