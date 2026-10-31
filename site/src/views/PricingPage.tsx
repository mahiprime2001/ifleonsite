"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PageCta, PageIntro } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    title: "Project-based",
    subtitle: "Fixed scope and timeline",
    description: "Best for clearly defined work like automation setups, cloud migrations or AI integrations.",
    points: ["Clear scope and deliverables", "Defined timeline", "One-time cost", "Documentation included"],
  },
  {
    title: "Hourly consulting",
    subtitle: "Flexible and advisory",
    description: "Ideal for audits, architecture guidance, DevOps reviews or short-term expert help.",
    points: ["Pay only for time used", "Flexible engagement", "Expert-level guidance", "Fast turnaround"],
  },
  {
    title: "Monthly retainer",
    subtitle: "Ongoing support and improvements",
    description: "For startups and teams that need continuous DevOps, cloud or AI support.",
    points: ["Priority support", "Continuous optimisation", "Predictable monthly cost", "Long-term partnership"],
    featured: true,
  },
  {
    title: "Support & maintenance",
    subtitle: "Stability and peace of mind",
    description: "For existing systems that need monitoring, security updates and operational support.",
    points: ["Monitoring and maintenance", "Security updates", "Incident support", "Performance optimisation"],
  },
];

const HOW = [
  { title: "Free consultation", text: "We understand the goal, the constraints and what already exists." },
  { title: "Written estimate", text: "Scope, timeline and cost in writing, before any work starts." },
  { title: "Pick the model", text: "Project, hourly, retainer or support, whichever fits the work." },
];

/* Engagement models as ruled columns (one highlighted), then how a price is reached. */
export default function PricingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title={
          <>
            Engagement models that fit your <em className="text-brand-700">scale.</em>
          </>
        }
        intro="Pricing depends on scope, complexity and timeline. Every engagement starts with a free consultation and a clear written estimate."
      />

      <section className="pb-8">
        <div className="shell">
          <div className="grid overflow-hidden rounded-[1.75rem] border border-line bg-white md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                className={`relative flex flex-col p-8 ${i > 0 ? "border-t border-line md:border-t-0" : ""} ${
                  i % 2 === 1 ? "md:border-l md:border-line" : ""
                } ${i >= 2 ? "md:border-t md:border-line xl:border-t-0" : ""} ${i > 0 ? "xl:border-l xl:border-line" : ""} ${
                  plan.featured ? "bg-brand-900 text-paper" : ""
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-6 top-6 rounded-full bg-brand-700 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-brand-100">
                    Best for ongoing work
                  </span>
                )}
                <p className={`font-mono text-[0.66rem] uppercase tracking-[0.16em] ${plan.featured ? "text-brand-300" : "text-ink-3"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className={`mt-4 font-serif text-3xl font-normal ${plan.featured ? "text-paper" : ""}`}>{plan.title}</h2>
                <p className={`mt-1 text-sm ${plan.featured ? "text-brand-200" : "text-brand-700"}`}>{plan.subtitle}</p>
                <p className={`mt-5 leading-relaxed ${plan.featured ? "text-brand-100/85" : "text-ink-2"}`}>{plan.description}</p>
                <ul className="mt-6 space-y-2.5">
                  {plan.points.map((p) => (
                    <li key={p} className={`flex gap-2.5 text-[0.95rem] ${plan.featured ? "text-paper" : "text-ink"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.featured ? "text-brand-300" : "text-brand-600"}`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <p className="eyebrow">How pricing works</p>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {HOW.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                className="border-t border-ink pt-6"
              >
                <span className="font-serif text-5xl text-brand-200">{i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl font-normal">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <PageCta
        title={
          <>
            Get a clear <em className="text-brand-300">estimate.</em>
          </>
        }
        text="Tell us about the work. We reply within 24 hours and the first consultation is free."
      />
    </>
  );
}
