import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
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
    className={`surface-card border ${
      isOpen ? "border-brand/40" : "border-border"
    } rounded-xl overflow-hidden transition-colors`}
  >
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center gap-4 p-5 md:p-6 text-left group"
      aria-expanded={isOpen}
    >
      <span className="text-base md:text-lg font-semibold text-foreground">
        {question}
      </span>
      <span
        className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
          isOpen
            ? "bg-primary text-primary-foreground shadow-card"
            : "bg-primary/10 text-brand group-hover:bg-primary/20"
        }`}
      >
        {isOpen ? (
          <Minus className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
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
          <div className="px-5 md:px-6 pb-5 md:pb-6 text-muted-foreground leading-relaxed border-t border-border pt-4">
            {answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ question, answer }) => ({
    "@type": "Question",
    "name": question,
    "acceptedAnswer": { "@type": "Answer", "text": answer },
  })),
};

export default function FAQPage() {
  useDocumentMeta({
    title: "FAQ — Working with IFLEON | Pricing, Process & Support",
    description: "Answers to common questions about IFLEON's services, engagement models, timelines, pricing, and how we work with startups, businesses, and individuals.",
    canonical: "https://ifleon.com/faq",
  });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "faq-jsonld";
    script.text = JSON.stringify(faqJsonLd);
    document.head.appendChild(script);
    return () => { document.getElementById("faq-jsonld")?.remove(); };
  }, []);

  return (
    <div className="bg-transparent min-h-screen">
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked"
        highlight="questions"
        description="Everything you need to know about working with IFLEON — engagement models, pricing, integrations, and how we get started."
      />

      <section className="relative py-20 bg-transparent overflow-hidden">

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

          {/* CTA — strategic card */}
          <ScrollReveal direction="up">
            <div className="mt-16 relative rounded-3xl surface-card p-8 md:p-10 overflow-hidden">
              <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-card flex-shrink-0">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-muted-foreground">
                    We respond within 24 hours and the first consultation is on us.
                  </p>
                </div>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-7 py-3.5 rounded-xl font-semibold transition-all flex-shrink-0"
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
