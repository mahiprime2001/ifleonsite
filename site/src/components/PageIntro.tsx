"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/lib/router";

const EASE = [0.22, 1, 0.36, 1] as const;

/*
 * The opening of every inner page: eyebrow, a large serif title that rises out of a mask, an intro
 * line and an optional aside (stats, filters, a call to action). Same rhythm everywhere, so pages
 * feel like one publication.
 */
export function PageIntro({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-32 md:pb-20 md:pt-44">
      <div aria-hidden className="absolute inset-0 mesh-bg" />
      <div className="shell relative grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          <h1 className="mt-6 overflow-hidden pb-[0.08em] font-serif text-[2.6rem] font-normal leading-[1.03] tracking-tightest sm:text-6xl lg:text-[4.6rem]">
            <motion.span
              className="block"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            >
              {title}
            </motion.span>
          </h1>
          {intro && (
            <motion.p
              className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            >
              {intro}
            </motion.p>
          )}
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* A ruled list of small facts for an intro aside: "6 · Industries". */
export function IntroFacts({ items }: { items: Array<{ value: ReactNode; label: string }> }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-6 py-3.5">
          <dt className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">{item.label}</dt>
          <dd className="font-serif text-2xl text-ink">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Closing call to action used at the end of inner pages. */
export function PageCta({
  title,
  text,
  to = "/#contact",
  label = "Book a free consultation",
}: {
  title: ReactNode;
  text: string;
  to?: string;
  label?: string;
}) {
  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-brand-900 px-8 py-14 text-paper md:px-16 md:py-20"
        >
          <div aria-hidden className="absolute inset-0 iso-grid-bg opacity-[0.08] invert" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="max-w-xl font-serif text-4xl font-normal leading-[1.05] text-paper md:text-5xl">{title}</h2>
              <p className="mt-4 max-w-lg text-brand-100/80">{text}</p>
            </div>
            <Link
              to={to}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-paper px-7 py-3.5 text-[0.95rem] font-semibold text-brand-950 transition hover:bg-white active:translate-y-px"
            >
              {label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
