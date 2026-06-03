import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { Briefcase, Layers, Users, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { Parallax } from "./animations/Parallax";
import { site } from "../config/site";

type MetricProps = {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ElementType;
};

const MetricCard = ({ value, label, suffix, icon: Icon }: MetricProps) => {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = numRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    const setFinal = () => {
      el.textContent = String(value);
    };

    // Reduced motion: just show the final number.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFinal();
      return;
    }

    // Self-contained rAF count-up (no animation-library dependency, so it can't
    // silently break on a library version change). Plays once when scrolled in.
    let played = false;
    let raf = 0;
    const run = () => {
      if (played) return;
      played = true;
      const dur = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4); // ease-out
        el.textContent = String(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.2 },
    );
    observer.observe(card);

    // Safety net: never leave the number stuck at 0 if the observer never fires.
    const safety = window.setTimeout(() => {
      if (!played) setFinal();
    }, 2500);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="surface-card relative rounded-2xl p-6 md:p-8 text-center overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      <div className="relative">
        <motion.div
          className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-brand-gradient shadow-card"
          whileHover={{ rotate: 8, scale: 1.06 }}
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>

        <div className="flex items-end justify-center gap-1 text-foreground">
          <span ref={numRef} className="text-4xl md:text-5xl font-bold">
            0
          </span>
          {suffix && (
            <span className="text-2xl md:text-3xl font-bold text-muted-foreground mb-1">
              {suffix}
            </span>
          )}
        </div>

        <p className="mt-2 text-muted-foreground font-medium text-sm md:text-base">{label}</p>
      </div>
    </motion.div>
  );
};

export const Metrics = () => {
  const headRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;
          const letters = el.querySelectorAll<HTMLElement>("[data-l]");
          animate(letters, {
            opacity: [0, 1],
            translateY: [22, 0],
            rotateZ: [-8, 0],
            duration: 700,
            delay: stagger(28),
            easing: "easeOutExpo",
          });
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const headline = "Impact That Speaks for Itself";

  return (
    <section className="relative py-20 md:py-24 bg-transparent overflow-hidden">
      <Parallax offset={40} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 mesh-bg opacity-40" />
      </Parallax>
      <Parallax offset={-70} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 iso-grid-bg opacity-15" />
      </Parallax>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal direction="up">
            <p className="eyebrow mb-3">
              By the Numbers
            </p>
          </ScrollReveal>

          <h2
            ref={headRef}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-4 leading-tight"
            aria-label={headline}
          >
            {headline.split("").map((ch, i) => (
              <span
                key={i}
                data-l
                className="inline-block opacity-0"
                style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
              >
                {ch}
              </span>
            ))}
          </h2>

          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Measurable outcomes from real-world projects across AI, DevOps,
              cloud, and cybersecurity.
            </p>
          </ScrollReveal>
        </div>

        <Parallax offset={-30}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <MetricCard value={site.metrics.projectsDelivered} label="Projects Delivered" icon={Briefcase} />
            <MetricCard value={site.metrics.industriesServed} label="Industries Served" icon={Layers} />
            <MetricCard value={site.metrics.clients} label="Clients & Individuals" icon={Users} />
            <MetricCard value={site.metrics.securityFirstPct} suffix="%" label="Security-First Approach" icon={ShieldCheck} />
          </div>
        </Parallax>

        <ScrollReveal direction="up">
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-muted-foreground mb-4 text-base md:text-lg">
              Want to be part of these numbers?
            </p>
            <a
              href="#contact"
              className="shine-on-hover inline-block bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Start a Conversation
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
