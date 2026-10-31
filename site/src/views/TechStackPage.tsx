"use client";

import { motion } from "framer-motion";
import { IntroFacts, PageCta, PageIntro } from "../components/PageIntro";

const EASE = [0.22, 1, 0.36, 1] as const;

const stacks = [
  { title: "AI & data", items: ["Python", "Machine learning", "TensorFlow", "PyTorch", "LangChain", "Hugging Face"] },
  { title: "Cloud platforms", items: ["AWS", "Microsoft Azure", "Cloud architecture", "Cost optimisation"] },
  { title: "DevOps & automation", items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "CI/CD pipelines"] },
  { title: "Databases & backend", items: ["MySQL", "PostgreSQL", "SQLite", "Firebase", "Supabase", "Flask", ".NET"] },
  { title: "Frontend & desktop", items: ["React", "TypeScript", "Tailwind CSS", "Tauri", "Electron"] },
  { title: "Security & networking", items: ["Cybersecurity", "DPDP compliance", "Linux hardening", "Network security", "Audits"] },
];

const total = stacks.reduce((n, s) => n + s.items.length, 0);

/* The tools we ship with, grouped; each group's items cascade in. */
export default function TechStackPage() {
  return (
    <>
      <PageIntro
        eyebrow="Tech stack"
        title={
          <>
            Tools we <em className="text-brand-700">ship</em> with.
          </>
        }
        intro="The platforms, languages and tooling behind our work. We choose for reliability and long-term maintenance, not fashion."
        aside={<IntroFacts items={[{ value: stacks.length, label: "Areas" }, { value: total, label: "Tools in daily use" }]} />}
      />

      <section className="pb-8">
        <div className="shell grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {stacks.map((stack, i) => (
            <motion.div
              key={stack.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
              className="border-b border-line py-10 sm:pr-8 lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:pl-8 sm:max-lg:[&:nth-child(even)]:border-l sm:max-lg:[&:nth-child(even)]:pl-8"
            >
              <p className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-serif text-3xl font-normal">{stack.title}</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {stack.items.map((item, j) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + j * 0.04, ease: EASE }}
                    className="rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm text-ink-2 transition-colors hover:border-brand-600 hover:text-brand-700"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <PageCta
        title={
          <>
            Need a stack <em className="text-brand-300">reviewed?</em>
          </>
        }
        text="We audit architectures and pipelines and tell you what to keep, fix or replace."
      />
    </>
  );
}
