import { motion } from "framer-motion";
import {
  ShieldCheck,
  Brain,
  GitBranch,
  Users,
  Target,
  Zap,
} from "lucide-react";

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose IFLEON
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine technical depth with a business-first mindset to deliver
            solutions you can trust and scale with confidence.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
