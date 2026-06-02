/* V24 — PASTEL: a LIGHT, soft pastel homepage for IFLEON.

   Aesthetic: gentle, calm, airy. A whisper-soft palette of mint, lavender,
   peach, baby-blue and butter washed across a near-white canvas. Rounded
   everything (pill chips, super-rounded cards), soft diffuse shadows, lots
   of breathing room, friendly rounded display type, and slow drifting
   pastel gradient blobs in the background. Micro-interactions are gentle —
   nothing snaps, everything floats. Designed to feel approachable and warm,
   especially for the individual-customer audience.

   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom (Link). No three.js / WebGL / external assets. The app
   forces LIGHT chrome for this version. No Header/Footer. Hero starts with
   pt-28 md:pt-32. Honors prefers-reduced-motion (drifting/scroll motion
   gated; static fallback). Colors defined inline below. */

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Quote,
  Building2,
  Users,
  Layers,
  Compass,
  PenTool,
  Rocket,
  HeartHandshake,
  ShieldCheck,
  Sun,
  Star,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Pastel palette — soft tints on a near-white airy canvas            */
/* ------------------------------------------------------------------ */
const CANVAS = "#FBFAFF"; // page background — faintest cool white
const CARD = "#FFFFFF"; // brightest card surface
const INK = "#43395B"; // gentle plum-grey ink (primary text)
const INK_SOFT = "#7A7196"; // muted secondary text

/* Soft pastel fills (card / chip backgrounds) */
const MINT = "#D6F5E9";
const LAVENDER = "#E7E0FF";
const PEACH = "#FFE6D6";
const BABYBLUE = "#DCEEFF";
const BUTTER = "#FFF3CF";
const BLUSH = "#FFE0EC";

/* Deeper companions for glyphs / accent text — readable on white & on tint */
const MINT_DEEP = "#139B79";
const LAVENDER_DEEP = "#7A5CE0";
const PEACH_DEEP = "#E5762E";
const BABYBLUE_DEEP = "#2E84D8";
const BUTTER_DEEP = "#C19405";
const BLUSH_DEEP = "#DB5C93";

type Accent = { fill: string; deep: string };

/* ------------------------------------------------------------------ */
/* Soft diffuse shadow — airy, low-contrast, no hard edges            */
/* ------------------------------------------------------------------ */
function soft(lift = 18, tint = "rgba(122,92,224,0.14)"): CSSProperties {
  return {
    boxShadow: `0 ${lift}px ${lift * 2}px -${Math.round(lift * 0.7)}px ${tint}, 0 2px 6px -2px rgba(67,57,91,0.08)`,
  };
}

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS: { value: string; label: string; accent: Accent }[] = [
  { value: "25", label: "Projects Delivered", accent: { fill: LAVENDER, deep: LAVENDER_DEEP } },
  { value: "6", label: "Industries Served", accent: { fill: MINT, deep: MINT_DEEP } },
  { value: "50+", label: "Clients & Individuals", accent: { fill: PEACH, deep: PEACH_DEEP } },
  { value: "99.9%", label: "Uptime Maintained", accent: { fill: BABYBLUE, deep: BABYBLUE_DEEP } },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK: {
  icon: LucideIcon;
  step: string;
  title: string;
  body: string;
  accent: Accent;
}[] = [
  {
    icon: Compass,
    step: "01",
    title: "Listen & scope",
    body: "We start from the outcome you want — in plain language — then map the simplest path that gets you there.",
    accent: { fill: LAVENDER, deep: LAVENDER_DEEP },
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design & build",
    body: "Short, friendly cycles with working software you can actually see, and clean code pushed to a repo you own.",
    accent: { fill: MINT, deep: MINT_DEEP },
  },
  {
    icon: Rocket,
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it stays calm under real users and real traffic.",
    accent: { fill: PEACH, deep: PEACH_DEEP },
  },
  {
    icon: HeartHandshake,
    step: "04",
    title: "Hand over & care",
    body: "Runbooks, training, and gentle ongoing support so your team stays fully in control long after launch.",
    accent: { fill: BABYBLUE, deep: BABYBLUE_DEEP },
  },
];

const QUOTES: { quote: string; name: string; role: string; accent: Accent }[] = [
  {
    quote:
      "They migrated us to AWS without a minute of downtime and our infra bill dropped by a third. Felt less like a vendor, more like part of our own team.",
    name: "Operations Lead",
    role: "Logistics SaaS · Bengaluru",
    accent: { fill: MINT, deep: MINT_DEEP },
  },
  {
    quote:
      "We needed ISO 27001 to close an enterprise deal. IFLEON got us audit-ready in weeks, not quarters — and explained every step in plain English.",
    name: "Startup Founder",
    role: "Fintech · Hyderabad",
    accent: { fill: LAVENDER, deep: LAVENDER_DEEP },
  },
  {
    quote:
      "I came in as a complete beginner. Six months later I landed my first cloud role. The personalised roadmap and the patience made all the difference.",
    name: "Career Switcher",
    role: "Now a Cloud Engineer · Chennai",
    accent: { fill: PEACH, deep: PEACH_DEEP },
  },
];

/* Rotating accent palette for service cards */
const ACCENTS: Accent[] = [
  { fill: LAVENDER, deep: LAVENDER_DEEP },
  { fill: MINT, deep: MINT_DEEP },
  { fill: PEACH, deep: PEACH_DEEP },
  { fill: BABYBLUE, deep: BABYBLUE_DEEP },
  { fill: BLUSH, deep: BLUSH_DEEP },
  { fill: BUTTER, deep: BUTTER_DEEP },
];

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll helper (gated by reduced-motion)                  */
/* ------------------------------------------------------------------ */
function useReveal() {
  const reduce = useReducedMotion();
  const container: Variants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: reduce ? {} : { staggerChildren: 0.07, delayChildren: 0.04 },
      },
    }),
    [reduce],
  );
  const item: Variants = useMemo(
    () =>
      reduce
        ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
        : {
            hidden: { opacity: 0, y: 22 },
            show: {
              opacity: 1,
              y: 0,
              transition: { type: "spring", stiffness: 140, damping: 20 },
            },
          },
    [reduce],
  );
  return { reduce, container, item };
}

/* ------------------------------------------------------------------ */
/* Drifting pastel blob — soft, slow, blurred background motion       */
/* ------------------------------------------------------------------ */
function Blob({
  className,
  color,
  reduce,
  delay = 0,
}: {
  className: string;
  color: string;
  reduce: boolean | null;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{
        background: color,
        filter: "blur(46px)",
        borderRadius: "9999px",
      }}
      animate={reduce ? undefined : { y: [0, -26, 0], x: [0, 14, 0] }}
      transition={
        reduce
          ? undefined
          : { duration: 13, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                    */
/* ------------------------------------------------------------------ */
function SectionHead({
  eyebrow,
  title,
  blurb,
  accent,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  accent: Accent;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider"
        style={{ background: accent.fill, color: accent.deep }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2
        className="mt-5 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
        style={{ color: INK }}
      >
        {title}
      </h2>
      {blurb && (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed" style={{ color: INK_SOFT }}>
          {blurb}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gentle buttons                                                     */
/* ------------------------------------------------------------------ */
function PrimaryBtn({
  to,
  href,
  external,
  children,
  reduce,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  children: ReactNode;
  reduce: boolean | null;
}) {
  const inner = (
    <motion.span
      whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group/btn inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
      style={{
        background: `linear-gradient(135deg, ${LAVENDER_DEEP} 0%, ${BABYBLUE_DEEP} 100%)`,
        color: "#FFFFFF",
        ...soft(16, "rgba(122,92,224,0.4)"),
      }}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
    </motion.span>
  );
  if (to)
    return (
      <Link to={to} className="inline-flex">
        {inner}
      </Link>
    );
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex"
    >
      {inner}
    </a>
  );
}

function SecondaryBtn({
  to,
  href,
  external,
  icon: Icon,
  children,
  reduce,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  reduce: boolean | null;
}) {
  const inner = (
    <motion.span
      whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
      style={{
        background: CARD,
        color: INK,
        border: `1.5px solid ${LAVENDER}`,
        ...soft(12),
      }}
    >
      {Icon && <Icon className="h-4 w-4" style={{ color: LAVENDER_DEEP }} />}
      {children}
    </motion.span>
  );
  if (to)
    return (
      <Link to={to} className="inline-flex">
        {inner}
      </Link>
    );
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex"
    >
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Service card — soft rounded pastel tile                            */
/* ------------------------------------------------------------------ */
function ServiceCard({
  service,
  accent,
  item,
  reduce,
}: {
  service: Service;
  accent: Accent;
  item: Variants;
  reduce: boolean | null;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={item}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.75rem] p-6"
      style={{ background: CARD, border: "1.5px solid #F0ECFA", ...soft(16) }}
    >
      {/* soft tint that warms up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: accent.fill, filter: "blur(20px)" }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span
          className="flex shrink-0 items-center justify-center rounded-2xl"
          style={{ background: accent.fill, color: accent.deep, height: "3.25rem", width: "3.25rem" }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide"
          style={{ background: accent.fill, color: accent.deep }}
        >
          {service.tagline.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>
      <h4 className="relative font-display text-lg font-semibold leading-snug" style={{ color: INK }}>
        {service.title}
      </h4>
      <p className="relative text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
        {service.description}
      </p>
      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
        {service.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ background: CANVAS, color: INK_SOFT, border: "1px solid #EFEBFA" }}
          >
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Services group block                                               */
/* ------------------------------------------------------------------ */
function ServiceGroup({
  icon: Icon,
  label,
  accent,
  services,
  startIndex,
}: {
  icon: LucideIcon;
  label: string;
  accent: Accent;
  services: Service[];
  startIndex: number;
}) {
  const { reduce, container, item } = useReveal();
  return (
    <div className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: accent.fill, color: accent.deep }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-semibold" style={{ color: INK }}>
          {label}
        </h3>
        <span
          className="ml-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold"
          style={{ background: accent.fill, color: accent.deep }}
        >
          {services.length}
        </span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((s, i) => (
          <ServiceCard
            key={s.id}
            service={s}
            accent={ACCENTS[(startIndex + i) % ACCENTS.length]}
            item={item}
            reduce={reduce}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
export default function PastelHome() {
  const reduce = useReducedMotion();
  const { container, item } = useReveal();

  const businessStart = 0;
  const individualStart = businessServices.length;
  const specialtyStart = businessServices.length + individualServices.length;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: CANVAS, color: INK }}
    >
      {/* soft drifting pastel gradient washes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <Blob
          className="absolute -left-24 -top-24 h-96 w-96 opacity-70"
          color="rgba(231,224,255,0.9)"
          reduce={reduce}
        />
        <Blob
          className="absolute -right-20 top-10 h-80 w-80 opacity-70"
          color="rgba(220,238,255,0.9)"
          reduce={reduce}
          delay={2}
        />
        <Blob
          className="absolute left-1/3 top-[55%] h-80 w-80 opacity-60"
          color="rgba(214,245,233,0.85)"
          reduce={reduce}
          delay={4}
        />
        <Blob
          className="absolute -right-10 bottom-0 h-72 w-72 opacity-60"
          color="rgba(255,230,214,0.8)"
          reduce={reduce}
          delay={6}
        />
      </div>

      {/* ============================ HERO ============================ */}
      <section className="relative mx-auto max-w-6xl px-5 pt-28 pb-16 md:pt-32 md:pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{ background: CARD, color: LAVENDER_DEEP, border: `1.5px solid ${LAVENDER}`, ...soft(10) }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: BUTTER, color: BUTTER_DEEP }}
            >
              <Sun className="h-3 w-3" />
            </span>
            Founder-led consultancy · Nellore, India · since 2022
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: INK }}
          >
            Infinite Possibilities,
            <br className="hidden sm:block" />{" "}
            <span
              className="relative inline-block rounded-3xl px-4 py-1"
              style={{
                background: `linear-gradient(120deg, ${LAVENDER}, ${BABYBLUE}, ${MINT})`,
                color: LAVENDER_DEEP,
              }}
            >
              Logical Solutions
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            IFLEON builds AI, DevOps, cloud, and cybersecurity that actually ships —
            for ambitious teams and curious individuals alike. Friendly experts,
            production-grade results, and code you own from day one.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <PrimaryBtn href="mailto:info@ifleon.com" reduce={reduce}>
              Request a Free Consultation
            </PrimaryBtn>
            <SecondaryBtn to="/services" icon={Layers} reduce={reduce}>
              Explore Services
            </SecondaryBtn>
          </motion.div>

          {/* compliance chips */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-2.5"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: INK_SOFT }}>
              <ShieldCheck className="h-4 w-4" style={{ color: MINT_DEEP }} />
              Compliance-ready:
            </span>
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="rounded-full px-3 py-1.5 font-mono text-xs font-semibold"
                style={{ background: CARD, color: INK, border: "1.5px solid #EDE8F8", ...soft(7) }}
              >
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============================ STATS =========================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              whileHover={reduce ? undefined : { y: -5 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="flex flex-col items-center rounded-[1.75rem] px-4 py-7 text-center"
              style={{ background: s.accent.fill, ...soft(14) }}
            >
              <span className="font-display text-4xl font-semibold sm:text-5xl" style={{ color: s.accent.deep }}>
                {s.value}
              </span>
              <span className="mt-2 text-sm font-medium" style={{ color: INK }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========================== SERVICES ========================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24">
        <SectionHead
          eyebrow="What we do"
          title="Sixteen gentle ways we move you forward"
          blurb="From enterprise platforms to a smarter home setup — pick the help you need. Every engagement leaves you with something you fully own."
          accent={{ fill: LAVENDER, deep: LAVENDER_DEEP }}
        />

        <ServiceGroup
          icon={Building2}
          label="For Business"
          accent={{ fill: BABYBLUE, deep: BABYBLUE_DEEP }}
          services={businessServices}
          startIndex={businessStart}
        />
        <ServiceGroup
          icon={Users}
          label="For Individuals"
          accent={{ fill: MINT, deep: MINT_DEEP }}
          services={individualServices}
          startIndex={individualStart}
        />
        <ServiceGroup
          icon={Layers}
          label="Specialty & Add-Ons"
          accent={{ fill: PEACH, deep: PEACH_DEEP }}
          services={specialtyServices}
          startIndex={specialtyStart}
        />
      </section>

      {/* ========================= HOW WE WORK ======================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24">
        <SectionHead
          eyebrow="How we work"
          title="A simple, four-step rhythm"
          blurb="No mystery, no lock-in. You can see progress at every step and keep the keys at the end."
          accent={{ fill: MINT, deep: MINT_DEEP }}
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {HOW_WE_WORK.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                variants={item}
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="flex h-full flex-col gap-4 rounded-[1.75rem] p-6"
                style={{ background: CARD, border: "1.5px solid #F0ECFA", ...soft(14) }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: s.accent.fill, color: s.accent.deep }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-3xl font-bold" style={{ color: s.accent.fill }}>
                    {s.step}
                  </span>
                </div>
                <h4 className="font-display text-lg font-semibold" style={{ color: INK }}>
                  {s.title}
                </h4>
                <p className="text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24">
        <SectionHead
          eyebrow="Kind words"
          title="People we've helped, in their own words"
          accent={{ fill: BLUSH, deep: BLUSH_DEEP }}
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              variants={item}
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 20 }}
              className="flex h-full flex-col gap-5 rounded-[1.75rem] p-7"
              style={{ background: CARD, border: "1.5px solid #F0ECFA", ...soft(14) }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: q.accent.fill, color: q.accent.deep }}
              >
                <Quote className="h-5 w-5" />
              </span>
              <blockquote className="text-[15px] leading-relaxed" style={{ color: INK }}>
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ background: q.accent.fill, color: q.accent.deep }}
                >
                  {q.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: INK }}>
                    {q.name}
                  </span>
                  <span className="text-xs" style={{ color: INK_SOFT }}>
                    {q.role}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      {/* ========================= CLOSING CTA ======================== */}
      <section className="relative mx-auto max-w-5xl px-5 pb-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          className="relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center md:px-14"
          style={{
            background: `linear-gradient(140deg, ${LAVENDER} 0%, ${BABYBLUE} 50%, ${MINT} 100%)`,
            border: "1.5px solid #FFFFFF",
            ...soft(26, "rgba(122,92,224,0.28)"),
          }}
        >
          {/* soft corner glows */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full"
            style={{ background: BUTTER, filter: "blur(40px)", opacity: 0.7 }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full"
            style={{ background: BLUSH, filter: "blur(42px)", opacity: 0.7 }}
          />

          <div className="relative">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider"
              style={{ background: CARD, color: LAVENDER_DEEP, ...soft(8) }}
            >
              <Star className="h-3.5 w-3.5" />
              Let's build something
            </span>
            <h2
              className="mx-auto mt-5 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              style={{ color: INK }}
            >
              Tell us what you&rsquo;re dreaming up — we&rsquo;ll help you ship it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "#5A507A" }}>
              Whether it&rsquo;s an AI roadmap, a cloud migration, or just getting your
              devices running smoothly — a free, no-pressure consultation is the
              easiest place to start.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PrimaryBtn href="mailto:info@ifleon.com" reduce={reduce}>
                <Mail className="h-4 w-4" /> info@ifleon.com
              </PrimaryBtn>
              <SecondaryBtn to="/services" icon={Layers} reduce={reduce}>
                Browse all services
              </SecondaryBtn>
              <SecondaryBtn
                href="https://github.com/ifleonlabs"
                external
                icon={Github}
                reduce={reduce}
              >
                github.com/ifleonlabs
              </SecondaryBtn>
            </div>

            <p className="mt-8 font-mono text-xs font-semibold" style={{ color: "#5A507A" }}>
              IFLEON · Nellore, India · serving India &amp; global ·
              Infinite Possibilities, Logical Solutions.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
