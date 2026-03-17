import { ArrowRight, Zap, Code, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import AnoAI from "./animated_hero";


export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ===== Background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900/90 to-slate-900">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <AnoAI />
          </motion.div>
        )}
      </div>

      {/* ===== Content ===== */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Brand */}
        <motion.div
          className="mb-10"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            IFLEON
          </h1>

          <p className="text-xl md:text-2xl text-white/90 tracking-wide">
            Infinite Logical Elements of Network
          </p>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="block bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Infinite Possibilities,
          </span>
          <span className="block mt-2">Logical Technology Solutions</span>
        </motion.h2>

        {/* Clarifier */}
        <motion.p
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We build AI-powered software, automate DevOps pipelines, and deliver
          secure cloud solutions that help businesses scale faster and smarter.
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base md:text-lg text-gray-400 max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          From startups to growing enterprises across India, IFLEON delivers
          reliable, scalable, and future-ready technology solutions tailored to
          real-world business needs.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Get Free Tech Consultation
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <Link
            to="/blog"
            className="bg-white/10 hover:bg-white/20 border border-white/30 px-10 py-5 rounded-2xl font-semibold text-white/90 hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
          >
            Explore Insights
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {/* Services */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {[
            { icon: Zap, text: "AI Solutions & Analytics" },
            { icon: Code, text: "DevOps & CI/CD Automation" },
            { icon: Shield, text: "Cloud & Cybersecurity" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -8, scale: 1.03 }}
                className="cursor-pointer flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust / Credibility */}
        <motion.div
          className="flex flex-wrap justify-center gap-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div>
            <div className="text-3xl font-black text-emerald-400">2022</div>
            <div className="text-gray-400 text-sm">Founded</div>
          </div>

          <div>
            <div className="text-white font-semibold">Nellore, India</div>
            <div className="text-gray-400 text-sm">Serving Pan-India</div>
          </div>

          <div>
            <div className="text-lg font-bold text-white">
              S. Mahendra Reddy
            </div>
            <div className="text-gray-400 text-sm">
              Founder & Lead DevOps / AI Engineer
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
