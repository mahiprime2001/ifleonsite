/* V15 — "RETRO": dark Y2K / retro-web revival.
   Early-2000s-meets-vaporwave: chrome/metallic gradient text, glossy beveled
   buttons, saturated purple→blue→cyan gradients, a scrolling marquee, star /
   sparkle accents and pixel touches — maximalist but legible. App forces dark.
   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. No WebGL, no external assets/fonts/images. */

import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Star,
  Zap,
  Building2,
  User,
  Layers,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  Quote,
  ShieldCheck,
  MousePointerClick,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const BG = "#0a0014"; // deep aubergine-black
const PURPLE = "#a855f7";
const BLUE = "#3b82f6";
const CYAN = "#22d3ee";
const PINK = "#ec4899";

const GRAD = `linear-gradient(90deg, ${PURPLE}, ${BLUE}, ${CYAN})`;
const GRAD_HOT = `linear-gradient(90deg, ${PINK}, ${PURPLE}, ${BLUE})`;
const CHROME =
  "linear-gradient(180deg,#ffffff 0%,#d8e6ff 38%,#7fa8d8 52%,#e9f2ff 66%,#9fb6d6 100%)";

const MAILTO = "mailto:info@ifleon.com";

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const MARQUEE = [
  "AI / ML",
  "DevOps",
  "Cloud",
  "Cybersecurity",
  "Automation",
  "Data Engineering",
  "Mobile",
  "UI / UX",
  "AI Agents",
  "Smart Home",
  "Career Guidance",
];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the single highest-leverage problem worth solving first.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Support",
    body: "We stay on after launch — monitoring, iteration, and a team that picks up the phone.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON moved us from quarterly releases to shipping daily. The CI/CD pipeline alone paid for the engagement in a month.",
    name: "Operations Lead",
    role: "B2B SaaS, India",
  },
  {
    quote:
      "Their AI support copilot answers from our own docs and deflects almost half our tickets. It just works.",
    name: "Head of Support",
    role: "Fintech",
  },
  {
    quote:
      "I went from curious to a cloud role in six months. The learning path and mock interviews were a game-changer.",
    name: "Career Switcher",
    role: "Individual client",
  },
];

const GROUPS: { id: string; label: string; icon: typeof Building2; items: Service[] }[] = [
  { id: "business", label: "Business", icon: Building2, items: businessServices },
  { id: "individual", label: "Individuals", icon: User, items: individualServices },
  { id: "specialty", label: "Specialty", icon: Layers, items: specialtyServices },
];

/* tagline → accent for service cards, cycled */
const CARD_ACCENTS = [PURPLE, BLUE, CYAN, PINK];

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

function ChromeText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: CHROME,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        WebkitTextStroke: "0.5px rgba(80,120,200,0.45)",
        filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.55))",
      }}
    >
      {children}
    </span>
  );
}

function GradText({
  children,
  hot,
  className,
}: {
  children: React.ReactNode;
  hot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: hot ? GRAD_HOT : GRAD,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}

/* Glossy beveled Y2K button — Aqua-style. */
function GlossyButton({
  children,
  href,
  to,
  variant = "primary",
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  variant?: "primary" | "ghost";
}) {
  const primary = variant === "primary";
  const inner = (
    <span
      className="relative z-10 flex items-center gap-2 text-sm font-bold tracking-wide"
      style={{
        color: primary ? "#fff" : "#dbeafe",
        textShadow: primary ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {children}
    </span>
  );

  const base =
    "group relative inline-flex items-center justify-center rounded-xl px-6 py-3 overflow-hidden transition-transform duration-150 active:translate-y-px";
  const style: React.CSSProperties = primary
    ? {
        backgroundImage: GRAD,
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.25) inset, 0 10px 26px -8px rgba(59,130,246,0.7), 0 2px 0 rgba(0,0,0,0.35)",
      }
    : {
        background: "rgba(168,85,247,0.06)",
        boxShadow:
          "0 0 0 1px rgba(168,85,247,0.55) inset, 0 0 0 1px rgba(34,211,238,0.18)",
      };

  const gloss = primary ? (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-xl"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))",
      }}
    />
  ) : null;

  if (to) {
    return (
      <Link to={to} className={base} style={style}>
        {gloss}
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={base} style={style}>
      {gloss}
      {inner}
    </a>
  );
}

function Sparkle({
  className,
  size = 16,
  color = CYAN,
  delay = 0,
  animate,
}: {
  className?: string;
  size?: number;
  color?: string;
  delay?: number;
  animate: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      className={className}
      style={{ position: "absolute", color, lineHeight: 0 }}
      animate={
        animate
          ? { opacity: [0.2, 1, 0.2], scale: [0.7, 1.15, 0.7], rotate: [0, 90, 0] }
          : { opacity: 0.6 }
      }
      transition={
        animate
          ? { duration: 2.4, repeat: Infinity, delay, ease: "easeInOut" }
          : undefined
      }
    >
      <Sparkles size={size} strokeWidth={1.6} />
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Background — vaporwave grid + sun + scanlines                      */
/* ------------------------------------------------------------------ */

function RetroBackground({ animate }: { animate: boolean }) {
  const gid = useId().replace(/:/g, "");
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% -10%, rgba(168,85,247,0.30), transparent 60%), radial-gradient(100% 70% at 50% 110%, rgba(34,211,238,0.16), transparent 60%), ${BG}`,
        }}
      />
      {/* glowing sun */}
      <div
        className="absolute left-1/2 top-[6%] h-[42vh] w-[42vh] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${PINK} 0%, ${PURPLE} 45%, transparent 70%)`,
          filter: "blur(8px)",
          opacity: 0.45,
        }}
      />
      {/* perspective grid floor */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`grid-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        {/* horizontal lines */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 60 - Math.pow(i / 9, 1.8) * 60;
          return (
            <line
              key={`h${i}`}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke={`url(#grid-${gid})`}
              strokeWidth="0.25"
            />
          );
        })}
        {/* vanishing-point verticals */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i / 20) * 100;
          return (
            <line
              key={`v${i}`}
              x1="50"
              y1="0"
              x2={x}
              y2="60"
              stroke={`url(#grid-${gid})`}
              strokeWidth="0.18"
            />
          );
        })}
      </svg>
      {/* scanlines */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)",
          opacity: animate ? 0.5 : 0.25,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Marquee                                                            */
/* ------------------------------------------------------------------ */

function Marquee({ animate }: { animate: boolean }) {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div
      className="relative overflow-hidden border-y py-3"
      style={{
        borderColor: "rgba(168,85,247,0.35)",
        background:
          "linear-gradient(90deg, rgba(168,85,247,0.10), rgba(34,211,238,0.10))",
      }}
    >
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap px-4"
        animate={animate ? { x: ["0%", "-50%"] } : undefined}
        transition={
          animate ? { duration: 26, repeat: Infinity, ease: "linear" } : undefined
        }
      >
        {row.map((label, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className="font-mono text-sm font-bold uppercase tracking-widest"
              style={{ color: i % 2 ? CYAN : PURPLE }}
            >
              {label}
            </span>
            <Star size={12} fill={PINK} color={PINK} />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, accent }: { service: Service; accent: string }) {
  const Icon = service.icon;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col rounded-2xl p-5"
      style={{
        background: "rgba(13,2,28,0.72)",
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 0 1px ${accent}33`,
        backdropFilter: "blur(4px)",
      }}
    >
      {/* glossy top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{
            color: "#fff",
            backgroundImage: `linear-gradient(140deg, ${accent}, ${accent}55)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.18) inset, 0 6px 16px -6px ${accent}`,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <Star size={12} className="opacity-80" fill={accent} color={accent} />
      </div>
      <h4 className="font-display text-base font-bold leading-snug text-white">
        {service.title}
      </h4>
      <p className="mt-1 text-sm font-medium" style={{ color: accent }}>
        {service.tagline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        {service.description}
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export default function RetroHome() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: animate ? 24 : 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ background: BG }}>
      <RetroBackground animate={animate} />

      {/* ===================== HERO ===================== */}
      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 text-center md:pt-32">
        {/* floating sparkles */}
        <Sparkle animate={animate} className="left-[8%] top-[18%]" size={22} color={CYAN} />
        <Sparkle animate={animate} className="right-[10%] top-[24%]" size={18} color={PINK} delay={0.6} />
        <Sparkle animate={animate} className="left-[16%] top-[58%]" size={14} color={PURPLE} delay={1.1} />
        <Sparkle animate={animate} className="right-[14%] top-[60%]" size={16} color={CYAN} delay={1.6} />

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(34,211,238,0.08)",
            boxShadow: `0 0 0 1px ${CYAN}66 inset`,
          }}
        >
          <Zap size={14} color={CYAN} />
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-200">
            IFLEON · Est. 2022 · Nellore, India
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mt-7 max-w-4xl font-display text-5xl font-black leading-[1.02] tracking-tight md:text-7xl"
        >
          <ChromeText>Infinite Possibilities,</ChromeText>
          <br />
          <GradText hot>Logical Solutions.</GradText>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
        >
          A founder-led consultancy building{" "}
          <span style={{ color: CYAN }}>AI, DevOps, cloud, and cybersecurity</span>{" "}
          solutions for businesses and individuals — from Nellore to the rest of the
          world.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <GlossyButton href={MAILTO} variant="primary">
            <Mail size={16} />
            Request a Free Consultation
          </GlossyButton>
          <GlossyButton to="/services" variant="ghost">
            Explore Services
            <ArrowRight size={16} />
          </GlossyButton>
        </motion.div>

        {/* compliance chips */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.15 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {COMPLIANCE.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200"
              style={{ background: "rgba(255,255,255,0.04)", boxShadow: `0 0 0 1px ${PURPLE}55 inset` }}
            >
              <ShieldCheck size={12} color={PURPLE} />
              {c}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <Marquee animate={animate} />

      {/* ===================== METRICS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: animate ? 18 : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl p-5 text-center"
              style={{
                background: "rgba(13,2,28,0.7)",
                boxShadow: `0 0 0 1px ${CARD_ACCENTS[i % 4]}44 inset`,
              }}
            >
              <div className="font-display text-4xl font-black md:text-5xl">
                <GradText hot={i % 2 === 1}>{m.value}</GradText>
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: CYAN }}>
            What we build
          </span>
          <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
            <ChromeText>16 Services, One Team</ChromeText>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
            Grouped for businesses, individuals, and the specialty add-ons that round
            out a build.
          </p>
        </div>

        {GROUPS.map((group) => {
          const GIcon = group.icon;
          return (
            <div key={group.id} className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{
                    backgroundImage: GRAD,
                    color: "#fff",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.2) inset",
                  }}
                >
                  <GIcon className="h-4 w-4" />
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {group.label}
                </h3>
                <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${PURPLE}66, transparent)` }} />
                <span className="font-mono text-xs text-slate-500">
                  {group.items.length.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: animate ? 18 : 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
                    className="h-full"
                  >
                    <ServiceCard service={service} accent={CARD_ACCENTS[i % 4]} />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: PINK }}>
            How we work
          </span>
          <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
            <GradText>Four steps, no black boxes</GradText>
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            const accent = CARD_ACCENTS[i % 4];
            return (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: "rgba(13,2,28,0.7)",
                  boxShadow: `0 0 0 1px ${accent}40 inset`,
                }}
              >
                <div
                  className="font-display text-5xl font-black leading-none"
                  style={{ color: `${accent}33`, WebkitTextStroke: `1px ${accent}77` }}
                >
                  {p.step}
                </div>
                <span
                  className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundImage: `linear-gradient(140deg, ${accent}, ${accent}44)`, color: "#fff" }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h4 className="mt-3 font-display text-lg font-bold text-white">
                  {p.title}
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const accent = CARD_ACCENTS[i % 4];
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex h-full flex-col rounded-2xl p-6"
                style={{
                  background: "rgba(13,2,28,0.72)",
                  boxShadow: `0 0 0 1px ${accent}40 inset`,
                }}
              >
                <Quote size={22} color={accent} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-1.5">
                  <Star size={12} fill={accent} color={accent} />
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="text-xs text-slate-500">· {t.role}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <motion.div
          initial={{ opacity: 0, y: animate ? 24 : 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl px-6 py-14 text-center"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 0%, rgba(168,85,247,0.22), transparent 60%), rgba(10,0,20,0.85)",
            boxShadow: `0 0 0 1px ${PURPLE}55 inset, 0 0 80px -30px ${BLUE}`,
          }}
        >
          <Sparkle animate={animate} className="left-[12%] top-[20%]" size={18} color={PINK} />
          <Sparkle animate={animate} className="right-[14%] top-[26%]" size={16} color={CYAN} delay={0.7} />

          <div className="mx-auto inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ boxShadow: `0 0 0 1px ${CYAN}55 inset` }}>
            <MousePointerClick size={13} color={CYAN} />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200">
              Let’s build something
            </span>
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black md:text-5xl">
            <ChromeText>Ready when you are.</ChromeText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 md:text-base">
            Tell us the problem worth solving first. Free consultation, no slide-deck
            theatre — just a logical plan and a team that ships.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GlossyButton href={MAILTO} variant="primary">
              <Mail size={16} />
              info@ifleon.com
            </GlossyButton>
            <GlossyButton to="/services" variant="ghost">
              Explore Services
              <ArrowRight size={16} />
            </GlossyButton>
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-slate-200 transition-colors hover:text-white"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.16) inset" }}
            >
              <Github size={16} />
              github.com/ifleonlabs
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
