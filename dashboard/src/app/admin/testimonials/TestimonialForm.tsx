"use client";

import { useActionState, useState } from "react";
import { ImageUrlField } from "@/components/ImageUrlField";
import type { TestimonialFormState } from "./actions";

export type TestimonialFormValues = {
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarUrl: string;
  rating: string;
  isPublished: boolean;
};

const EMPTY: TestimonialFormValues = {
  name: "",
  role: "",
  company: "",
  quote: "",
  avatarUrl: "",
  rating: "",
  isPublished: true,
};

type Props = {
  action: (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  initial?: TestimonialFormValues;
  submitLabel: string;
};

export function TestimonialForm({ action, initial = EMPTY, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // Controlled fields: React 19 resets uncontrolled inputs after a form action.
  const [values, setValues] = useState(initial);
  const field = (name: Exclude<keyof TestimonialFormValues, "isPublished">) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [name]: e.target.value })),
  });

  const errors = state?.fieldErrors ?? {};
  const fieldError = (name: keyof TestimonialFormValues) =>
    errors[name]?.[0] && <p className="mt-1 text-xs text-danger">{errors[name]?.[0]}</p>;

  return (
    <form action={formAction} className="grid max-w-4xl gap-6 lg:grid-cols-[1fr_280px]">
      <div className="card space-y-5 p-5">
        <label className="block">
          <span className="label">Quote</span>
          <textarea {...field("quote")} rows={5} required className="input mt-1" />
          {fieldError("quote")}
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="label">Name</span>
            <input {...field("name")} required className="input mt-1" />
            {fieldError("name")}
          </label>
          <label className="block">
            <span className="label">Role</span>
            <input {...field("role")} className="input mt-1" placeholder="CTO" />
          </label>
          <label className="block">
            <span className="label">Company</span>
            <input {...field("company")} className="input mt-1" />
          </label>
          <label className="block">
            <span className="label">Rating</span>
            <select {...field("rating")} className="input mt-1">
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} ({n})
                </option>
              ))}
            </select>
            {fieldError("rating")}
          </label>
        </div>
        <ImageUrlField
          name="avatarUrl"
          label="Photo"
          value={values.avatarUrl}
          onChange={(avatarUrl) => setValues((prev) => ({ ...prev, avatarUrl }))}
          error={errors.avatarUrl?.[0]}
        />
      </div>

      <aside className="card h-fit space-y-4 p-4">
        <input type="hidden" name="isPublished" value={String(values.isPublished)} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(e) => setValues((prev) => ({ ...prev, isPublished: e.target.checked }))}
            className="size-4 accent-green-600"
          />
          Show on the website
        </label>
        {state?.error && (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}
        {state?.saved && !pending && <p className="text-sm text-accent">Saved.</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Saving…" : submitLabel}
        </button>
      </aside>
    </form>
  );
}
