"use client";

/* Shown when a page can't load its content (usually: the dashboard API is briefly unreachable). */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 pt-32 text-center text-slate-200">
      <p className="mb-4">This page couldn&apos;t be loaded right now.</p>
      <button onClick={reset} className="text-emerald-400 hover:text-emerald-300">
        Try again
      </button>
    </div>
  );
}
