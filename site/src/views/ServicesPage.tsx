"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { ContactFormDialog } from "../components/ContactFormDialog";
import { IntroFacts, PageCta, PageIntro } from "../components/PageIntro";
import {
  buildPrefillMessage,
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../data/services";

const EASE = [0.22, 1, 0.36, 1] as const;

const GROUPS = [
  { key: "business", label: "For business", blurb: "Platforms, automation and infrastructure for teams.", items: businessServices },
  { key: "individual", label: "For individuals", blurb: "Setup, safety and guidance for people and homes.", items: individualServices },
  { key: "specialty", label: "Specialty", blurb: "Focused work for one specific problem.", items: specialtyServices },
] as const;

type GroupKey = (typeof GROUPS)[number]["key"];

/*
 * Services, one group at a time (fewer choices on screen), each service a row that opens on demand.
 * /services#<service-id> opens that service directly.
 */
export default function ServicesPage() {
  const [group, setGroup] = useState<GroupKey>("business");
  const [open, setOpen] = useState<string | null>(businessServices[0]?.id ?? null);
  const [dialog, setDialog] = useState<{ open: boolean; prefill: { service?: string; message?: string } }>({
    open: false,
    prefill: {},
  });

  // Deep link: /services#ai-solutions
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const match = GROUPS.find((g) => g.items.some((s) => s.id === id));
    if (!match) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash is only readable after hydration
    setGroup(match.key);
    setOpen(id);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  }, []);

  const current = GROUPS.find((g) => g.key === group)!;

  const discuss = (s: Service) =>
    setDialog({ open: true, prefill: { service: s.title, message: buildPrefillMessage(s.title, s.features) } });

  return (
    <>
      <PageIntro
        eyebrow="Services"
        title={
          <>
            Everything we build, deploy and <em className="text-brand-700">run.</em>
          </>
        }
        intro="Pick a group, open a service, and you will see exactly what you get, what we hand over and the tools we use. Every engagement starts with a free consultation."
        aside={
          <IntroFacts
            items={[
              { value: businessServices.length, label: "For business" },
              { value: individualServices.length, label: "For individuals" },
              { value: specialtyServices.length, label: "Specialty" },
            ]}
          />
        }
      />

      {/* Group switcher, pinned while browsing */}
      <div className="sticky top-3 z-30 mt-2 sm:top-4">
        <div className="shell">
          <div
            role="tablist"
            aria-label="Service groups"
            className="mx-auto flex w-full max-w-max gap-1 overflow-x-auto rounded-full border border-line bg-paper/85 p-1 shadow-soft backdrop-blur-xl"
          >
            {GROUPS.map((g) => {
              const active = g.key === group;
              return (
                <button
                  key={g.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setGroup(g.key);
                    setOpen(g.items[0]?.id ?? null);
                  }}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                    active ? "text-white" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="service-group"
                      className="absolute inset-0 rounded-full bg-brand-700"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {g.label} <span className={active ? "text-brand-200" : "text-ink-4"}>{g.items.length}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24">
        <div className="shell">
          <AnimatePresence mode="wait">
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-baseline">
                <h2 className="font-serif text-3xl font-normal md:text-4xl">{current.label}</h2>
                <p className="text-ink-3">{current.blurb}</p>
              </div>

              <ol className="mt-10 border-t border-line">
                {current.items.map((service, i) => {
                  const isOpen = open === service.id;
                  return (
                    <li key={service.id} id={service.id} className="scroll-mt-28 border-b border-line">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : service.id)}
                        aria-expanded={isOpen}
                        className="group flex w-full items-baseline gap-5 py-7 text-left md:gap-8"
                      >
                        <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1">
                          <span
                            className={`block font-serif text-2xl leading-tight transition-colors md:text-[2.2rem] ${
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
                          className={`grid h-10 w-10 shrink-0 place-items-center self-center rounded-full border transition-colors ${
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
                            <div className="grid gap-10 pb-10 md:grid-cols-[1.2fr_1fr] md:pl-14">
                              <div>
                                <p className="max-w-prose text-lg leading-relaxed text-ink-2">{service.description}</p>
                                <p className="mt-6 border-l-2 border-brand-200 pl-4 font-serif text-lg italic leading-relaxed text-ink-2">
                                  {service.realWorld}
                                </p>
                                <button type="button" onClick={() => discuss(service)} className="btn-primary group mt-8">
                                  Discuss this service
                                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </button>
                              </div>
                              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                                <Detail title="What you get" items={service.features.slice(0, 5)} />
                                <Detail title="We hand over" items={service.deliverables.slice(0, 5)} />
                                <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
                                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">Typical stack</p>
                                  <ul className="mt-3 flex flex-wrap gap-2">
                                    {service.technologies.map((tech) => (
                                      <li key={tech} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-2">
                                        {tech}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <PageCta
        title={
          <>
            Not sure which one <em className="text-brand-300">fits?</em>
          </>
        }
        text="Describe the problem in a few lines and we will suggest the right approach on a free call."
      />

      <ContactFormDialog
        open={dialog.open}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        prefill={dialog.prefill}
      />
    </>
  );
}

function Detail({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-[0.95rem] leading-snug text-ink-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
