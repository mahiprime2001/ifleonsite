/* V14 — "CYBER": dark cyberpunk. Near-black with neon magenta (#FF2E97) +
   cyan (#00E5FF). A CSS perspective neon grid floor, glowing neon borders and
   text-shadow, subtle scanlines, a glitch-style headline (layered offset color
   shadows + clip animation), and HUD/console framing on cards. Retro-futuristic,
   electric, loud. App forces dark chrome for this version.
   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. No WebGL, no external assets/fonts/images. */

import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Terminal,
  Zap,
  Building2,
  User,
  Layers,
  Cpu,
  PenTool,
  Rocket,
  Activity,
  Quote,
  ShieldCheck,
  ChevronRight,
  Wifi,
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

const BG = "#04020a"; // near-black, faint violet
const PANEL = "rgba(8,4,18,0.78)";
const MAGENTA = "#FF2E97";
const CYAN = "#00E5FF";
const VIOLET = "#7C3AED";

const GRAD = `linear-gradient(90deg, ${MAGENTA}, ${CYAN})`;
const GRAD_REV = `linear-gradient(90deg, ${CYAN}, ${MAGENTA})`;

const MAILTO = "mailto:info@ifleon.com";
const GITHUB = "https://github.com/ifleonlabs";

/* per-card neon accents, cycled */
const ACCENTS = [MAGENTA, CYAN, VIOLET];

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

const PROCESS = [
  {
    icon: Cpu,
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
    icon: Activity,
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
    role: "B2B SaaS · India",
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

const GROUPS: {
  id: string;
  label: string;
  tag: string;
  icon: typeof Building2;
  items: Service[];
}[] = [
  { id: "business", label: "Business", tag: "ENTERPRISE", icon: Building2, items: businessServices },
  { id: "individual", label: "Individuals", tag: "PERSONAL", icon: User, items: individualServices },
  { id: "specialty", label: "Specialty", tag: "ADD-ON", icon: Layers, items: specialtyServices },
];

/* ------------------------------------------------------------------ */
/*  Presentational helpers                                             */
/* ------------------------------------------------------------------ */

/* Glitch headline — layered offset magenta/cyan shadows + clip slices. */
function GlitchText({ children }: { children: string }) {
  return (
    <span
      className="cyber-glitch relative inline-block"
      data-text={children}
      style={{ color: "#f4f1ff" }}
    >
      {children}
    </span>
  );
}

function NeonGradText({
  children,
  rev,
  className,
}: {
  children: React.ReactNode;
  rev?: boolean;
  className?: string;
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: rev ? GRAD_REV : GRAD,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        filter: "drop-shadow(0 0 18px rgba(0,229,255,0.35))",
      }}
    >
      {children}
    </span>
  );
}

/* Neon button — primary (filled gradient + glow) or ghost (outline). */
function NeonButton({
  children,
  href,
  to,
  variant = "primary",
  external,
}: {
  children: React.ReactNode;
  href?: string;
  to?: string;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const primary = variant === "primary";
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-transform duration-150 active:translate-y-px";
  const style: React.CSSProperties = primary
    ? {
        color: "#04020a",
        backgroundImage: GRAD,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.25) inset, 0 0 28px -4px ${MAGENTA}, 0 0 40px -10px ${CYAN}`,
      }
    : {
        color: CYAN,
        background: "rgba(0,229,255,0.05)",
        boxShadow: `0 0 0 1px ${CYAN}88 inset, 0 0 22px -10px ${CYAN}`,
        textShadow: `0 0 10px ${CYAN}88`,
      };

  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;

  if (to) {
    return (
      <Link to={to} className={base} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={base}
      style={style}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Background — neon grid floor + glow + scanlines                    */
/* ------------------------------------------------------------------ */

function CyberBackground({ animate }: { animate: boolean }) {
  const gid = useId().replace(/:/g, "");
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base wash + horizon glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 70% at 50% 0%, rgba(124,58,237,0.22), transparent 55%), radial-gradient(120% 60% at 50% 100%, rgba(255,46,151,0.16), transparent 60%), ${BG}`,
        }}
      />
      {/* horizon glow line */}
      <div
        className="absolute inset-x-0 top-[52%] h-px"
        style={{ boxShadow: `0 0 30px 6px ${CYAN}, 0 0 60px 12px ${MAGENTA}55`, background: CYAN }}
      />
      {/* perspective neon grid floor */}
      <svg
        className="absolute inset-x-0 bottom-0 h-[48%] w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`cyfade-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0" />
            <stop offset="55%" stopColor={MAGENTA} stopOpacity="0.45" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* horizontal lines, denser toward horizon */}
        {Array.from({ length: 11 }).map((_, i) => {
          const y = 60 - Math.pow(i / 11, 1.9) * 60;
          return (
            <line
              key={`h${i}`}
              x1="0"
              x2="100"
              y1={y}
              y2={y}
              stroke={`url(#cyfade-${gid})`}
              strokeWidth="0.22"
            />
          );
        })}
        {/* verticals fanning from a vanishing point */}
        {Array.from({ length: 25 }).map((_, i) => {
          const x = (i / 24) * 100;
          return (
            <line
              key={`v${i}`}
              x1="50"
              y1="0"
              x2={x}
              y2="60"
              stroke={`url(#cyfade-${gid})`}
              strokeWidth="0.16"
            />
          );
        })}
      </svg>
      {/* scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,229,255,0.05) 0px, rgba(0,229,255,0.05) 1px, transparent 1px, transparent 3px)",
          opacity: animate ? 0.6 : 0.3,
          mixBlendMode: "overlay",
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.6) 100%)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card — HUD / console framing                               */
/* ------------------------------------------------------------------ */

function ServiceCard({ service, accent }: { service: Service; accent: string }) {
  const Icon = service.icon;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-md p-5"
      style={{
        background: PANEL,
        boxShadow: `0 0 0 1px ${accent}3a inset, 0 0 0 1px rgba(255,255,255,0.04)`,
        backdropFilter: "blur(4px)",
      }}
    >
      {/* corner ticks (HUD framing) */}
      {(
        [
          "left-2 top-2 border-l border-t",
          "right-2 top-2 border-r border-t",
          "left-2 bottom-2 border-l border-b",
          "right-2 bottom-2 border-r border-b",
        ] as const
      ).map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute h-3 w-3 ${pos}`}
          style={{ borderColor: accent }}
        />
      ))}
      {/* top neon edge that lights up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="mb-3 flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-md"
          style={{
            color: accent,
            background: `${accent}14`,
            boxShadow: `0 0 0 1px ${accent}66 inset, 0 0 16px -6px ${accent}`,
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          {service.id.slice(0, 8)}
        </span>
      </div>

      <h4 className="font-display text-base font-bold leading-snug text-white">
        {service.title}
      </h4>
      <p
        className="mt-1 font-mono text-xs font-semibold uppercase tracking-wide"
        style={{ color: accent, textShadow: `0 0 12px ${accent}66` }}
      >
        {service.tagline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>

      <div className="mt-auto flex items-center gap-1.5 pt-4 font-mono text-[11px] uppercase tracking-wider text-slate-500 transition-colors group-hover:text-slate-300">
        <ChevronRight size={12} style={{ color: accent }} />
        execute
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

export default function CyberHome() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: animate ? 24 : 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative min-h-screen overflow-x-clip" style={{ background: BG }}>
      {/* component-scoped CSS for the glitch effect (no external assets) */}
      <style>{`
        .cyber-glitch { position: relative; }
        .cyber-glitch::before,
        .cyber-glitch::after {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          width: 100%;
          pointer-events: none;
        }
        .cyber-glitch::before { color: ${MAGENTA}; }
        .cyber-glitch::after  { color: ${CYAN}; }
        ${
          animate
            ? `
        .cyber-glitch::before {
          animation: cyGlitchA 2.6s infinite steps(2, jump-none);
          clip-path: inset(0 0 62% 0);
          mix-blend-mode: screen;
        }
        .cyber-glitch::after {
          animation: cyGlitchB 3.1s infinite steps(2, jump-none);
          clip-path: inset(58% 0 0 0);
          mix-blend-mode: screen;
        }
        @keyframes cyGlitchA {
          0%,92%,100% { transform: translate(0,0); opacity: .0; }
          93% { transform: translate(-2px,-1px); opacity: .9; }
          96% { transform: translate(3px,1px);  opacity: .85; }
          98% { transform: translate(-1px,0);   opacity: .9; }
        }
        @keyframes cyGlitchB {
          0%,90%,100% { transform: translate(0,0); opacity: .0; }
          91% { transform: translate(2px,1px);  opacity: .9; }
          94% { transform: translate(-3px,-1px); opacity: .85; }
          97% { transform: translate(1px,0);     opacity: .9; }
        }`
            : `
        .cyber-glitch::before { transform: translate(-1.5px,0); opacity: .35; mix-blend-mode: screen; }
        .cyber-glitch::after  { transform: translate(1.5px,0);  opacity: .35; mix-blend-mode: screen; }`
        }
      `}</style>

      <CyberBackground animate={animate} />

      {/* ===================== HERO ===================== */}
      <section className="relative mx-auto max-w-6xl px-6 pt-28 pb-16 text-center md:pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: "rgba(0,229,255,0.06)",
            boxShadow: `0 0 0 1px ${CYAN}66 inset, 0 0 22px -10px ${CYAN}`,
          }}
        >
          <Wifi size={14} color={CYAN} />
          <span
            className="font-mono text-xs uppercase tracking-[0.22em]"
            style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}88` }}
          >
            IFLEON // EST. 2022 // NELLORE, INDIA
          </span>
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mx-auto mt-7 max-w-4xl font-display text-5xl font-black leading-[1.04] tracking-tight md:text-7xl"
        >
          <GlitchText>Infinite Possibilities,</GlitchText>
          <br />
          <NeonGradText>Logical Solutions.</NeonGradText>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
        >
          A founder-led consultancy engineering{" "}
          <span style={{ color: CYAN, textShadow: `0 0 12px ${CYAN}66` }}>
            AI, DevOps, cloud, and cybersecurity
          </span>{" "}
          for businesses and individuals — from Nellore to the rest of the world.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <NeonButton href={MAILTO} variant="primary">
            <Mail size={16} />
            Request a Free Consultation
          </NeonButton>
          <NeonButton to="/services" variant="ghost">
            Explore Services
            <ArrowRight size={16} />
          </NeonButton>
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
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-200"
              style={{ background: "rgba(255,255,255,0.03)", boxShadow: `0 0 0 1px ${MAGENTA}55 inset` }}
            >
              <ShieldCheck size={12} color={MAGENTA} />
              {c}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ===================== METRICS ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICS.map((m, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative overflow-hidden rounded-md p-5 text-center"
                style={{ background: PANEL, boxShadow: `0 0 0 1px ${accent}44 inset` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
                <div className="font-display text-4xl font-black md:text-5xl">
                  <NeonGradText rev={i % 2 === 1}>{m.value}</NeonGradText>
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-slate-400">
                  {m.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="text-center">
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}66` }}
          >
            &gt;_ what we build
          </span>
          <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
            <NeonGradText>16 Services, One Team</NeonGradText>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 md:text-base">
            Grouped for businesses, individuals, and the specialty add-ons that round out
            a build.
          </p>
        </div>

        {GROUPS.map((group) => {
          const GIcon = group.icon;
          return (
            <div key={group.id} className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-md"
                  style={{
                    backgroundImage: GRAD,
                    color: "#04020a",
                    boxShadow: `0 0 18px -6px ${MAGENTA}`,
                  }}
                >
                  <GIcon className="h-4 w-4" />
                </span>
                <h3 className="font-display text-xl font-bold text-white">{group.label}</h3>
                <span
                  className="rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400"
                  style={{ boxShadow: `0 0 0 1px ${CYAN}44 inset` }}
                >
                  {group.tag}
                </span>
                <span
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, ${MAGENTA}66, transparent)` }}
                />
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
                    <ServiceCard service={service} accent={ACCENTS[i % ACCENTS.length]} />
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
          <span
            className="font-mono text-xs uppercase tracking-[0.3em]"
            style={{ color: MAGENTA, textShadow: `0 0 10px ${MAGENTA}66` }}
          >
            &gt;_ how we work
          </span>
          <h2 className="mt-3 font-display text-3xl font-black md:text-5xl">
            <NeonGradText rev>Four steps, no black boxes</NeonGradText>
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative overflow-hidden rounded-md p-5"
                style={{ background: PANEL, boxShadow: `0 0 0 1px ${accent}40 inset` }}
              >
                <div
                  className="font-display text-5xl font-black leading-none"
                  style={{ color: "transparent", WebkitTextStroke: `1px ${accent}99` }}
                >
                  {p.step}
                </div>
                <span
                  className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-md"
                  style={{
                    color: accent,
                    background: `${accent}14`,
                    boxShadow: `0 0 0 1px ${accent}66 inset, 0 0 16px -6px ${accent}`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <h4 className="mt-3 font-display text-lg font-bold text-white">{p.title}</h4>
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
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: animate ? 18 : 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="relative flex h-full flex-col overflow-hidden rounded-md p-6"
                style={{ background: PANEL, boxShadow: `0 0 0 1px ${accent}40 inset` }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />
                <Quote size={22} color={accent} style={{ filter: `drop-shadow(0 0 10px ${accent}88)` }} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-200">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-2">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="font-mono text-[11px] text-slate-500">· {t.role}</span>
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
          className="relative overflow-hidden rounded-lg px-6 py-14 text-center"
          style={{
            background:
              "radial-gradient(120% 100% at 50% 0%, rgba(255,46,151,0.18), transparent 60%), radial-gradient(120% 100% at 50% 100%, rgba(0,229,255,0.16), transparent 60%), rgba(4,2,10,0.9)",
            boxShadow: `0 0 0 1px ${MAGENTA}55 inset, 0 0 90px -30px ${CYAN}`,
          }}
        >
          {/* HUD corner ticks */}
          {(
            [
              "left-3 top-3 border-l-2 border-t-2",
              "right-3 top-3 border-r-2 border-t-2",
              "left-3 bottom-3 border-l-2 border-b-2",
              "right-3 bottom-3 border-r-2 border-b-2",
            ] as const
          ).map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`pointer-events-none absolute h-5 w-5 ${pos}`}
              style={{ borderColor: CYAN }}
            />
          ))}

          <div
            className="mx-auto inline-flex items-center gap-2 rounded-md px-3 py-1"
            style={{ boxShadow: `0 0 0 1px ${CYAN}55 inset` }}
          >
            <Terminal size={13} color={CYAN} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: CYAN, textShadow: `0 0 10px ${CYAN}88` }}
            >
              ./initiate --build
            </span>
          </div>

          <h2 className="mx-auto mt-5 max-w-3xl font-display text-3xl font-black md:text-5xl">
            <NeonGradText>Ready when you are.</NeonGradText>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 md:text-base">
            Tell us the problem worth solving first. Free consultation, no slide-deck
            theatre — just a logical plan and a team that ships.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <NeonButton href={MAILTO} variant="primary">
              <Mail size={16} />
              info@ifleon.com
            </NeonButton>
            <NeonButton to="/services" variant="ghost">
              <Zap size={16} />
              Explore Services
            </NeonButton>
            <NeonButton href={GITHUB} variant="ghost" external>
              <Github size={16} />
              github.com/ifleonlabs
            </NeonButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
