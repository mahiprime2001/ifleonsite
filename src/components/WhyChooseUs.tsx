import { motion } from "framer-motion";
import {
  ShieldCheck,
  Brain,
  GitBranch,
  Users,
  Target,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { MagnetCard } from "./animations/MagnetCard";
import { SplitReveal } from "./motion/SplitReveal";

const reasons = [
  {
    icon: Brain,
    title: "Practical AI, Not Hype",
    description:
      "We focus on AI solutions that solve real business problems — not experimental demos or buzzwords.",
  },
  {
    icon: GitBranch,
    title: "Strong DevOps Foundation",
    description:
      "From CI/CD pipelines to cloud automation, we build systems that are stable, scalable, and easy to maintain.",
  },
  {
    icon: ShieldCheck,
    title: "Security-First Approach",
    description:
      "Every solution is designed with security, compliance, and data protection in mind from day one.",
  },
  {
    icon: Users,
    title: "Founder-Led Execution",
    description:
      "Your project is handled directly by experienced engineers, not passed between junior resources.",
  },
  {
    icon: Target,
    title: "Business-Focused Delivery",
    description:
      "We align technology decisions with your business goals, timelines, and budgets.",
  },
  {
    icon: Zap,
    title: "Fast & Transparent Communication",
    description:
      "Clear updates, honest timelines, and no hidden surprises throughout the project lifecycle.",
  },
];

export const WhyChooseUs = () => {
  return (
    <section className="relative py-20 md:py-24 bg-transparent overflow-hidden">
      <div className="absolute inset-0 iso-grid-bg opacity-25 pointer-events-none" />
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="eyebrow mb-3">
              Why IFLEON
            </p>
            <SplitReveal as="h2" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-display text-foreground mb-4 leading-tight">
              Engineering depth meets{" "}
              <span className="text-gradient-iflo">business clarity</span>
            </SplitReveal>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine technical depth with a business-first mindset to deliver
              solutions you can trust and scale with confidence.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 perspective-1000"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30, rotateX: -15 },
                  show: { opacity: 1, y: 0, rotateX: 0 },
                }}
                transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <MagnetCard
                  intensity={10}
                  className="surface-card h-full rounded-2xl"
                >
                  <div className="p-6 md:p-8 h-full">
                    <motion.div
                      whileHover={{ rotate: 6, scale: 1.08 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-primary/10 text-brand"
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                </MagnetCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
