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
  },
  {
    icon: Brain,
    title: "AI Automation for Data Processing",
    industry: "Data & Analytics",
    problem: "Manual data processing workflows were slow and error-prone.",
    solution:
      "Designed an AI-assisted automation pipeline to process and validate data efficiently.",
    outcome: "Faster processing times and reduced manual effort.",
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
  },
];

export default function CaseStudiesPage() {
  useDocumentMeta({
    title: "Case Studies — Real-World Projects & Outcomes | IFLEON",
    description: "See how IFLEON solves real business problems: cloud cost optimization, security hardening, AI automation, and DevOps pipeline modernization — with measurable results.",
    canonical: "https://ifleon.com/case-studies",
  });
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Case Studies"
        title="Real-world projects."
        highlight="Practical outcomes."
        description="A selection of recent engagements that show how we approach problems and ship measurable solutions."
      />

      <section className="relative py-20 bg-transparent overflow-hidden">
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
                    className="surface-card h-full rounded-2xl hover:border-brand/40 transition-all"
                  >
                    <div className="p-7 md:p-8">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div
                          whileHover={{ rotate: 6, scale: 1.05 }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-brand"
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <h3 className="font-display text-lg md:text-xl font-semibold text-foreground leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-xs text-brand uppercase tracking-wider mt-1 font-semibold">
                            {item.industry}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand block mb-1">
                            Problem
                          </span>
                          {item.problem}
                        </div>
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand block mb-1">
                            Solution
                          </span>
                          {item.solution}
                        </div>
                        <div>
                          <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand block mb-1">
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

          {/* Highlight stat strip */}
          <ScrollReveal direction="scale">
            <div className="surface-card mt-12 relative rounded-3xl p-8 md:p-10 shadow-card overflow-hidden">
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { num: "40%", label: "Average accuracy lift" },
                  { num: "75%", label: "Faster deploys" },
                  { num: "50%", label: "Cloud cost savings" },
                  { num: "24h", label: "Avg. response time" },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="font-display text-3xl md:text-4xl font-bold text-brand flex items-center justify-center gap-1">
                      <TrendingUp className="h-5 w-5" />
                      {m.num}
                    </div>
                    <div className="text-muted-foreground text-xs md:text-sm mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-5">
                Want to discuss a similar challenge?
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-card"
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
