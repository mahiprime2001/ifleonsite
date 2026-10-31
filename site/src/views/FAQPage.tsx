"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { PageIntro } from "../components/PageIntro";
import { Link } from "@/lib/router";

const EASE = [0.22, 1, 0.36, 1] as const;

const faqs = [
  {
    question: "What type of clients do you work with?",
    answer: "Startups, small and mid-sized businesses, and individuals who value quality, security and technology that scales.",
  },
  {
    question: "Do you offer one-time projects or long-term support?",
    answer: "Both. We handle one-time implementations as well as long-term consulting, maintenance and optimisation.",
  },
  {
    question: "How do you price your services?",
    answer: "Pricing depends on scope, complexity and timeline. After the initial consultation you get a clear, written estimate.",
  },
  {
    question: "Do you work with remote clients?",
    answer: "Yes. We work with clients across India and collaborate remotely with structured communication and regular updates.",
  },
  {
    question: "Can you integrate with existing systems?",
    answer: "Yes. We regularly work with existing infrastructure, legacy systems and third-party tools to extend and scale what is already there.",
  },
  {
    question: "How do we get started?",
    answer: "Send us a message through the contact form. We set up a free consultation to understand your needs and recommend next steps.",
  },
];

/* Questions on the right, open one at a time; a pinned heading and contact link on the left. */
export default function FAQPage() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          }).replace(/</g, "\\u003c"),
        }}
      />

      <PageIntro
        eyebrow="FAQ"
        title={
          <>
            Questions, <em className="text-brand-700">answered.</em>
          </>
        }
        intro="What clients usually ask before working with us. Anything else, just write to us."
      />

      <section className="pb-24 md:pb-36">
        <div className="shell grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="font-serif text-2xl leading-snug text-ink">Did not find your question?</p>
            <p className="mt-3 text-ink-2">An engineer replies within 24 hours.</p>
            <Link to="/#contact" className="link-arrow group mt-6">
              Ask us directly
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ol className="border-t border-line">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <li key={faq.question} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-baseline gap-5 py-7 text-left"
                  >
                    <span className="font-mono text-xs text-ink-4">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`flex-1 font-serif text-xl leading-snug transition-colors md:text-2xl ${
                        isOpen ? "text-brand-700" : "text-ink group-hover:text-brand-700"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className={`grid h-9 w-9 shrink-0 place-items-center self-center rounded-full border transition-colors ${
                        isOpen ? "border-brand-700 bg-brand-700 text-white" : "border-line-strong text-ink-2"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-8 pl-9 text-lg leading-relaxed text-ink-2">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
