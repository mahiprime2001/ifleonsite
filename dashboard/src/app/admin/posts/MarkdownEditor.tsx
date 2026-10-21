"use client";

import { useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { uploadImage } from "@/lib/upload-client";

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

type ToolId =
  | "bold" | "italic" | "h2" | "h3" | "link" | "ul" | "ol" | "checklist" | "quote"
  | "note" | "tip" | "warning" | "code" | "codeblock" | "table" | "image";

const TOOLS: { id: ToolId; label: string; title: string; className?: string }[] = [
  { id: "bold", label: "B", title: "Bold (Ctrl+B)", className: "font-bold" },
  { id: "italic", label: "I", title: "Italic (Ctrl+I)", className: "italic" },
  { id: "h2", label: "H2", title: "Heading" },
  { id: "h3", label: "H3", title: "Subheading" },
  { id: "link", label: "Link", title: "Link (Ctrl+K)" },
  { id: "ul", label: "• List", title: "Bulleted list" },
  { id: "ol", label: "1. List", title: "Numbered list" },
  { id: "checklist", label: "☑ List", title: "Checklist" },
  { id: "quote", label: "Quote", title: "Quote" },
  { id: "note", label: "ℹ Note", title: "Note box" },
  { id: "tip", label: "💡 Tip", title: "Tip box" },
  { id: "warning", label: "⚠ Warning", title: "Warning box" },
  { id: "code", label: "</>", title: "Inline code", className: "font-mono" },
  { id: "codeblock", label: "Code block", title: "Code block (with Copy button)" },
  { id: "table", label: "Table", title: "Table" },
  { id: "image", label: "Image", title: "Upload an image" },
];

const SHORTCUTS: Record<string, ToolId> = { b: "bold", i: "italic", k: "link" };

export function MarkdownEditor({ name, value, onChange, error }: Props) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /*
   * Replaces the current selection. execCommand("insertText") keeps the browser's own undo history
   * (Ctrl+Z works) and fires a normal input event, so React's onChange sees the new value.
   * Optionally selects [selectFrom, selectTo) of the inserted text afterwards.
   */
  function insert(text: string, selectFrom?: number, selectTo?: number) {
    const ta = textarea.current;
    if (!ta) return;
    ta.focus();
    const start = ta.selectionStart;
    if (!document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, start, ta.selectionEnd, "end");
      onChange(ta.value);
    }
    if (selectFrom !== undefined) ta.setSelectionRange(start + selectFrom, start + (selectTo ?? selectFrom));
  }

  function selection() {
    const ta = textarea.current!;
    return { ta, start: ta.selectionStart, end: ta.selectionEnd, text: ta.value.slice(ta.selectionStart, ta.selectionEnd) };
  }

  function wrap(before: string, after: string, placeholder: string) {
    const { text } = selection();
    const inner = text || placeholder;
    insert(before + inner + after, before.length, before.length + inner.length);
  }

  /* Applies a prefix to every line the selection touches, e.g. "- " or "1. ". */
  function prefixLines(prefix: (index: number) => string) {
    const { ta, start, end } = selection();
    const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = ta.value.indexOf("\n", end);
    const lineEnd = nextBreak === -1 ? ta.value.length : nextBreak;
    ta.setSelectionRange(lineStart, lineEnd);
    const lines = ta.value.slice(lineStart, lineEnd).split("\n");
    const result = lines.map((line, i) => prefix(i) + line).join("\n");
    insert(result, result.length);
  }

  /* Wraps the selected lines (or a placeholder) in a callout box: > [!TIP] … */
  function callout(type: "NOTE" | "TIP" | "WARNING") {
    const { text } = selection();
    const body = (text || "Write the message here.")
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
    const block = `\n> [!${type}]\n${body}\n`;
    const start = block.indexOf(body);
    insert(block, start + 2, start + body.length);
  }

  function link() {
    const { text } = selection();
    const label = text || "link text";
    const url = "https://";
    insert(`[${label}](${url})`, label.length + 3, label.length + 3 + url.length);
  }

  async function uploadAndInsert(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    setUploadError(null);
    setUploading((n) => n + images.length);
    for (const file of images) {
      try {
        const url = await uploadImage(file);
        const alt = file.name.replace(/\.[^.]+$/, "").replace(/[[\]]/g, "") || "image";
        insert(`![${alt}](${url})\n`);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  /* Event handler only (never called during render), so touching refs here is fine. */
  function runTool(id: ToolId) {
    switch (id) {
      case "bold":
        return wrap("**", "**", "bold text");
      case "italic":
        return wrap("_", "_", "italic text");
      case "h2":
        return prefixLines(() => "## ");
      case "h3":
        return prefixLines(() => "### ");
      case "link":
        return link();
      case "ul":
        return prefixLines(() => "- ");
      case "ol":
        return prefixLines((i) => `${i + 1}. `);
      case "checklist":
        return prefixLines(() => "- [ ] ");
      case "quote":
        return prefixLines(() => "> ");
      case "note":
        return callout("NOTE");
      case "tip":
        return callout("TIP");
      case "warning":
        return callout("WARNING");
      case "table":
        return insert("\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n| Cell | Cell |\n", 3, 9);
      case "code":
        return wrap("`", "`", "code");
      case "codeblock":
        // A language after the fence turns on syntax colours, e.g. ```bash, ```ts, ```yaml
        return wrap("\n```bash\n", "\n```\n", "your code here");
      case "image":
        return fileInput.current?.click();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="label">Content</span>
        <div className="flex gap-1 text-sm" role="tablist">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1 capitalize ${tab === t ? "bg-surface-2 font-medium" : "text-muted"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-1 overflow-hidden rounded-lg border border-line focus-within:border-accent">
        {tab === "write" && (
          <div className="flex flex-wrap gap-1 border-b border-line bg-surface-2 px-2 py-1.5" role="toolbar" aria-label="Formatting">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                title={tool.title}
                aria-label={tool.title}
                // Keep focus (and the selection) in the textarea when clicking a tool.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => runTool(tool.id)}
                className={`rounded px-2 py-1 text-xs text-muted hover:bg-surface hover:text-foreground ${tool.className ?? ""}`}
              >
                {tool.label}
              </button>
            ))}
            <span className="ml-auto self-center pr-1 text-xs text-muted">
              {uploading > 0 ? "Uploading image…" : "Markdown · paste or drop images"}
            </span>
          </div>
        )}

        {/* The textarea stays mounted in preview mode so its value is always submitted. */}
        <textarea
          ref={textarea}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const tool = SHORTCUTS[e.key.toLowerCase()];
            if (!tool) return;
            e.preventDefault();
            runTool(tool);
          }}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData.files);
            if (files.some((f) => f.type.startsWith("image/"))) {
              e.preventDefault();
              void uploadAndInsert(files);
            }
          }}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) e.preventDefault();
          }}
          onDrop={(e) => {
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
              e.preventDefault();
              void uploadAndInsert(files);
            }
          }}
          rows={24}
          className={`block w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed outline-none ${tab === "preview" ? "hidden" : ""}`}
        />

        {tab === "preview" && (
          <div className="prose prose-invert prose-headings:font-serif max-w-none min-h-96 bg-surface p-6">
            {value.trim() ? (
              <Markdown>{value}</Markdown>
            ) : (
              <p className="text-muted">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          void uploadAndInsert(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      {(uploadError || error) && <p className="mt-1 text-xs text-danger">{uploadError || error}</p>}
    </div>
  );
}
