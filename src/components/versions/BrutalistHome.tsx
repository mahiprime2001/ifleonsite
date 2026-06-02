/* V10 — BRUTALIST homepage for IFLEON.
   LIGHT neubrutalism: thick 3-4px solid black borders, hard offset box-shadows
   (no blur), bright flat color blocks (electric yellow / blue / pink / lime),
   chunky rectangular buttons that physically shift on hover, mono labels, an
   exposed raw grid, and oversized bold sans headings. Playful, loud, confident.
   Self-contained. The app forces a LIGHT chrome for this version.
   Allowed imports only: react, framer-motion, lucide-react, react-router-dom.
   No WebGL / three.js / external assets. Motion is gated behind
   useReducedMotion (static fallback). */

import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Quote,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Brutalist palette — define locally, don't rely on global tokens.   */
/* ------------------------------------------------------------------ */
const INK = "#0A0A0A"; // hard black for borders / text
const PAPER = "#FAF7F0"; // warm off-white page
const PANEL = "#FFFFFF"; // crisp white surface
const YELLOW = "#FFE600"; // electric yellow
const BLUE = "#2563EB"; // electric blue
const PINK = "#FF5DA2"; // hot pink
const LIME = "#A3E635"; // acid lime
const CYAN = "#22D3EE"; // bright cyan accent

const BORDER = `3px solid ${INK}`;
const BORDER_THICK = `4px solid ${INK}`;
const SHADOW = `6px 6px 0 ${INK}`;
const SHADOW_SM = `4px 4px 0 ${INK}`;
const SHADOW_LG = `10px 10px 0 ${INK}`;

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered", bg: YELLOW },
  { value: "6", label: "Industries Served", bg: PINK },
  { value: "50+", label: "Clients & Individuals", bg: LIME },
  { value: "99.9%", label: "Uptime", bg: CYAN },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK = [
  {
    step: "01",
    title: "SCOPE THE OUTCOME",
    body: "We start from the business result, then reverse-engineer the right stack. No tech for tech's sake.",
    bg: YELLOW,
  },
  {
    step: "02",
    title: "BUILD IN THE OPEN",
    body: "Short cycles, working software you can see, and clean code pushed to a repo you own.",
    bg: BLUE,
    invert: true,
  },
  {
    step: "03",
    title: "SHIP & SECURE",
    body: "Automated delivery, monitoring, and security baked in so it survives real users.",
    bg: PINK,
  },
  {
    step: "04",
    title: "HAND OVER & SUPPORT",
    body: "Runbooks, training, and a maintenance plan so your team stays in control after launch.",
    bg: LIME,
  },
];

const QUOTES = [
  {
    quote:
      "They shipped our AI support copilot in six weeks and it now deflects nearly half our tickets. No fluff, just working software.",
    name: "Priya N.",
    role: "Head of Ops, SaaS",
    bg: PINK,
  },
  {
    quote:
      "Our deploys went from quarterly panic to daily, boring, one-click releases. The DevOps overhaul paid for itself fast.",
    name: "Daniel R.",
    role: "CTO, Fintech",
    bg: YELLOW,
  },
  {
    quote:
      "IFLEON cleared our ISO 27001 gaps and we closed two enterprise deals that had been stuck on security review.",
    name: "Aarav S.",
    role: "Founder, B2B Platform",
    bg: CYAN,
  },
];

const SERVICE_BG = [YELLOW, BLUE, PINK, LIME, CYAN];

/* ------------------------------------------------------------------ */
/* Motion variants (gated by reduced-motion at call sites)            */
/* ------------------------------------------------------------------ */
const riseUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                              */
/* ------------------------------------------------------------------ */

function MonoTag({
  children,
  bg = YELLOW,
  invert = false,
}: {
  children: React.ReactNode;
  bg?: string;
  invert?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] px-2.5 py-1"
      style={{
        background: bg,
        color: invert ? PAPER : INK,
        border: BORDER,
      }}
    >
      {children}
    </span>
  );
}

/* Chunky rectangular button. Shifts toward its shadow on hover, so the
   shadow visually collapses — the classic neubrutalist press. */
function BrutalButton({
  children,
  href,
  to,
  bg,
  fg = INK,
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  bg: string;
  fg?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const base =
    "group inline-flex items-center justify-center gap-2 font-mono text-sm md:text-[15px] font-extrabold uppercase tracking-wider px-6 py-3.5 select-none";
  const style: React.CSSProperties = {
    background: bg,
    color: fg,
    border: BORDER_THICK,
    boxShadow: SHADOW,
  };
  const hover = reduce
    ? {}
    : { x: 6, y: 6, boxShadow: `0px 0px 0 ${INK}` };
  const tap = reduce ? {} : { x: 6, y: 6, boxShadow: `0px 0px 0 ${INK}` };

  const inner = (
    <>
      {children}
    </>
  );

  if (to) {
    return (
      <motion.div
        whileHover={hover}
        whileTap={tap}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        style={{ display: "inline-block" }}
      >
        <Link to={to} className={`${base} ${className}`} style={style}>
          {inner}
        </Link>
      </motion.div>
    );
  }
  return (
    <motion.a
      href={href}
      whileHover={hover}
      whileTap={tap}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={`${base} ${className}`}
      style={style}
    >
      {inner}
    </motion.a>
  );
}

/* Service card. Icon is colored via a wrapper span using currentColor,
   because Service.icon only accepts className (not style). */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduce = useReducedMotion();
  const Icon = service.icon as LucideIcon;
  const bg = SERVICE_BG[index % SERVICE_BG.length];
  const onBlue = bg === BLUE;

  return (
    <motion.div
      variants={riseUp}
      whileHover={reduce ? undefined : { x: -3, y: -3, boxShadow: SHADOW_LG }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="flex flex-col h-full p-5"
      style={{
        background: PANEL,
        border: BORDER_THICK,
        boxShadow: SHADOW,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid place-items-center w-12 h-12 shrink-0"
          style={{
            background: bg,
            color: onBlue ? PAPER : INK,
            border: BORDER,
          }}
        >
          <Icon className="w-6 h-6" />
        </span>
        <span
          className="font-mono text-[11px] font-bold tabular-nums"
          style={{ color: INK }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3
        className="mt-4 font-display text-[20px] leading-[1.05] font-black"
        style={{ color: INK }}
      >
        {service.title}
      </h3>
      <p
        className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-wide"
        style={{ color: BLUE }}
      >
        {service.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "#3A3A3A" }}>
        {service.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.technologies.slice(0, 3).map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] font-bold px-2 py-0.5"
            style={{ border: `2px solid ${INK}`, color: INK, background: PAPER }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section: services group                                            */
/* ------------------------------------------------------------------ */
function ServiceGroup({
  label,
  tagBg,
  services,
  startIndex,
}: {
  label: string;
  tagBg: string;
  services: Service[];
  startIndex: number;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <MonoTag bg={tagBg} invert={tagBg === BLUE}>
          {label}
        </MonoTag>
        <div className="flex-1 h-[3px]" style={{ background: INK }} />
        <span className="font-mono text-[11px] font-bold" style={{ color: INK }}>
          {String(services.length).padStart(2, "0")}
        </span>
      </div>
      <motion.div
        variants={stagger}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "show"}
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={startIndex + i} />
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
export default function BrutalistHome() {
  const reduce = useReducedMotion();

  const totalServices =
    businessServices.length +
    individualServices.length +
    specialtyServices.length;

  // Marquee text for the loud ticker strip.
  const tickerItems = useMemo(
    () => [
      "AI & MACHINE LEARNING",
      "DEVOPS & CI/CD",
      "CLOUD MIGRATION",
      "CYBERSECURITY",
      "AI AGENTS",
      "DATA ENGINEERING",
      "SMART HOME",
      "CAREER GUIDANCE",
    ],
    [],
  );

  const fadeIn = (delay = 0) =>
    reduce
      ? { initial: undefined, animate: undefined }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ background: PAPER, color: INK }}
    >
      {/* Exposed raw grid background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(${INK}0D 1.5px, transparent 1.5px), linear-gradient(90deg, ${INK}0D 1.5px, transparent 1.5px)`,
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        {/* ============================= HERO ============================= */}
        <section className="pt-28 md:pt-32 pb-14">
          <motion.div {...fadeIn(0)}>
            <MonoTag bg={LIME}>
              <Zap className="w-3.5 h-3.5" /> Founder-led · Nellore, India · Since 2022
            </MonoTag>
          </motion.div>

          <motion.h1
            {...fadeIn(0.05)}
            className="mt-6 font-display font-black tracking-tight"
            style={{
              fontSize: "clamp(2.6rem, 8vw, 5.6rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            <span className="block">INFINITE</span>
            <span
              className="inline-block px-3 my-1"
              style={{ background: YELLOW, border: BORDER_THICK, boxShadow: SHADOW_SM }}
            >
              POSSIBILITIES,
            </span>
            <span className="block">LOGICAL</span>
            <span
              className="inline-block px-3 mt-1"
              style={{
                background: BLUE,
                color: PAPER,
                border: BORDER_THICK,
                boxShadow: SHADOW_SM,
              }}
            >
              SOLUTIONS.
            </span>
          </motion.h1>

          <motion.p
            {...fadeIn(0.12)}
            className="mt-7 max-w-xl text-base md:text-lg leading-relaxed font-medium"
            style={{ color: "#2A2A2A" }}
          >
            IFLEON is a founder-led consultancy building{" "}
            <strong>AI, DevOps, cloud & cybersecurity</strong> that actually ships.
            For businesses scaling up and individuals leveling up — in India and
            across the globe.
          </motion.p>

          <motion.div {...fadeIn(0.18)} className="mt-8 flex flex-wrap gap-4">
            <BrutalButton
              href="mailto:info@ifleon.com?subject=Free%20Consultation%20Request"
              bg={PINK}
            >
              Request a Free Consultation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </BrutalButton>
            <BrutalButton to="/services" bg={PANEL}>
              Explore Services
              <ArrowUpRight className="w-4 h-4" />
            </BrutalButton>
          </motion.div>

          {/* Stats row — chunky color blocks */}
          <motion.div
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            animate={reduce ? undefined : "show"}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={riseUp}
                className="p-4"
                style={{ background: s.bg, border: BORDER_THICK, boxShadow: SHADOW_SM }}
              >
                <div
                  className="font-display font-black leading-none"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
                >
                  {s.value}
                </div>
                <div className="mt-1.5 font-mono text-[11px] font-bold uppercase tracking-wide">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      {/* ===================== LOUD TICKER STRIP ===================== */}
      <div
        className="relative z-10 overflow-hidden border-y"
        style={{ background: INK, borderColor: INK, borderTopWidth: 4, borderBottomWidth: 4 }}
      >
        <motion.div
          className="flex whitespace-nowrap py-3"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduce
              ? undefined
              : { duration: 22, ease: "linear", repeat: Infinity }
          }
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0">
              {tickerItems.map((t) => (
                <span
                  key={`${dup}-${t}`}
                  className="flex items-center gap-3 px-6 font-mono text-sm font-extrabold uppercase tracking-widest"
                  style={{ color: YELLOW }}
                >
                  <Star className="w-3.5 h-3.5" style={{ color: PINK }} fill={PINK} />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        {/* ========================= SERVICES ========================= */}
        <section className="pt-16 pb-6">
          <motion.div {...fadeIn(0)} className="mb-10">
            <MonoTag bg={CYAN}>What We Do</MonoTag>
            <h2
              className="mt-4 font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 0.95 }}
            >
              {totalServices} SERVICES.
              <br />
              ZERO FLUFF.
            </h2>
            <p className="mt-3 max-w-lg text-sm md:text-base font-medium" style={{ color: "#2A2A2A" }}>
              From enterprise transformation to setting up your home network —
              grouped for businesses, individuals, and specialist add-ons.
            </p>
          </motion.div>

          <ServiceGroup
            label="Business"
            tagBg={BLUE}
            services={businessServices}
            startIndex={0}
          />
          <ServiceGroup
            label="Individuals"
            tagBg={PINK}
            services={individualServices}
            startIndex={businessServices.length}
          />
          <ServiceGroup
            label="Specialty & Add-ons"
            tagBg={YELLOW}
            services={specialtyServices}
            startIndex={businessServices.length + individualServices.length}
          />
        </section>

        {/* ======================= HOW WE WORK ======================= */}
        <section className="py-12">
          <motion.div {...fadeIn(0)} className="mb-8">
            <MonoTag bg={PINK}>The Process</MonoTag>
            <h2
              className="mt-4 font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 0.95 }}
            >
              HOW WE WORK
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HOW_WE_WORK.map((s) => (
              <motion.div
                key={s.step}
                variants={riseUp}
                whileHover={reduce ? undefined : { x: -3, y: -3, boxShadow: SHADOW_LG }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
                className="p-5"
                style={{
                  background: s.bg,
                  color: s.invert ? PAPER : INK,
                  border: BORDER_THICK,
                  boxShadow: SHADOW,
                }}
              >
                <div
                  className="font-display font-black leading-none"
                  style={{ fontSize: "2.6rem" }}
                >
                  {s.step}
                </div>
                <h3 className="mt-3 font-mono text-sm font-extrabold uppercase tracking-wider">
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed font-medium"
                  style={{ color: s.invert ? "rgba(250,247,240,0.9)" : "#1A1A1A" }}
                >
                  {s.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ======================= TESTIMONIALS ======================= */}
        <section className="py-12">
          <motion.div {...fadeIn(0)} className="mb-8">
            <MonoTag bg={LIME}>Receipts</MonoTag>
            <h2
              className="mt-4 font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", lineHeight: 0.95 }}
            >
              WHAT CLIENTS SAY
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-5 md:grid-cols-3"
          >
            {QUOTES.map((q) => (
              <motion.div
                key={q.name}
                variants={riseUp}
                className="flex flex-col p-5"
                style={{ background: PANEL, border: BORDER_THICK, boxShadow: SHADOW }}
              >
                <span
                  className="grid place-items-center w-10 h-10"
                  style={{ background: q.bg, border: BORDER, color: INK }}
                >
                  <Quote className="w-5 h-5" />
                </span>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed font-medium" style={{ color: "#1A1A1A" }}>
                  "{q.quote}"
                </p>
                <div className="mt-4 pt-3" style={{ borderTop: BORDER }}>
                  <div className="font-display font-black text-base">{q.name}</div>
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>
                    {q.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ========================= CLOSING CTA ========================= */}
        <section className="py-14">
          <motion.div
            {...fadeIn(0)}
            className="relative p-7 md:p-12"
            style={{ background: BLUE, color: PAPER, border: BORDER_THICK, boxShadow: SHADOW_LG }}
          >
            <MonoTag bg={YELLOW}>Let's Build</MonoTag>
            <h2
              className="mt-5 font-display font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 6vw, 4rem)", lineHeight: 0.92 }}
            >
              GOT A PROBLEM
              <br />
              WORTH SOLVING?
            </h2>
            <p className="mt-4 max-w-lg text-base md:text-lg font-medium" style={{ color: "rgba(250,247,240,0.92)" }}>
              Tell us the outcome you want. We'll bring the AI, the pipelines, the
              cloud, and the security to get you there.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <BrutalButton href="mailto:info@ifleon.com?subject=Project%20Inquiry" bg={YELLOW}>
                <Mail className="w-4 h-4" /> info@ifleon.com
              </BrutalButton>
              <BrutalButton to="/services" bg={PINK}>
                Explore Services <ArrowUpRight className="w-4 h-4" />
              </BrutalButton>
              <BrutalButton
                href="https://github.com/ifleonlabs"
                bg={PANEL}
              >
                <Github className="w-4 h-4" /> github.com/ifleonlabs
              </BrutalButton>
            </div>

            {/* Compliance row */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(250,247,240,0.7)" }}>
                Compliance:
              </span>
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1"
                  style={{ background: PAPER, color: INK, border: `3px solid ${PAPER}` }}
                >
                  {c}
                </span>
              ))}
            </div>
          </motion.div>

          <p className="mt-6 text-center font-mono text-[11px] font-bold uppercase tracking-widest" style={{ color: "#555" }}>
            IFLEON — Infinite Possibilities, Logical Solutions.
          </p>
        </section>
      </div>
    </main>
  );
}
