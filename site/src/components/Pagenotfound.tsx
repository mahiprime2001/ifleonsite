"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";

const EASE = [0.22, 1, 0.36, 1] as const;

const PLACES = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Our work", to: "/portfolio" },
  { label: "Journal", to: "/blog" },
  { label: "Contact", to: "/#contact" },
];

/* 404: a large outlined number with the brand rings drifting behind, a light line, and the way back. */
export function NotFoundPage() {
  const [reason, setReason] = useState("This page took a wrong turn somewhere between commit and deploy.");

  useEffect(() => {
    let cancelled = false;
    fetch("/reasons.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((quotes: string[]) => {
        if (!cancelled && quotes.length) setReason(quotes[Math.floor(Math.random() * quotes.length)]);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
      <div aria-hidden className="absolute inset-0 mesh-bg" />
      <div className="shell relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-6 font-serif text-5xl font-normal leading-[1.05] tracking-tightest md:text-7xl">
            This page is <em className="text-brand-700">not here.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">{reason}</p>

          <ul className="mt-10 border-t border-line">
            {PLACES.map((place, i) => (
              <motion.li
                key={place.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
                className="border-b border-line"
              >
                <Link to={place.to} className="group flex items-center justify-between py-4 font-serif text-2xl text-ink hover:text-brand-700">
                  {place.label}
                  <ArrowUpRight className="h-5 w-5 text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-700" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div aria-hidden className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="82" cy="100" r="60" fill="none" stroke="#B3D3BF" strokeWidth="1.5" strokeDasharray="3 6" />
            <circle cx="118" cy="100" r="60" fill="none" stroke="#D4CCBE" strokeWidth="1.5" strokeDasharray="3 6" />
          </motion.svg>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE }}
            className="font-serif text-[9rem] leading-none text-transparent md:text-[11rem]"
            style={{ WebkitTextStroke: "2px #17583B" }}
          >
            404
          </motion.span>
        </div>
      </div>
    </section>
  );
}
