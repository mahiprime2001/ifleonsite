import React, { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        cf7FormData.append(key, value || "")
      );

      // Required CF7 hidden fields
      cf7FormData.append("_wpcf7", "84");
      cf7FormData.append("_wpcf7_version", "5.8.7");
      cf7FormData.append("_wpcf7_locale", "en_US");
      cf7FormData.append("_wpcf7_unit_tag", "wpcf7-f84-p0-o1");
      cf7FormData.append("_wpcf7_container_post", "0");

      const response = await fetch(
        "https://ifleon.com/wp-json/contact-form-7/v1/contact-forms/84/feedback",
        {
          method: "POST",
          body: cf7FormData,
        }
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
        setError(
          result.invalid_fields.map((f) => f.message).join(", ")
        );
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
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Let’s Transform Your Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Looking to implement AI, DevOps automation, or cloud solutions?
            Reach out to IFLEON for a free consultation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h3>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <a
                      href="mailto:info@ifleon.com"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      info@ifleon.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Location</div>
                    <div className="text-gray-600">
                      Nellore, Andhra Pradesh, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-2">
                Free Consultation
              </h4>
              <p className="text-gray-600">
                Discuss your requirements with our experts and get practical,
                result-driven recommendations.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10"
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Message Sent
                  </h3>
                  <p className="text-gray-600">
                    Thanks for contacting IFLEON. We’ll respond within 24 hours.
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <input
                      name="your-phone"
                      type="tel"
                      inputMode="tel"
                      pattern="[0-9+\-\s()]{7,}"
                      placeholder="Mobile Number *"
                      required
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

                  <div className="mb-6">
                    <select
                      name="your-service"
                      value={formData["your-service"]}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="">Select a service</option>
                      <option value="AI Solutions">AI Solutions</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Cloud Migration">Cloud Migration</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

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
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="h-5 w-5" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
