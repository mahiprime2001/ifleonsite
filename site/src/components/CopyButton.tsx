"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";

/* Small copy-to-clipboard button, e.g. next to the email address. Confirms with a tick for a moment. */
export function CopyButton({
  value,
  label = "Copy",
  tone = "light",
}: {
  value: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    // The Clipboard API can stall (e.g. waiting on a permission prompt); give it a moment, then fall back.
    const ok = await Promise.race([
      navigator.clipboard?.writeText(value).then(() => true) ?? Promise.resolve(false),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 800)),
    ]).catch(() => false);
    if (!ok) {
      // Older browsers / insecure contexts: copy through a temporary text field.
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const dark = tone === "dark";
  const colors = dark
    ? "border-white/15 text-brand-100 hover:border-white/40 hover:text-white"
    : "border-line-strong bg-white text-ink-2 hover:border-brand-600 hover:text-brand-700";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `${label} ${value}`}
      title={copied ? "Copied" : label}
      className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors ${colors}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          {copied ? (
            <Check className={`h-3.5 w-3.5 ${dark ? "text-brand-300" : "text-brand-600"}`} />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
