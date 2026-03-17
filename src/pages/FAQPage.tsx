import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What type of clients do you work with?",
    answer:
      "We work with startups, small and mid-sized businesses, and individuals who value quality, security, and scalable technology solutions.",
  },
  {
    question: "Do you offer one-time projects or long-term support?",
    answer:
      "Both. We handle one-time implementations as well as long-term consulting, maintenance, and optimization engagements.",
  },
  {
    question: "How do you price your services?",
    answer:
      "Pricing depends on project scope, complexity, and timeline. After the initial consultation, we provide a clear and transparent estimate.",
  },
  {
    question: "Do you work with remote clients?",
    answer:
      "Yes. We work with clients across India and support remote collaboration through structured communication and regular updates.",
  },
  {
    question: "Can you integrate with existing systems?",
    answer:
      "Absolutely. We frequently work with existing infrastructure, legacy systems, and third-party tools to enhance and scale current setups.",
  },
  {
    question: "How do we get started?",
    answer:
      "Simply contact us through the website. We’ll schedule a free consultation to understand your requirements and recommend next steps.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center p-6 text-left"
      aria-expanded={isOpen}
    >
      <span className="text-lg font-semibold text-gray-900">
        {question}
      </span>
      {isOpen ? (
        <Minus className="h-5 w-5 text-blue-600" />
      ) : (
        <Plus className="h-5 w-5 text-blue-600" />
      )}
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="px-6 pb-6 text-gray-600 leading-relaxed">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about working with IFLEON.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-700 mb-4">
            Didn’t find what you’re looking for?
          </p>
          <a
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
}
