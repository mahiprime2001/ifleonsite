"use client";

import { motion } from "framer-motion";
import { IntroFacts, PageCta, PageIntro } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

const caseStudies = [
  {
    title: "Cloud cost optimisation for a startup",
    industry: "SaaS / Startup",
    problem: "High cloud costs from unoptimised infrastructure and no monitoring.",
    solution: "Restructured cloud resources, introduced cost monitoring and optimised compute usage.",
    outcome: "Clear cost visibility and a significantly more efficient cloud setup.",
  },
  {
    title: "Security hardening for internal systems",
    industry: "Enterprise IT",
    problem: "Security and compliance needed to improve across many Linux servers.",
    solution: "Implemented hardening, access controls and monitoring best practices.",
    outcome: "A stronger security posture and more confidence in daily operations.",
  },
  {
    title: "AI automation for data processing",
    industry: "Data & Analytics",
    problem: "Manual data processing workflows were slow and error-prone.",
    solution: "Designed an AI-assisted pipeline to process and validate data automatically.",
    outcome: "Faster processing and far less manual effort.",
  },
  {
    title: "DevOps pipeline modernisation",
    industry: "Software Development",
    problem: "Slow releases and inconsistent deployments across the team.",
    solution: "Introduced CI/CD pipelines, automated testing and containerised deployments.",
    outcome: "More reliable releases and faster development cycles.",
  },
];

const STAGES = [
  { key: "problem", label: "Problem" },
  { key: "solution", label: "What we did" },
  { key: "outcome", label: "Outcome" },
] as const;

/* Each case reads left to right: problem, what we did, outcome; a rule draws across as it enters. */
export default function CaseStudiesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Case studies"
        title={
          <>
            How we <em className="text-brand-700">think</em>, case by case.
          </>
        }
        intro="Short write-ups of real engagements: the problem we were handed, what we changed and what it led to."
        aside={<IntroFacts items={[{ value: caseStudies.length, label: "Case studies" }, { value: "4", label: "Industries" }]} />}
      />

      <section className="pb-8">
        <div className="shell space-y-20 md:space-y-28">
          {caseStudies.map((study, i) => (
            <motion.article
              key={study.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
                <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-brand-700">{study.industry}</p>
                  <h2 className="mt-2 font-serif text-3xl font-normal leading-tight md:text-5xl">{study.title}</h2>
                </div>
              </div>

              <div className="relative mt-10 md:ml-14">
                <motion.div
                  aria-hidden
                  className="absolute left-0 right-0 top-0 h-px origin-left bg-brand-600"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                />
                <div className="grid border-t border-line md:grid-cols-3">
                  {STAGES.map((stage, s) => (
                    <motion.div
                      key={stage.key}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6, delay: 0.3 + s * 0.15, ease: EASE }}
                      className={`py-6 md:py-8 ${s > 0 ? "border-t border-line md:border-l md:border-t-0 md:pl-8" : ""} md:pr-8`}
                    >
                      <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">{stage.label}</p>
                      <p className={`mt-3 leading-relaxed ${stage.key === "outcome" ? "font-serif text-xl text-ink" : "text-ink-2"}`}>
                        {study[stage.key]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <PageCta
        title={
          <>
            Have a problem like <em className="text-brand-300">these?</em>
          </>
        }
        text="Share it in a few lines. We will tell you how we would approach it on a free call."
      />
    </>
  );
}
