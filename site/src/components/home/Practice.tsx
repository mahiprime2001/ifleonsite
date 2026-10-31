"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Link } from "@/lib/router";
import { businessServices } from "@/data/services";
import { EASE } from "./SectionHeading";

/*
 * "What we do" as an editorial index: the heading stays pinned on the left while the practices
 * scroll past on the right. Hovering (or tapping) a row opens its details.
 */
export function Practice() {
  const [open, setOpen] = useState<string | null>(businessServices[0]?.id ?? null);

  return (
    <section id="services" className="relative py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="eyebrow">What we do</p>
            <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tightest md:text-6xl">
              Six practices, <em className="text-brand-700">one</em> accountable team.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
              The same engineers design, build and run what we ship, so nothing gets lost between a strategy deck
              and production.
            </p>
            <Link to="/services" className="link-arrow group mt-8">
              Every service, including for individuals
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <ol className="border-t border-line">
          {businessServices.map((service, i) => {
            const isOpen = open === service.id;
            return (
              <motion.li
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                className="border-b border-line"
                onMouseEnter={() => setOpen(service.id)}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-baseline gap-5 py-7 text-left md:gap-8"
                >
                  <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span
                      className={`block font-serif text-2xl leading-tight transition-colors md:text-[2.1rem] ${
                        isOpen ? "text-brand-700" : "text-ink group-hover:text-brand-700"
                      }`}
                    >
                      {service.title}
                    </span>
                    <span className="mt-1 block text-sm text-ink-3">{service.tagline}</span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className={`grid h-9 w-9 shrink-0 place-items-center self-center rounded-full border transition-colors ${
                      isOpen ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong text-ink-2"
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 pl-9 md:grid-cols-[1.4fr_1fr] md:pl-14">
                        <p className="max-w-prose leading-relaxed text-ink-2">{service.description}</p>
                        <div>
                          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">Typical stack</p>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {service.technologies.slice(0, 6).map((tech) => (
                              <li key={tech} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-2">
                                {tech}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
