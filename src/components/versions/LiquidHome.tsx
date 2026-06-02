/* V21 — LIQUID: a LIGHT, organic / fluid homepage for IFLEON.

   Aesthetic: morphing SVG blob shapes that slowly breathe and reshape
   (animated `d` paths + animated border-radius blobs), vibrant gradient
   fills (coral -> violet -> blue -> teal), gooey soft shapes, and fluid
   wavy SVG section dividers. Playful, organic, alive — on a bright canvas.

   Self-contained: only react, framer-motion, lucide-react, react-router-dom.
   No three.js / WebGL / external assets. The app forces LIGHT chrome for
   this version. No Header/Footer. Hero starts pt-28 md:pt-32. Honors
   prefers-reduced-motion (all looping motion gated; static fallback). */

import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Quote,
  Building2,
  User,
  Layers,
  Target,
  Hammer,
  Rocket,
  LifeBuoy,
  ShieldCheck,
  Droplets,
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
/* Liquid palette — vivid coral / violet / blue / teal on bright cream */
/* ------------------------------------------------------------------ */
const CANVAS = "#FBFAFF"; // page canvas — almost-white with a cool tint
const INK = "#211A3B"; // deep indigo ink (primary text)
const INK_SOFT = "#5E5780"; // muted text

const CORAL = "#FF6B6B";
const VIOLET = "#8B5CF6";
const BLUE = "#3B82F6";
const TEAL = "#14B8A6";
const PINK = "#EC4899";
const AMBER = "#F59E0B";

/* The signature liquid gradient — coral -> violet -> blue -> teal */
const FLOW = `linear-gradient(120deg, ${CORAL} 0%, ${VIOLET} 34%, ${BLUE} 68%, ${TEAL} 100%)`;
const FLOW_TEXT = `linear-gradient(105deg, ${CORAL}, ${VIOLET} 45%, ${BLUE} 75%, ${TEAL})`;

/* clip text to a gradient fill */
const gradientText: CSSProperties = {
  backgroundImage: FLOW_TEXT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered", from: CORAL, to: VIOLET },
  { value: "6", label: "Industries Served", from: VIOLET, to: BLUE },
  { value: "50+", label: "Clients & Individuals", from: BLUE, to: TEAL },
  { value: "99.9%", label: "Uptime Maintained", from: TEAL, to: AMBER },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK: {
  icon: LucideIcon;
  step: string;
  title: string;
  body: string;
  from: string;
  to: string;
}[] = [
  {
    icon: Target,
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result you want, then reverse-engineer the right stack — never tech for tech's sake.",
    from: CORAL,
    to: VIOLET,
  },
  {
    icon: Hammer,
    step: "02",
    title: "Build in the open",
    body: "Short cycles, working software you can actually see, and clean code pushed to a repo that you own from day one.",
    from: VIOLET,
    to: BLUE,
  },
  {
    icon: Rocket,
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives real users and real traffic.",
    from: BLUE,
    to: TEAL,
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays fully in control long after launch.",
    from: TEAL,
    to: AMBER,
  },
];

const QUOTES: { quote: string; name: string; role: string; from: string; to: string }[] = [
  {
    quote:
      "They migrated us to AWS without a minute of downtime and our infra bill dropped by a third. Felt less like a vendor, more like our own team.",
    name: "Operations Lead",
    role: "Logistics SaaS · Bengaluru",
    from: BLUE,
    to: TEAL,
  },
  {
    quote:
      "We needed ISO 27001 to close an enterprise deal. IFLEON got us audit-ready in weeks, not quarters — and explained every step in plain English.",
    name: "Founder",
    role: "Fintech startup · Hyderabad",
    from: CORAL,
    to: VIOLET,
  },
  {
    quote:
      "I came in as a complete beginner. Six months later I landed my first cloud role. The personalised roadmap made all the difference.",
    name: "Career Switcher",
    role: "Now a Cloud Engineer · Chennai",
    from: VIOLET,
    to: BLUE,
  },
];

/* Rotating gradient pairs for service cards */
const ACCENTS: { from: string; to: string }[] = [
  { from: CORAL, to: VIOLET },
  { from: VIOLET, to: BLUE },
  { from: BLUE, to: TEAL },
  { from: TEAL, to: AMBER },
  { from: PINK, to: CORAL },
  { from: AMBER, to: PINK },
];

/* ------------------------------------------------------------------ */
/* Morphing blob path keyframes (organic, closed bezier loops).        */
/* Each entry is a full SVG `d` for a ~200x200 viewBox blob.           */
/* ------------------------------------------------------------------ */
const BLOB_PATHS = [
  "M48,-58C62,-47,72,-31,74,-14C76,3,70,21,60,36C49,51,35,63,18,69C0,75,-19,75,-36,67C-53,59,-67,43,-72,25C-77,7,-73,-13,-63,-29C-52,-45,-35,-57,-17,-64C2,-71,23,-69,48,-58Z",
  "M52,-62C65,-50,71,-30,71,-11C72,8,67,27,56,42C45,58,28,69,9,73C-11,77,-32,73,-49,62C-66,51,-78,33,-80,14C-83,-6,-75,-27,-62,-42C-49,-57,-30,-66,-10,-69C9,-72,30,-74,52,-62Z",
  "M44,-54C56,-43,64,-28,69,-11C73,5,73,23,65,38C56,53,40,65,22,71C3,77,-17,77,-35,69C-53,61,-69,46,-74,28C-79,9,-73,-12,-62,-29C-51,-46,-35,-58,-17,-64C2,-70,23,-66,44,-54Z",
];

/* Border-radius keyframes for CSS gooey blobs (no SVG needed). */
const GOO_RADII = [
  "42% 58% 63% 37% / 41% 44% 56% 59%",
  "63% 37% 38% 62% / 49% 60% 40% 51%",
  "38% 62% 56% 44% / 60% 38% 62% 40%",
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
        transition: reduce ? {} : { staggerChildren: 0.07, delayChildren: 0.05 },
      },
    }),
    [reduce],
  );
  const item: Variants = useMemo(
    () =>
      reduce
        ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
        : {
            hidden: { opacity: 0, y: 26, scale: 0.96 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 170, damping: 20 },
            },
          },
    [reduce],
  );
  return { reduce, container, item };
}

/* ------------------------------------------------------------------ */
/* Morphing SVG blob — animates its `d` path through BLOB_PATHS.       */
/* Filled with a vivid gradient defined per-instance.                  */
/* ------------------------------------------------------------------ */
function MorphBlob({
  className,
  from,
  to,
  reduce,
  duration = 14,
  delay = 0,
  opacity = 1,
}: {
  className: string;
  from: string;
  to: string;
  reduce: boolean | null;
  duration?: number;
  delay?: number;
  opacity?: number;
}) {
  const gid = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      viewBox="-100 -100 200 200"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`g-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <motion.path
        fill={`url(#g-${gid})`}
        d={BLOB_PATHS[0]}
        animate={
          reduce
            ? undefined
            : { d: [BLOB_PATHS[0], BLOB_PATHS[1], BLOB_PATHS[2], BLOB_PATHS[0]] }
        }
        transition={
          reduce
            ? undefined
            : { duration, repeat: Infinity, ease: "easeInOut", delay }
        }
      />
    </svg>
  );
}

/* CSS gooey blob — animates border-radius + gentle drift. */
function GooBlob({
  className,
  from,
  to,
  reduce,
  duration = 12,
  delay = 0,
}: {
  className: string;
  from: string;
  to: string;
  reduce: boolean | null;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      initial={{ borderRadius: GOO_RADII[0] }}
      animate={
        reduce
          ? { borderRadius: GOO_RADII[0] }
          : {
              borderRadius: [GOO_RADII[0], GOO_RADII[1], GOO_RADII[2], GOO_RADII[0]],
              y: [0, -14, 0],
              rotate: [0, 8, 0],
            }
      }
      transition={
        reduce
          ? undefined
          : { duration, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Fluid wavy SVG section divider.                                    */
/* flip=true mirrors vertically so waves can cap top or bottom.       */
/* ------------------------------------------------------------------ */
function WaveDivider({
  fill,
  flip = false,
  className = "",
}: {
  fill: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={`pointer-events-none w-full leading-[0] ${className}`}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[90px]"
        style={flip ? { transform: "scaleY(-1)" } : undefined}
      >
        <path
          fill={fill}
          d="M0,40 C180,100 360,0 540,40 C720,80 900,120 1080,80 C1260,40 1350,30 1440,56 L1440,120 L0,120 Z"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading                                                    */
/* ------------------------------------------------------------------ */
function SectionHead({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white"
        style={{ backgroundImage: FLOW }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <h2
        className="mt-5 font-display text-3xl font-bold leading-tight sm:text-4xl"
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
/* Fluid buttons                                                      */
/* ------------------------------------------------------------------ */
function PrimaryBtn({
  to,
  href,
  children,
  reduce,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  reduce: boolean | null;
}) {
  const inner = (
    <motion.span
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="group/btn inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold text-white"
      style={{
        backgroundImage: FLOW,
        borderRadius: "42% 58% 56% 44% / 100% 100% 100% 100%",
        boxShadow: "0 16px 34px -12px rgba(139,92,246,0.55)",
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
    <a href={href} className="inline-flex">
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
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-bold"
      style={{
        background: "#fff",
        color: INK,
        boxShadow: "0 10px 26px -14px rgba(33,26,59,0.4)",
        border: "1.5px solid rgba(139,92,246,0.22)",
      }}
    >
      {Icon && <Icon className="h-4 w-4" style={{ color: VIOLET }} />}
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
/* Service card — soft gooey shape with a gradient icon blob          */
/* ------------------------------------------------------------------ */
function ServiceCard({
  service,
  from,
  to,
  item,
  reduce,
}: {
  service: Service;
  from: string;
  to: string;
  item: Variants;
  reduce: boolean | null;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={item}
      whileHover={reduce ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 240, damping: 18 }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[2rem] bg-white p-6"
      style={{ boxShadow: "0 24px 50px -28px rgba(33,26,59,0.32)" }}
    >
      {/* faint gradient wash that intensifies on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 opacity-15 transition-opacity duration-500 group-hover:opacity-30"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          borderRadius: GOO_RADII[1],
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center text-white transition-transform duration-300 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            borderRadius: GOO_RADII[2],
          }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {service.tagline.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>
      <h4 className="relative font-display text-lg font-bold leading-snug" style={{ color: INK }}>
        {service.title}
      </h4>
      <p className="relative text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
        {service.description}
      </p>
      <div className="relative mt-auto flex flex-wrap gap-1.5 pt-1">
        {service.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: "rgba(139,92,246,0.08)", color: INK_SOFT }}
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
  from,
  to,
  services,
  startIndex,
}: {
  icon: LucideIcon;
  label: string;
  from: string;
  to: string;
  services: Service[];
  startIndex: number;
}) {
  const { reduce, container, item } = useReveal();
  return (
    <div className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center text-white"
          style={{
            background: `linear-gradient(135deg, ${from}, ${to})`,
            borderRadius: GOO_RADII[0],
          }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-bold" style={{ color: INK }}>
          {label}
        </h3>
        <span
          className="ml-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        >
          {services.length}
        </span>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((s, i) => {
          const accent = ACCENTS[(startIndex + i) % ACCENTS.length];
          return (
            <ServiceCard
              key={s.id}
              service={s}
              from={accent.from}
              to={accent.to}
              item={item}
              reduce={reduce}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
export default function LiquidHome() {
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
      {/* soft radial color wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(820px 620px at 10% 4%, rgba(255,107,107,0.18), transparent 60%), radial-gradient(760px 600px at 92% 6%, rgba(59,130,246,0.16), transparent 62%), radial-gradient(700px 520px at 72% 96%, rgba(20,184,166,0.16), transparent 65%)",
        }}
      />

      {/* ============================ HERO ============================ */}
      <section className="relative mx-auto max-w-6xl px-5 pt-28 pb-20 md:pt-32 md:pb-28">
        {/* morphing background blobs */}
        <MorphBlob
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 md:h-96 md:w-96"
          from={CORAL}
          to={VIOLET}
          reduce={reduce}
          opacity={0.16}
          duration={16}
        />
        <MorphBlob
          className="pointer-events-none absolute -right-20 top-28 hidden h-80 w-80 md:block"
          from={BLUE}
          to={TEAL}
          reduce={reduce}
          opacity={0.16}
          duration={18}
          delay={2}
        />

        {/* small floating gooey accents */}
        <GooBlob
          className="pointer-events-none absolute left-6 bottom-6 hidden h-16 w-16 md:block"
          from={AMBER}
          to={PINK}
          reduce={reduce}
          delay={1}
        />
        <GooBlob
          className="pointer-events-none absolute right-10 bottom-16 hidden h-12 w-12 lg:block"
          from={TEAL}
          to={BLUE}
          reduce={reduce}
          delay={2.4}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold"
            style={{ color: VIOLET, boxShadow: "0 10px 26px -16px rgba(33,26,59,0.5)" }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-white"
              style={{ background: `linear-gradient(135deg, ${CORAL}, ${VIOLET})` }}
            >
              <Droplets className="h-3 w-3" />
            </span>
            Founder-led consultancy · Nellore, India · since 2022
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: INK }}
          >
            Infinite Possibilities,{" "}
            <span className="relative inline-block" style={gradientText}>
              Logical Solutions
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            IFLEON builds AI, DevOps, cloud, and cybersecurity that actually ships —
            for ambitious teams and curious individuals alike. Fluid ideas,
            production-grade results, code you own.
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
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: INK_SOFT }}
            >
              <ShieldCheck className="h-4 w-4" style={{ color: TEAL }} />
              Compliance-ready:
            </span>
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white px-3 py-1.5 font-mono text-xs font-bold"
                style={{ color: INK, boxShadow: "0 8px 20px -16px rgba(33,26,59,0.5)" }}
              >
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* wavy divider into the stats band */}
      <WaveDivider fill="rgba(139,92,246,0.07)" />

      {/* ============================ STATS =========================== */}
      <section
        className="relative px-5 py-16"
        style={{ background: "rgba(139,92,246,0.07)" }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={item}
              whileHover={reduce ? undefined : { y: -6 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="relative flex flex-col items-center overflow-hidden rounded-[1.8rem] bg-white px-4 py-8 text-center"
              style={{ boxShadow: "0 22px 46px -28px rgba(33,26,59,0.35)" }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 opacity-20"
                style={{
                  background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                  borderRadius: GOO_RADII[2],
                }}
              />
              <span
                className="relative font-display text-4xl font-bold sm:text-5xl"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {s.value}
              </span>
              <span className="relative mt-2 text-sm font-semibold" style={{ color: INK }}>
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <WaveDivider fill="rgba(139,92,246,0.07)" flip />

      {/* ========================== SERVICES ========================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-8">
        <SectionHead
          eyebrow="What we do"
          title="Sixteen ways we move you forward"
          blurb="From enterprise platforms to a smarter home setup — pick the help you need. Every engagement leaves you with something you fully own."
        />

        <ServiceGroup
          icon={Building2}
          label="For Business"
          from={CORAL}
          to={VIOLET}
          services={businessServices}
          startIndex={businessStart}
        />
        <ServiceGroup
          icon={User}
          label="For Individuals"
          from={BLUE}
          to={TEAL}
          services={individualServices}
          startIndex={individualStart}
        />
        <ServiceGroup
          icon={Layers}
          label="Specialty & Add-Ons"
          from={PINK}
          to={AMBER}
          services={specialtyServices}
          startIndex={specialtyStart}
        />
      </section>

      {/* ========================= HOW WE WORK ======================== */}
      <WaveDivider fill="rgba(20,184,166,0.08)" />
      <section
        className="relative px-5 py-16"
        style={{ background: "rgba(20,184,166,0.08)" }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="How we work"
            title="A simple, four-step rhythm"
            blurb="No mystery, no lock-in. You can see progress at every step and keep the keys at the end."
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
                  whileHover={reduce ? undefined : { y: -8 }}
                  transition={{ type: "spring", stiffness: 240, damping: 18 }}
                  className="flex h-full flex-col gap-4 rounded-[1.9rem] bg-white p-6"
                  style={{ boxShadow: "0 22px 46px -28px rgba(33,26,59,0.32)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-14 w-14 items-center justify-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                        borderRadius: GOO_RADII[1],
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                    <span
                      className="font-display text-3xl font-bold"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {s.step}
                    </span>
                  </div>
                  <h4 className="font-display text-lg font-bold" style={{ color: INK }}>
                    {s.title}
                  </h4>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
                    {s.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      <WaveDivider fill="rgba(20,184,166,0.08)" flip />

      {/* ======================== TESTIMONIALS ======================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-8">
        <SectionHead eyebrow="Kind words" title="People we've helped, in their words" />
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
              whileHover={reduce ? undefined : { y: -8 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="flex h-full flex-col gap-5 rounded-[1.9rem] bg-white p-7"
              style={{ boxShadow: "0 22px 46px -28px rgba(33,26,59,0.32)" }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${q.from}, ${q.to})`,
                  borderRadius: GOO_RADII[0],
                }}
              >
                <Quote className="h-5 w-5" />
              </span>
              <blockquote className="text-[15px] leading-relaxed" style={{ color: INK }}>
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${q.from}, ${q.to})` }}
                >
                  {q.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold" style={{ color: INK }}>
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
          initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="relative overflow-hidden rounded-[2.6rem] px-6 py-14 text-center text-white md:px-14"
          style={{
            backgroundImage: FLOW,
            boxShadow: "0 30px 70px -32px rgba(139,92,246,0.6)",
          }}
        >
          {/* morphing corner blobs (white wash, gooey) */}
          <MorphBlob
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56"
            from="#ffffff"
            to="#ffffff"
            reduce={reduce}
            opacity={0.14}
            duration={15}
          />
          <MorphBlob
            className="pointer-events-none absolute -bottom-20 -left-16 h-60 w-60"
            from="#ffffff"
            to="#ffffff"
            reduce={reduce}
            opacity={0.12}
            duration={17}
            delay={1.6}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider backdrop-blur">
              <Star className="h-3.5 w-3.5" />
              Let's build something
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
              Tell us what you're dreaming up — we'll help you ship it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/90">
              Whether it's an AI roadmap, a cloud migration, or just getting your
              devices running smoothly — a free, no-pressure consultation is the
              easiest place to start.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SecondaryBtn href="mailto:info@ifleon.com" icon={Mail} reduce={reduce}>
                info@ifleon.com
              </SecondaryBtn>
              <Link to="/services" className="inline-flex">
                <motion.span
                  whileHover={reduce ? undefined : { scale: 1.04 }}
                  whileTap={reduce ? undefined : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold"
                  style={{ color: VIOLET }}
                >
                  Browse all services
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
              <SecondaryBtn
                href="https://github.com/ifleonlabs"
                external
                icon={Github}
                reduce={reduce}
              >
                github.com/ifleonlabs
              </SecondaryBtn>
            </div>

            <p className="mt-8 font-mono text-xs font-semibold text-white/85">
              IFLEON · Nellore, India · serving India &amp; global ·
              Infinite Possibilities, Logical Solutions.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
