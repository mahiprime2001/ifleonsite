import { motion } from "framer-motion";
import {
  MessageSquare,
  FileSearch,
  Layers,
  Rocket,
  LifeBuoy,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Discovery & Consultation",
    description:
      "We start by understanding your business goals, technical needs, and constraints through a detailed discussion.",
  },
  {
    step: "02",
    icon: FileSearch,
    title: "Analysis & Planning",
    description:
      "We analyze requirements, propose the right technology approach, timeline, and a clear execution plan.",
  },
  {
    step: "03",
    icon: Layers,
    title: "Design & Implementation",
    description:
      "Our team builds the solution using best practices in AI, DevOps, cloud, and security engineering.",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Testing & Deployment",
    description:
      "We thoroughly test, optimize, and deploy the solution with minimal disruption and full transparency.",
  },
  {
    step: "05",
    icon: LifeBuoy,
    title: "Support & Optimization",
    description:
      "Post-delivery, we provide support, improvements, and guidance to help you scale confidently.",
  },
];

export const HowWeWork = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How We Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A clear, transparent, and structured approach — from first
            conversation to long-term success.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>

                <div className="text-blue-600 font-bold mb-1">
                  Step {item.step}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Line */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700">
            No hidden steps. No surprises. Just clear execution.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
