"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { EASE } from "./SectionHeading";

/* Counts from 0 to `to` once the number scrolls into view. */
function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

const cellClass = (i: number) =>
  [
    "py-12 md:py-16",
    i % 2 === 1 ? "border-l border-line pl-6" : "pr-6",
    i >= 1 ? "md:border-l md:border-line md:pl-8" : "",
    i >= 2 ? "border-t border-line md:border-t-0" : "",
  ].join(" ");

/* A ruled band of figures; the article count is live from the dashboard. */
export function Numbers({ articles }: { articles: number }) {
  const figures = [
    { to: 25, label: "Projects delivered" },
    { to: 6, label: "Industries served" },
    { to: 50, suffix: "+", label: "Clients and individuals" },
    { to: articles, label: "Engineering articles published" },
  ];

  return (
    <section aria-label="IFLEON in numbers" className="border-y border-line bg-white/60">
      <div className="shell grid grid-cols-2 md:grid-cols-4">
        {figures.map((figure, i) => (
          <motion.div
            key={figure.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className={cellClass(i)}
          >
            <p className="font-serif text-6xl leading-none tracking-tightest text-ink md:text-7xl">
              <Count to={figure.to} suffix={figure.suffix} />
            </p>
            <p className="mt-4 max-w-[12rem] text-sm text-ink-3">{figure.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
