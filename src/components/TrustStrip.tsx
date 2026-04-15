import { motion } from "framer-motion";
import {
  Building2,
  Rocket,
  Users,
  ShieldCheck,
  Code2,
  Cloud,
  Bot,
  Cpu,
  Database,
  GitBranch,
  Sparkles,
  Zap,
  Globe,
  Terminal,
  Briefcase,
  Layers,
} from "lucide-react";

const trustItems = [
  { icon: Rocket, label: "Startups" },
  { icon: Building2, label: "Small & Mid Businesses" },
  { icon: Users, label: "Individual Founders" },
  { icon: Code2, label: "Development Teams" },
  { icon: ShieldCheck, label: "Security-Conscious Clients" },
  { icon: Cloud, label: "Cloud-Native Teams" },
  { icon: Bot, label: "AI / ML Projects" },
  { icon: Cpu, label: "Embedded Innovators" },
  { icon: Database, label: "Data-Driven Orgs" },
  { icon: GitBranch, label: "DevOps Pipelines" },
  { icon: Sparkles, label: "Product Studios" },
  { icon: Zap, label: "High-Growth SaaS" },
  { icon: Globe, label: "Global Remote Teams" },
  { icon: Terminal, label: "Engineering Labs" },
  { icon: Briefcase, label: "Consultancies" },
  { icon: Layers, label: "Platform Teams" },
];

export const TrustStrip = () => {
  const loop = [...trustItems, ...trustItems];

  return (
    <section className="py-14 bg-white border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 text-sm uppercase tracking-wider">
            Trusted By
          </p>
        </motion.div>
      </div>

      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <motion.div
          className="flex gap-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loop.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center text-gray-600 shrink-0 w-40"
              >
                <Icon className="h-8 w-8 mb-2 text-gray-500" />
                <span className="text-sm font-medium whitespace-nowrap">
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
