/*
 * Turns GitHub-style alert blockquotes into callout boxes:
 *
 *   > [!TIP] Optional custom title
 *   > Body text…
 *
 * Types: NOTE, TIP, IMPORTANT, WARNING, CAUTION. The blockquote is rendered as
 * <aside class="callout callout-tip" data-callout="tip" data-title="…">. Anything else stays a normal quote.
 */

type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
};

export const CALLOUT_TYPES = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
} as const;
export type CalloutType = keyof typeof CALLOUT_TYPES;

const MARKER = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;

function toCallout(quote: MdNode) {
  const paragraph = quote.children?.[0];
  if (paragraph?.type !== "paragraph" || !paragraph.children?.length) return;
  const first = paragraph.children[0];
  if (first.type !== "text" || !first.value) return;

  const match = MARKER.exec(first.value);
  const type = match?.[1].toLowerCase();
  if (!match || !type || !(type in CALLOUT_TYPES)) return;

  // Remove the marker (and the rest of its line, used as the title) from the body.
  first.value = first.value.slice(match[0].length);
  if (!first.value) paragraph.children.shift();
  if (paragraph.children[0]?.type === "break") paragraph.children.shift();
  if (paragraph.children.length === 0) quote.children!.shift();

  quote.data = {
    hName: "aside",
    hProperties: {
      className: ["callout", `callout-${type}`],
      dataCallout: type,
      dataTitle: match[2].trim() || CALLOUT_TYPES[type as CalloutType],
    },
  };
}

function walk(node: MdNode) {
  if (node.type === "blockquote") toCallout(node);
  node.children?.forEach(walk);
}

export function remarkCallouts() {
  return (tree: MdNode) => walk(tree);
}
