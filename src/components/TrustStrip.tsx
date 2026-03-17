import { motion } from "framer-motion";
import {
  Building2,
  Rocket,
  Users,
  ShieldCheck,
  Code2,
} from "lucide-react";

const trustItems = [
  { icon: Rocket, label: "Startups" },
  { icon: Building2, label: "Small & Mid Businesses" },
  { icon: Users, label: "Individual Founders" },
  { icon: Code2, label: "Development Teams" },
  { icon: ShieldCheck, label: "Security-Conscious Clients" },
];

export const TrustStrip = () => {
  return (
    <section className="py-14 bg-white border-y border-gray-200">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center text-center text-gray-600"
              >
                <Icon className="h-8 w-8 mb-2 text-gray-500" />
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
