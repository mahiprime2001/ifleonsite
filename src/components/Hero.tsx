import { ArrowRight, Zap, Code, Shield, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { AnimeText } from "./animations/AnimeText";
import { Lemniscate } from "./brand/Lemniscate";
import Magnetic from "./motion/Magnetic";

// Signature WebGL showpiece — code-split so it never blocks the hero's first paint.
const HeroFlowField = lazy(() => import("./three/HeroFlowField"));

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-12 bg-transparent"
    >
      {/* ===== Full-bleed signature WebGL field (behind everything) ===== */}
      {shouldReduceMotion ? (
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Lemniscate withNodes draw className="w-[80%] max-w-[900px] opacity-70" />
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <Lemniscate
                withNodes={false}
                draw={false}
                className="w-[70%] max-w-[820px] opacity-30"
              />
            </div>
          }
        >
          <HeroFlowField className="absolute inset-0 z-0" />
        </Suspense>
      )}

      {/* readability scrims so the copy stays crisp over the field */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-transparent to-background/55 pointer-events-none" />
      {/* mobile/tablet: soft wash behind the stacked copy so text stays legible over the field */}
      <div
        className="absolute inset-0 z-[1] lg:hidden pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 75% at 50% 40%, hsl(var(--background) / 0.8), hsl(var(--background) / 0.32) 62%, transparent 88%)",
        }}
      />
      {/* desktop: left-weighted wash so the copy column stays crisp */}
      <div
        className="absolute inset-0 z-[1] hidden lg:block pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.55) 34%, transparent 64%)",
        }}
      />

      {/* ===== Hero content ===== */}
      <motion.div
        className="relative z-10 w-full max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10"
        style={{ y: shouldReduceMotion ? 0 : contentY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-12 xl:gap-14 items-center">
          {/* ===== Left: copy column ===== */}
          <div className="relative text-center lg:text-left lg:max-w-[640px]">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow mb-6 inline-block"
            >
              AI · DevOps · Cloud · Security
            </motion.div>

            <h1 className="font-display font-semibold leading-[1.03] mb-5">
              <AnimeText
                as="span"
                text="IFLEON"
                className="block text-5xl sm:text-6xl xl:text-7xl 2xl:text-[5.5rem] text-brand-gradient animate-gradient"
                staggerMs={50}
                duration={900}
              />
              <span className="block mt-3 text-3xl sm:text-4xl xl:text-5xl 2xl:text-6xl font-bold">
                <span className="text-brand-gradient animate-gradient">
                  Infinite Possibilities,
                </span>{" "}
                <span className="text-foreground">Logical Solutions.</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-3 max-w-2xl mx-auto lg:mx-0"
            >
              We build AI-powered software, automate DevOps pipelines, and deliver
              secure cloud solutions that help businesses scale faster and smarter.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0"
            >
              From startups to enterprises across India — reliable, future-ready
              technology tailored to real business needs.
            </motion.p>

            {/* Quick value-prop checklist */}
            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-8 text-sm text-muted-foreground max-w-xl mx-auto lg:mx-0"
            >
              {[
                "Founder-led delivery",
                "Pan-India coverage",
                "Free consultation",
                "Security-first approach",
              ].map((item, i) => (
                <li key={i} className="flex items-center justify-center lg:justify-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand flex-shrink-0" />
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
              <Magnetic strength={0.5}>
                <button
                  onClick={scrollToContact}
                  data-cursor
                  className="shine-on-hover group relative bg-primary text-primary-foreground hover:bg-primary/90 px-7 py-3.5 rounded-2xl font-semibold shadow-card flex items-center justify-center gap-3 transition-transform hover:-translate-y-0.5"
                >
                  Request a Free Consultation
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Magnetic>

              <Magnetic strength={0.4}>
                <Link
                  to="/services"
                  data-cursor
                  className="border border-border bg-card hover:bg-accent text-foreground px-7 py-3.5 rounded-2xl font-semibold transition-all flex items-center justify-center gap-3"
                >
                  Explore Services
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Magnetic>
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
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="surface-card flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="h-4 w-4 text-brand" />
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* ===== Right: signature lemniscate mark over a soft brand wash ===== */}
          <motion.div
            className="relative w-full"
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="relative aspect-square w-full max-w-[600px] mx-auto">
              {/* floating stat tiles + compliance pills overlay the full-bleed field */}
              <motion.div
                className="surface-card absolute left-2 top-8 sm:left-4 md:left-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl no-select"
                animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="eyebrow text-[9px] sm:text-[10px]">Live</div>
                <div className="text-sm sm:text-base font-bold text-foreground">
                  Pipelines deployed
                </div>
              </motion.div>
              <motion.div
                className="surface-card absolute right-2 bottom-12 sm:right-4 md:right-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl no-select"
                animate={shouldReduceMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.4 }}
              >
                <div className="eyebrow text-[9px] sm:text-[10px]">99.9%</div>
                <div className="text-sm sm:text-base font-bold text-foreground">Uptime</div>
              </motion.div>

              {/* compliance pills */}
              <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-wrap items-center justify-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.6 }}
              >
                {["ISO 27001", "DPDP", "SOC 2"].map((label) => (
                  <span
                    key={label}
                    className="surface-card inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-muted-foreground no-select"
                  >
                    <Shield className="h-3 w-3 text-brand flex-shrink-0" />
                    {label}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom credibility row */}
        <motion.div
          className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[
            { num: "2022", label: "Founded", gradient: false },
            { num: "Pan-India", label: "Reach", gradient: false },
            { num: "AI · DevOps", label: "Specialties", gradient: true },
            { num: "Founder-led", label: "Execution", gradient: false },
          ].map((item, i) => (
            <div key={i} className="text-center md:text-left">
              <div
                className={`font-display text-lg sm:text-xl md:text-2xl font-bold ${
                  item.gradient ? "text-brand-gradient" : "text-foreground"
                }`}
              >
                {item.num}
              </div>
              <div className="text-muted-foreground text-[11px] sm:text-xs md:text-sm tracking-wide uppercase">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        animate={shouldReduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-[10px] tracking-[0.4em] uppercase">Scroll</div>
        <div
          className="w-[2px] h-8"
          style={{ background: "linear-gradient(to bottom, hsl(var(--brand)), transparent)" }}
        />
      </motion.div>
    </section>
  );
};
