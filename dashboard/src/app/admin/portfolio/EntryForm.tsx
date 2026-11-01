"use client";

import { useActionState, useState } from "react";
import { GalleryField } from "@/components/GalleryField";
import { ImageUrlField } from "@/components/ImageUrlField";
import type { PortfolioKind } from "@/db/schema";
import { ENTRY_KINDS, type EntryField, labelFor, placeholderFor } from "@/lib/portfolio";
import type { PortfolioFormState } from "./actions";

export type EntryFormValues = {
  title: string;
  slug: string;
  subtitle: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  body: string;
  imageUrl: string;
  gallery: string[];
  url: string;
  repoUrl: string;
  tags: string;
  isFeatured: boolean;
  isPublished: boolean;
};

export const EMPTY_ENTRY: EntryFormValues = {
  title: "",
  slug: "",
  subtitle: "",
  location: "",
  startDate: "",
  endDate: "",
  summary: "",
  body: "",
  imageUrl: "",
  gallery: [],
  url: "",
  repoUrl: "",
  tags: "",
  isFeatured: false,
  isPublished: true,
};

type TextField = "title" | "slug" | "subtitle" | "location" | "startDate" | "endDate" | "summary" | "body" | "url" | "repoUrl" | "tags";

type Props = {
  kind: PortfolioKind;
  action: (state: PortfolioFormState, formData: FormData) => Promise<PortfolioFormState>;
  initial?: EntryFormValues;
  submitLabel: string;
};

export function EntryForm({ kind, action, initial = EMPTY_ENTRY, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // Controlled fields: React 19 resets uncontrolled inputs after a form action.
  const [values, setValues] = useState(initial);
  const set = <K extends keyof EntryFormValues>(name: K, value: EntryFormValues[K]) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const field = (name: TextField) => ({
    name,
    value: values[name],
    placeholder: placeholderFor(kind, name),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value),
  });

  const has = (f: EntryField) => ENTRY_KINDS[kind].fields.includes(f);
  const errors = state?.fieldErrors ?? {};
  const fieldError = (name: string) =>
    errors[name]?.[0] && <p className="mt-1 text-xs text-danger">{errors[name]?.[0]}</p>;

  return (
    <form action={formAction} className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
      <div className="card space-y-5 p-5">
        <label className="block">
          <span className="label">
            {labelFor(kind, "title")}
            {kind === "photo" && <span className="font-normal text-muted"> (optional)</span>}
          </span>
          <input {...field("title")} required={kind !== "photo"} className="input mt-1" />
          {fieldError("title")}
        </label>

        {has("slug") && (
          <label className="block">
            <span className="label">{labelFor(kind, "slug")}</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="shrink-0 text-sm text-muted">/projects/</span>
              <input {...field("slug")} className="input" placeholder="Made from the name if left empty" />
            </div>
            {fieldError("slug")}
          </label>
        )}

        {(has("subtitle") || has("location")) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {has("subtitle") && (
              <label className="block">
                <span className="label">{labelFor(kind, "subtitle")}</span>
                <input {...field("subtitle")} className="input mt-1" />
              </label>
            )}
            {has("location") && (
              <label className="block">
                <span className="label">{labelFor(kind, "location")}</span>
                <input {...field("location")} className="input mt-1" placeholder="e.g. Remote, or Hyderabad" />
              </label>
            )}
          </div>
        )}

        {has("dates") && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="label">{labelFor(kind, "startDate")}</span>
              <input {...field("startDate")} className="input mt-1" placeholder="e.g. 2023-06 or Jun 2023" />
            </label>
            {kind !== "achievement" && (
              <label className="block">
                <span className="label">{labelFor(kind, "endDate")}</span>
                <input
                  {...field("endDate")}
                  className="input mt-1"
                  placeholder={kind === "certification" ? "Leave empty if it doesn't expire" : "Leave empty for “Present”"}
                />
              </label>
            )}
          </div>
        )}

        {has("summary") && (
          <label className="block">
            <span className="label">{labelFor(kind, "summary")}</span>
            <textarea {...field("summary")} rows={2} className="input mt-1" />
            {fieldError("summary")}
          </label>
        )}

        {has("body") && (
          <label className="block">
            <span className="label">{labelFor(kind, "body")}</span>
            <textarea {...field("body")} rows={12} className="input mt-1 font-mono text-sm" />
            {fieldError("body")}
          </label>
        )}

        {has("tags") && (
          <label className="block">
            <span className="label">{labelFor(kind, "tags")}</span>
            <input {...field("tags")} className="input mt-1" />
            <span className="mt-1 block text-xs text-muted">Separate with commas.</span>
          </label>
        )}

        {(has("url") || has("repoUrl")) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {has("url") && (
              <label className="block">
                <span className="label">{labelFor(kind, "url")}</span>
                <input {...field("url")} className="input mt-1" placeholder="https://…" />
                {fieldError("url")}
              </label>
            )}
            {has("repoUrl") && (
              <label className="block">
                <span className="label">{labelFor(kind, "repoUrl")}</span>
                <input {...field("repoUrl")} className="input mt-1" placeholder="https://github.com/…" />
                {fieldError("repoUrl")}
              </label>
            )}
          </div>
        )}

        {has("gallery") && (
          <div>
            <GalleryField name="gallery" label={labelFor(kind, "gallery")} value={values.gallery} onChange={(v) => set("gallery", v)} />
            {fieldError("gallery")}
          </div>
        )}
      </div>

      <aside className="space-y-6">
        {has("image") && (
          <div className="card p-4">
            <ImageUrlField
              name="imageUrl"
              label={labelFor(kind, "image")}
              value={values.imageUrl}
              onChange={(v) => set("imageUrl", v)}
              error={errors.imageUrl?.[0]}
            />
          </div>
        )}
        <div className="card space-y-4 p-4 lg:sticky lg:top-8">
          <input type="hidden" name="isPublished" value={String(values.isPublished)} />
          <input type="hidden" name="isFeatured" value={String(values.isFeatured)} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="size-4 accent-green-600"
            />
            Show on the site
          </label>
          {has("featured") && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="size-4 accent-green-600"
              />
              {labelFor(kind, "featured")}
            </label>
          )}
          {state?.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}
          {state?.saved && !pending && <p className="text-sm text-accent">Saved.</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Saving…" : submitLabel}
          </button>
        </div>
      </aside>
    </form>
  );
}
