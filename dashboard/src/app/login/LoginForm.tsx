"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="username" className="input mt-1" />
      </label>
      <label className="block">
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input mt-1"
        />
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
