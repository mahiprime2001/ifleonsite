// src/components/post/PostRenderer.tsx
import { useEffect } from "react";
import Prism from "prismjs";

// Import languages you need
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";

// Import a Prism theme (or add in index.css)
import "prismjs/themes/prism-tomorrow.css";

interface PostRendererProps {
  content: string;
}

export const PostRenderer = ({ content }: PostRendererProps) => {
  useEffect(() => {
    Prism.highlightAll(); // highlight every <pre><code> block
  }, [content]);

  return (
    <div
      className="prose max-w-none bg-white rounded-2xl shadow-lg p-8 mb-12"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
