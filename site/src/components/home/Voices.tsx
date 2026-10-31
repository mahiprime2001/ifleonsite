"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import type { Testimonial } from "@/lib/api";
import { EASE } from "./SectionHeading";

const SLIDE_MS = 7000;

/* One large quote at a time; advances on a timer (paused on hover) with a progress rule. */
export function Voices({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, count, paused]);

  if (count === 0) return null;
  const current = testimonials[index];
  const go = (step: number) => setIndex((i) => (i + step + count) % count);
  const rating = Math.min(5, Math.max(0, Number(current.rating ?? 5) || 0));

  return (
    <section
      aria-label="What clients say"
      className="relative overflow-hidden bg-paper-2/70 py-24 md:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-[6%] select-none font-serif text-[22rem] leading-none text-brand-100"
      >
        &ldquo;
      </span>

      <div className="shell relative">
        <p className="eyebrow">Client voices</p>

        <div className="mt-10 min-h-[16rem] md:min-h-[18rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <blockquote className="max-w-4xl font-serif text-3xl font-normal leading-[1.2] tracking-[-0.015em] text-ink md:text-5xl">
                {current.quote}
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-700 font-serif text-xl text-paper">
                  {current.name.charAt(0)}
                </span>
                <span>
                  <span className="block font-semibold text-ink">{current.name}</span>
                  <span className="block text-sm text-ink-3">
                    {[current.role, current.company].filter(Boolean).join(", ")}
                  </span>
                </span>
                {rating > 0 && (
                  <span className="flex gap-0.5" aria-label={`Rated ${rating} out of 5`}>
                    {Array.from({ length: rating }, (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {count > 1 && (
          <div className="mt-14 flex items-center gap-6">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-white/70 text-ink transition hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-white/70 text-ink transition hover:bg-white"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative h-px flex-1 bg-line">
              <motion.div
                key={`${index}-${paused}`}
                className="absolute inset-y-0 left-0 bg-brand-600"
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
              />
            </div>
            <span className="font-mono text-xs text-ink-3">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
