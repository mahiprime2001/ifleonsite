import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { remarkCallouts, type CalloutType } from "./remark-callouts";

/*
 * Server-side twin of components/Markdown.tsx: renders a post to an HTML string for the public API,
 * so ifleon.com (and its prerendered pages) show the same callouts and code blocks as the dashboard.
 * Raw HTML in the Markdown is dropped (remark-rehype's default), so a post can't inject scripts.
 * Code blocks get a Copy button with no handler; the site wires it up.
 */

const CALLOUT_ICON: Record<CalloutType, string> = {
  note: "ℹ",
  tip: "💡",
  important: "❗",
  warning: "⚠",
  caution: "⛔",
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const text = (value: string): HastNode => ({ type: "text", value });
const el = (tagName: string, properties: Record<string, unknown>, children: HastNode[]): HastNode => ({
  type: "element",
  tagName,
  properties,
  children,
});

function decorate(node: HastNode) {
  node.children?.forEach((child, i) => {
    if (child.type !== "element") return;

    if (child.tagName === "pre") {
      const code = child.children?.find((c) => c.tagName === "code");
      const classes = Array.isArray(code?.properties?.className) ? (code.properties.className as string[]) : [];
      const language = classes.find((c) => c.startsWith("language-"))?.slice("language-".length) ?? "code";
      node.children![i] = el("div", { className: ["code-block"] }, [
        el("div", { className: ["code-block-bar"] }, [
          el("span", {}, [text(language)]),
          el("button", { type: "button", className: ["code-block-copy"], ariaLabel: "Copy code" }, [text("Copy")]),
        ]),
        child,
      ]);
      return; // nothing to decorate inside code
    }

    if (child.tagName === "aside" && typeof child.properties?.dataCallout === "string") {
      const type = child.properties.dataCallout as CalloutType;
      const title = String(child.properties.dataTitle ?? "");
      child.properties = { className: ["callout", `callout-${type}`] };
      child.children = [
        el("p", { className: ["callout-title"] }, [el("span", { ariaHidden: "true" }, [text(CALLOUT_ICON[type] ?? "")]), text(` ${title}`)]),
        ...(child.children ?? []),
      ];
    }

    if (child.tagName === "a" && typeof child.properties?.href === "string" && child.properties.href.startsWith("http")) {
      child.properties.target = "_blank";
      child.properties.rel = ["noopener", "noreferrer"];
    }

    decorate(child);
  });
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCallouts)
  .use(remarkRehype)
  .use(rehypeHighlight, { detect: true })
  .use(() => (tree: HastNode) => decorate(tree))
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string) {
  return String(await processor.process(markdown));
}
