"use client";

import { useState } from "react";
import { ratePost } from "./rateAction";

interface RatingButtonsProps {
  postId: number;
  initialRating: number | null;
}

export function RatingButtons({ postId, initialRating }: RatingButtonsProps) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [isLoading, setIsLoading] = useState(false);

  const handleRate = async (value: 1 | -1) => {
    setIsLoading(true);
    try {
      const newRating = rating === value ? null : value;
      await ratePost(postId, newRating);
      setRating(newRating);
    } catch (error) {
      console.error("Failed to rate post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs font-medium text-muted">Rate this post:</p>
      <div className="flex gap-1">
        <button
          onClick={() => handleRate(1)}
          disabled={isLoading}
          title="Thumbs up"
          className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
            rating === 1
              ? "bg-accent-soft text-accent"
              : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
          } disabled:opacity-50`}
        >
          👍
        </button>
        <button
          onClick={() => handleRate(-1)}
          disabled={isLoading}
          title="Thumbs down"
          className={`inline-flex h-8 w-8 items-center justify-center rounded transition-colors ${
            rating === -1
              ? "bg-red-500/15 text-danger"
              : "bg-surface-2 text-muted hover:bg-surface-3 hover:text-foreground"
          } disabled:opacity-50`}
        >
          👎
        </button>
      </div>
    </div>
  );
}
