import { motion } from "framer-motion";
import {
  MessageSquare,
  FileSearch,
  Layers,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { IsoProcess } from "./illustrations/IsoProcess";

type Step = 1 | 2 | 3 | 4 | 5;

const steps: {
  step: string;
  num: Step;
  icon: typeof MessageSquare;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    num: 1,
    icon: MessageSquare,
    title: "Discovery & Consultation",
    description:
      "We start by understanding your business goals, technical needs, and constraints through a detailed discussion.",
  },
  {
    step: "02",
    num: 2,
    icon: FileSearch,
    title: "Analysis & Planning",
    description:
      "We analyze requirements, propose the right technology approach, timeline, and a clear execution plan.",
  },
  {
    step: "03",
    num: 3,
    icon: Layers,
    title: "Design & Implementation",
    description:
      "Our team builds the solution using best practices in AI, DevOps, cloud, and security engineering.",
  },
  {
    step: "04",
    num: 4,
    icon: Rocket,
    title: "Testing & Deployment",
    description:
      "We thoroughly test, optimize, and deploy the solution with minimal disruption and full transparency.",
  },
  {
    step: "05",
    num: 5,
    icon: LifeBuoy,
    title: "Support & Optimization",
    description:
      "Post-delivery, we provide support, improvements, and guidance to help you scale confidently.",
  },
];

export const HowWeWork = () => {
  return (
    <section className="relative py-20 md:py-24 bg-gradient-to-b from-slate-950 to-slate-900 text-white overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="absolute inset-0 iso-grid-bg opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-bold text-blue-400 tracking-[0.3em] uppercase mb-3">
              Our Process
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              How We Work
            </h2>
            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto">
              A clear, transparent, and structured approach — from first
              conversation to long-term success.
            </p>
          </div>
        </ScrollReveal>

        {/* Steps with illustrations + connecting line */}
        <div className="relative">
          {/* connecting line — desktop */}
          <div className="hidden lg:block absolute top-[110px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0" />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.num}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                  className="relative text-center"
                >
                  {/* Isometric scene */}
                  <motion.div
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="mb-4 mx-auto max-w-[220px]"
                  >
                    <IsoProcess step={item.num} className="w-full h-auto rounded-xl" />
                  </motion.div>

                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-3">
                    <Icon className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-300">
                      Step {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <ScrollReveal direction="up">
          <div className="mt-12 md:mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="text-slate-200 text-sm md:text-base">
                No hidden steps. No surprises. Just clear execution.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
