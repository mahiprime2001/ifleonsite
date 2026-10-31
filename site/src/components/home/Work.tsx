"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import { EASE, SectionHeading } from "./SectionHeading";

const PROJECTS = [
  {
    client: "Regional financial services",
    title: "AI-powered fraud and customer analytics",
    result: "40%",
    resultLabel: "better fraud detection",
    stack: ["Python", "TensorFlow", "AWS SageMaker"],
  },
  {
    client: "Healthcare technology startup",
    title: "End-to-end CI/CD and release automation",
    result: "75%",
    resultLabel: "faster deployments",
    stack: ["Jenkins", "Docker", "AWS"],
  },
  {
    client: "Manufacturing SMB",
    title: "Legacy-to-cloud migration and tuning",
    result: "50%",
    resultLabel: "lower operating cost",
    stack: ["AWS EC2", "S3", "Lambda"],
  },
  {
    client: "Educational institution",
    title: "Security programme aligned with DPDP",
    result: "ISO",
    resultLabel: "27001-aligned controls",
    stack: ["DPDP", "Threat detection", "ISO 27001"],
  },
];

/* Selected work: wide editorial rows; each wipes in as it scrolls into view, the others dim on hover. */
export function Work() {
  return (
    <section className="py-24 md:py-36">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title={
              <>
                Real projects, <em className="text-brand-700">measured</em> outcomes.
              </>
            }
          />
          <Link to="/case-studies" className="link-arrow group shrink-0">
            Read the case studies
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="group/list mt-16 border-t border-line">
          {PROJECTS.map((project, i) => (
            <motion.li
              key={project.title}
              initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
              whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: EASE }}
              className="group relative border-b border-line transition-opacity duration-300 group-hover/list:opacity-50 hover:!opacity-100"
            >
              <div className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100" />
              <div className="relative grid items-center gap-6 py-9 md:grid-cols-[3rem_1.6fr_1fr_auto] md:gap-10 md:px-4">
                <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-brand-700">{project.client}</p>
                  <h3 className="mt-2 font-serif text-2xl font-normal leading-snug md:text-3xl">{project.title}</h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-line px-3 py-1 text-xs text-ink-3">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:text-right">
                  <p className="font-serif text-6xl leading-none text-ink transition-transform duration-500 group-hover:-translate-y-1 md:text-7xl">
                    {project.result}
                  </p>
                  <p className="mt-2 text-sm text-ink-3">{project.resultLabel}</p>
                </div>
                <span className="hidden h-11 w-11 place-items-center rounded-full border border-line-strong text-ink-2 transition-all duration-300 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white md:grid">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
