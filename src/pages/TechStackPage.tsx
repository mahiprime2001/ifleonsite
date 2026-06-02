import { motion } from "framer-motion";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import {
  Cloud,
  Server,
  Database,
  Shield,
  Brain,
  Code,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

const stacks = [
  {
    icon: Brain,
    title: "AI & Data",
    items: ["Python", "Machine Learning", "TensorFlow", "PyTorch", "LangChain", "Hugging Face"],
  },
  {
    icon: Cloud,
    title: "Cloud Platforms",
    items: ["AWS", "Microsoft Azure", "Cloud Architecture", "Cost Optimization"],
  },
  {
    icon: Server,
    title: "DevOps & Automation",
    items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "CI/CD Pipelines"],
  },
  {
    icon: Database,
    title: "Databases & Backend",
    items: ["MySQL", "PostgreSQL", "SQLite", "Firebase", "Supabase", "Flask", ".NET"],
  },
  {
    icon: Code,
    title: "Frontend & Desktop",
    items: ["React", "TypeScript", "Tailwind CSS", "Tauri", "Electron"],
  },
  {
    icon: Shield,
    title: "Security & Networking",
    items: ["Cybersecurity", "DPDP Compliance", "Linux Hardening", "Network Security", "Audits"],
  },
];

export default function TechStackPage() {
  useDocumentMeta({
    title: "Tech Stack & Frameworks We Ship With | IFLEON",
    description: "IFLEON's technology toolkit: Python, TensorFlow, AWS, Azure, Docker, Kubernetes, React, TypeScript, PostgreSQL, and more — the platforms we use to build secure, scalable solutions.",
    canonical: "https://ifleon.com/tech-stack",
  });
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Tech Stack"
        title="Tools & frameworks"
        highlight="we ship with"
        description="The platforms, languages, and tooling we use to build secure, scalable, and future-ready solutions."
      />

      <section className="relative py-20 bg-transparent overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 iso-grid-bg opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.07 } },
            }}
          >
            {stacks.map((stack, index) => {
              const Icon = stack.icon;
              return (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30, rotateX: -10 },
                    show: { opacity: 1, y: 0, rotateX: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <MagnetCard
                    intensity={8}
                    className="h-full surface-card rounded-2xl transition-all"
                  >
                    <div className="p-7 md:p-8 h-full">
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.06 }}
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-primary/10 text-brand"
                      >
                        <Icon className="h-7 w-7" />
                      </motion.div>

                      <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                        {stack.title}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {stack.items.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-card border border-border rounded-lg text-xs md:text-sm font-medium text-muted-foreground hover:border-brand-soft hover:text-foreground transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </MagnetCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* spotlight card */}
          <ScrollReveal direction="scale">
            <div className="mt-12 relative rounded-3xl surface-card p-8 md:p-12 overflow-hidden">
              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-brand-soft mb-4">
                    <Sparkles className="h-4 w-4 text-brand" />
                    <span className="eyebrow">
                      Stack-Agnostic
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-3">
                    We adopt your stack — or recommend a better one.
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    The list above is what we ship daily, but we're comfortable
                    adopting your existing toolchain or proposing a stack that
                    fits your team's skills, budget, and timeline.
                  </p>
                </div>

                <div className="text-center lg:text-right">
                  <Link
                    to="/#contact"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-7 py-4 rounded-xl font-semibold transition-all"
                  >
                    Talk to an Engineer
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
