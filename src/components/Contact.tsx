import React, { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send, CheckCircle, Phone, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";

interface ContactFormResponse {
  status: string;
  message: string;
  invalid_fields?: { message: string }[];
}

export const Contact = () => {
  const [formData, setFormData] = useState({
    "your-name": "",
    "your-email": "",
    "your-phone": "",
    "your-company": "",
    "your-service": "",
    "your-message": "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ service?: string; message?: string }>)
        .detail;
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
      const cf7FormData = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        cf7FormData.append(key, value || ""),
      );

      cf7FormData.append("_wpcf7", "84");
      cf7FormData.append("_wpcf7_version", "5.8.7");
      cf7FormData.append("_wpcf7_locale", "en_US");
      cf7FormData.append("_wpcf7_unit_tag", "wpcf7-f84-p0-o1");
      cf7FormData.append("_wpcf7_container_post", "0");

      const response = await fetch(
        "https://ifleon.com/wp-json/contact-form-7/v1/contact-forms/84/feedback",
        { method: "POST", body: cf7FormData },
      );

      const result: ContactFormResponse = await response.json();

      if (result.status === "mail_sent") {
        setIsSubmitted(true);
        setFormData({
          "your-name": "",
          "your-email": "",
          "your-phone": "",
          "your-company": "",
          "your-service": "",
          "your-message": "",
        });
        setTimeout(() => setIsSubmitted(false), 3500);
      } else if (result.invalid_fields?.length) {
        setError(result.invalid_fields.map((f) => f.message).join(", "));
      } else {
        setError(result.message || "Form submission failed.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-[40rem] h-[40rem] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 right-1/4 w-[40rem] h-[40rem] rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-bold text-emerald-400 tracking-[0.3em] uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              Let's transform your{" "}
              <span className="text-gradient-iflo">business.</span>
            </h2>
            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto">
              Looking to implement AI, DevOps automation, or cloud solutions?
              Reach out to IFLEON for a free consultation.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Panel */}
          <ScrollReveal direction="right" className="lg:col-span-2">
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@ifleon.com",
                  href: "mailto:info@ifleon.com",
                  accent: "from-blue-500 to-cyan-500",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Nellore, Andhra Pradesh, India",
                  accent: "from-emerald-500 to-teal-500",
                },
                {
                  icon: Phone,
                  label: "Response time",
                  value: "Within 24 hours",
                  accent: "from-purple-500 to-pink-500",
                },
                {
                  icon: Clock,
                  label: "Engagement",
                  value: "Free initial consultation",
                  accent: "from-amber-500 to-orange-500",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                const Wrapper = item.href ? "a" : "div";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Wrapper
                      {...(item.href ? { href: item.href } : {})}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-emerald-400/40 hover:-translate-y-0.5 transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${item.accent} shadow-md`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">
                          {item.label}
                        </div>
                        <div className="font-semibold text-white truncate">
                          {item.value}
                        </div>
                      </div>
                    </Wrapper>
                  </motion.div>
                );
              })}

              <motion.div
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl text-white overflow-hidden border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(30,58,138,0.6) 0%, rgba(15,118,110,0.5) 100%)",
                }}
              >
                <div className="absolute inset-0 mesh-bg opacity-50" />
                <div className="relative">
                  <h4 className="font-bold text-lg mb-2">Free Consultation</h4>
                  <p className="text-blue-100 text-sm">
                    Discuss your requirements with our experts and get practical,
                    result-driven recommendations — no commitment required.
                  </p>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="left" className="lg:col-span-3">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      Message Sent
                    </h3>
                    <p className="text-slate-300">
                      Thanks for contacting IFLEON. We'll respond within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        name="your-name"
                        required
                        placeholder="Full Name *"
                        value={formData["your-name"]}
                        onChange={handleChange}
                        className="input-dark"
                      />
                      <input
                        name="your-email"
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={formData["your-email"]}
                        onChange={handleChange}
                        className="input-dark"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        name="your-phone"
                        type="tel"
                        inputMode="tel"
                        pattern="[0-9+\-\s()]{7,}"
                        placeholder="Mobile Number *"
                        required
                        value={formData["your-phone"]}
                        onChange={handleChange}
                        className="input-dark"
                      />
                      <input
                        name="your-company"
                        placeholder="Company / Organization"
                        value={formData["your-company"]}
                        onChange={handleChange}
                        className="input-dark"
                      />
                    </div>

                    <div className="mb-4">
                      <select
                        name="your-service"
                        value={formData["your-service"]}
                        onChange={handleChange}
                        className="input-dark w-full"
                      >
                        <option value="" className="bg-slate-900">Select a service</option>
                        <option value="AI Solutions" className="bg-slate-900">AI Solutions</option>
                        <option value="DevOps" className="bg-slate-900">DevOps</option>
                        <option value="Cloud Migration" className="bg-slate-900">Cloud Migration</option>
                        <option value="Cybersecurity" className="bg-slate-900">Cybersecurity</option>
                        <option value="Other" className="bg-slate-900">Other</option>
                      </select>
                    </div>

                    <textarea
                      ref={messageRef}
                      name="your-message"
                      rows={5}
                      required
                      placeholder="Tell us about your requirements..."
                      value={formData["your-message"]}
                      onChange={handleChange}
                      className="input-dark resize-none mb-4 w-full"
                    />

                    {error && (
                      <p className="text-red-400 text-sm mb-4">{error}</p>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="shine-on-hover w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="h-5 w-5" />
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
