import { motion } from "framer-motion";
import { Briefcase, Cloud, Shield, Brain } from "lucide-react";

const caseStudies = [
  {
    icon: Cloud,
    title: "Cloud Cost Optimization for a Startup",
    industry: "SaaS / Startup",
    problem:
      "The client was experiencing high cloud costs due to unoptimized infrastructure and lack of monitoring.",
    solution:
      "We restructured cloud resources, introduced cost monitoring, and optimized compute usage.",
    outcome:
      "Improved cost visibility and a significantly more efficient cloud setup.",
  },
  {
    icon: Shield,
    title: "Security Hardening for Internal Systems",
    industry: "Enterprise IT",
    problem:
      "The client needed to improve system security and compliance across multiple Linux servers.",
    solution:
      "We implemented security hardening, access controls, and monitoring best practices.",
    outcome:
      "Stronger security posture and improved operational confidence.",
  },
  {
    icon: Brain,
    title: "AI Automation for Data Processing",
    industry: "Data & Analytics",
    problem:
      "Manual data processing workflows were slow and error-prone.",
    solution:
      "We designed an AI-assisted automation pipeline to process and validate data efficiently.",
    outcome:
      "Faster processing times and reduced manual effort.",
  },
  {
    icon: Briefcase,
    title: "DevOps Pipeline Modernization",
    industry: "Software Development",
    problem:
      "The development team faced slow releases and inconsistent deployment processes.",
    solution:
      "We introduced CI/CD pipelines, automated testing, and containerized deployments.",
    outcome:
      "More reliable releases and faster development cycles.",
  },
];

export default function CaseStudiesPage() {
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
            Case Studies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A selection of real-world projects that highlight how we approach
            problems and deliver practical solutions.
          </p>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((item, index) => {
            const Icon = item.icon;
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
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.industry}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-gray-600 text-sm">
                  <p>
                    <span className="font-semibold text-gray-900">
                      Problem:
                    </span>{" "}
                    {item.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">
                      Solution:
                    </span>{" "}
                    {item.solution}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-900">
                      Outcome:
                    </span>{" "}
                    {item.outcome}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-700 mb-4">
            Want to discuss a similar challenge?
          </p>
          <a
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
