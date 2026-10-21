"use client";

import Link from "next/link";

interface TagData {
  tag: string;
  count: number;
  isAiGenerated: boolean;
}

interface TopicsCoverageMapProps {
  tags: TagData[];
  allTags?: string[]; // Optional: tags that haven't been used yet
}

export function TopicsCoverageMap({ tags, allTags = [] }: TopicsCoverageMapProps) {
  if (tags.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-muted">No posts yet to analyze topic coverage</p>
      </div>
    );
  }

  // Calculate max count for size scaling
  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const minCount = Math.min(...tags.map((t) => t.count), 1);

  // Determine color intensity based on AI generation
  const getColorClass = (isAiGenerated: boolean, count: number) => {
    if (!isAiGenerated) {
      return "bg-surface-2 text-muted hover:bg-surface-2";
    }
    // Scale accent intensity based on frequency
    const intensity = (count - minCount) / (maxCount - minCount || 1);
    if (intensity > 0.66) return "bg-accent text-white";
    if (intensity > 0.33) return "bg-accent-soft text-accent";
    return "bg-accent-soft/50 text-accent/70 hover:bg-accent-soft/70";
  };

  // Calculate average size for font scaling
  const avgCount = tags.reduce((sum, t) => sum + t.count, 0) / tags.length;
  const getSizeClass = (count: number) => {
    const ratio = count / avgCount;
    if (ratio > 1.5) return "text-lg font-semibold";
    if (ratio > 1.2) return "text-base font-medium";
    if (ratio > 0.8) return "text-sm font-medium";
    return "text-xs font-medium";
  };

  // Group tags by AI vs manual
  const aiTags = tags.filter((t) => t.isAiGenerated);
  const manualTags = tags.filter((t) => !t.isAiGenerated);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Total Topics</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{tags.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">AI-Generated Posts</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-accent">
            {tags.reduce((sum, t) => (t.isAiGenerated ? sum + t.count : sum), 0)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">Most Used Topic</p>
          <p className="mt-2 text-lg font-semibold text-accent truncate">
            {tags[0]?.tag}
          </p>
          <p className="mt-1 text-xs text-muted">{tags[0]?.count} posts</p>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-4 text-sm font-medium">Topic Coverage</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tagData) => (
            <div
              key={tagData.tag}
              className={`
                rounded-full px-4 py-2 transition-all
                ${getSizeClass(tagData.count)}
                ${getColorClass(tagData.isAiGenerated, tagData.count)}
                hover:shadow-sm
              `}
              title={`${tagData.tag}: ${tagData.count} post${tagData.count !== 1 ? "s" : ""}${tagData.isAiGenerated ? " (AI)" : ""}`}
            >
              <span>
                {tagData.tag}
                <span className="ml-1.5 inline-block rounded-full bg-black/10 px-1.5 py-0 text-xs opacity-70">
                  {tagData.count}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {manualTags.length > 0 && (
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-medium">Manual Posts by Topic</h3>
          <div className="space-y-2">
            {manualTags.map((tagData) => (
              <div key={tagData.tag} className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
                <span className="text-sm font-medium">{tagData.tag}</span>
                <span className="text-xs font-semibold text-muted tabular-nums">
                  {tagData.count} post{tagData.count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aiTags.length > 0 && (
        <div className="card p-4">
          <h3 className="mb-3 text-sm font-medium">AI-Generated Posts by Topic</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {aiTags
              .sort((a, b) => b.count - a.count)
              .map((tagData) => (
                <div key={tagData.tag} className="flex items-center justify-between rounded-lg bg-accent-soft/30 p-3">
                  <span className="text-sm font-medium text-accent">{tagData.tag}</span>
                  <span className="text-xs font-semibold text-accent tabular-nums">
                    {tagData.count} post{tagData.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-line bg-surface-2/50 p-4">
        <h3 className="mb-2 text-sm font-medium">Coverage Tips</h3>
        <ul className="space-y-2 text-xs text-muted">
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Topics with more posts appear larger in the tag cloud</span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>
              <span className="inline-block rounded bg-accent text-white px-1.5 py-0 text-xs mr-1">AI</span>
              topics come from AI-generated posts
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-accent">•</span>
            <span>Diversify topics to improve audience reach and SEO</span>
          </li>
          {allTags.length > 0 && (
            <li className="flex gap-2">
              <span className="text-accent">•</span>
              <span>Consider exploring underrepresented areas to expand coverage</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
