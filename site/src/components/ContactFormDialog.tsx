"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, Mail, MapPin } from "lucide-react";
import { sendContact } from "../lib/api";


interface Prefill {
  service?: string;
  message?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  prefill?: Prefill;
  title?: string;
  subtitle?: string;
}

/* Fixed choices in the service dropdown; a prefilled service from the Services page is added on top. */
const SERVICE_OPTIONS = ["AI Solutions", "DevOps", "Cloud Migration", "Cybersecurity", "Custom Software", "Data Engineering", "Mobile Apps", "UI/UX Design", "Other"];

export const ContactFormDialog = ({
  open,
  onClose,
  prefill,
  title = "Let's Talk",
  subtitle = "Tell us about your project — we'll get back within 24 hours.",
}: Props) => {
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
  const [website, setWebsite] = useState("");
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!open) return;
// eslint-disable-next-line react-hooks/set-state-in-effect -- the dialog resets and prefills each time it opens
    setFormData((prev) => ({
      ...prev,
      "your-service": prefill?.service ?? prev["your-service"],
      "your-message": prefill?.message ?? prev["your-message"],
    }));
    setIsSubmitted(false);
    setError(null);
    const t = setTimeout(() => messageRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, [open, prefill]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        setFormData({
          "your-name": "",
          "your-email": "",
          "your-phone": "",
          "your-company": "",
          "your-service": "",
          "your-message": "",
        });
        setTimeout(() => onClose(), 2400);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-paper-2 hover:bg-paper-3 flex items-center justify-center text-ink-2 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-ink">
                  {title}
                </h3>
                <p className="text-ink-2 mt-1">{subtitle}</p>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <a
                  href="mailto:info@ifleon.com"
                  className="inline-flex items-center gap-2 text-ink-2 hover:text-brand-700"
                >
                  <Mail className="h-4 w-4" /> info@ifleon.com
                </a>
                <span className="inline-flex items-center gap-2 text-ink-2">
                  <MapPin className="h-4 w-4" /> Nellore, India
                </span>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-14 w-14 text-brand-700 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-ink mb-1">
                    Message Sent
                  </h4>
                  <p className="text-ink-2">
                    Thanks — we&apos;ll respond within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      name="your-name"
                      required
                      placeholder="Full Name *"
                      value={formData["your-name"]}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name="your-email"
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={formData["your-email"]}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      name="your-phone"
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9+\-\s()]{7,}"
                      placeholder="Phone (optional)"
                      value={formData["your-phone"]}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name="your-company"
                      placeholder="Company / Organization"
                      value={formData["your-company"]}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>

                  <select
                    name="your-service"
                    value={formData["your-service"]}
                    onChange={handleChange}
                    className="input w-full mb-4"
                  >
                    <option value="">Select a service</option>
                    {prefill?.service && !SERVICE_OPTIONS.includes(prefill.service) && (
                      <option value={prefill.service}>{prefill.service}</option>
                    )}
                    <option value="AI Solutions">AI Solutions</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Cloud Migration">Cloud Migration</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Custom Software">Custom Software</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Other">Other</option>
                  </select>

                  <textarea
                    ref={messageRef}
                    name="your-message"
                    rows={6}
                    required
                    placeholder="Tell us about your requirements..."
                    value={formData["your-message"]}
                    onChange={handleChange}
                    className="input resize-none mb-4 w-full"
                  />

                  {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-brand-700 to-brand-500 hover:from-brand-700 hover:to-brand-500 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
