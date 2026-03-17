import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  Layers,
  LifeBuoy,
} from "lucide-react";

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
  return (
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pricing & Engagement Models
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible engagement options designed to match different business
            needs, project scopes, and growth stages.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {plan.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>

                <ul className="space-y-2 text-gray-600 text-sm">
                  {plan.points.map((point, i) => (
                    <li key={i}>• {point}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Exact pricing depends on scope, complexity, and timeline. All
            engagements start with a free consultation to ensure the right
            approach and expectations.
          </p>

          <a
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Request a Free Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
