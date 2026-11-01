"use client";

import { useActionState, useState } from "react";
import { ImageUrlField } from "@/components/ImageUrlField";
import type { PortfolioFormState } from "./actions";

export type ProfileFormValues = {
  name: string;
  headline: string;
  intro: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  photoUrl: string;
  resumeUrl: string;
  links: { label: string; url: string }[];
  seoTitle: string;
  seoDescription: string;
};

type TextField = Exclude<keyof ProfileFormValues, "links">;

type Props = {
  action: (state: PortfolioFormState, formData: FormData) => Promise<PortfolioFormState>;
  initial: ProfileFormValues;
};

const LINK_SUGGESTIONS = ["GitHub", "LinkedIn", "X", "Instagram", "YouTube", "Blog"];

export function ProfileForm({ action, initial }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // Controlled fields: React 19 resets uncontrolled inputs after a form action.
  const [values, setValues] = useState(initial);
  const set = <K extends keyof ProfileFormValues>(name: K, value: ProfileFormValues[K]) =>
    setValues((prev) => ({ ...prev, [name]: value }));
  const field = (name: TextField) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(name, e.target.value),
  });

  const errors = state?.fieldErrors ?? {};
  const fieldError = (name: keyof ProfileFormValues) =>
    errors[name]?.[0] && <p className="mt-1 text-xs text-danger">{errors[name]?.[0]}</p>;

  const setLink = (index: number, patch: Partial<{ label: string; url: string }>) =>
    set(
      "links",
      values.links.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  const moveLink = (from: number, to: number) => {
    if (to < 0 || to >= values.links.length) return;
    const next = [...values.links];
    [next[from], next[to]] = [next[to], next[from]];
    set("links", next);
  };

  return (
    <form action={formAction} className="grid max-w-5xl gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <section className="card space-y-5 p-5">
          <h2 className="font-medium">About you</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="label">Name</span>
              <input {...field("name")} required className="input mt-1" placeholder="S. Mahendra Reddy" />
              {fieldError("name")}
            </label>
            <label className="block">
              <span className="label">Headline</span>
              <input {...field("headline")} className="input mt-1" placeholder="e.g. Founder of IFLEON · DevOps & AI engineer" />
              {fieldError("headline")}
            </label>
          </div>
          <label className="block">
            <span className="label">Intro</span>
            <textarea {...field("intro")} rows={2} className="input mt-1" placeholder="One or two sentences that open the home page." />
            {fieldError("intro")}
          </label>
          <label className="block">
            <span className="label">Bio (Markdown)</span>
            <textarea {...field("bio")} rows={10} className="input mt-1 font-mono text-sm" placeholder="The longer story for the About section." />
            {fieldError("bio")}
          </label>
        </section>

        <section className="card space-y-5 p-5">
          <h2 className="font-medium">Contact</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="label">Email</span>
              <input {...field("email")} type="email" className="input mt-1" />
              {fieldError("email")}
            </label>
            <label className="block">
              <span className="label">Phone (optional)</span>
              <input {...field("phone")} className="input mt-1" placeholder="Leave empty to keep it off the site" />
            </label>
            <label className="block">
              <span className="label">Location</span>
              <input {...field("location")} className="input mt-1" placeholder="e.g. Nellore, India" />
            </label>
            <label className="block">
              <span className="label">Availability</span>
              <input {...field("availability")} className="input mt-1" placeholder="e.g. Open to freelance work" />
              <span className="mt-1 block text-xs text-muted">Shown as a badge. Leave empty to hide it.</span>
            </label>
          </div>

          <div>
            <span className="label">Links</span>
            <input type="hidden" name="links" value={JSON.stringify(values.links)} />
            <ul className="mt-2 space-y-2">
              {values.links.map((link, index) => (
                <li key={index} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <input
                    value={link.label}
                    onChange={(e) => setLink(index, { label: e.target.value })}
                    list="link-suggestions"
                    aria-label="Link name"
                    placeholder="Name"
                    className="input sm:w-40"
                  />
                  <input
                    value={link.url}
                    onChange={(e) => setLink(index, { url: e.target.value })}
                    aria-label="Link URL"
                    placeholder="https://…"
                    className="input min-w-0 flex-1"
                  />
                  <span className="flex shrink-0 gap-1 text-muted">
                    <button type="button" onClick={() => moveLink(index, index - 1)} disabled={index === 0} aria-label="Move up" className="rounded px-2 py-1 hover:bg-surface-2 disabled:opacity-30">
                      ▲
                    </button>
                    <button type="button" onClick={() => moveLink(index, index + 1)} disabled={index === values.links.length - 1} aria-label="Move down" className="rounded px-2 py-1 hover:bg-surface-2 disabled:opacity-30">
                      ▼
                    </button>
                    <button type="button" onClick={() => set("links", values.links.filter((_, i) => i !== index))} className="rounded px-2 py-1 text-xs hover:bg-surface-2 hover:text-danger">
                      Remove
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <datalist id="link-suggestions">
              {LINK_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <button type="button" onClick={() => set("links", [...values.links, { label: "", url: "" }])} className="btn-secondary mt-3 px-3 py-1.5 text-xs">
              Add link
            </button>
            {fieldError("links")}
          </div>
        </section>

        <section className="card space-y-5 p-5">
          <h2 className="font-medium">Search engines</h2>
          <label className="block">
            <span className="label">Page title</span>
            <input {...field("seoTitle")} className="input mt-1" placeholder="Defaults to your name and headline" />
          </label>
          <label className="block">
            <span className="label">Description</span>
            <textarea {...field("seoDescription")} rows={2} className="input mt-1" placeholder="Defaults to your intro" />
          </label>
        </section>
      </div>

      <aside className="space-y-6">
        <div className="card space-y-5 p-4">
          <ImageUrlField
            name="photoUrl"
            label="Portrait"
            value={values.photoUrl}
            onChange={(v) => set("photoUrl", v)}
            error={errors.photoUrl?.[0]}
          />
          <ImageUrlField
            name="resumeUrl"
            label="Résumé (PDF)"
            fileType="pdf"
            value={values.resumeUrl}
            onChange={(v) => set("resumeUrl", v)}
            error={errors.resumeUrl?.[0]}
          />
        </div>
        <div className="card space-y-4 p-4 lg:sticky lg:top-8">
          {state?.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}
          {state?.saved && !pending && <p className="text-sm text-accent">Saved.</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Saving…" : "Save profile"}
          </button>
        </div>
      </aside>
    </form>
  );
}
