"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { EASE } from "./SectionHeading";

/* About + founder: a deep-green plate with the brand rings turning on scroll, beside the story. */
export function Founder() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const plateY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-20, 40]);

  return (
    <section id="about" ref={ref} className="py-24 md:py-36">
      <div className="shell grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <motion.div style={{ y: plateY }} className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div className="absolute inset-0 rounded-[2rem] bg-brand-900 shadow-lift" />
          <div aria-hidden className="absolute inset-0 rounded-[2rem] iso-grid-bg opacity-20 invert" />
          <motion.svg style={{ rotate: ringRotate }} viewBox="0 0 200 200" className="absolute inset-[12%]" aria-hidden>
            <circle cx="82" cy="100" r="52" fill="none" stroke="#FAF8F4" strokeOpacity="0.85" strokeWidth="2" />
            <circle cx="118" cy="100" r="52" fill="none" stroke="#84B699" strokeWidth="2" />
          </motion.svg>
          <div className="absolute inset-x-8 bottom-8">
            <p className="font-serif text-3xl text-paper">S. Mahendra Reddy</p>
            <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brand-300">
              Founder and lead engineer
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="eyebrow">About IFLEON</p>
          <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tightest md:text-6xl">
            Founder-led, <em className="text-brand-700">by design.</em>
          </h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
            <p>
              IFLEON, short for Infinite Logical Elements of Network, is a consulting and engineering company founded
              in Nellore in 2022. We focus on AI, DevOps, cloud engineering and secure digital systems.
            </p>
            <p>
              Mahendra brings hands-on experience in AI systems, DevOps automation, cloud infrastructure and scalable
              application design. His aim is to make advanced technology accessible, practical and useful for
              businesses across India.
            </p>
          </div>

          <dl className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brand-700">Vision</dt>
              <dd className="mt-3 leading-relaxed text-ink-2">
                To become a trusted pan-India technology partner delivering intelligent, secure and scalable digital
                solutions.
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brand-700">Mission</dt>
              <dd className="mt-3 leading-relaxed text-ink-2">
                To solve real-world business problems with AI, DevOps and cloud technology, and to share what we learn
                through open platforms.
              </dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
