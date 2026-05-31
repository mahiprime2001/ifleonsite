import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { animate, stagger } from "animejs";
import { Briefcase, Layers, Users, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";

type MetricProps = {
  value: number;
  label: string;
  suffix?: string;
  icon: React.ElementType;
  accent: string;
};

const MetricCard = ({ value, label, suffix, icon: Icon, accent }: MetricProps) => {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = numRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;
          const proxy = { v: 0 };
          animate(proxy, {
            v: value,
            duration: 1800,
            easing: "easeOutExpo",
            update: () => {
              el.textContent = Math.round(proxy.v).toString();
            },
          });
        });
      },
      { threshold: 0.4 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="relative bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 hover:bg-white/10 hover:shadow-2xl transition-all text-center border border-white/10 hover:border-indigo-400/40 overflow-hidden"
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="relative">
        <motion.div
          className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br ${accent} shadow-lg`}
          whileHover={{ rotate: 8, scale: 1.06 }}
        >
          <Icon className="h-7 w-7 text-white" />
        </motion.div>

        <div className="flex items-end justify-center gap-1 text-white">
          <span ref={numRef} className="text-4xl md:text-5xl font-black">
            0
          </span>
          {suffix && (
            <span className="text-2xl md:text-3xl font-black text-slate-200 mb-1">
              {suffix}
            </span>
          )}
        </div>

        <p className="mt-2 text-slate-300 font-medium text-sm md:text-base">{label}</p>
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
    <section className="relative py-20 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 iso-grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal direction="up">
            <p className="text-sm font-bold text-indigo-400 tracking-[0.3em] uppercase mb-3">
              By the Numbers
            </p>
          </ScrollReveal>

          <h2
            ref={headRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight"
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
            <p className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto">
              Measurable outcomes from real-world projects across AI, DevOps,
              cloud, and cybersecurity.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <MetricCard value={25} label="Projects Delivered" icon={Briefcase} accent="from-blue-500 to-sky-500" />
          <MetricCard value={6} label="Industries Served" icon={Layers} accent="from-purple-500 to-pink-500" />
          <MetricCard value={50} suffix="+" label="Clients & Individuals" icon={Users} accent="from-indigo-500 to-violet-500" />
          <MetricCard value={99} suffix="%" label="Security-First Approach" icon={ShieldCheck} accent="from-amber-500 to-orange-500" />
        </div>

        <ScrollReveal direction="up">
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-slate-300 mb-4 text-base md:text-lg">
              Want to be part of these numbers?
            </p>
            <a
              href="#contact"
              className="shine-on-hover inline-block bg-gradient-to-r from-blue-600 to-indigo-500 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 text-white px-8 py-3 rounded-xl font-semibold transition-all"
            >
              Start a Conversation
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
