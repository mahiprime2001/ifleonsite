/* V4 — Bold editorial / brutalist homepage for IFLEON.
   Type-led, high-contrast paper canvas, structural rules, marquee, numbered index.
   Self-contained. Forces a LIGHT chrome regardless of app theme. No WebGL. */

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Github,
  Asterisk,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — forced light brutalist chrome                            */
/* ------------------------------------------------------------------ */
const PAPER = "#F4F1EA"; // warm off-white canvas
const PAPER_2 = "#FBFBF7"; // lighter paper for inset blocks
const INK = "#0B0B0C"; // near-black
const BLUE = "#2563EB"; // electric blue
const HOT = "#FF5A36"; // hot secondary

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const MARQUEE_WORDS = [
  "AI",
  "DevOps",
  "Cloud",
  "Cybersecurity",
  "Automation",
  "Data",
  "Mobile",
  "UI / UX",
  "SEO",
  "AI Agents",
  "Smart Home",
  "Tech Support",
];

const MANIFESTO = [
  {
    title: "Scope the outcome, not the buzzword.",
    body: "Every engagement starts with the business result you actually need — then we work backward to the right stack. No tech for tech's sake.",
  },
  {
    title: "Ship in weeks, not quarters.",
    body: "Tight loops, working software early, and one-click rollbacks. You see progress you can use, not slideware.",
  },
  {
    title: "Build it so it stays built.",
    body: "Infrastructure-as-code, tests, runbooks, and handover. We leave you with something your team can own and extend.",
  },
  {
    title: "Secure and compliant by default.",
    body: "ISO 27001, DPDP, and SOC 2 thinking baked in from line one — not bolted on before the audit.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly 40% and migrated us with zero downtime. The runbooks they left mean we are not dependent on them — that is rare.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
  },
  {
    quote:
      "We walked into our investor meeting with a clickable prototype instead of slides. IFLEON turned a vague idea into something people could actually feel.",
    name: "Founder",
    org: "Early-stage startup · Global",
  },
  {
    quote:
      "Our support team deflects 40%+ of tickets with the AI assistant they built on our own docs. It does real work, not demo theatre.",
    name: "Head of Support",
    org: "E-commerce · APAC",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
function useReveal() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.07 },
    },
  };

  const lineUp: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { y: "110%" },
        show: {
          y: "0%",
          transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
        },
      };

  const fade: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return { reduce, container, lineUp, fade };
}

/* A single masked line that clips & slides up. */
function RevealLine({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className?: string;
  variants: Variants;
}) {
  return (
    <span className="block overflow-hidden">
      <motion.span className={`block ${className ?? ""}`} variants={variants}>
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function EditorialHome() {
  const { reduce, container, lineUp, fade } = useReveal();

  // 01–16 numbered index across all categories.
  const indexed = useMemo(
    () => [...businessServices, ...individualServices, ...specialtyServices],
    [],
  );

  const inView = { once: true, amount: 0.3 } as const;

  return (
    <div
      className="min-h-screen w-full font-sans antialiased selection:bg-[#FF5A36] selection:text-white"
      style={{ background: PAPER, color: INK }}
    >
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative px-5 pt-28 sm:px-8 md:px-10 md:pt-32">
        {/* top meta rule */}
        <div
          className="mx-auto flex max-w-[1400px] items-center justify-between border-b-2 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] sm:text-xs"
          style={{ borderColor: INK }}
        >
          <span className="flex items-center gap-2">
            <Asterisk className="h-3.5 w-3.5" style={{ color: HOT }} />
            IFLEON / CONSULTANCY
          </span>
          <span className="hidden sm:inline">NELLORE · INDIA → GLOBAL</span>
          <span>EST. 2024</span>
        </div>

        <div className="mx-auto max-w-[1400px]">
          {/* Giant headline */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8 font-display font-black leading-[0.86] tracking-[-0.03em]"
            style={{ fontSize: "clamp(3.2rem, 12vw, 13rem)" }}
          >
            <RevealLine variants={lineUp}>Infinite</RevealLine>
            <RevealLine variants={lineUp} className="italic">
              <span style={{ color: BLUE }}>Possibilities,</span>
            </RevealLine>
            <RevealLine variants={lineUp}>Logical</RevealLine>
            <RevealLine variants={lineUp}>
              Solutions<span style={{ color: HOT }}>.</span>
            </RevealLine>
          </motion.h1>

          {/* sub row: tagline + CTAs */}
          <div className="mt-10 grid grid-cols-1 gap-8 border-t-2 pt-8 md:grid-cols-12" style={{ borderColor: INK }}>
            <motion.p
              variants={fade}
              initial="hidden"
              animate="show"
              className="md:col-span-7 lg:col-span-6 text-lg leading-snug sm:text-xl md:text-2xl"
              style={{ maxWidth: "44ch" }}
            >
              A founder-led <strong>AI, DevOps, Cloud &amp; Cybersecurity</strong>{" "}
              consultancy. We turn ambitious ideas into shipped, secure,
              maintainable systems — for businesses and individuals alike.
            </motion.p>

            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="flex flex-col items-start gap-3 sm:flex-row md:col-span-5 md:flex-col md:items-stretch lg:col-span-6 lg:flex-row lg:items-start lg:justify-end"
            >
              <Link
                to="/services"
                className="group inline-flex items-center justify-between gap-3 px-7 py-4 font-mono text-sm font-bold uppercase tracking-widest text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: INK }}
              >
                Explore Services
                <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center justify-between gap-3 border-2 px-7 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-colors duration-200 hover:text-white"
                style={{ borderColor: INK }}
                onMouseEnter={(e) => (e.currentTarget.style.background = INK)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Start a Project
                <Mail className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* Stat row with rules between */}
          <motion.dl
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-10 grid grid-cols-2 border-2 md:grid-cols-4"
            style={{ borderColor: INK }}
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={fade}
                className={[
                  "flex flex-col justify-between p-5 sm:p-6",
                  i % 2 === 0 ? "border-r-2" : "",
                  "md:border-r-2",
                  i < 2 ? "border-b-2 md:border-b-0" : "",
                  i === 3 ? "md:border-r-0" : "",
                  i === 1 ? "md:border-r-2" : "",
                ].join(" ")}
                style={{ borderColor: INK }}
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
                  {String(i + 1).padStart(2, "0")} / {s.label}
                </dt>
                <dd
                  className="mt-6 font-display font-black leading-none"
                  style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
                >
                  {s.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARQUEE                                                       */}
      {/* ============================================================ */}
      <section
        className="mt-14 overflow-hidden border-y-2 py-4"
        style={{ background: INK, borderColor: INK }}
        aria-hidden="true"
      >
        <div className="flex">
          {reduce ? (
            <div className="flex shrink-0 items-center gap-8 px-4 font-display text-3xl font-black tracking-tight sm:text-4xl" style={{ color: PAPER }}>
              {MARQUEE_WORDS.map((w) => (
                <span key={w} className="flex items-center gap-8">
                  {w}
                  <Asterisk className="h-5 w-5" style={{ color: HOT }} />
                </span>
              ))}
            </div>
          ) : (
            <motion.div
              className="flex shrink-0 items-center gap-8 px-4 font-display text-3xl font-black tracking-tight sm:text-4xl"
              style={{ color: PAPER }}
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            >
              {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
                <span key={`${w}-${i}`} className="flex items-center gap-8">
                  {w}
                  <Asterisk className="h-5 w-5" style={{ color: i % 2 ? BLUE : HOT }} />
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES INDEX — magazine contents 01–16                      */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col gap-4 border-b-2 pb-6 md:flex-row md:items-end md:justify-between" style={{ borderColor: INK }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: HOT }}>
                The Index — what we build
              </p>
              <h2
                className="mt-3 font-display font-black leading-[0.9] tracking-[-0.02em]"
                style={{ fontSize: "clamp(2.4rem, 7vw, 6rem)" }}
              >
                Sixteen ways<br />to ship it.
              </h2>
            </div>
            <p className="max-w-[34ch] font-mono text-sm leading-relaxed opacity-80">
              Across business, individual, and specialty work. Numbered like a
              contents page — pick a line, we will scope it.
            </p>
          </div>

          {/* Numbered rows */}
          <motion.ul
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
          >
            {indexed.map((svc, i) => {
              const Icon = svc.icon;
              const n = String(i + 1).padStart(2, "0");
              const accent = i % 3 === 0 ? BLUE : i % 3 === 1 ? HOT : INK;
              return (
                <motion.li
                  key={svc.id}
                  variants={fade}
                  className="group relative border-b-2"
                  style={{ borderColor: INK }}
                >
                  <Link
                    to="/services"
                    className="grid grid-cols-12 items-center gap-3 py-5 transition-colors duration-200 sm:py-6"
                  >
                    {/* fill on hover */}
                    <span
                      className="pointer-events-none absolute inset-0 -z-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
                      style={{ background: INK }}
                    />
                    <span className="relative z-10 col-span-2 font-mono text-sm tabular-nums transition-colors duration-200 group-hover:text-[var(--paper)] sm:col-span-1" style={{ ["--paper" as string]: PAPER }}>
                      {n}
                    </span>
                    <span className="relative z-10 col-span-8 sm:col-span-6 lg:col-span-5">
                      <span
                        className="block font-display font-bold leading-[0.95] tracking-[-0.01em] transition-colors duration-200 group-hover:text-[var(--paper)]"
                        style={{ fontSize: "clamp(1.35rem, 3.2vw, 2.6rem)", ["--paper" as string]: PAPER }}
                      >
                        {svc.title}
                      </span>
                    </span>
                    <span className="relative z-10 col-span-12 col-start-3 row-start-2 -mt-1 font-mono text-xs uppercase tracking-wider opacity-80 transition-colors duration-200 group-hover:text-[var(--paper)] group-hover:opacity-90 sm:col-span-4 sm:col-start-auto sm:row-start-auto sm:mt-0 lg:col-span-5" style={{ ["--paper" as string]: PAPER }}>
                      {svc.tagline}
                    </span>
                    <span
                      className="relative z-10 col-span-2 hidden items-center justify-end gap-2 transition-colors duration-200 group-hover:text-[var(--paper)] sm:flex sm:col-span-1"
                      style={{ color: accent, ["--paper" as string]: PAPER }}
                    >
                      <Icon className="h-5 w-5" />
                      <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      {/* ============================================================ */}
      {/* METRICS STATEMENT — big solid block                           */}
      {/* ============================================================ */}
      <section className="px-5 sm:px-8 md:px-10">
        <div
          className="mx-auto max-w-[1400px] px-6 py-16 text-center sm:px-10 md:py-24"
          style={{ background: BLUE, color: PAPER_2 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] opacity-80">
            By the numbers
          </p>
          <p
            className="mx-auto mt-6 max-w-[18ch] font-display font-black leading-[0.95] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)" }}
          >
            25 projects. 50+ clients. 99.9% uptime.
          </p>
          <p className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed opacity-90 sm:text-lg">
            Across 6 industries, for B2B teams and individuals — delivered with
            compliance baked in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="border-2 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: PAPER_2 }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MANIFESTO — numbered "how we work"                            */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: HOT }}>
              The Method
            </p>
            <h2
              className="mt-3 font-display font-black leading-[0.9] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4.8rem)" }}
            >
              How we<br />work.
            </h2>
            <p className="mt-5 max-w-[34ch] text-base leading-relaxed opacity-80">
              Four principles. They keep us honest and keep your project moving.
            </p>
          </div>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="md:col-span-8"
          >
            {MANIFESTO.map((m, i) => (
              <motion.li
                key={m.title}
                variants={fade}
                className="grid grid-cols-12 gap-4 border-t-2 py-7"
                style={{ borderColor: INK }}
              >
                <span
                  className="col-span-2 font-display font-black leading-none sm:col-span-1"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: i % 2 ? HOT : BLUE }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-10 sm:col-span-11">
                  <h3
                    className="font-display font-bold leading-tight tracking-[-0.01em]"
                    style={{ fontSize: "clamp(1.3rem, 3vw, 2.1rem)" }}
                  >
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-[60ch] text-base leading-relaxed opacity-80">
                    {m.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS — pull quotes                                    */}
      {/* ============================================================ */}
      <section
        className="border-y-2 px-5 py-16 sm:px-8 md:px-10 md:py-24"
        style={{ background: PAPER_2, borderColor: INK }}
      >
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: HOT }}>
            In their words
          </p>
          <div className="mt-8 grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: INK }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inView}
                transition={{ duration: 0.6, delay: reduce ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between p-7 sm:p-8"
                style={{ background: PAPER_2 }}
              >
                <div>
                  <Quote
                    className="h-9 w-9"
                    style={{ color: i % 2 ? HOT : BLUE }}
                    aria-hidden="true"
                  />
                  <blockquote
                    className="mt-4 font-display font-medium leading-[1.15] tracking-[-0.01em]"
                    style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)" }}
                  >
                    {t.quote}
                  </blockquote>
                </div>
                <figcaption className="mt-8 border-t-2 pt-4 font-mono text-xs uppercase tracking-wider" style={{ borderColor: INK }}>
                  <span className="block font-bold">{t.name}</span>
                  <span className="opacity-70">{t.org}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CLOSING CTA                                                   */}
      {/* ============================================================ */}
      <section className="px-5 py-20 sm:px-8 md:px-10 md:py-28" style={{ background: INK, color: PAPER }}>
        <div className="mx-auto max-w-[1400px]">
          <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: HOT }}>
            Let's build
          </p>
          <h2
            className="mt-4 font-display font-black leading-[0.85] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.8rem, 11vw, 11rem)" }}
          >
            Got a problem<br />
            worth solving<span style={{ color: BLUE }}>?</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t-2 pt-10 md:grid-cols-12" style={{ borderColor: PAPER }}>
            <p className="md:col-span-6 text-lg leading-snug sm:text-xl" style={{ maxWidth: "40ch" }}>
              Tell us what you are trying to ship, secure, or scale. One email
              starts the conversation — businesses and individuals both welcome.
            </p>

            <div className="flex flex-col gap-4 md:col-span-6 md:items-end">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex w-full items-center justify-between gap-4 px-7 py-5 font-mono text-base font-bold uppercase tracking-widest transition-transform duration-200 hover:-translate-y-0.5 sm:text-lg md:w-auto"
                style={{ background: PAPER, color: INK }}
              >
                info@ifleon.com
                <Mail className="h-6 w-6" />
              </a>

              <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto md:justify-end">
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-between gap-3 border-2 px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-colors duration-200"
                  style={{ borderColor: PAPER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = PAPER;
                    e.currentTarget.style.color = INK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = PAPER;
                  }}
                >
                  View all services
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-3 border-2 px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest transition-colors duration-200"
                  style={{ borderColor: PAPER }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = PAPER;
                    e.currentTarget.style.color = INK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = PAPER;
                  }}
                >
                  <Github className="h-5 w-5" />
                  github.com/ifleonlabs
                </a>
              </div>
            </div>
          </div>

          {/* baseline meta */}
          <div className="mt-16 flex flex-col gap-3 border-t-2 pt-6 font-mono text-[11px] uppercase tracking-[0.18em] opacity-70 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: PAPER }}>
            <span>IFLEON © {new Date().getFullYear()}</span>
            <span>Infinite Possibilities, Logical Solutions.</span>
            <span>Nellore · India → Global</span>
          </div>
        </div>
      </section>
    </div>
  );
}
