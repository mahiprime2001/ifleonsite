/* V13 — CLAY: a LIGHT claymorphism homepage for IFLEON.

   Aesthetic: soft, inflated, tactile "clay" UI. Big border-radius, pastel
   fills (lavender, mint, peach, sky), and the signature claymorphism double
   shadow — a soft dark outer drop-shadow PLUS a light inner highlight via
   inset box-shadow — so every surface looks puffy and squeezable. Buttons
   physically squish on hover. Friendly, playful, rounded.

   Self-contained: only react, framer-motion, lucide-react, react-router-dom.
   No three.js / WebGL / external assets. The app forces LIGHT chrome for this
   version. No Header/Footer. Hero starts with pt-28 md:pt-32. Honors
   prefers-reduced-motion (looping/scroll motion gated; static fallback). */

import { useMemo, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
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
  Heart,
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
/* Clay palette — soft pastels on a warm cream canvas                 */
/* ------------------------------------------------------------------ */
const CREAM = "#F3EFFB"; // page canvas — faint lavender cream
const INK = "#3A2E55"; // deep plum ink (primary text)
const INK_SOFT = "#6B5E86"; // muted text
const WHITE = "#FCFAFF"; // brightest clay surface

const LAVENDER = "#C9B8FF";
const MINT = "#A7E8D2";
const PEACH = "#FFC9A8";
const SKY = "#A9D6FF";
const PINK = "#FFB8D9";
const LEMON = "#FCE48E";

/* Darker companions used for icon glyphs / accent text so they read on
   their own pastel without losing contrast. */
const LAVENDER_DEEP = "#6C4CE0";
const MINT_DEEP = "#0E9E78";
const PEACH_DEEP = "#E2702A";
const SKY_DEEP = "#2C7FD6";
const PINK_DEEP = "#D6488F";
const LEMON_DEEP = "#B98A05";

/* ------------------------------------------------------------------ */
/* The signature claymorphism double shadow.                          */
/* Outer soft drop-shadow (depth) + inner light highlight + inner soft */
/* dark (to round the bottom edge) → looks inflated like clay.         */
/* ------------------------------------------------------------------ */
function clay(opts?: {
  /* outer ambient shadow tint (rgba string) */
  drop?: string;
  /* lift amount in px for the outer shadow */
  lift?: number;
  /* inner top highlight */
  hi?: string;
  /* inner bottom shade */
  lo?: string;
}): CSSProperties {
  const drop = opts?.drop ?? "rgba(58,46,85,0.18)";
  const lift = opts?.lift ?? 22;
  const hi = opts?.hi ?? "rgba(255,255,255,0.7)";
  const lo = opts?.lo ?? "rgba(58,46,85,0.10)";
  return {
    boxShadow: [
      `0 ${lift}px ${lift * 1.8}px -${Math.round(lift * 0.6)}px ${drop}`,
      `inset 6px 6px 12px ${hi}`,
      `inset -8px -8px 16px ${lo}`,
    ].join(", "),
  };
}

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered", fill: LAVENDER, deep: LAVENDER_DEEP },
  { value: "6", label: "Industries Served", fill: MINT, deep: MINT_DEEP },
  { value: "50+", label: "Clients & Individuals", fill: PEACH, deep: PEACH_DEEP },
  { value: "99.9%", label: "Uptime Maintained", fill: SKY, deep: SKY_DEEP },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK: { icon: LucideIcon; step: string; title: string; body: string; fill: string; deep: string }[] = [
  {
    icon: Target,
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result you want, then reverse-engineer the right stack — never tech for tech's sake.",
    fill: LAVENDER,
    deep: LAVENDER_DEEP,
  },
  {
    icon: Hammer,
    step: "02",
    title: "Build in the open",
    body: "Short cycles, working software you can actually see, and clean code pushed to a repo that you own from day one.",
    fill: MINT,
    deep: MINT_DEEP,
  },
  {
    icon: Rocket,
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives real users and real traffic.",
    fill: PEACH,
    deep: PEACH_DEEP,
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays fully in control long after launch.",
    fill: SKY,
    deep: SKY_DEEP,
  },
];

const QUOTES: { quote: string; name: string; role: string; fill: string; deep: string }[] = [
  {
    quote:
      "They migrated us to AWS without a minute of downtime and our infra bill dropped by a third. Felt less like a vendor, more like our own team.",
    name: "Operations Lead",
    role: "Logistics SaaS · Bengaluru",
    fill: MINT,
    deep: MINT_DEEP,
  },
  {
    quote:
      "We needed ISO 27001 to close an enterprise deal. IFLEON got us audit-ready in weeks, not quarters — and explained every step in plain English.",
    name: "Founder",
    role: "Fintech startup · Hyderabad",
    fill: LAVENDER,
    deep: LAVENDER_DEEP,
  },
  {
    quote:
      "I came in as a complete beginner. Six months later I landed my first cloud role. The personalised roadmap made all the difference.",
    name: "Career Switcher",
    role: "Now a Cloud Engineer · Chennai",
    fill: PEACH,
    deep: PEACH_DEEP,
  },
];

/* Rotating accent palette for service cards */
const ACCENTS: { fill: string; deep: string }[] = [
  { fill: LAVENDER, deep: LAVENDER_DEEP },
  { fill: MINT, deep: MINT_DEEP },
  { fill: PEACH, deep: PEACH_DEEP },
  { fill: SKY, deep: SKY_DEEP },
  { fill: PINK, deep: PINK_DEEP },
  { fill: LEMON, deep: LEMON_DEEP },
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
            hidden: { opacity: 0, y: 24, scale: 0.96 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 180, damping: 20 },
            },
          },
    [reduce],
  );
  return { reduce, container, item };
}

/* ------------------------------------------------------------------ */
/* Section heading                                                    */
/* ------------------------------------------------------------------ */
function SectionHead({
  eyebrow,
  title,
  blurb,
  fill,
  deep,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
  fill: string;
  deep: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider"
        style={{ background: fill, color: deep, ...clay({ lift: 8, drop: "rgba(58,46,85,0.12)" }) }}
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
/* Squishy clay buttons                                               */
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
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className="group/btn inline-flex items-center justify-center gap-2 rounded-[1.6rem] px-7 py-4 text-sm font-bold"
      style={{
        background: `linear-gradient(150deg, ${LAVENDER} 0%, ${SKY} 100%)`,
        color: "#2A1F45",
        ...clay({ lift: 16, drop: "rgba(108,76,224,0.35)", hi: "rgba(255,255,255,0.85)" }),
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
      whileTap={reduce ? undefined : { scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className="inline-flex items-center justify-center gap-2 rounded-[1.6rem] px-7 py-4 text-sm font-bold"
      style={{
        background: WHITE,
        color: INK,
        ...clay({ lift: 14 }),
      }}
    >
      {Icon && <Icon className="h-4 w-4" />}
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
/* Service card — puffy clay pill                                     */
/* ------------------------------------------------------------------ */
function ServiceCard({
  service,
  fill,
  deep,
  item,
  reduce,
}: {
  service: Service;
  fill: string;
  deep: string;
  item: Variants;
  reduce: boolean | null;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={item}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group flex h-full flex-col gap-4 rounded-[1.9rem] p-6"
      style={{ background: WHITE, ...clay({ lift: 18 }) }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem]"
          style={{ background: fill, color: deep, ...clay({ lift: 9, drop: "rgba(58,46,85,0.14)" }) }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span
          className="rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-transform group-hover:scale-105"
          style={{ background: fill, color: deep }}
        >
          {service.tagline.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>
      <h4 className="font-display text-lg font-bold leading-snug" style={{ color: INK }}>
        {service.title}
      </h4>
      <p className="text-[13.5px] leading-relaxed" style={{ color: INK_SOFT }}>
        {service.description}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {service.features.slice(0, 3).map((f) => (
          <span
            key={f}
            className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{ background: CREAM, color: INK_SOFT }}
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
  fill,
  deep,
  services,
  startIndex,
}: {
  icon: LucideIcon;
  label: string;
  fill: string;
  deep: string;
  services: Service[];
  startIndex: number;
}) {
  const { reduce, container, item } = useReveal();
  return (
    <div className="mb-14 last:mb-0">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-[1rem]"
          style={{ background: fill, color: deep, ...clay({ lift: 8 }) }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-display text-2xl font-bold" style={{ color: INK }}>
          {label}
        </h3>
        <span
          className="ml-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold"
          style={{ background: fill, color: deep }}
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
              fill={accent.fill}
              deep={accent.deep}
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
/* Decorative floating clay blob                                      */
/* ------------------------------------------------------------------ */
function Blob({
  className,
  fill,
  reduce,
  delay = 0,
}: {
  className: string;
  fill: string;
  reduce: boolean | null;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ background: fill, ...clay({ lift: 30, drop: "rgba(58,46,85,0.16)" }) }}
      animate={
        reduce
          ? undefined
          : { y: [0, -18, 0], rotate: [0, 6, 0] }
      }
      transition={
        reduce
          ? undefined
          : { duration: 9, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                               */
/* ------------------------------------------------------------------ */
export default function ClayHome() {
  const reduce = useReducedMotion();
  const { container, item } = useReveal();

  const businessStart = 0;
  const individualStart = businessServices.length;
  const specialtyStart = businessServices.length + individualServices.length;

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: CREAM, color: INK }}
    >
      {/* soft radial wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 12% 8%, rgba(201,184,255,0.5), transparent 60%), radial-gradient(800px 600px at 92% 0%, rgba(169,214,255,0.45), transparent 60%), radial-gradient(700px 500px at 70% 95%, rgba(167,232,210,0.4), transparent 65%)",
        }}
      />

      {/* ============================ HERO ============================ */}
      <section className="relative mx-auto max-w-6xl px-5 pt-28 pb-16 md:pt-32 md:pb-24">
        {/* decorative blobs */}
        <Blob
          className="pointer-events-none absolute -left-10 top-24 hidden h-28 w-28 rounded-[2.2rem] md:block"
          fill={PEACH}
          reduce={reduce}
        />
        <Blob
          className="pointer-events-none absolute right-2 top-44 hidden h-20 w-20 rounded-full lg:block"
          fill={MINT}
          reduce={reduce}
          delay={1.5}
        />
        <Blob
          className="pointer-events-none absolute -right-6 bottom-10 hidden h-24 w-24 rounded-[2rem] md:block"
          fill={PINK}
          reduce={reduce}
          delay={2.6}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold"
            style={{ background: WHITE, color: LAVENDER_DEEP, ...clay({ lift: 10 }) }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: LAVENDER, color: LAVENDER_DEEP }}
            >
              <Heart className="h-3 w-3" />
            </span>
            Founder-led consultancy · Nellore, India · since 2022
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            style={{ color: INK }}
          >
            Infinite Possibilities,{" "}
            <span
              className="relative inline-block rounded-2xl px-3 py-1"
              style={{
                background: `linear-gradient(120deg, ${LAVENDER}, ${SKY})`,
                ...clay({ lift: 10, drop: "rgba(108,76,224,0.28)" }),
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
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: INK_SOFT }}>
              <ShieldCheck className="h-4 w-4" style={{ color: MINT_DEEP }} />
              Compliance-ready:
            </span>
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="rounded-full px-3 py-1.5 font-mono text-xs font-bold"
                style={{ background: WHITE, color: INK, ...clay({ lift: 7 }) }}
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
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex flex-col items-center rounded-[1.8rem] px-4 py-7 text-center"
              style={{ background: s.fill, ...clay({ lift: 16 }) }}
            >
              <span className="font-display text-4xl font-bold sm:text-5xl" style={{ color: s.deep }}>
                {s.value}
              </span>
              <span className="mt-2 text-sm font-semibold" style={{ color: INK }}>
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
          title="Sixteen ways we move you forward"
          blurb="From enterprise platforms to a smarter home setup — pick the help you need. Every engagement leaves you with something you fully own."
          fill={LAVENDER}
          deep={LAVENDER_DEEP}
        />

        <ServiceGroup
          icon={Building2}
          label="For Business"
          fill={SKY}
          deep={SKY_DEEP}
          services={businessServices}
          startIndex={businessStart}
        />
        <ServiceGroup
          icon={User}
          label="For Individuals"
          fill={MINT}
          deep={MINT_DEEP}
          services={individualServices}
          startIndex={individualStart}
        />
        <ServiceGroup
          icon={Layers}
          label="Specialty & Add-Ons"
          fill={PEACH}
          deep={PEACH_DEEP}
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
          fill={MINT}
          deep={MINT_DEEP}
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
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex h-full flex-col gap-4 rounded-[1.9rem] p-6"
                style={{ background: WHITE, ...clay({ lift: 16 }) }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-[1.2rem]"
                    style={{ background: s.fill, color: s.deep, ...clay({ lift: 9 }) }}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-3xl font-bold" style={{ color: s.fill }}>
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
      </section>

      {/* ======================== TESTIMONIALS ======================== */}
      <section className="relative mx-auto max-w-6xl px-5 pb-24">
        <SectionHead
          eyebrow="Kind words"
          title="People we've helped, in their words"
          fill={PEACH}
          deep={PEACH_DEEP}
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
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-full flex-col gap-5 rounded-[1.9rem] p-7"
              style={{ background: WHITE, ...clay({ lift: 16 }) }}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-[1rem]"
                style={{ background: q.fill, color: q.deep, ...clay({ lift: 8 }) }}
              >
                <Quote className="h-5 w-5" />
              </span>
              <blockquote className="text-[15px] leading-relaxed" style={{ color: INK }}>
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold"
                  style={{ background: q.fill, color: q.deep }}
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
          initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="relative overflow-hidden rounded-[2.6rem] px-6 py-14 text-center md:px-14"
          style={{
            background: `linear-gradient(140deg, ${LAVENDER} 0%, ${SKY} 55%, ${MINT} 100%)`,
            ...clay({ lift: 26, drop: "rgba(108,76,224,0.3)", hi: "rgba(255,255,255,0.6)" }),
          }}
        >
          {/* puffy corner blobs */}
          <Blob
            className="pointer-events-none absolute -right-8 -top-8 hidden h-28 w-28 rounded-[2rem] md:block"
            fill={LEMON}
            reduce={reduce}
          />
          <Blob
            className="pointer-events-none absolute -bottom-8 -left-8 hidden h-24 w-24 rounded-full md:block"
            fill={PINK}
            reduce={reduce}
            delay={1.8}
          />

          <div className="relative">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider"
              style={{ background: WHITE, color: LAVENDER_DEEP, ...clay({ lift: 8 }) }}
            >
              <Star className="h-3.5 w-3.5" />
              Let's build something
            </span>
            <h2
              className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl"
              style={{ color: "#2A1F45" }}
            >
              Tell us what you're dreaming up — we'll help you ship it.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed" style={{ color: "#42356A" }}>
              Whether it's an AI roadmap, a cloud migration, or just getting your
              devices running smoothly — a free, no-pressure consultation is the
              easiest place to start.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <SecondaryBtn href="mailto:info@ifleon.com" icon={Mail} reduce={reduce}>
                info@ifleon.com
              </SecondaryBtn>
              <PrimaryBtn to="/services" reduce={reduce}>
                Browse all services
              </PrimaryBtn>
              <SecondaryBtn
                href="https://github.com/ifleonlabs"
                external
                icon={Github}
                reduce={reduce}
              >
                github.com/ifleonlabs
              </SecondaryBtn>
            </div>

            <p className="mt-8 font-mono text-xs font-semibold" style={{ color: "#42356A" }}>
              IFLEON · Nellore, India · serving India &amp; global ·
              Infinite Possibilities, Logical Solutions.
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
