import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="card w-full max-w-sm p-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimization needed */}
        <img src="/logo.svg" alt="" width={44} height={44} className="mb-4" />
        <h1 className="font-serif text-2xl font-medium">IFLEON Dashboard</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Sign in to manage the site.</p>
        {/* LoginForm reads ?next= from the URL, which is only known at request time. */}
        <Suspense fallback={<div className="h-56" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
