"use client";

import { useEffect, useRef } from "react";
import "highlight.js/styles/github-dark.css";

interface PostRendererProps {
  /** The post body as HTML from the dashboard API: already sanitized and syntax-highlighted. */
  html: string;
}

/* Shows a post's body and makes the Copy buttons on its code blocks work. */
export const PostRenderer = ({ html }: PostRendererProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(".code-block-copy");
      if (!button) return;
      const code = button.closest(".code-block")?.querySelector("pre code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code.replace(/\n$/, ""));
        button.textContent = "Copied ✓";
      } catch {
        button.textContent = "Select and press Ctrl+C";
      }
      setTimeout(() => (button.textContent = "Copy"), 1500);
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return (
    <div
      ref={ref}
      className="post-content prose max-w-none bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
