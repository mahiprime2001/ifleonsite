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
    accent: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Platforms",
    items: ["AWS", "Microsoft Azure", "Cloud Architecture", "Cost Optimization"],
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Server,
    title: "DevOps & Automation",
    items: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "CI/CD Pipelines"],
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: Database,
    title: "Databases & Backend",
    items: ["MySQL", "PostgreSQL", "SQLite", "Firebase", "Supabase", "Flask", ".NET"],
    accent: "from-amber-500 to-orange-500",
  },
  {
    icon: Code,
    title: "Frontend & Desktop",
    items: ["React", "TypeScript", "Tailwind CSS", "Tauri", "Electron"],
    accent: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Security & Networking",
    items: ["Cybersecurity", "DPDP Compliance", "Linux Hardening", "Network Security", "Audits"],
    accent: "from-rose-500 to-pink-500",
  },
];

export default function TechStackPage() {
  useDocumentMeta({
    title: "Tech Stack & Frameworks We Ship With | IFLEON",
    description: "IFLEON's technology toolkit: Python, TensorFlow, AWS, Azure, Docker, Kubernetes, React, TypeScript, PostgreSQL, and more — the platforms we use to build secure, scalable solutions.",
    canonical: "https://ifleon.com/tech-stack",
  });
  return (
    <div className="bg-slate-950 min-h-screen">
      <PageHero
        eyebrow="Tech Stack"
        title="Tools & frameworks"
        highlight="we ship with"
        description="The platforms, languages, and tooling we use to build secure, scalable, and future-ready solutions."
      />

      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
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
                    className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 hover:shadow-2xl transition-all"
                  >
                    <div className="p-7 md:p-8 h-full">
                      <motion.div
                        whileHover={{ rotate: 6, scale: 1.06 }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${stack.accent} shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-bold text-white mb-4">
                        {stack.title}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {stack.items.map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs md:text-sm font-medium text-slate-200 hover:border-emerald-400/40 hover:text-white transition-colors"
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

          {/* WHITE spotlight card */}
          <ScrollReveal direction="scale">
            <div className="mt-12 relative rounded-3xl bg-white p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(167,139,250,0.4)] overflow-hidden border border-purple-200">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-100 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-100 blur-3xl" />

              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 mb-4">
                    <Sparkles className="h-4 w-4 text-purple-700" />
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-800">
                      Stack-Agnostic
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                    We adopt your stack — or recommend a better one.
                  </h2>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    The list above is what we ship daily, but we're comfortable
                    adopting your existing toolchain or proposing a stack that
                    fits your team's skills, budget, and timeline.
                  </p>
                </div>

                <div className="text-center lg:text-right">
                  <Link
                    to="/#contact"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 text-white px-7 py-4 rounded-xl font-semibold transition-all"
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
