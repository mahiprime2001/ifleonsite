"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { EASE } from "./SectionHeading";

const STEPS = [
  {
    title: "Discovery",
    detail: "Consultation",
    text: "We start with your goals, constraints and the systems you already run, in a working session rather than a sales call.",
  },
  {
    title: "Plan",
    detail: "Analysis & planning",
    text: "A written approach: the technology, the timeline, the risks and what it costs. You know what you are buying before we start.",
  },
  {
    title: "Build",
    detail: "Design & implementation",
    text: "Engineering in short, visible increments, with AI, DevOps, cloud and security practices built in from the first commit.",
  },
  {
    title: "Ship",
    detail: "Testing & deployment",
    text: "Tested, automated releases with rollback paths, so going live is a non-event instead of a weekend.",
  },
  {
    title: "Run",
    detail: "Support & optimisation",
    text: "After launch we stay on: monitoring, fixes, improvements and honest advice as you grow.",
  },
];

/*
 * Desktop: the section pins and the steps travel sideways as you scroll (a horizontal track driven
 * by vertical scroll), with a progress rule underneath. Small screens get a plain vertical timeline.
 */
export function Process() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-128vw"]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section ref={ref} aria-labelledby="process-title" className="relative bg-paper-2/70 lg:h-[330vh]">
      {/* Desktop: pinned horizontal track */}
      <div className="hidden h-screen overflow-hidden lg:sticky lg:top-0 lg:flex lg:items-center">
        <motion.div style={{ x }} className="flex items-stretch gap-[3vw] pl-[6vw]">
          <div className="flex w-[30vw] shrink-0 flex-col justify-center">
            <p className="eyebrow">How we work</p>
            <h2 id="process-title" className="mt-5 font-serif text-6xl font-normal leading-[1.02] tracking-tightest">
              Five steps. <em className="text-brand-700">No</em> surprises.
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-2">
              The same path for a weekend fix or a year-long platform. Keep scrolling.
            </p>
          </div>
          {STEPS.map((step, i) => (
            <article
              key={step.title}
              className="surface flex h-[62vh] w-[34vw] shrink-0 flex-col justify-between rounded-[1.75rem] p-10"
            >
              <div className="flex items-start justify-between">
                <span
                  className="font-serif text-[9rem] leading-none text-transparent"
                  style={{ WebkitTextStroke: "1.5px #B3D3BF" }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">{step.detail}</span>
              </div>
              <div>
                <h3 className="font-serif text-5xl font-normal tracking-tightest">{step.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">{step.text}</p>
              </div>
            </article>
          ))}
          <div className="w-[8vw] shrink-0" />
        </motion.div>

        <div className="absolute inset-x-[6vw] bottom-10 h-px bg-line">
          <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-brand-600" />
        </div>
      </div>

      {/* Mobile and tablet: vertical timeline */}
      <div className="shell py-24 lg:hidden">
        <p className="eyebrow">How we work</p>
        <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tightest">
          Five steps. <em className="text-brand-700">No</em> surprises.
        </h2>
        <ol className="mt-12 space-y-10 border-l border-line pl-8">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative"
            >
              <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-brand-600" />
              <p className="font-mono text-xs text-ink-3">
                {String(i + 1).padStart(2, "0")} · {step.detail}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-normal">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-2">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
