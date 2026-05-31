import { motion } from "framer-motion";
import {
  Building2,
  Rocket,
  ShieldCheck,
  Cloud,
  Bot,
  GitBranch,
  Zap,
  Globe,
  Briefcase,
  Layers,
} from "lucide-react";

const trustItems = [
  { icon: Rocket, label: "Startups" },
  { icon: Building2, label: "SMBs & Enterprises" },
  { icon: Bot, label: "AI / ML Projects" },
  { icon: Cloud, label: "Cloud-Native Teams" },
  { icon: GitBranch, label: "DevOps Pipelines" },
  { icon: ShieldCheck, label: "Security-Conscious Clients" },
  { icon: Globe, label: "Global Remote Teams" },
  { icon: Zap, label: "High-Growth SaaS" },
  { icon: Briefcase, label: "Consultancies" },
  { icon: Layers, label: "Platform Teams" },
];

export const TrustStrip = () => {
  const loop = [...trustItems, ...trustItems];

  return (
    <section className="relative py-10 md:py-12 bg-slate-950 border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 iso-grid-bg opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-400 text-xs md:text-sm uppercase tracking-[0.3em] font-semibold">
            Trusted by teams across
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10" />

        <motion.div
          className="flex gap-8 md:gap-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
        >
          {loop.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 shrink-0"
              >
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm md:text-base font-medium whitespace-nowrap text-slate-200">
                  {item.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
