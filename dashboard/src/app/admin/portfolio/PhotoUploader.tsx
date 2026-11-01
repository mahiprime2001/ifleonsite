"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImage } from "@/lib/upload-client";
import { addPhotos } from "./actions";

/* "Upload photos" on the Photos tab: pick several at once; each becomes a photo entry. */
export function PhotoUploader() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [left, setLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setLeft(files.length);
    const urls: string[] = [];
    const failed: string[] = [];
    // One at a time, so a large batch doesn't hit the server all at once.
    for (const file of Array.from(files)) {
      try {
        urls.push(await uploadImage(file));
      } catch (e) {
        failed.push(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
      }
      setLeft((n) => n - 1);
    }
    if (fileInput.current) fileInput.current.value = "";
    if (failed.length) setError(failed.join(" · "));
    if (urls.length) startSaving(() => addPhotos(urls));
  }

  const busy = left > 0 || saving;
  return (
    <div className="text-right">
      <button type="button" onClick={() => fileInput.current?.click()} disabled={busy} className="btn-primary">
        {left > 0 ? `Uploading ${left}…` : saving ? "Saving…" : "Upload photos"}
      </button>
      <input
        ref={fileInput}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-1 max-w-sm text-xs text-danger">{error}</p>}
    </div>
  );
}
