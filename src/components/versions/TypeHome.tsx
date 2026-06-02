/* V27 — "TYPE": LIGHT kinetic typography. Type IS the design.
   Enormous animated words, line-mask reveals, word-by-word stagger,
   scrolling type, scale/weight play. Black ink on warm white with one
   accent (electric blue). framer-motion + gsap/ScrollTrigger.
   Forced LIGHT chrome. Honors prefers-reduced-motion. No WebGL. */

import { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Mail, Github } from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Theme tokens — forced LIGHT chrome                                 */
/* ------------------------------------------------------------------ */

const INK = "#0A0A0B"; // near-black type
const PAPER = "#F6F4EF"; // warm white
const ACCENT = "#1D4ED8"; // the one committed accent — electric blue
const MUTE = "#8A8780"; // warm grey for secondary type
const HAIR = "rgba(10,10,11,0.12)"; // hairline rules

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "25", suffix: "", label: "Projects Delivered" },
  { value: "6", suffix: "", label: "Industries Served" },
  { value: "50", suffix: "+", label: "Clients & Individuals" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const MARQUEE = [
  "AI / ML",
  "DevOps",
  "Cloud",
  "Cybersecurity",
  "Automation",
  "Data",
  "Mobile",
  "UI / UX",
  "AI Agents",
];

const PROCESS = [
  {
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the single highest-leverage problem worth solving first.",
  },
  {
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
  },
  {
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
  },
  {
    step: "04",
    title: "Operate & Scale",
    body: "Monitoring, hardening, and a clean hand-off so it stays yours — and stays fast.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They migrated us to AWS without a single minute of downtime and trimmed our cloud bill by nearly 40%. The runbooks they left behind are gold.",
    name: "Founder",
    role: "Fintech SaaS · India",
  },
  {
    quote:
      "Our support copilot now answers from our own docs and deflects almost half our tickets. It felt less like a vendor and more like an in-house team.",
    name: "Head of Product",
    role: "B2B Platform · Global",
  },
  {
    quote:
      "I switched into a DevOps role in six months with their guidance. The roadmap and mock interviews made all the difference.",
    name: "Cloud Engineer",
    role: "Individual · Career Switch",
  },
];

const GROUPS: { key: string; label: string; services: Service[] }[] = [
  { key: "business", label: "Business", services: businessServices },
  { key: "individual", label: "Individuals", services: individualServices },
  { key: "specialty", label: "Specialty", services: specialtyServices },
];

/* ------------------------------------------------------------------ */
/*  Reveal helpers (framer-motion)                                     */
/* ------------------------------------------------------------------ */

/** Word-by-word mask stagger for the hero headline. */
const wordWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const wordItem: Variants = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
};

/** Simple fade-rise for supporting copy / CTAs. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TypeHome() {
  const reduced = !!useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  /* ----- GSAP scroll choreography (skip entirely if reduced) ----- */
  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* Line-mask reveals: each .ty-line clips up from its overflow box. */
      gsap.utils.toArray<HTMLElement>(".ty-line").forEach((el) => {
        gsap.from(el, {
          yPercent: 120,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 92%" },
        });
      });

      /* Word-stagger reveals for the giant service list. */
      gsap.utils.toArray<HTMLElement>(".ty-row-word").forEach((word) => {
        gsap.from(word, {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: word, start: "top 92%" },
        });
      });

      /* Big metric numerals — scale punch on enter. */
      gsap.utils.toArray<HTMLElement>(".ty-metric").forEach((el, i) => {
        gsap.from(el, {
          scale: 0.6,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.6)",
          delay: i * 0.07,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      /* Generic rise-in reveals. */
      gsap.utils.toArray<HTMLElement>(".ty-rise").forEach((el) => {
        gsap.from(el, {
          y: 44,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* Velocity-reactive scrolling type: base drift + skew on scroll. */
      if (marqueeRef.current) {
        const track = marqueeRef.current;
        const baseDrift = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 26,
          ease: "none",
        });
        const skewSetter = gsap.quickSetter(track, "skewX", "deg");
        const xExtra = gsap.quickTo(track, "x", { duration: 0.5, ease: "power3" });
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 1600);
            baseDrift.timeScale(1 + Math.abs(v) * 4);
            skewSetter(v * 7);
            xExtra(-v * 100);
          },
        });
        return () => {
          baseDrift.kill();
          st.kill();
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  /* Refresh ScrollTrigger once layout settles. */
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [reduced]);

  const heroReveal = reduced
    ? {}
    : { variants: wordWrap, initial: "hidden" as const, animate: "show" as const };

  const inViewRise = reduced
    ? {}
    : {
        variants: fadeUp,
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once: true },
      };

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full overflow-x-clip"
      style={
        {
          background: PAPER,
          color: INK,
          colorScheme: "light",
          // accent exposed for group-hover color swaps
          ["--ty-accent" as string]: ACCENT,
        } as React.CSSProperties
      }
    >
      {/* faint grid paper texture */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,10,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,11,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, #000 35%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, #000 35%, transparent 80%)",
        }}
      />

      {/* ============================== HERO ============================== */}
      <section className="relative px-5 pt-28 pb-16 md:px-10 md:pt-32 md:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* eyebrow */}
          <motion.div
            {...inViewRise}
            className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.32em]"
            style={{ color: MUTE }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: ACCENT }}
              />
              IFLEON — Founder-led
            </span>
            <span>Nellore, India</span>
            <span>Est. 2022</span>
            <span style={{ color: ACCENT }}>Serving Globally</span>
          </motion.div>

          {/* GIANT kinetic headline built around the tagline */}
          <motion.h1
            {...heroReveal}
            className="font-display font-black uppercase leading-[0.82] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.75rem, 12.5vw, 13rem)" }}
          >
            <span className="block overflow-hidden">
              <motion.span variants={reduced ? undefined : wordItem} className="block">
                Infinite
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={reduced ? undefined : wordItem}
                className="block"
                style={{ color: ACCENT }}
              >
                Possibilities,
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                variants={reduced ? undefined : wordItem}
                className="block"
                style={{ WebkitTextStroke: `2px ${INK}`, color: "transparent" }}
              >
                Logical
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={reduced ? undefined : wordItem} className="block">
                Solutions.
              </motion.span>
            </span>
          </motion.h1>

          {/* subhead + CTAs */}
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.4fr_1fr] md:items-end">
            <motion.p
              {...inViewRise}
              className="max-w-xl text-lg leading-relaxed md:text-2xl"
              style={{ color: INK }}
            >
              A founder-led{" "}
              <span className="font-semibold" style={{ color: ACCENT }}>
                AI · DevOps · Cloud · Cybersecurity
              </span>{" "}
              consultancy building systems that ship fast, scale calmly, and stay
              secure — for businesses and individuals alike.
            </motion.p>

            <motion.div
              {...inViewRise}
              className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch"
            >
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold transition-transform hover:scale-[1.02]"
                style={{ background: INK, color: PAPER }}
              >
                <Mail className="h-5 w-5" />
                Request a Free Consultation
              </a>
              <Link
                to="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 px-7 py-4 text-base font-bold transition-colors hover:bg-black/[0.04]"
                style={{ borderColor: INK, color: INK }}
              >
                Explore Services
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== SCROLLING TYPE MARQUEE ===================== */}
      <section
        className="relative overflow-hidden border-y py-5 md:py-7"
        style={{ borderColor: HAIR }}
      >
        <div
          ref={marqueeRef}
          className="flex w-max items-center whitespace-nowrap will-change-transform"
        >
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={i}
              className="font-display mx-5 text-3xl font-black uppercase tracking-tight md:mx-8 md:text-6xl"
              style={{ color: INK }}
            >
              {m}
              <span style={{ color: ACCENT }} className="px-3 md:px-4">
                ·
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* =============== SERVICES — GIANT TYPOGRAPHIC LIST =============== */}
      <section className="relative px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <header className="mb-16 flex flex-col gap-3 md:mb-20 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">
              <span className="block overflow-hidden">
                <span className="ty-line block">Sixteen ways</span>
              </span>
              <span className="block overflow-hidden">
                <span className="ty-line block" style={{ color: ACCENT }}>
                  to ship.
                </span>
              </span>
            </h2>
            <p className="max-w-sm text-base md:text-right" style={{ color: MUTE }}>
              One team across every layer of the stack — grouped for business,
              individuals, and specialty engagements.
            </p>
          </header>

          {GROUPS.map((group) => (
            <div key={group.key} className="mb-16 last:mb-0 md:mb-20">
              <div
                className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em]"
                style={{ color: MUTE }}
              >
                <span style={{ color: ACCENT }}>{group.label}</span>
                <span className="h-px flex-1" style={{ background: HAIR }} />
                <span>{group.services.length} services</span>
              </div>

              <ul style={{ borderBottom: `1px solid ${HAIR}` }}>
                {group.services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li
                      key={s.id}
                      className="ty-row group"
                      style={{ borderTop: `1px solid ${HAIR}` }}
                    >
                      <a
                        href="mailto:info@ifleon.com"
                        className="flex items-center gap-4 py-4 md:gap-7 md:py-6"
                      >
                        <span
                          className="shrink-0 transition-colors group-hover:[color:var(--ty-accent)]"
                          style={{ color: MUTE }}
                        >
                          <Icon className="h-6 w-6 md:h-7 md:w-7" />
                        </span>
                        <span className="min-w-0 flex-1 overflow-hidden">
                          <span
                            className="ty-row-word font-display block text-2xl font-extrabold leading-tight tracking-tight transition-colors group-hover:[color:var(--ty-accent)] md:text-5xl"
                            style={{ color: INK }}
                          >
                            {s.title}
                          </span>
                        </span>
                        <span
                          className="hidden max-w-[14rem] shrink-0 truncate text-sm md:block"
                          style={{ color: MUTE }}
                        >
                          {s.tagline}
                        </span>
                        <ArrowUpRight
                          className="h-5 w-5 shrink-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:[color:var(--ty-accent)]"
                          style={{ color: MUTE }}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== OVERSIZED METRICS ===================== */}
      <section
        className="relative px-5 py-24 md:px-10 md:py-32"
        style={{ background: INK, color: PAPER, colorScheme: "dark" }}
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <p
            className="mb-12 font-mono text-xs uppercase tracking-[0.3em] md:mb-16"
            style={{ color: "rgba(246,244,239,0.55)" }}
          >
            Real work · real numbers
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label} className="ty-metric">
                <div
                  className="font-display font-black leading-[0.85] tracking-tighter"
                  style={{ fontSize: "clamp(3.5rem, 9vw, 9rem)", color: PAPER }}
                >
                  {m.value}
                  <span style={{ color: ACCENT }}>{m.suffix}</span>
                </div>
                <div
                  className="mt-3 font-mono text-xs uppercase tracking-[0.2em]"
                  style={{ color: "rgba(246,244,239,0.6)" }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="relative px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <h2 className="font-display mb-14 text-4xl font-black uppercase leading-[0.9] tracking-tight md:mb-20 md:text-7xl">
            <span className="block overflow-hidden">
              <span className="ty-line block">How we</span>
            </span>
            <span className="block overflow-hidden">
              <span className="ty-line block" style={{ color: ACCENT }}>
                work.
              </span>
            </span>
          </h2>

          <div
            className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4"
            style={{ background: HAIR }}
          >
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="ty-rise relative p-7 md:p-9"
                style={{ background: PAPER }}
              >
                <div
                  className="font-display text-5xl font-black md:text-6xl"
                  style={{ color: ACCENT }}
                >
                  {p.step}
                </div>
                <h3 className="font-display mt-5 text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTE }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section
        className="relative border-y px-5 py-24 md:px-10 md:py-32"
        style={{ borderColor: HAIR }}
      >
        <div className="mx-auto w-full max-w-[1400px]">
          <p
            className="mb-14 font-mono text-xs uppercase tracking-[0.3em] md:mb-16"
            style={{ color: MUTE }}
          >
            What people say after launch
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {TESTIMONIALS.map((t) => (
              <figure key={t.role} className="ty-rise flex h-full flex-col">
                <div
                  className="font-display text-6xl font-black leading-none"
                  style={{ color: ACCENT }}
                  aria-hidden
                >
                  &ldquo;
                </div>
                <blockquote
                  className="mt-3 flex-1 text-lg leading-relaxed md:text-xl"
                  style={{ color: INK }}
                >
                  {t.quote}
                </blockquote>
                <figcaption
                  className="mt-6 border-t pt-4"
                  style={{ borderColor: "rgba(10,10,11,0.15)" }}
                >
                  <div className="font-semibold" style={{ color: INK }}>
                    {t.name}
                  </div>
                  <div className="text-sm" style={{ color: MUTE }}>
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative px-5 py-28 md:px-10 md:py-40">
        <div className="mx-auto w-full max-w-[1400px] text-center">
          <h2
            className="font-display font-black uppercase leading-[0.84] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.5rem, 11vw, 11rem)" }}
          >
            <span className="block overflow-hidden">
              <span className="ty-line block">Let&rsquo;s build</span>
            </span>
            <span className="block overflow-hidden">
              <span className="ty-line block" style={{ color: ACCENT }}>
                something real.
              </span>
            </span>
          </h2>

          <p
            className="ty-rise mx-auto mt-8 max-w-xl text-lg md:text-xl"
            style={{ color: MUTE }}
          >
            Tell us where you want to go. We&rsquo;ll bring the AI, the cloud, the
            pipelines, and the security to get you there.
          </p>

          <div className="ty-rise mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-transform hover:scale-[1.02]"
              style={{ background: INK, color: PAPER }}
            >
              <Mail className="h-5 w-5" />
              info@ifleon.com
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-base font-bold transition-colors hover:bg-black/[0.04]"
              style={{ borderColor: INK, color: INK }}
            >
              Browse all services
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 px-8 py-4 text-base font-bold transition-colors hover:bg-black/[0.04]"
              style={{ borderColor: INK, color: INK }}
            >
              <Github className="h-5 w-5" />
              github.com/ifleonlabs
            </a>
          </div>

          <div
            className="ty-rise mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.25em]"
            style={{ color: MUTE }}
          >
            {COMPLIANCE.map((c) => (
              <span key={c} className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
