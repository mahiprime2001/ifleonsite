"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ImageUrlField } from "@/components/ImageUrlField";
import { slugify } from "@/lib/slug";
import type { AutosaveResult, PostFormState } from "./actions";
import { MarkdownEditor } from "./MarkdownEditor";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string;
  status: "draft" | "published" | "archived";
  /* ISO string, or "" for no date. */
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY: PostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  tags: "",
  status: "draft",
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
};

const AUTOSAVE_DELAY_MS = 4000;

/* datetime-local works in the browser's time zone; the server stores UTC. */
function isoToLocalInput(iso: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

const subscribeNoop = () => () => {};

type AutosaveStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; at: string }
  | { kind: "error"; message: string };

type Props = {
  action: (state: PostFormState, formData: FormData) => Promise<PostFormState>;
  /* Only passed for existing posts. Runs only while the post is a draft. */
  autosave?: (formData: FormData) => Promise<AutosaveResult>;
  initial?: PostFormValues;
  submitLabel: string;
};

export function PostForm({ action, autosave, initial = EMPTY, submitLabel }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  /*
   * Change tracking: every edit bumps `version`; a successful save (manual or auto) records the
   * version it saved. Unsaved changes = the two differ.
   */
  const versionRef = useRef(0);
  const [version, setVersion] = useState(0);
  const [savedVersion, setSavedVersion] = useState(0);
  const markChanged = () => {
    versionRef.current += 1;
    setVersion(versionRef.current);
  };
  const dirty = version !== savedVersion;

  const [state, formAction, pending] = useActionState(
    async (prev: PostFormState, formData: FormData) => {
      const submitted = versionRef.current;
      const result = await action(prev, formData);
      if (result?.saved) setSavedVersion(submitted);
      return result;
    },
    undefined,
  );

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.slug));
  const [content, setContent] = useState(initial.content);
  const [coverImageUrl, setCoverImageUrl] = useState(initial.coverImageUrl);
  const [publishedAt, setPublishedAt] = useState(initial.publishedAt);
  /*
   * Every field is controlled: React 19 resets uncontrolled fields after a form action,
   * which would silently revert edits after a save or a failed validation.
   */
  const [fields, setFields] = useState(() => ({
    excerpt: initial.excerpt,
    tags: initial.tags,
    status: initial.status as string,
    seoTitle: initial.seoTitle,
    seoDescription: initial.seoDescription,
  }));
  const field = (name: keyof typeof fields) => ({
    name,
    value: fields[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((prev) => ({ ...prev, [name]: e.target.value })),
  });
  // The local-time date input only renders in the browser, so server and client HTML match.
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);

  // Autosave drafts a few seconds after the last change. Published posts are never autosaved,
  // so half-finished edits can't go live.
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>({ kind: "idle" });
  const canAutosave = Boolean(autosave) && fields.status === "draft";
  useEffect(() => {
    if (!autosave || !canAutosave || version === savedVersion || pending) return;
    const timer = setTimeout(async () => {
      const form = formRef.current;
      if (!form) return;
      const saving = versionRef.current;
      setAutosaveStatus({ kind: "saving" });
      const result = await autosave(new FormData(form));
      if (result.ok) {
        setSavedVersion(saving);
        setAutosaveStatus({
          kind: "saved",
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      } else {
        setAutosaveStatus({ kind: "error", message: result.error });
      }
    }, AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [autosave, canAutosave, version, savedVersion, pending]);

  // Warn before closing or reloading the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const errors = state?.fieldErrors ?? {};
  const fieldError = (name: keyof PostFormValues) =>
    errors[name]?.[0] && <p className="mt-1 text-xs text-danger">{errors[name]?.[0]}</p>;

  let saveStatus: { text: string; tone: string } | null = null;
  if (pending) saveStatus = null;
  else if (autosaveStatus.kind === "error" && dirty) saveStatus = { text: autosaveStatus.message, tone: "text-danger" };
  else if (autosaveStatus.kind === "saving") saveStatus = { text: "Autosaving…", tone: "text-muted" };
  else if (dirty)
    saveStatus = {
      text: canAutosave ? "Unsaved changes · autosaves in a few seconds" : "Unsaved changes",
      tone: "text-amber-300",
    };
  else if (state?.saved) saveStatus = { text: "Saved.", tone: "text-accent" };
  else if (autosaveStatus.kind === "saved") saveStatus = { text: `Autosaved at ${autosaveStatus.at}`, tone: "text-accent" };

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={markChanged}
      className="grid gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5">
        <label className="block">
          <span className="label">Title</span>
          <input
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            required
            className="input mt-1 text-lg"
          />
          {fieldError("title")}
        </label>

        <label className="block">
          <span className="label">Slug</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted">/blog/</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className="input font-mono text-sm"
            />
          </div>
          {fieldError("slug")}
        </label>

        <label className="block">
          <span className="label">Excerpt</span>
          <textarea
            {...field("excerpt")}
            rows={2}
            className="input mt-1"
            placeholder="One or two sentences shown on the blog list."
          />
          {fieldError("excerpt")}
        </label>

        <MarkdownEditor
          name="content"
          value={content}
          onChange={(value) => {
            setContent(value);
            markChanged();
          }}
          error={errors.content?.[0]}
        />
      </div>

      <aside className="space-y-5">
        <div className="card space-y-4 p-4 lg:sticky lg:top-4">
          <label className="block">
            <span className="label">Status</span>
            <select {...field("status")} className="input mt-1">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="block">
            <span className="label">Publish date</span>
            <input type="hidden" name="publishedAt" value={publishedAt} />
            {isClient ? (
              <input
                type="datetime-local"
                value={isoToLocalInput(publishedAt)}
                onChange={(e) =>
                  setPublishedAt(e.target.value ? new Date(e.target.value).toISOString() : "")
                }
                className="input mt-1"
              />
            ) : (
              <div className="input mt-1 h-10" />
            )}
            <p className="mt-1 text-xs text-muted">
              Empty = now when published. A future date schedules the post.
            </p>
            {fieldError("publishedAt")}
          </label>

          {state?.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Saving…" : submitLabel}
          </button>
          {saveStatus && (
            <p aria-live="polite" className={`text-center text-xs ${saveStatus.tone}`}>
              {saveStatus.text}
            </p>
          )}
        </div>

        <div className="card space-y-4 p-4">
          <label className="block">
            <span className="label">Tags</span>
            <input {...field("tags")} className="input mt-1" placeholder="devops, ai, cloud" />
          </label>
          <ImageUrlField
            name="coverImageUrl"
            label="Cover image"
            value={coverImageUrl}
            onChange={(value) => {
              setCoverImageUrl(value);
              markChanged();
            }}
            error={errors.coverImageUrl?.[0]}
          />
        </div>

        <div className="card space-y-4 p-4">
          <p className="text-sm font-medium">Search engine</p>
          <label className="block">
            <span className="label">SEO title</span>
            <input {...field("seoTitle")} className="input mt-1" placeholder="Defaults to the title" />
          </label>
          <label className="block">
            <span className="label">SEO description</span>
            <textarea
              {...field("seoDescription")}
              rows={3}
              className="input mt-1"
              placeholder="Defaults to the excerpt. About 150 characters."
            />
            {fieldError("seoDescription")}
          </label>
        </div>
      </aside>
    </form>
  );
}
