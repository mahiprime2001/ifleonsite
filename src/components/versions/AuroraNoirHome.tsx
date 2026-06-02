/* V18 — Aurora Noir.
   Deep navy/black canvas with large, soft, slowly-drifting AURORA RIBBONS —
   curtains of teal-green, violet, and blue light blurred across the top, like
   northern lights over a dark sky. Premium, calm, sophisticated. Refined type,
   thin hairline dividers, restrained accents. Self-contained, DARK chrome
   (the app forces dark for this version). No WebGL / three.js / external assets. */

import { useMemo } from "react";
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Sparkles,
  Building2,
  User,
  Layers,
  Search,
  PencilRuler,
  Hammer,
  Rocket,
  Quote,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — deep "Aurora Noir" night sky                             */
/* ------------------------------------------------------------------ */
const VOID = "#05070F"; // deepest near-black backdrop
const NIGHT = "#080B17"; // panel / canvas navy-black
const PANEL = "#0C1120"; // raised card surface
const PANEL_HI = "#10172A"; // hovered / brighter surface
const INK = "#F3F6FF"; // primary near-white text
const SUB = "#A6B0CC"; // muted body text
const FAINT = "#697493"; // faint meta text
const HAIRLINE = "rgba(148,163,210,0.12)"; // thin divider / border
const HAIRLINE_HI = "rgba(148,163,210,0.24)";

// Aurora ribbon stops — teal-green, blue, violet
const TEAL = "#2DD4BF";
const GREEN = "#34D399";
const BLUE = "#3B82F6";
const INDIGO = "#6366F1";
const VIOLET = "#A78BFA";

const PANEL_SHADOW =
  "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 60px -28px rgba(0,0,0,0.8)";
const GLOW_SHADOW =
  "0 1px 0 rgba(255,255,255,0.05) inset, 0 30px 70px -26px rgba(99,102,241,0.5)";

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients & Individuals" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    body: "We start with the outcome you actually need, audit what exists, and scope the highest-value work first.",
    tint: TEAL,
  },
  {
    icon: PencilRuler,
    title: "Design",
    body: "Architecture, UX flows, and a clear plan — so everyone sees the shape of the solution before a line ships.",
    tint: BLUE,
  },
  {
    icon: Hammer,
    title: "Build",
    body: "Tight loops, working software early, tests and infrastructure-as-code. Progress you can use, not slideware.",
    tint: INDIGO,
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    body: "Zero-downtime delivery, monitoring, runbooks, and handover — built so your team can own and extend it.",
    tint: VIOLET,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly 40% and migrated us with zero downtime. The runbooks they left mean we're not dependent on them — that's rare.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
    tint: TEAL,
  },
  {
    quote:
      "We walked into our investor meeting with a clickable prototype instead of slides. IFLEON turned a vague idea into something people could feel.",
    name: "Founder",
    org: "Early-stage startup · Global",
    tint: VIOLET,
  },
  {
    quote:
      "Our support team deflects 40%+ of tickets with the AI assistant they built on our own docs. It does real work, not demo theatre.",
    name: "Head of Support",
    org: "E-commerce · APAC",
    tint: BLUE,
  },
];

const GROUPS: {
  key: string;
  label: string;
  blurb: string;
  icon: typeof Building2;
  tint: string;
  services: Service[];
}[] = [
  {
    key: "business",
    label: "For Business",
    blurb: "Ship, secure, and scale the systems your company runs on.",
    icon: Building2,
    tint: BLUE,
    services: businessServices,
  },
  {
    key: "individual",
    label: "For Individuals",
    blurb: "Practical, friendly help for your devices, safety, and career.",
    icon: User,
    tint: TEAL,
    services: individualServices,
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    blurb: "Focused engagements that slot into work already underway.",
    icon: Layers,
    tint: VIOLET,
    services: specialtyServices,
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function AuroraNoirHome() {
  const reduce = useReducedMotion();
  const inView = { once: true, amount: 0.2 } as const;

  /* slow mirrored drift for the aurora ribbons (gated by reduced-motion) */
  const ribbonTransition = (duration: number): Transition =>
    reduce
      ? { duration: 0 }
      : { duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" };

  const fade: Variants = useMemo(
    () =>
      reduce
        ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: 22 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          },
    [reduce],
  );

  const stagger: Variants = useMemo(
    () => ({
      hidden: {},
      show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
    }),
    [reduce],
  );

  return (
    <div
      className="min-h-screen w-full overflow-x-clip font-sans antialiased"
      style={{ background: VOID, color: INK }}
    >
      {/* keyframes for the aurora shimmer + slow star twinkle */}
      <style>{`
        @keyframes aurora-sheen { to { transform: rotate(360deg); } }
        @keyframes aurora-twinkle { 0%,100% { opacity: 0.25; } 50% { opacity: 0.9; } }
        @media (prefers-reduced-motion: reduce) {
          .aurora-anim { animation: none !important; }
        }
      `}</style>

      {/* ============================================================ */}
      {/* HERO — aurora ribbons drifting over a deep night sky          */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden px-5 pt-28 pb-20 sm:px-8 md:px-10 md:pt-32 md:pb-28">
        {/* --- aurora field --- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {/* deep vertical wash, lighter at the very top where the lights live */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #0A1124 0%, ${NIGHT} 48%, ${VOID} 100%)`,
            }}
          />

          {/* faint star dust */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.7), transparent)," +
                "radial-gradient(1px 1px at 28% 8%, rgba(255,255,255,0.5), transparent)," +
                "radial-gradient(1px 1px at 47% 22%, rgba(255,255,255,0.6), transparent)," +
                "radial-gradient(1px 1px at 63% 12%, rgba(255,255,255,0.45), transparent)," +
                "radial-gradient(1px 1px at 78% 25%, rgba(255,255,255,0.6), transparent)," +
                "radial-gradient(1px 1px at 90% 9%, rgba(255,255,255,0.5), transparent)," +
                "radial-gradient(1px 1px at 6% 34%, rgba(255,255,255,0.4), transparent)",
            }}
          />

          {/* AURORA RIBBONS — large soft blurred curtains drifting slowly.
              Each is a wide, tall radial/linear band, heavily blurred, with
              screen-like blending so overlaps brighten into northern-lights. */}
          <div className="absolute inset-x-0 top-0 h-[78vh]" style={{ mixBlendMode: "screen" }}>
            {/* teal-green curtain */}
            <motion.div
              className="absolute blur-[60px]"
              style={{
                top: "-22%",
                left: "-15%",
                width: "75vw",
                height: "70vh",
                background: `radial-gradient(60% 50% at 50% 40%, ${TEAL}, ${GREEN}66 38%, transparent 70%)`,
                opacity: 0.55,
                transform: "rotate(-12deg)",
              }}
              animate={reduce ? undefined : { x: [0, 90, -30, 0], y: [0, 26, -14, 0], opacity: [0.45, 0.62, 0.5, 0.45] }}
              transition={ribbonTransition(26)}
            />
            {/* blue curtain */}
            <motion.div
              className="absolute blur-[64px]"
              style={{
                top: "-26%",
                left: "18%",
                width: "70vw",
                height: "78vh",
                background: `radial-gradient(55% 55% at 50% 40%, ${BLUE}, ${INDIGO}66 40%, transparent 72%)`,
                opacity: 0.5,
                transform: "rotate(9deg)",
              }}
              animate={reduce ? undefined : { x: [0, -70, 40, 0], y: [0, 34, -18, 0], opacity: [0.4, 0.58, 0.46, 0.4] }}
              transition={ribbonTransition(31)}
            />
            {/* violet curtain */}
            <motion.div
              className="absolute blur-[58px]"
              style={{
                top: "-20%",
                right: "-12%",
                width: "66vw",
                height: "68vh",
                background: `radial-gradient(58% 50% at 50% 38%, ${VIOLET}, ${INDIGO}55 42%, transparent 72%)`,
                opacity: 0.48,
                transform: "rotate(-7deg)",
              }}
              animate={reduce ? undefined : { x: [0, 60, -40, 0], y: [0, 22, -10, 0], opacity: [0.4, 0.55, 0.44, 0.4] }}
              transition={ribbonTransition(28)}
            />
            {/* thin bright filament for the curtain "edge" shimmer */}
            <motion.div
              className="absolute blur-[26px]"
              style={{
                top: "2%",
                left: "30%",
                width: "44vw",
                height: "40vh",
                background: `linear-gradient(110deg, transparent, ${TEAL}cc 45%, ${VIOLET}99 70%, transparent)`,
                opacity: 0.4,
                transform: "rotate(-16deg) skewX(-10deg)",
              }}
              animate={reduce ? undefined : { x: [0, 50, -30, 0], opacity: [0.3, 0.5, 0.34, 0.3] }}
              transition={ribbonTransition(22)}
            />
          </div>

          {/* fade the aurora into the canvas lower down for legible content */}
          <div
            className="absolute inset-x-0 top-[42vh] h-[40vh]"
            style={{ background: `linear-gradient(180deg, transparent, ${VOID})` }}
          />
        </div>

        <div className="mx-auto max-w-6xl text-center">
          {/* eyebrow pill */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md"
            style={{
              borderColor: HAIRLINE_HI,
              background: "rgba(12,17,32,0.55)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: TEAL }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: SUB }}>
              Founder-led · AI · DevOps · Cloud · Security
            </span>
          </motion.div>

          {/* headline built around the tagline */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-7 max-w-4xl font-display font-black leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: "clamp(2.6rem, 7.5vw, 5.5rem)" }}
          >
            Infinite{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(100deg, ${TEAL}, ${BLUE} 40%, ${VIOLET} 78%)`,
              }}
            >
              Possibilities,
            </span>
            <br className="hidden sm:block" /> Logical Solutions.
          </motion.h1>

          {/* subhead */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{ color: SUB }}
          >
            IFLEON turns ambitious ideas into shipped, secure, and maintainable
            systems — for businesses and individuals alike. Based in Nellore,
            India, working with clients worldwide.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
              style={{
                color: VOID,
                backgroundImage: `linear-gradient(100deg, ${TEAL}, ${BLUE} 52%, ${VIOLET})`,
                boxShadow: "0 14px 36px -12px rgba(45,212,191,0.55)",
              }}
            >
              Request a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/services"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
              style={{ borderColor: HAIRLINE_HI, color: INK, background: "rgba(12,17,32,0.5)" }}
            >
              Explore Services
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* compliance row */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: FAINT }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
              Compliant by default
            </span>
            {COMPLIANCE.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full" style={{ background: FAINT }} />
                {c}
              </span>
            ))}
          </motion.div>
        </div>

        {/* glass metric cards floating over the night */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              variants={fade}
              className="rounded-2xl border p-5 text-left backdrop-blur-md sm:p-6"
              style={{
                borderColor: HAIRLINE,
                background: "rgba(12,17,32,0.6)",
                boxShadow: PANEL_SHADOW,
              }}
            >
              <div
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  backgroundImage: `linear-gradient(120deg, ${TEAL}, ${VIOLET})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {s.value}
              </div>
              <div className="mt-2 text-sm font-medium" style={{ color: SUB }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES SHOWCASE — all 16, grouped                           */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24" style={{ background: NIGHT }}>
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="What we build"
            eyebrowTint={TEAL}
            title="Sixteen services, one team to ship them."
            sub="Grouped for businesses, individuals, and focused specialty work — every engagement scoped around the outcome you need."
          />

          <div className="mt-14 space-y-16">
            {GROUPS.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div key={group.key}>
                  {/* group header */}
                  <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: HAIRLINE }}>
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        color: VOID,
                        backgroundImage: `linear-gradient(135deg, ${group.tint}, ${VIOLET})`,
                        boxShadow: `0 10px 24px -10px ${group.tint}99`,
                      }}
                    >
                      <GroupIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl" style={{ color: INK }}>
                        {group.label}
                      </h3>
                      <p className="text-sm" style={{ color: SUB }}>
                        {group.blurb}
                      </p>
                    </div>
                  </div>

                  {/* cards */}
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {group.services.map((svc) => {
                      const Icon = svc.icon;
                      return (
                        <motion.div key={svc.id} variants={fade}>
                          <Link
                            to="/services"
                            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
                            style={{
                              borderColor: HAIRLINE,
                              background: PANEL,
                              boxShadow: PANEL_SHADOW,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = PANEL_HI;
                              e.currentTarget.style.borderColor = `${group.tint}55`;
                              e.currentTarget.style.boxShadow = GLOW_SHADOW;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = PANEL;
                              e.currentTarget.style.borderColor = HAIRLINE;
                              e.currentTarget.style.boxShadow = PANEL_SHADOW;
                            }}
                          >
                            {/* faint top aurora line on the card */}
                            <span
                              aria-hidden="true"
                              className="absolute inset-x-0 top-0 h-px"
                              style={{
                                background: `linear-gradient(90deg, transparent, ${group.tint}88, transparent)`,
                              }}
                            />
                            <span
                              className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                              style={{
                                color: group.tint,
                                background: `${group.tint}1f`,
                                border: `1px solid ${group.tint}33`,
                              }}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <h4 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight" style={{ color: INK }}>
                              {svc.title}
                            </h4>
                            <p
                              className="mt-1 text-sm font-medium"
                              style={{ color: group.tint }}
                            >
                              {svc.tagline}
                            </p>
                            <p
                              className="mt-3 flex-1 text-sm leading-relaxed"
                              style={{ color: SUB }}
                            >
                              {svc.description}
                            </p>
                            <span
                              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold"
                              style={{ color: INK }}
                            >
                              Learn more
                              <ArrowRight className="h-4 w-4 -translate-x-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* METRICS BANNER — aurora-lit panel with slow sheen             */}
      {/* ============================================================ */}
      <section className="px-5 py-4 sm:px-8 md:px-10" style={{ background: NIGHT }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border px-6 py-14 text-center sm:px-10 md:py-20"
          style={{
            borderColor: HAIRLINE_HI,
            background: `radial-gradient(120% 100% at 50% -10%, ${INDIGO}33, transparent 60%), ${PANEL}`,
            boxShadow: PANEL_SHADOW,
          }}
        >
          {/* slow rotating aurora sheen */}
          <div
            aria-hidden="true"
            className="aurora-anim pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 opacity-30"
            style={{
              background:
                `conic-gradient(from 0deg, transparent, ${TEAL}44, transparent 22%, ${VIOLET}44 40%, transparent 60%)`,
              mixBlendMode: "screen",
              animation: reduce ? undefined : "aurora-sheen 24s linear infinite",
            }}
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.24em]" style={{ color: SUB }}>
              By the numbers
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-black leading-none"
                    style={{
                      fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                      backgroundImage: `linear-gradient(120deg, ${TEAL}, ${BLUE} 55%, ${VIOLET})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm font-medium" style={{ color: SUB }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: SUB }}>
              Across 6 industries, for B2B teams and individuals — delivered with
              ISO 27001, DPDP, and SOC 2 thinking baked in from line one.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW WE WORK — 4 steps                                         */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24" style={{ background: VOID }}>
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="How we work"
            eyebrowTint={VIOLET}
            title="A clear path from idea to shipped."
            sub="Four steps that keep the work honest and your project moving — no tech for tech's sake."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  variants={fade}
                  className="relative flex flex-col overflow-hidden rounded-2xl border p-6"
                  style={{ borderColor: HAIRLINE, background: PANEL, boxShadow: PANEL_SHADOW }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${step.tint}88, transparent)` }}
                  />
                  <span
                    className="font-mono text-xs font-bold tracking-[0.2em]"
                    style={{ color: step.tint }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      color: step.tint,
                      background: `${step.tint}1f`,
                      border: `1px solid ${step.tint}33`,
                    }}
                  >
                    <StepIcon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight" style={{ color: INK }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: SUB }}>
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS                                                  */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24" style={{ background: NIGHT }}>
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="In their words"
            eyebrowTint={TEAL}
            title="Outcomes clients can point to."
            sub="A few of the results teams and founders have shared after working with us."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3"
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={i}
                variants={fade}
                className="flex h-full flex-col rounded-2xl border p-7"
                style={{ borderColor: HAIRLINE, background: PANEL, boxShadow: PANEL_SHADOW }}
              >
                <div className="flex items-center justify-between">
                  <Quote className="h-7 w-7" style={{ color: t.tint }} aria-hidden="true" />
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-3.5 w-3.5" style={{ color: t.tint, fill: t.tint }} />
                    ))}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed" style={{ color: INK }}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t pt-4 font-mono text-xs uppercase tracking-wider" style={{ borderColor: HAIRLINE }}>
                  <span className="block font-bold" style={{ color: INK }}>
                    {t.name}
                  </span>
                  <span style={{ color: FAINT }}>{t.org}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CLOSING CTA                                                   */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24" style={{ background: VOID }}>
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border px-6 py-16 text-center sm:px-10 md:py-20"
          style={{ borderColor: HAIRLINE_HI, background: PANEL, boxShadow: PANEL_SHADOW }}
        >
          {/* soft aurora halo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                `radial-gradient(60% 90% at 50% -10%, ${VIOLET}33, transparent 70%),` +
                `radial-gradient(50% 80% at 88% 120%, ${TEAL}26, transparent 70%),` +
                `radial-gradient(50% 80% at 12% 120%, ${BLUE}26, transparent 70%)`,
              mixBlendMode: "screen",
            }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-3xl font-display font-black leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: INK }}
            >
              Got a problem{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(100deg, ${TEAL}, ${BLUE} 45%, ${VIOLET})` }}
              >
                worth solving?
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed" style={{ color: SUB }}>
              Tell us what you're trying to ship, secure, or scale. One email
              starts the conversation — businesses and individuals both welcome.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{
                  color: VOID,
                  backgroundImage: `linear-gradient(100deg, ${TEAL}, ${BLUE} 52%, ${VIOLET})`,
                  boxShadow: "0 14px 36px -12px rgba(45,212,191,0.55)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{ borderColor: HAIRLINE_HI, color: INK, background: "rgba(12,17,32,0.5)" }}
              >
                Explore Services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{ borderColor: HAIRLINE_HI, color: INK, background: "rgba(12,17,32,0.5)" }}
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
              </a>
            </div>

            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: FAINT }}>
              IFLEON © {new Date().getFullYear()} · Nellore · India → Global ·
              Infinite Possibilities, Logical Solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared section header                                              */
/* ------------------------------------------------------------------ */
function SectionHead({
  eyebrow,
  eyebrowTint,
  title,
  sub,
}: {
  eyebrow: string;
  eyebrowTint: string;
  title: string;
  sub: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <p
        className="font-mono text-xs font-semibold uppercase tracking-[0.2em]"
        style={{ color: eyebrowTint }}
      >
        {eyebrow}
      </p>
      <h2
        className="mt-3 font-display font-black leading-[1.02] tracking-[-0.02em]"
        style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: INK }}
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: SUB }}>
        {sub}
      </p>
    </motion.div>
  );
}
