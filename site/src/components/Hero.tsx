"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/lib/router";
import { HeroVisual } from "./HeroVisual";

const EASE = [0.22, 1, 0.36, 1] as const;

/* The last word of the headline cycles through these. */
const WORDS = ["running.", "scaling.", "secure.", "ahead."];

const FACTS = [
  { value: "2022", label: "Founded in Nellore" },
  { value: "Pan-India", label: "Clients we serve" },
  { value: "AI · DevOps", label: "Core practice" },
  { value: "Founder-led", label: "Every engagement" },
];

export const Hero = () => {
  const ref = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-14 pt-28 md:pb-20 md:pt-36">
      <div aria-hidden className="absolute inset-0 mesh-bg" />
      <div
        aria-hidden
        className="absolute inset-0 iso-grid-bg opacity-50 [mask-image:radial-gradient(65%_55%_at_75%_35%,black,transparent)]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Infinite possibilities, logical solutions
            </motion.p>

            <h1 className="mt-6 font-serif text-[2.7rem] font-normal leading-[1.03] tracking-tightest text-ink sm:text-6xl lg:text-[4.6rem]">
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              >
                Software that keeps your business
              </motion.span>
              {/* Every word occupies the same grid cell, so the line never changes height or wraps differently. */}
              <span className="relative inline-grid overflow-hidden pb-[0.1em] align-bottom">
                {WORDS.map((word) => (
                  <span key={word} aria-hidden className="invisible col-start-1 row-start-1 italic">
                    {word}
                  </span>
                ))}
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={WORDS[wordIndex]}
                    className="col-start-1 row-start-1 italic text-brand-700"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <motion.p
              className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-2 md:text-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            >
              IFLEON builds AI-powered software, automates delivery pipelines and runs secure cloud systems for
              businesses across India. One founder-led team, from first commit to production.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
            >
              <Link to="/#contact" className="btn-primary shine-on-hover group !px-7 !py-3.5 text-[0.95rem]">
                Book a free consultation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/services" className="link-arrow group justify-center text-[0.95rem] sm:justify-start">
                See what we build
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.p
              className="mt-6 text-sm text-ink-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Free first consultation · Reply within 24 hours
            </motion.p>
          </div>

          <motion.div
            style={{ y: visualY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="mx-auto mb-6 w-full max-w-[30rem] lg:mb-0 lg:max-w-[34rem]"
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Credibility row */}
        <motion.dl
          className="mt-16 grid grid-cols-2 border-t border-line md:mt-24 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {FACTS.map((fact, i) => (
            <div
              key={fact.label}
              className={`py-6 pr-4 ${i % 2 === 1 ? "border-l border-line pl-5" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""} ${i >= 2 ? "border-t border-line md:border-t-0" : ""}`}
            >
              <dt className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">{fact.label}</dt>
              <dd className="mt-2 font-serif text-[1.45rem] text-ink md:text-[1.7rem]">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};
