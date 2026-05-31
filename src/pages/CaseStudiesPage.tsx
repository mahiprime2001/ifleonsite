import { motion } from "framer-motion";
import { Briefcase, Cloud, Shield, Brain, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

const caseStudies = [
  {
    icon: Cloud,
    title: "Cloud Cost Optimization for a Startup",
    industry: "SaaS / Startup",
    problem:
      "High cloud costs from unoptimized infrastructure and lack of monitoring.",
    solution:
      "Restructured cloud resources, introduced cost monitoring, and optimized compute usage.",
    outcome:
      "Improved cost visibility and a significantly more efficient cloud setup.",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Security Hardening for Internal Systems",
    industry: "Enterprise IT",
    problem:
      "Needed to improve system security and compliance across multiple Linux servers.",
    solution:
      "Implemented security hardening, access controls, and monitoring best practices.",
    outcome: "Stronger security posture and improved operational confidence.",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    icon: Brain,
    title: "AI Automation for Data Processing",
    industry: "Data & Analytics",
    problem: "Manual data processing workflows were slow and error-prone.",
    solution:
      "Designed an AI-assisted automation pipeline to process and validate data efficiently.",
    outcome: "Faster processing times and reduced manual effort.",
    accent: "from-purple-500 to-pink-500",
  },
  {
    icon: Briefcase,
    title: "DevOps Pipeline Modernization",
    industry: "Software Development",
    problem:
      "Slow releases and inconsistent deployment processes across the team.",
    solution:
      "Introduced CI/CD pipelines, automated testing, and containerized deployments.",
    outcome: "More reliable releases and faster development cycles.",
    accent: "from-amber-500 to-orange-500",
  },
];

export default function CaseStudiesPage() {
  useDocumentMeta({
    title: "Case Studies — Real-World Projects & Outcomes | IFLEON",
    description: "See how IFLEON solves real business problems: cloud cost optimization, security hardening, AI automation, and DevOps pipeline modernization — with measurable results.",
    canonical: "https://ifleon.com/case-studies",
  });
  return (
    <div className="bg-slate-950 min-h-screen">
      <PageHero
        eyebrow="Case Studies"
        title="Real-world projects."
        highlight="Practical outcomes."
        description="A selection of recent engagements that show how we approach problems and ship measurable solutions."
      />

      <section className="relative py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-32 left-1/3 w-[36rem] h-[36rem] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1000"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {caseStudies.map((item, index) => {
              const Icon = item.icon;
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
                    intensity={6}
                    className="h-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl hover:bg-white/10 hover:border-emerald-400/40 transition-all"
                  >
                    <div className="p-7 md:p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div
                          whileHover={{ rotate: 6, scale: 1.05 }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.accent} shadow-lg`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-emerald-400 uppercase tracking-wider mt-1 font-semibold">
                            {item.industry}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-slate-300">
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-rose-300 block mb-1">
                            Problem
                          </span>
                          {item.problem}
                        </div>
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-300 block mb-1">
                            Solution
                          </span>
                          {item.solution}
                        </div>
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-300 block mb-1">
                            Outcome
                          </span>
                          {item.outcome}
                        </div>
                      </div>
                    </div>
                  </MagnetCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* WHITE highlight stat strip */}
          <ScrollReveal direction="scale">
            <div className="mt-12 relative rounded-3xl bg-white p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(96,165,250,0.4)] overflow-hidden border border-blue-200">
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-emerald-100 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-blue-100 blur-3xl" />

              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { num: "40%", label: "Average accuracy lift", color: "text-purple-600" },
                  { num: "75%", label: "Faster deploys", color: "text-emerald-600" },
                  { num: "50%", label: "Cloud cost savings", color: "text-blue-600" },
                  { num: "24h", label: "Avg. response time", color: "text-amber-600" },
                ].map((m, i) => (
                  <div key={i}>
                    <div
                      className={`text-3xl md:text-4xl font-black ${m.color} flex items-center justify-center gap-1`}
                    >
                      <TrendingUp className="h-5 w-5" />
                      {m.num}
                    </div>
                    <div className="text-gray-600 text-xs md:text-sm mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="mt-16 text-center">
              <p className="text-slate-300 mb-5">
                Want to discuss a similar challenge?
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
