import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Briefcase, Layers, Users, ShieldCheck } from "lucide-react";

type MetricProps = {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ElementType;
};

const AnimatedNumber = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / value), 20);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold">
      {count}
    </span>
  );
};

const MetricCard = ({ value, label, suffix, icon: Icon }: MetricProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all text-center"
  >
    <div className="w-14 h-14 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
      <Icon className="h-7 w-7 text-blue-600" />
    </div>

    <div className="flex items-end justify-center gap-1 text-gray-900">
      <AnimatedNumber value={value} />
      {suffix && (
        <span className="text-2xl font-bold text-gray-700">
          {suffix}
        </span>
      )}
    </div>

    <p className="mt-2 text-gray-600 font-medium">{label}</p>
  </motion.div>
);

export const Metrics = () => {
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
            Impact That Speaks for Itself
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Measurable outcomes from real-world projects across AI, DevOps,
            cloud, and cybersecurity.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetricCard
            value={25}
            label="Projects Delivered"
            icon={Briefcase}
          />
          <MetricCard
            value={6}
            label="Industries Served"
            icon={Layers}
          />
          <MetricCard
            value={50}
            suffix="+"
            label="Clients & Individuals"
            icon={Users}
          />
          <MetricCard
            value={99}
            suffix="%"
            label="Security-First Approach"
            icon={ShieldCheck}
          />
        </div>

        {/* Soft CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-700 mb-4">
            Want to be part of these numbers?
          </p>
          <a
            href="#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
};
