import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  User,
  Sparkles,
  GitBranch,
  Bot,
  Linkedin,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../data/services";
import { ScrollReveal } from "./animations/ScrollReveal";
import { MagnetCard } from "./animations/MagnetCard";
import { IsoIcon } from "./illustrations/IsoIcon";

type Category = {
  key: string;
  title: string;
  short: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Service[];
  accent: string;
};

const categories: Category[] = [
  {
    key: "business",
    title: "Business Solutions",
    short: "For Business",
    subtitle: "Enterprise capabilities to scale operations and teams.",
    icon: Briefcase,
    items: businessServices,
    accent: "from-blue-500 to-indigo-500",
  },
  {
    key: "individual",
    title: "Individual Solutions",
    short: "For Individuals",
    subtitle: "Personal tech setup, security, and career guidance.",
    icon: User,
    items: individualServices,
    accent: "from-purple-500 to-pink-500",
  },
  {
    key: "specialty",
    title: "Specialty & Add-Ons",
    short: "Specialty",
    subtitle: "Targeted offerings we plug into existing teams and products.",
    icon: Sparkles,
    items: specialtyServices,
    accent: "from-amber-500 to-orange-500",
  },
];

const isoVariants = ["ai", "devops", "cloud", "security", "consulting", "data"] as const;

export const Services = () => {
  const [activeKey, setActiveKey] = useState(categories[0].key);
  const active = categories.find((c) => c.key === activeKey)!;

  return (
    <section
      id="services"
      className="relative py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[40rem] h-[40rem] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 right-1/4 w-[40rem] h-[40rem] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <p className="text-sm font-bold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              What We Do
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Solutions for{" "}
              <span className="text-gradient-iflo">every scale</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              From enterprise platforms to personal tech setup — pick a category
              to see what we offer.
            </p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.key === activeKey;
              return (
                <motion.button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveKey(cat.key)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all border ${
                    isActive
                      ? "text-white border-transparent shadow-lg"
                      : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md"
                  }`}
                  style={
                    isActive
                      ? {
                          background: "linear-gradient(90deg, #3b82f6, #10b981)",
                          boxShadow: "0 10px 30px -8px rgba(59,130,246,0.5)",
                        }
                      : undefined
                  }
                >
                  <Icon className="h-4 w-4" />
                  {cat.short}
                  {isActive && (
                    <motion.span
                      layoutId="active-tab-glow"
                      className="absolute inset-0 rounded-full -z-10 blur-md"
                      style={{
                        background: "linear-gradient(90deg, #3b82f6, #10b981)",
                        opacity: 0.5,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {active.title}
              </h3>
              <p className="text-slate-300">{active.subtitle}</p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12 perspective-1000"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {active.items.map((s, i) => {
                const variant = isoVariants[i % isoVariants.length];
                return (
                  <motion.div
                    key={s.id}
                    variants={{
                      hidden: { opacity: 0, y: 30, rotateX: -15 },
                      show: { opacity: 1, y: 0, rotateX: 0 },
                    }}
                    transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <MagnetCard
                      intensity={8}
                      className="h-full rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-400/40 backdrop-blur-md transition-colors"
                    >
                      <Link
                        to="/services"
                        className="group flex flex-col h-full p-6 rounded-2xl"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <IsoIcon variant={variant} className="w-16 h-16" />
                          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div className="font-bold text-white leading-tight text-lg mb-2">
                          {s.title}
                        </div>
                        <div className="text-sm text-slate-400 line-clamp-2">
                          {s.tagline}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                          Learn more
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </Link>
                    </MagnetCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mb-20">
          <Link
            to="/services"
            className="shine-on-hover inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 text-white px-8 py-4 rounded-xl font-semibold transition-all"
          >
            View All Services With Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Bottom CTA card */}
        <ScrollReveal direction="scale">
          <motion.div
            className="relative rounded-3xl p-12 text-white text-center overflow-hidden border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(30,58,138,0.5) 0%, rgba(15,118,110,0.4) 50%, rgba(14,165,233,0.4) 100%)",
            }}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 mesh-bg opacity-50" />
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-400/30 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/30 blur-3xl" />

            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-black mb-4">
                Technical Insights & Open Source
              </h3>
              <p className="text-base md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Explore real-world implementations, technical blogs, and
                open-source contributions from IFLEON.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/blog"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  <Bot className="h-5 w-5" /> Read Our Blog
                </a>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white/60 hover:bg-white hover:text-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 backdrop-blur-md"
                >
                  <GitBranch className="h-5 w-5" /> View Source Code
                </a>
                <a
                  href="https://www.linkedin.com/company/ifleon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white/60 hover:bg-white hover:text-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 backdrop-blur-md"
                >
                  <Linkedin className="h-5 w-5" /> Visit Us on LinkedIn
                </a>
              </div>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};
