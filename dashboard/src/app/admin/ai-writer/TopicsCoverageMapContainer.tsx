import { isNull } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { TopicsCoverageMap } from "./TopicsCoverageMap";

interface TagData {
  tag: string;
  count: number;
  isAiGenerated: boolean;
}

export async function TopicsCoverageMapContainer() {
  // Fetch all posts with tags
  const allPosts = await db
    .select({
      tags: posts.tags,
      source: posts.source,
      deletedAt: posts.deletedAt,
    })
    .from(posts)
    .where(isNull(posts.deletedAt)); // Exclude trashed posts

  // Build tag statistics
  const tagMap = new Map<string, { count: number; aiCount: number }>();

  for (const post of allPosts) {
    const isAiGenerated = post.source === "ai";
    for (const tag of post.tags) {
      const existing = tagMap.get(tag) ?? { count: 0, aiCount: 0 };
      tagMap.set(tag, {
        count: existing.count + 1,
        aiCount: existing.aiCount + (isAiGenerated ? 1 : 0),
      });
    }
  }

  // Convert to sorted array with AI flag
  const tags: TagData[] = Array.from(tagMap.entries())
    .map(([tag, stats]) => ({
      tag,
      count: stats.count,
      isAiGenerated: stats.aiCount > 0,
    }))
    .sort((a, b) => b.count - a.count);

  return <TopicsCoverageMap tags={tags} />;
}
