"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check } from "lucide-react";
import { IntroFacts, PageCta, PageIntro } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

const projects = [
  {
    title: "AI-powered customer analytics platform",
    category: "AI & Machine Learning",
    client: "Regional financial services",
    duration: "6 months",
    year: "2024",
    description: "ML platform for fraud detection and customer behaviour analysis.",
    technologies: ["Python", "TensorFlow", "AWS SageMaker", "React", "PostgreSQL"],
    results: ["40% improvement in fraud detection accuracy", "Reduced false positives by 35%", "1M+ transactions processed daily"],
  },
  {
    title: "Enterprise DevOps transformation",
    category: "DevOps & Automation",
    client: "Healthcare technology startup",
    duration: "4 months",
    year: "2024",
    description: "Complete CI/CD pipeline automation with zero-downtime releases.",
    technologies: ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
    results: ["75% reduction in deployment time", "Zero-downtime deployments", "5x faster release cycles"],
  },
  {
    title: "Cloud migration and optimisation",
    category: "Cloud Infrastructure",
    client: "Manufacturing SMB",
    duration: "5 months",
    year: "2023",
    description: "Legacy on-premise systems moved to AWS and tuned for cost and performance.",
    technologies: ["AWS EC2", "S3", "Lambda", "CloudFormation", "RDS"],
    results: ["50% reduction in infrastructure costs", "99.9% uptime achieved", "3x performance improvement"],
  },
  {
    title: "Enterprise security framework",
    category: "Cybersecurity",
    client: "Educational institution",
    duration: "3 months",
    year: "2023",
    description: "Security framework with DPDP compliance, threat detection and incident response.",
    technologies: ["Linux hardening", "Security tools", "Monitoring", "Compliance"],
    results: ["100% DPDP compliance achieved", "Zero security incidents", "Real-time threat monitoring"],
  },
  {
    title: "Custom ERP system",
    category: "Custom Development",
    client: "Local retail chain",
    duration: "8 months",
    year: "2023",
    description: "Custom ERP with mobile access, inventory management and integrated customer analytics.",
    technologies: ["Odoo", "Python", "React Native", "PostgreSQL"],
    results: ["30% increase in operational efficiency", "Real-time inventory tracking", "Mobile field-team access"],
  },
  {
    title: "IoT smart home integration",
    category: "IoT Solutions",
    client: "Residential clients",
    duration: "2 months",
    year: "2024",
    description: "Home automation with voice control, security systems and energy management.",
    technologies: ["IoT devices", "Home Assistant", "Voice integration"],
    results: ["15+ homes automated", "30% energy savings achieved", "Voice-controlled systems"],
  },
];

const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

/* Work: filter by practice; the grid re-flows with shared-layout animation. */
export default function PortfolioPage() {
  const [category, setCategory] = useState("All");
  const shown = category === "All" ? projects : projects.filter((p) => p.category === category);

  return (
    <>
      <PageIntro
        eyebrow="Our work"
        title={
          <>
            Projects that <em className="text-brand-700">shipped.</em>
          </>
        }
        intro="A selection of recent engagements across AI, DevOps, cloud and security, with the results our clients measured."
        aside={
          <IntroFacts
            items={[
              { value: projects.length, label: "Featured projects" },
              { value: categories.length - 1, label: "Practices" },
              { value: "2023–24", label: "Delivered" },
            ]}
          />
        }
      />

      <section className="pb-8">
        <div className="shell">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Filter by practice">
            {categories.map((c) => {
              const active = c === category;
              const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-all ${
                    active ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong bg-white text-ink-2 hover:border-ink/30 hover:text-ink"
                  }`}
                >
                  {c} <span className={active ? "text-brand-200" : "text-ink-4"}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-8 pt-6">
        <div className="shell">
          <LayoutGroup>
            <motion.ul layout className="grid gap-6 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {shown.map((project) => (
                  <motion.li
                    key={project.title}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="surface group flex flex-col p-7 transition-shadow duration-300 hover:shadow-lift md:p-9"
                  >
                    <div className="flex items-center justify-between font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-3">
                      <span className="text-brand-700">{project.category}</span>
                      <span>
                        {project.year} · {project.duration}
                      </span>
                    </div>
                    <h2 className="mt-5 font-serif text-3xl font-normal leading-tight">{project.title}</h2>
                    <p className="mt-2 text-sm text-ink-3">{project.client}</p>
                    <p className="mt-5 leading-relaxed text-ink-2">{project.description}</p>

                    <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
                      {project.results.map((r) => (
                        <li key={r} className="flex gap-2.5 text-[0.95rem] text-ink">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          {r}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-auto flex flex-wrap gap-2 pt-7">
                      {project.technologies.map((t) => (
                        <li key={t} className="rounded-full border border-line px-3 py-1 text-xs text-ink-3">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>
      </section>

      <PageCta
        title={
          <>
            Your project could be <em className="text-brand-300">next.</em>
          </>
        }
        text="Tell us what you are building and where it hurts today. The first consultation is free."
      />
    </>
  );
}
