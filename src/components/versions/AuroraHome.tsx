/* V8 — Aurora.
   Animated mesh-gradient hero in the Stripe / Linear lineage: a large, soft,
   slowly-drifting multi-color gradient (blue → violet → pink → teal) behind
   clean white content, with crisp floating white cards over soft shadows.
   Bright, premium, colorful-but-clean. Self-contained, LIGHT chrome. No WebGL. */

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
/* Palette — forced light "Aurora" chrome                             */
/* ------------------------------------------------------------------ */
const INK = "#0B1020"; // near-black navy text
const SUB = "#475069"; // muted slate body text
const FAINT = "#8A93AC"; // faint meta text
const CANVAS = "#FBFBFE"; // off-white page canvas
const HAIRLINE = "rgba(15,23,42,0.08)"; // subtle card border

// Aurora gradient stops
const BLUE = "#3B82F6";
const INDIGO = "#6366F1";
const VIOLET = "#8B5CF6";
const PINK = "#EC4899";
const TEAL = "#14B8A6";

const SOFT_SHADOW =
  "0 1px 2px rgba(15,23,42,0.04), 0 12px 32px -12px rgba(15,23,42,0.18)";
const HOVER_SHADOW =
  "0 2px 4px rgba(15,23,42,0.05), 0 28px 56px -20px rgba(99,102,241,0.42)";

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
    tint: BLUE,
  },
  {
    icon: PencilRuler,
    title: "Design",
    body: "Architecture, UX flows, and a clear plan — so everyone sees the shape of the solution before a line ships.",
    tint: INDIGO,
  },
  {
    icon: Hammer,
    title: "Build",
    body: "Tight loops, working software early, tests and infrastructure-as-code. Progress you can use, not slideware.",
    tint: VIOLET,
  },
  {
    icon: Rocket,
    title: "Launch & Support",
    body: "Zero-downtime delivery, monitoring, runbooks, and handover — built so your team can own and extend it.",
    tint: TEAL,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They cut our cloud bill by nearly 40% and migrated us with zero downtime. The runbooks they left mean we're not dependent on them — that's rare.",
    name: "Operations Lead",
    org: "Mid-market SaaS · India",
    tint: BLUE,
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
    tint: TEAL,
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
    tint: PINK,
    services: individualServices,
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    blurb: "Focused engagements that slot into work already underway.",
    icon: Layers,
    tint: TEAL,
    services: specialtyServices,
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function AuroraHome() {
  const reduce = useReducedMotion();
  const inView = { once: true, amount: 0.2 } as const;

  /* drift transition for the gradient blobs (gated by reduced-motion) */
  const blobTransition = (duration: number): Transition =>
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
      style={{ background: CANVAS, color: INK }}
    >
      {/* keyframes for the conic sheen + subtle float */}
      <style>{`
        @keyframes aurora-spin { to { transform: rotate(360deg); } }
        @keyframes aurora-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @media (prefers-reduced-motion: reduce) {
          .aurora-anim { animation: none !important; }
        }
      `}</style>

      {/* ============================================================ */}
      {/* HERO — animated mesh gradient behind white content            */}
      {/* ============================================================ */}
      <section className="relative isolate overflow-hidden px-5 pt-28 pb-20 sm:px-8 md:px-10 md:pt-32 md:pb-28">
        {/* --- animated gradient field --- */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          {/* base wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #F4F6FF 0%, #FBFBFE 55%, #FBFBFE 100%)",
            }}
          />
          {/* drifting blobs */}
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              top: "-18%",
              left: "-10%",
              width: "60vw",
              height: "60vw",
              maxWidth: 820,
              maxHeight: 820,
              background: `radial-gradient(circle at 30% 30%, ${BLUE}, transparent 62%)`,
              opacity: 0.55,
            }}
            animate={reduce ? undefined : { x: [0, 70, -20, 0], y: [0, 50, 20, 0] }}
            transition={blobTransition(22)}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              top: "-12%",
              right: "-12%",
              width: "55vw",
              height: "55vw",
              maxWidth: 760,
              maxHeight: 760,
              background: `radial-gradient(circle at 60% 40%, ${VIOLET}, transparent 62%)`,
              opacity: 0.5,
            }}
            animate={reduce ? undefined : { x: [0, -60, 25, 0], y: [0, 40, -25, 0] }}
            transition={blobTransition(26)}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              top: "12%",
              right: "8%",
              width: "42vw",
              height: "42vw",
              maxWidth: 560,
              maxHeight: 560,
              background: `radial-gradient(circle at 50% 50%, ${PINK}, transparent 64%)`,
              opacity: 0.42,
            }}
            animate={reduce ? undefined : { x: [0, 40, -30, 0], y: [0, -30, 30, 0] }}
            transition={blobTransition(30)}
          />
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              bottom: "-22%",
              left: "20%",
              width: "50vw",
              height: "50vw",
              maxWidth: 680,
              maxHeight: 680,
              background: `radial-gradient(circle at 40% 60%, ${TEAL}, transparent 64%)`,
              opacity: 0.45,
            }}
            animate={reduce ? undefined : { x: [0, -50, 30, 0], y: [0, 30, -20, 0] }}
            transition={blobTransition(28)}
          />
          {/* fine grain / fade to canvas at the bottom for clean content */}
          <div
            className="absolute inset-x-0 bottom-0 h-48"
            style={{
              background: `linear-gradient(180deg, transparent, ${CANVAS})`,
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl text-center">
          {/* eyebrow pill */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border bg-white/70 px-4 py-1.5 backdrop-blur-md"
            style={{ borderColor: HAIRLINE, boxShadow: SOFT_SHADOW }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: VIOLET }} />
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
                backgroundImage: `linear-gradient(100deg, ${BLUE}, ${VIOLET} 42%, ${PINK} 72%, ${TEAL})`,
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
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
              style={{
                backgroundImage: `linear-gradient(100deg, ${BLUE}, ${INDIGO} 50%, ${VIOLET})`,
                boxShadow: "0 12px 30px -10px rgba(99,102,241,0.6)",
              }}
            >
              Request a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/services"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
              style={{ borderColor: HAIRLINE, color: INK, boxShadow: SOFT_SHADOW }}
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

        {/* floating metric cards over the gradient */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-5"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fade}
              className="aurora-anim rounded-2xl border bg-white p-5 text-left sm:p-6"
              style={{
                borderColor: HAIRLINE,
                boxShadow: SOFT_SHADOW,
                animation: reduce
                  ? undefined
                  : `aurora-float ${6 + i}s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              <div
                className="font-display font-black leading-none"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
                  backgroundImage: `linear-gradient(120deg, ${BLUE}, ${VIOLET})`,
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
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="What we build"
            eyebrowTint={INDIGO}
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
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${group.tint}, ${INDIGO})`,
                        boxShadow: SOFT_SHADOW,
                      }}
                    >
                      <GroupIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
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
                            className="group flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1"
                            style={{ borderColor: HAIRLINE, boxShadow: SOFT_SHADOW }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.boxShadow = HOVER_SHADOW)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.boxShadow = SOFT_SHADOW)
                            }
                          >
                            <span
                              className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                              style={{
                                color: group.tint,
                                background: `${group.tint}14`,
                              }}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <h4 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight">
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
      {/* METRICS BANNER — gradient card with conic sheen               */}
      {/* ============================================================ */}
      <section className="px-5 sm:px-8 md:px-10">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-10 md:py-20"
          style={{
            backgroundImage: `linear-gradient(120deg, ${BLUE}, ${INDIGO} 38%, ${VIOLET} 66%, ${PINK})`,
            boxShadow: "0 30px 70px -28px rgba(99,102,241,0.6)",
          }}
        >
          {/* rotating conic sheen */}
          <div
            aria-hidden="true"
            className="aurora-anim pointer-events-none absolute left-1/2 top-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-25"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,255,255,0.6), transparent 30%)",
              animation: reduce ? undefined : "aurora-spin 18s linear infinite",
            }}
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-white/80">
              By the numbers
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-black leading-none text-white"
                    style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)" }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-2 text-sm font-medium text-white/85">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              Across 6 industries, for B2B teams and individuals — delivered with
              ISO 27001, DPDP, and SOC 2 thinking baked in from line one.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW WE WORK — 4 steps                                         */}
      {/* ============================================================ */}
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="How we work"
            eyebrowTint={TEAL}
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
                  className="relative flex flex-col rounded-2xl border bg-white p-6"
                  style={{ borderColor: HAIRLINE, boxShadow: SOFT_SHADOW }}
                >
                  <span
                    className="font-mono text-xs font-bold tracking-[0.2em]"
                    style={{ color: step.tint }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="mt-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ color: step.tint, background: `${step.tint}14` }}
                  >
                    <StepIcon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
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
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24" style={{ background: "#F6F7FD" }}>
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="In their words"
            eyebrowTint={PINK}
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
                className="flex h-full flex-col rounded-2xl border bg-white p-7"
                style={{ borderColor: HAIRLINE, boxShadow: SOFT_SHADOW }}
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
      <section className="px-5 py-16 sm:px-8 md:px-10 md:py-24">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-white px-6 py-16 text-center sm:px-10 md:py-20"
          style={{ borderColor: HAIRLINE, boxShadow: SOFT_SHADOW }}
        >
          {/* soft gradient halo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                `radial-gradient(60% 80% at 50% -10%, ${VIOLET}1f, transparent 70%),` +
                `radial-gradient(50% 70% at 90% 120%, ${TEAL}1f, transparent 70%),` +
                `radial-gradient(50% 70% at 10% 120%, ${BLUE}1f, transparent 70%)`,
            }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-3xl font-display font-black leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
            >
              Got a problem{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(100deg, ${BLUE}, ${VIOLET}, ${PINK})` }}
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
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{
                  backgroundImage: `linear-gradient(100deg, ${BLUE}, ${INDIGO} 50%, ${VIOLET})`,
                  boxShadow: "0 12px 30px -10px rgba(99,102,241,0.6)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{ borderColor: HAIRLINE, color: INK, boxShadow: SOFT_SHADOW }}
              >
                Explore Services
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border bg-white px-7 py-3.5 font-semibold transition-all duration-200 hover:-translate-y-0.5 sm:w-auto"
                style={{ borderColor: HAIRLINE, color: INK, boxShadow: SOFT_SHADOW }}
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
