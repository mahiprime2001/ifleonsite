"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/upload-client";

type Props = {
  name: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
};

/*
 * Several images in order: upload many at once, reorder, remove. Submitted as one hidden field with
 * one URL per line, so the server action reads it like any other text field.
 */
export function GalleryField({ name, label, value, onChange }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setUploading(files.length);
    const added: string[] = [];
    // One at a time, so a large batch doesn't hit the server all at once.
    for (const file of Array.from(files)) {
      try {
        added.push(await uploadImage(file));
      } catch (e) {
        setError(`${file.name}: ${e instanceof Error ? e.message : "upload failed."}`);
      }
      setUploading((n) => n - 1);
    }
    onChange([...value, ...added]);
    if (fileInput.current) fileInput.current.value = "";
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={value.join("\n")} />
      {value.length > 0 && (
        <ul className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <li key={`${url}-${index}`} className="overflow-hidden rounded-lg border border-line bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied URL on any host */}
              <img src={url} alt="" className="aspect-video w-full object-cover" />
              <div className="flex items-center justify-between px-2 py-1 text-xs text-muted">
                <span className="flex gap-1">
                  <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} aria-label="Move earlier" className="rounded px-1.5 hover:bg-surface disabled:opacity-30">
                    ◀
                  </button>
                  <button type="button" onClick={() => move(index, index + 1)} disabled={index === value.length - 1} aria-label="Move later" className="rounded px-1.5 hover:bg-surface disabled:opacity-30">
                    ▶
                  </button>
                </span>
                <button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))} className="hover:text-danger hover:underline">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2">
        <button type="button" onClick={() => fileInput.current?.click()} disabled={uploading > 0} className="btn-secondary px-3 py-1.5 text-xs">
          {uploading > 0 ? `Uploading ${uploading}…` : "Add images"}
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
