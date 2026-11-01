"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /* "pdf" turns this into a document field (e.g. a résumé): PDF upload, a link instead of a preview. */
  fileType?: "image" | "pdf";
  placeholder?: string;
};

/* A URL input with an Upload button and a small preview. The form still submits the URL as text. */
export function ImageUrlField({ name, label, value, onChange, error, fileType = "image", placeholder }: Props) {
  const isPdf = fileType === "pdf";
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      onChange(await uploadImage(file));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <div>
      <label className="block">
        <span className="label">{label}</span>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input mt-1"
          placeholder={placeholder ?? "https://… or upload"}
        />
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          {uploading ? "Uploading…" : isPdf ? "Upload PDF" : "Upload image"}
        </button>
        {value && isPdf && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline">
            Open file
          </a>
        )}
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-muted hover:underline">
            Remove
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept={isPdf ? "application/pdf" : "image/png,image/jpeg,image/webp,image/gif,image/avif"}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {value && !isPdf && (
        // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host
        <img src={value} alt="" className="mt-3 max-h-40 w-full rounded-lg border border-line object-cover" />
      )}
      {(uploadError || error) && <p className="mt-1 text-xs text-danger">{uploadError || error}</p>}
    </div>
  );
}
