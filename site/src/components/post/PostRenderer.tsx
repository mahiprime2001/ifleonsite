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
      className="post-content prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-[-0.015em] prose-headings:text-ink prose-h2:mt-14 prose-h2:text-[2rem] prose-p:text-ink-2 prose-p:leading-[1.8] prose-a:text-brand-700 prose-a:decoration-brand-200 prose-a:underline-offset-4 hover:prose-a:decoration-brand-700 prose-strong:text-ink prose-li:text-ink-2 prose-li:marker:text-brand-600 prose-blockquote:border-l-brand-600 prose-blockquote:font-serif prose-blockquote:text-ink prose-code:rounded prose-code:bg-paper-3 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.88em] prose-code:font-normal prose-code:text-ink prose-code:before:content-none prose-code:after:content-none prose-th:text-ink prose-td:text-ink-2 prose-hr:border-line"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
