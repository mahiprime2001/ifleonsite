import { motion } from "framer-motion";
import { Briefcase, Clock, Layers, LifeBuoy, Check, Crown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { MagnetCard } from "../components/animations/MagnetCard";

const plans = [
  {
    icon: Briefcase,
    title: "Project-Based",
    subtitle: "Fixed scope & timeline",
    description:
      "Best for clearly defined requirements like automation setups, cloud migrations, or AI integrations.",
    points: [
      "Clear scope & deliverables",
      "Defined timeline",
      "One-time cost",
      "Documentation included",
    ],
  },
  {
    icon: Clock,
    title: "Hourly / Consulting",
    subtitle: "Flexible & advisory",
    description:
      "Ideal for audits, architecture guidance, DevOps reviews, or short-term expert help.",
    points: [
      "Pay only for time used",
      "Flexible engagement",
      "Expert-level guidance",
      "Fast turnaround",
    ],
  },
  {
    icon: Layers,
    title: "Monthly Retainer",
    subtitle: "Ongoing support & improvements",
    description:
      "Perfect for startups and teams needing continuous DevOps, cloud, or AI support.",
    points: [
      "Priority support",
      "Continuous optimization",
      "Predictable monthly cost",
      "Long-term partnership",
    ],
  },
  {
    icon: LifeBuoy,
    title: "Support & Maintenance",
    subtitle: "Stability & peace of mind",
    description:
      "For existing systems that need monitoring, security updates, and operational support.",
    points: [
      "Monitoring & maintenance",
      "Security updates",
      "Incident support",
      "Performance optimization",
    ],
  },
];

export default function PricingPage() {
  useDocumentMeta({
    title: "Pricing & Engagement Models | IFLEON Consulting",
    description: "Flexible pricing for every project stage — project-based, hourly consulting, monthly retainer, and support & maintenance packages. No hidden costs.",
    canonical: "https://ifleon.com/pricing",
  });
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Pricing"
        title="Engagement models"
        highlight="that match your scale"
        description="Flexible options designed for different business needs, project scopes, and growth stages — every engagement starts with a free consultation."
      />

      {/* Plans grid */}
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
            {plans.map((plan, index) => {
              const Icon = plan.icon;
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
                    className="surface-card h-full rounded-2xl transition-all"
                  >
                    <div className="p-7 md:p-8 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <motion.div
                          whileHover={{ rotate: 6, scale: 1.05 }}
                          className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 text-brand"
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-5 text-sm md:text-base leading-relaxed flex-1">
                        {plan.description}
                      </p>

                      <ul className="space-y-2.5">
                        {plan.points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-brand mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </MagnetCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Premium / Custom tier — strategic accent card */}
          <ScrollReveal direction="scale">
            <div className="surface-card mt-10 relative rounded-3xl p-8 md:p-12 overflow-hidden">
              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-border mb-4">
                    <Crown className="h-4 w-4 text-brand" />
                    <span className="eyebrow">
                      Custom Enterprise
                    </span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-3">
                    Need something tailored?
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    Multi-team rollouts, complex AI/DevOps programs, and long-term
                    partnerships — we'll build a bespoke engagement model that fits
                    your scale, governance, and timeline.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
                    {[
                      "Dedicated team",
                      "SLAs & governance",
                      "Custom contracts",
                      "Quarterly reviews",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-brand" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center lg:text-right">
                  <Link
                    to="/#contact"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-7 py-4 rounded-xl font-semibold transition-all"
                  >
                    Talk to Sales
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="mt-16 text-center">
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                Exact pricing depends on scope, complexity, and timeline. Every
                engagement starts with a free consultation to align expectations.
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-8 py-3.5 rounded-xl font-semibold transition-all"
              >
                Request a Free Consultation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
