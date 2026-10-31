"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { sendContact } from "../lib/api";
import { CopyButton } from "./CopyButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const SERVICES = ["AI Solutions", "DevOps", "Cloud Migration", "Cybersecurity", "Custom software", "Other"];

const EMPTY = {
  "your-name": "",
  "your-email": "",
  "your-phone": "",
  "your-company": "",
  "your-service": "",
  "your-message": "",
};

/*
 * Contact: an open invitation on the left, the form on a paper card on the right. Messages go to the
 * dashboard (lib/api.ts). Other pages can prefill it with a "prefill-contact" window event.
 */
export const Contact = () => {
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ service?: string; message?: string }>).detail;
      if (!detail) return;
      setFormData((prev) => ({
        ...prev,
        "your-service": detail.service ?? prev["your-service"],
        "your-message": detail.message ?? prev["your-message"],
      }));
      setTimeout(() => messageRef.current?.focus(), 600);
    };
    window.addEventListener("prefill-contact", handler);
    return () => window.removeEventListener("prefill-contact", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await sendContact({
        name: formData["your-name"],
        email: formData["your-email"],
        phone: formData["your-phone"],
        company: formData["your-company"],
        service: formData["your-service"],
        message: formData["your-message"],
        website,
      });
      if (result.ok) {
        setIsSubmitted(true);
        setFormData(EMPTY);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Something went wrong. Please try again, or email info@ifleon.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 md:py-36">
      <div className="shell grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-5 font-serif text-4xl font-normal leading-[1.04] tracking-tightest md:text-6xl">
            Tell us what you are <em className="text-brand-700">building.</em>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-2">
            A short note is enough. The first consultation is free, and you will hear back from an engineer, not a
            sales team.
          </p>

          <dl className="mt-12 divide-y divide-line border-y border-line">
            {[
              {
                label: "Email",
                value: (
                  <span className="inline-flex items-center gap-3">
                    <a href="mailto:info@ifleon.com" className="hover:text-brand-700">
                      info@ifleon.com
                    </a>
                    <CopyButton value="info@ifleon.com" label="Copy email" />
                  </span>
                ),
              },
              { label: "Based in", value: "Nellore, Andhra Pradesh, India" },
              { label: "Reply time", value: "Within 24 hours" },
              { label: "First call", value: "Free, no commitment" },
            ].map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-ink-3">{row.label}</dt>
                <dd className="text-right font-medium text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="surface relative overflow-hidden rounded-[1.75rem] p-7 shadow-lift md:p-10"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex min-h-[28rem] flex-col items-center justify-center text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="grid h-16 w-16 place-items-center rounded-full bg-brand-700 text-white"
                >
                  <Check className="h-7 w-7" />
                </motion.span>
                <h3 className="mt-6 font-serif text-3xl font-normal">Message received.</h3>
                <p className="mt-3 max-w-sm text-ink-2">Thank you. We will reply within 24 hours.</p>
                <button type="button" onClick={() => setIsSubmitted(false)} className="link-arrow mt-8">
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Spam trap: hidden from people, bots fill it in. */}
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <fieldset>
                  <legend className="text-sm font-medium text-ink">What do you need help with?</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SERVICES.map((service) => {
                      const selected = formData["your-service"] === service;
                      return (
                        <button
                          key={service}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFormData((prev) => ({ ...prev, "your-service": selected ? "" : service }))}
                          className={`rounded-full border px-4 py-2 text-sm transition-all duration-200 ${
                            selected
                              ? "border-brand-700 bg-brand-700 text-white"
                              : "border-line-strong bg-white text-ink-2 hover:border-ink/30 hover:text-ink"
                          }`}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-8 grid gap-x-6 sm:grid-cols-2">
                  <Field label="Your name" placeholder="Full name" name="your-name" value={formData["your-name"]} onChange={handleChange} required autoComplete="name" />
                  <Field label="Email" placeholder="you@company.com" name="your-email" type="email" value={formData["your-email"]} onChange={handleChange} required autoComplete="email" />
                  <Field label="Phone (optional)" placeholder="+91" name="your-phone" type="tel" value={formData["your-phone"]} onChange={handleChange} autoComplete="tel" />
                  <Field label="Company (optional)" placeholder="Company or organisation" name="your-company" value={formData["your-company"]} onChange={handleChange} autoComplete="organization" />
                </div>

                <label className="mt-2 block">
                  <span className="text-sm font-medium text-ink">
                    What are you working on? <span className="text-brand-700">*</span>
                  </span>
                  <textarea
                    ref={messageRef}
                    name="your-message"
                    value={formData["your-message"]}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-line-strong bg-paper/60 px-4 py-3 text-base text-ink placeholder:text-ink-4 transition focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/15 resize-none"
                    placeholder="A few lines about the project, the timeline and where you are stuck."
                  />
                </label>

                {error && (
                  <p role="alert" className="mt-4 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={isSubmitting} className="btn-primary group mt-8 w-full !py-4 text-[0.95rem] disabled:cursor-wait disabled:opacity-70">
                  {isSubmitting ? "Sending…" : "Send message"}
                  {!isSubmitting && (
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

function Field({
  label,
  ...input
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mb-5 block">
      <span className="text-sm font-medium text-ink">
        {label}
        {input.required && <span className="text-brand-700"> *</span>}
      </span>
      <input
        {...input}
        className="mt-2 w-full rounded-xl border border-line-strong bg-paper/60 px-4 py-3 text-base text-ink placeholder:text-ink-4 transition focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/15"
      />
    </label>
  );
}
