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

type Category = {
  key: string;
  title: string;
  short: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  items: Service[];
};

const categories: Category[] = [
  {
    key: "business",
    title: "Business Solutions",
    short: "For Business",
    subtitle: "Enterprise capabilities to scale operations and teams.",
    icon: Briefcase,
    items: businessServices,
  },
  {
    key: "individual",
    title: "Individual Solutions",
    short: "For Individuals",
    subtitle: "Personal tech setup, security, and career guidance.",
    icon: User,
    items: individualServices,
  },
  {
    key: "specialty",
    title: "Specialty & Add-Ons",
    short: "Specialty",
    subtitle: "Targeted offerings we plug into existing teams and products.",
    icon: Sparkles,
    items: specialtyServices,
  },
];

export const Services = () => {
  const [activeKey, setActiveKey] = useState(categories[0].key);
  const active = categories.find((c) => c.key === activeKey)!;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Solutions for every scale
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From enterprise platforms to personal tech setup — pick a category
            to see what we offer.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.key === activeKey;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveKey(cat.key)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.short}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {active.title}
              </h3>
              <p className="text-gray-600">{active.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {active.items.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.id}
                    to="/services"
                    className="group flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 leading-tight">
                        {s.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {s.tagline}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mb-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-lg font-semibold transition shadow"
          >
            View All Services With Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-10 text-white text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold mb-4">
            Technical Insights & Open Source
          </h3>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            Explore real-world implementations, technical blogs, and open-source
            contributions from IFLEON.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Bot className="h-5 w-5" /> Read Our Blog
            </a>

            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <GitBranch className="h-5 w-5" /> View Source Code
            </a>

            <a
              href="https://www.linkedin.com/company/ifleon/"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Linkedin className="h-5 w-5" /> Visit Us on LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
