"use client";

import "highlight.js/styles/github-dark.min.css";
import { useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { remarkCallouts, type CalloutType } from "@/lib/markdown/remark-callouts";

/*
 * The one Markdown renderer for posts: GitHub-flavoured Markdown (tables, task lists, strikethrough),
 * callout boxes (> [!NOTE] …), and code blocks with syntax colours and a Copy button.
 * Raw HTML in posts is not rendered (react-markdown's default), so content can't inject scripts.
 */

const CALLOUT_ICON: Record<CalloutType, string> = {
  note: "ℹ",
  tip: "💡",
  important: "❗",
  warning: "⚠",
  caution: "⛔",
};

type HastNode = { type: string; value?: string; tagName?: string; properties?: { className?: unknown }; children?: HastNode[] };

/* Plain text of a syntax-highlighted code element, for copying. */
function textOf(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

function CodeBlock({ language, code, children }: { language: string | null; code: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block not-prose">
      <div className="code-block-bar">
        <span>{language ?? "code"}</span>
        <button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(code.replace(/\n$/, ""));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="code-block-copy"
          aria-label="Copy code"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

const components: Components = {
  pre({ node, children }) {
    const code = (node?.children as HastNode[] | undefined)?.find((c) => c.tagName === "code");
    const classes = Array.isArray(code?.properties?.className) ? (code.properties.className as string[]) : [];
    const language = classes.find((c) => c.startsWith("language-"))?.slice("language-".length) ?? null;
    return (
      <CodeBlock language={language} code={textOf(code)}>
        {children}
      </CodeBlock>
    );
  },
  aside({ node, children, ...props }) {
    const type = (props as Record<string, unknown>)["data-callout"] as CalloutType | undefined;
    if (!type) return <aside {...props}>{children}</aside>;
    const title = (props as Record<string, unknown>)["data-title"] as string;
    return (
      <aside className={`callout callout-${type}`} data-node={node?.type}>
        <p className="callout-title">
          <span aria-hidden="true">{CALLOUT_ICON[type]}</span> {title}
        </p>
        {children}
      </aside>
    );
  },
  a({ href, children }) {
    const external = href?.startsWith("http");
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkCallouts]}
      rehypePlugins={[[rehypeHighlight, { detect: true }]]}
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
}
