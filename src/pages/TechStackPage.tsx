import { motion } from "framer-motion";
import {
  Cloud,
  Server,
  Database,
  Shield,
  Brain,
  Code,
} from "lucide-react";

const stacks = [
  {
    icon: Brain,
    title: "AI & Data",
    items: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "PyTorch",
      "LangChain",
      "Hugging Face",
    ],
  },
  {
    icon: Cloud,
    title: "Cloud Platforms",
    items: [
      "AWS",
      "Microsoft Azure",
      "Cloud Architecture",
      "Cost Optimization",
    ],
  },
  {
    icon: Server,
    title: "DevOps & Automation",
    items: [
      "Docker",
      "Kubernetes",
      "Jenkins",
      "GitHub Actions",
      "Terraform",
      "CI/CD Pipelines",
    ],
  },
  {
    icon: Database,
    title: "Databases & Backend",
    items: [
      "MySQL",
      "PostgreSQL",
      "SQLite",
      "Firebase",
      "Supabase",
      "Flask",
      ".NET",
    ],
  },
  {
    icon: Code,
    title: "Frontend & Desktop",
    items: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Tauri",
      "Electron",
    ],
  },
  {
    icon: Shield,
    title: "Security & Networking",
    items: [
      "Cybersecurity Essentials",
      "DPDP Compliance",
      "Linux Hardening",
      "Network Security",
      "Monitoring & Audits",
    ],
  },
];

export default function TechStackPage() {
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
            Our Technology Stack
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tools, platforms, and frameworks we use to build secure, scalable,
            and future-ready solutions.
          </p>
        </motion.div>

        {/* Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stacks.map((stack, index) => {
            const Icon = stack.icon;
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
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {stack.title}
                </h3>

                <ul className="space-y-2 text-gray-600 text-sm">
                  {stack.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
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
            Need help choosing the right technology?
          </p>
          <a
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Talk to an Engineer
          </a>
        </motion.div>
      </div>
    </section>
  );
}
