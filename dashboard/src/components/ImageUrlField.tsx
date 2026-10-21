"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

/* A URL input with an Upload button and a small preview. The form still submits the URL as text. */
export function ImageUrlField({ name, label, value, onChange, error }: Props) {
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
          placeholder="https://… or upload"
        />
      </label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-muted hover:underline">
            Remove
          </button>
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host
        <img src={value} alt="" className="mt-3 max-h-40 w-full rounded-lg border border-line object-cover" />
      )}
      {(uploadError || error) && <p className="mt-1 text-xs text-danger">{uploadError || error}</p>}
    </div>
  );
}
