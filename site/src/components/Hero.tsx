"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@/lib/router";
import { UndrawHero } from "./illustrations/UndrawHero";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Headline words; the italic one is set in the accent colour. */
const HEADLINE: Array<{ text: string; accent?: boolean }> = [
  { text: "Infinite" },
  { text: "possibilities," },
  { text: "logical", accent: true },
  { text: "solutions." },
];

const FACTS = [
  { value: "2022", label: "Founded in Nellore" },
  { value: "Pan-India", label: "Clients we serve" },
  { value: "AI · DevOps", label: "Core practice" },
  { value: "Founder-led", label: "Every engagement" },
];

export const Hero = () => {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const artRotate = useTransform(scrollYProgress, [0, 1], [0, -3]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Ambient light + ruled paper */}
      <div aria-hidden className="absolute inset-0 mesh-bg" />
      <div
        aria-hidden
        className="absolute inset-0 iso-grid-bg opacity-60 [mask-image:radial-gradient(70%_60%_at_70%_30%,black,transparent)]"
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div style={{ y: copyY }}>
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              AI · DevOps · Cloud · Security
            </motion.p>

            <h1 className="mt-6 font-serif text-[2.9rem] font-normal leading-[1.02] tracking-tightest text-ink sm:text-6xl lg:text-[5.1rem]">
              {HEADLINE.map((word, i) => (
                <span key={word.text} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <motion.span
                    className={`inline-block ${word.accent ? "italic text-brand-700" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: EASE }}
                  >
                    {word.text}
                  </motion.span>
                  {i < HEADLINE.length - 1 && " "}
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-7 max-w-[34rem] text-lg leading-relaxed text-ink-2 md:text-xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            >
              We build AI-powered software, automate delivery pipelines and run secure cloud systems for
              businesses across India, from first commit to the 3&nbsp;a.m. pager.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
            >
              <Link to="/#contact" className="btn-primary shine-on-hover group !px-7 !py-3.5 text-[0.95rem]">
                Book a free consultation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link to="/services" className="link-arrow group text-[0.95rem]">
                See what we build
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Illustration on a paper card, with floating status tiles */}
          <motion.div
            className="relative mx-auto w-full max-w-[560px]"
            style={{ y: artY, rotate: artRotate }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
          >
            <div className="surface relative aspect-square overflow-hidden rounded-[2rem] p-6 shadow-lift">
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-paper-2 via-white to-brand-50" />
              <UndrawHero className="relative h-full w-full" />
            </div>

            <motion.div
              className="surface no-select absolute -left-4 bottom-24 px-4 py-3 sm:-left-8"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                Live
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">Pipeline deployed</p>
            </motion.div>

            <motion.div
              className="surface no-select absolute -right-3 top-[38%] px-4 py-3 sm:-right-6"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            >
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-3">Uptime target</p>
              <p className="mt-1 font-serif text-2xl text-ink">99.9%</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Credibility row */}
        <motion.dl
          className="mt-16 grid grid-cols-2 border-t border-line md:mt-24 md:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {FACTS.map((fact, i) => (
            <div
              key={fact.label}
              className={`py-6 pr-6 ${i > 0 ? "md:border-l md:border-line md:pl-6" : ""} ${i % 2 === 1 ? "border-l border-line pl-6 md:pl-6" : ""}`}
            >
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-3">{fact.label}</dt>
              <dd className="mt-2 font-serif text-2xl text-ink md:text-[1.7rem]">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
};
