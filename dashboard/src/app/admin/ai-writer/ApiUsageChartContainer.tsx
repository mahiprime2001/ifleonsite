import { gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { aiRuns } from "@/db/schema";
import { getAiConfig } from "@/lib/ai/config";
import { ApiUsageChart } from "./ApiUsageChart";

interface HourlyUsage {
  hour: string;
  requests: number;
  tokens: number;
  avgTokensPerRequest: number;
}

export async function ApiUsageChartContainer() {
  // Fetch AI runs from last 24 hours
  const runs = await db
    .select({
      createdAt: aiRuns.createdAt,
      inputTokens: aiRuns.inputTokens,
      outputTokens: aiRuns.outputTokens,
    })
    .from(aiRuns)
    .where(gte(aiRuns.createdAt, sql`now() - interval '24 hours'`));

  // Get AI config for rate limits
  const config = await getAiConfig();

  // Group runs by hour and calculate statistics
  const hourlyMap = new Map<string, { requests: number; tokens: number }>();

  for (const run of runs) {
    const hour = run.createdAt.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: process.env.DISPLAY_TIMEZONE || "Asia/Kolkata",
    });

    const totalTokens = (run.inputTokens ?? 0) + (run.outputTokens ?? 0);

    const existing = hourlyMap.get(hour) ?? { requests: 0, tokens: 0 };
    hourlyMap.set(hour, {
      requests: existing.requests + 1,
      tokens: existing.tokens + totalTokens,
    });
  }

  // Convert to sorted array
  const data: HourlyUsage[] = Array.from(hourlyMap.entries())
    .sort((a, b) => {
      // Parse times and sort chronologically
      const timeA = a[0];
      const timeB = b[0];
      return timeA.localeCompare(timeB);
    })
    .map(([hour, stats]) => ({
      hour,
      requests: stats.requests,
      tokens: stats.tokens,
      avgTokensPerRequest: Math.round(stats.tokens / stats.requests),
    }));

  // Extract rate limits from config providers
  // Rate limits are model-specific and should come from provider configuration
  // For now, we don't show rate lines since they vary by model tier
  const limits = {
    // rpm: undefined,  // Provider-specific, adjust based on actual tier
    // tpm: undefined,  // Provider-specific, adjust based on actual tier
    rpd: config.dailyLimit > 0 ? config.dailyLimit : undefined,
  };

  return <ApiUsageChart data={data} limits={limits} />;
}
