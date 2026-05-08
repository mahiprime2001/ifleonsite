import { ArrowRight, Zap, Code, Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FloatingObjects from "./three/FloatingObjects";
import { UndrawHero } from "./illustrations/UndrawHero";
import { AnimeText } from "./animations/AnimeText";

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const illoY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const illoRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-12"
    >
      {/* ===== Background layers ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-emerald-500/14 blur-[120px]" />
        <div className="absolute -bottom-40 -right-32 w-[44rem] h-[44rem] rounded-full bg-blue-500/16 blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full bg-purple-500/12 blur-[120px]" />
        <div className="absolute inset-0 iso-grid-bg opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60" />
        {!shouldReduceMotion && (
          <motion.div className="absolute inset-0" style={{ y: bgY }}>
            <FloatingObjects density="low" palette="blue" />
          </motion.div>
        )}
      </div>

      {/* ===== Hero content ===== */}
      <motion.div
        className="relative z-10 w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10"
        style={{ y: contentY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 xl:gap-14 items-center">
          {/* Left: copy column — fills its half */}
          <div className="relative text-center lg:text-left lg:max-w-[640px]">
            {/* decorative left accent bar (visible on lg+) so left edge feels intentional */}
            <div className="hidden lg:block absolute -left-10 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-400/0 via-emerald-400/60 to-emerald-400/0" />

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-xs sm:text-sm text-white/80 tracking-wide">
                AI • DevOps • Cloud • Cybersecurity
              </span>
            </motion.div>

            <h1 className="font-black leading-[1.05] mb-5">
              <AnimeText
                as="span"
                text="IFLEON"
                className="block text-5xl sm:text-6xl xl:text-7xl 2xl:text-[5.5rem] text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-400 animate-gradient"
                staggerMs={50}
                duration={900}
              />
              <span className="block mt-3 text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold">
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Infinite Possibilities,
                </span>{" "}
                <span className="text-white">Logical Solutions.</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 mb-3 max-w-2xl mx-auto lg:mx-0"
            >
              We build AI-powered software, automate DevOps pipelines, and deliver
              secure cloud solutions that help businesses scale faster and smarter.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm sm:text-base text-slate-400 mb-6 max-w-2xl mx-auto lg:mx-0"
            >
              From startups to enterprises across India — reliable, future-ready
              technology tailored to real business needs.
            </motion.p>

            {/* Quick value-prop checklist — fills left column visually */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-8 text-sm text-slate-300 max-w-xl mx-auto lg:mx-0"
            >
              {[
                "Founder-led delivery",
                "Pan-India coverage",
                "Free consultation",
                "Security-first approach",
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                onClick={scrollToContact}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="shine-on-hover group relative bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-xl hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-3 glow-emerald"
              >
                Get Free Consultation
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <Link
                to="/services"
                className="bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-md px-7 py-3.5 rounded-2xl font-semibold text-white/90 hover:text-white transition-all flex items-center justify-center gap-3"
              >
                Explore Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Service pills */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
            >
              {[
                { icon: Zap, text: "AI Solutions" },
                { icon: Code, text: "DevOps & CI/CD" },
                { icon: Shield, text: "Cloud & Security" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.03 }}
                    className="flex items-center gap-3 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white/90 truncate">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: isometric workstation — slightly larger, tighter to the column */}
          <motion.div
            className="relative w-full"
            style={{ y: illoY, rotate: illoRotate }}
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative aspect-square w-full max-w-[600px] mx-auto">
              {/*
                Hero illustration — flat unDraw / Storyset-style SVG.

                To use a real download from undraw.co or storyset.com:
                1. Pick an illustration (search "developer", "code review",
                   "team work", "AI", etc.)
                2. Set the brand color to #10b981 in their customizer (unDraw)
                   or pick the green-themed variant (Storyset).
                3. Download the SVG and save it to:
                   public/illustrations/your-name.svg
                4. Replace <UndrawHero /> below with:
                   <img src="/illustrations/your-name.svg" alt="" className="w-full h-full" />
              */}
              <UndrawHero className="w-full h-full" />

              {/* floating stat tiles */}
              <motion.div
                className="absolute left-2 top-8 sm:left-4 md:left-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white no-select"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-emerald-300 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-semibold">
                  Live
                </div>
                <div className="text-sm sm:text-base font-bold">Pipelines deployed</div>
              </motion.div>
              <motion.div
                className="absolute right-2 bottom-12 sm:right-4 md:right-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white no-select"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.4 }}
              >
                <div className="text-blue-300 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase font-semibold">
                  99.9%
                </div>
                <div className="text-sm sm:text-base font-bold">Uptime</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom credibility row */}
        <motion.div
          className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[
            { num: "2022", label: "Founded" },
            { num: "Pan-India", label: "Reach" },
            { num: "AI · DevOps", label: "Specialties" },
            { num: "Founder-led", label: "Execution" },
          ].map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="text-lg sm:text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-400">
                {item.num}
              </div>
              <div className="text-slate-400 text-[11px] sm:text-xs md:text-sm tracking-wide uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-[10px] tracking-[0.4em] uppercase">Scroll</div>
        <div className="w-[2px] h-8 bg-gradient-to-b from-emerald-400 to-transparent" />
      </motion.div>
    </section>
  );
};
