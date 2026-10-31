"use client";

import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

const PRACTICES = [
  "AI & machine learning",
  "DevOps & CI/CD",
  "Cloud infrastructure",
  "Cybersecurity",
  "Custom software",
  "Data engineering",
  "AI agents",
];

const STACK = [
  "Python", "TypeScript", "Next.js", "Docker", "Kubernetes", "Terraform", "AWS", "Azure",
  "PostgreSQL", "GitHub Actions", "Jenkins", "TensorFlow", "Linux", "Nginx",
];

/*
 * Two rows drifting in opposite directions. Scrolling fast leans them (skew follows scroll velocity),
 * so the strip reacts to the reader.
 */
export function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 });
  const skew = useTransform(velocity, [-2000, 0, 2000], [6, 0, -6]);

  return (
    <section aria-label="What we work with" className="relative overflow-hidden border-y border-line bg-paper-2/60 py-8">
      <motion.div style={{ skewX: skew }} className="space-y-5">
        <Row items={PRACTICES} className="font-serif text-3xl italic text-ink md:text-5xl" separator="✦" />
        <Row items={STACK} reverse className="font-mono text-xs uppercase tracking-[0.2em] text-ink-3 md:text-sm" separator="/" />
      </motion.div>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </section>
  );
}

function Row({ items, className, separator, reverse }: { items: string[]; className: string; separator: string; reverse?: boolean }) {
  // Rendered twice back to back; the CSS marquee moves it by half its width for a seamless loop.
  const loop = [...items, ...items];
  return (
    <div className="flex w-max animate-marquee whitespace-nowrap" style={reverse ? { animationDirection: "reverse" } : undefined}>
      {loop.map((item, i) => (
        <span key={i} aria-hidden={i >= items.length} className={`flex items-center ${className}`}>
          <span className="px-6 md:px-8">{item}</span>
          <span className="text-brand-500 not-italic">{separator}</span>
        </span>
      ))}
    </div>
  );
}
