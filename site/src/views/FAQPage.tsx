"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { PageHero } from "../components/PageHero";
import { ScrollReveal } from "../components/animations/ScrollReveal";

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
      "Simply contact us through the website. We'll schedule a free consultation to understand your requirements and recommend next steps.",
  },
];

const FAQItem = ({
  question,
  answer,
  isOpen,
  onClick,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className={`bg-white/5 border ${
      isOpen ? "border-brand-600/40" : "border-line"
    } backdrop-blur-md rounded-xl overflow-hidden transition-colors`}
  >
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center gap-4 p-5 md:p-6 text-left group"
      aria-expanded={isOpen}
    >
      <span className="text-base md:text-lg font-semibold text-ink">
        {question}
      </span>
      <span
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          isOpen
            ? "bg-gradient-to-br from-brand-700 to-brand-500 shadow-lg"
            : "bg-paper-2 group-hover:bg-paper-3"
        }`}
      >
        {isOpen ? (
          <Minus className="h-4 w-4 text-white" />
        ) : (
          <Plus className="h-4 w-4 text-white" />
        )}
      </span>
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="px-5 md:px-6 pb-5 md:pb-6 text-ink-2 leading-relaxed border-t border-line pt-4">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-paper min-h-screen">
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked"
        highlight="questions"
        description="Everything you need to know about working with IFLEON — engagement models, pricing, integrations, and how we get started."
      />

      <section className="relative py-20 bg-gradient-to-b from-paper via-paper-2 to-paper overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />
        <div className="absolute inset-0 iso-grid-bg opacity-20 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>

          {/* CTA — strategic WHITE card */}
          <ScrollReveal direction="up">
            <div className="mt-16 relative rounded-3xl bg-white p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(46,122,85,0.4)] overflow-hidden border border-brand-200">
              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-brand-50 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-brand-50 blur-3xl" />

              <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 flex items-center justify-center shadow-xl flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-semibold text-ink mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-ink-2">
                    We respond within 24 hours and the first consultation is on us.
                  </p>
                </div>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-700 to-brand-500 hover:shadow-xl hover:shadow-brand-900/15 hover:-translate-y-0.5 text-white px-7 py-3.5 rounded-xl font-semibold transition-all flex-shrink-0"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
