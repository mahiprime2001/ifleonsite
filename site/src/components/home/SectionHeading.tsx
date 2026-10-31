"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* Eyebrow + serif title + optional intro, revealed as it scrolls into view. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tightest md:text-6xl">{title}</h2>
      {intro && (
        <p className={`mt-6 max-w-xl text-lg leading-relaxed text-ink-2 ${align === "center" ? "mx-auto" : ""}`}>{intro}</p>
      )}
    </motion.div>
  );
}
