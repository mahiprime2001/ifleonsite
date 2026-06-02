/* V19 — "ISO" light isometric homepage for IFLEON.
   Playful tech-illustration aesthetic built around the existing isometric
   artwork in ../illustrations/*. Light airy canvas, blue/teal, soft shadows,
   floating iso cards on a subtle iso-grid background. Friendly, modern,
   technical.

   Self-contained. The app forces a LIGHT chrome for this version.
   Motion is calm (whileInView reveals + gentle float) and gated behind
   useReducedMotion. No WebGL / three.js — only CSS / SVG / gradients /
   framer-motion + lucide icons + the iso illustration components. */

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
  ShieldCheck,
  Compass,
  Hammer,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";
import { IsoEcosystem } from "../illustrations/IsoEcosystem";
import { IsoCloud } from "../illustrations/IsoCloud";
import { IsoAI } from "../illustrations/IsoAI";
import { IsoSecurity } from "../illustrations/IsoSecurity";
import { IsoTeam } from "../illustrations/IsoTeam";
import { IsoMail } from "../illustrations/IsoMail";
import { IsoDeveloper } from "../illustrations/IsoDeveloper";
import { IsoCollab3D } from "../illustrations/IsoCollab3D";
import { IsoDashboard } from "../illustrations/IsoDashboard";
import { IsoWorkstation3D } from "../illustrations/IsoWorkstation3D";
import { IsoProcess } from "../illustrations/IsoProcess";
import { IsoIcon } from "../illustrations/IsoIcon";

/* ------------------------------------------------------------------ */
/* Palette — light airy iso canvas                                    */
/* ------------------------------------------------------------------ */
const CANVAS = "#EEF4FF"; // pale blue page canvas
const CANVAS_2 = "#F7FAFF"; // lighter wash
const CARD = "#FFFFFF"; // iso card surface
const BORDER = "rgba(37,99,235,0.14)"; // soft blue border
const BORDER_HI = "rgba(37,99,235,0.42)"; // hover border
const INK = "#0F2547"; // deep navy text
const MUTED = "#5A6B8C"; // muted slate text
const BLUE = "#2563EB"; // electric blue accent
const TEAL = "#0EA5A5"; // teal accent
const GRID = "rgba(37,99,235,0.07)"; // iso-grid line

const MAIL = "mailto:info@ifleon.com";
const GH = "https://github.com/ifleonlabs";

/* IsoIcon variant per service category for accent artwork on cards */
type IsoVariant = "ai" | "devops" | "cloud" | "security" | "consulting" | "data";
const ICON_FOR: Record<string, IsoVariant> = {
  "ai-solutions": "ai",
  devops: "devops",
  "cloud-migration": "cloud",
  cybersecurity: "security",
  "custom-development": "consulting",
  "digital-transformation": "data",
  "tech-support": "consulting",
  "personal-security": "security",
  "smart-home": "cloud",
  "career-guidance": "consulting",
  "mobile-apps": "devops",
  "ui-ux": "ai",
  "data-engineering": "data",
  "seo-performance": "cloud",
  automation: "devops",
  "ai-agents": "ai",
};

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

const HOW_WE_WORK: {
  step: 1 | 2 | 3 | 4;
  icon: LucideIcon;
  title: string;
  body: string;
}[] = [
  {
    step: 1,
    icon: Compass,
    title: "Scope the outcome",
    body: "We start from the business result you want, then reverse-engineer the right stack — no tech for tech's sake.",
  },
  {
    step: 2,
    icon: Hammer,
    title: "Build in the open",
    body: "Short cycles, working software you can see early, and clean code pushed to a repo you actually own.",
  },
  {
    step: 3,
    icon: Rocket,
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives contact with real users.",
  },
  {
    step: 4,
    icon: LifeBuoy,
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays in control long after launch.",
  },
];

const QUOTES = [
  {
    quote:
      "IFLEON migrated us to AWS and cut our infra bill by nearly 40%. The handover was so clean our team owns it completely now.",
    name: "Priya R.",
    role: "CTO · B2B SaaS",
  },
  {
    quote:
      "Their AI support copilot answers from our own docs and deflects almost half our tickets. Felt like a real engineering partner, not a vendor.",
    name: "Daniel M.",
    role: "Head of Support · Fintech",
  },
  {
    quote:
      "I went from curious to a cloud role in six months. The roadmap and mock interviews made all the difference.",
    name: "Aarav S.",
    role: "Career Switcher",
  },
];

/* Hero floating iso cards — illustration + label, scattered on the grid */
const HERO_CARDS: {
  Illo: (p: { className?: string }) => JSX.Element;
  label: string;
  accent: string;
  className: string;
  delay: number;
}[] = [
  {
    Illo: IsoCloud,
    label: "Cloud & Migration",
    accent: BLUE,
    className: "absolute -left-2 top-2 w-40 sm:w-44",
    delay: 0,
  },
  {
    Illo: IsoSecurity,
    label: "Cybersecurity",
    accent: TEAL,
    className: "absolute right-0 top-0 w-36 sm:w-40",
    delay: 0.5,
  },
  {
    Illo: IsoAI,
    label: "AI & ML",
    accent: "#7C3AED",
    className: "absolute -left-4 bottom-2 w-36 sm:w-40",
    delay: 1,
  },
  {
    Illo: IsoDashboard,
    label: "Data & Analytics",
    accent: TEAL,
    className: "absolute right-2 bottom-4 w-40 sm:w-44",
    delay: 1.5,
  },
];

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const useMotionKit = () => {
  const reduce = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.08 } },
  };

  const float = (i = 0) =>
    reduce
      ? {}
      : {
          y: [0, -10, 0],
          transition: {
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: i * 0.4,
          },
        };

  return { reduce, fadeUp, stagger, float };
};

/* ================================================================== */
/* Small presentational pieces                                        */
/* ================================================================== */

const IsoGrid = () => (
  // Subtle isometric grid as a layered background — pure CSS gradients
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${GRID} 1px, transparent 1px), linear-gradient(90deg, ${GRID} 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        transform: "skewY(-12deg)",
        transformOrigin: "top left",
        maskImage:
          "radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(120% 90% at 50% 0%, #000 30%, transparent 80%)",
        opacity: 0.9,
      }}
    />
    {/* soft color blooms */}
    <div
      className="absolute -top-24 left-1/2 h-[460px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
      style={{ background: `radial-gradient(circle, rgba(37,99,235,0.16), transparent 70%)` }}
    />
    <div
      className="absolute top-1/3 -right-24 h-[360px] w-[360px] rounded-full blur-3xl"
      style={{ background: `radial-gradient(circle, rgba(14,165,165,0.14), transparent 70%)` }}
    />
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] font-mono"
    style={{
      background: CARD,
      color: BLUE,
      border: `1px solid ${BORDER}`,
      boxShadow: "0 6px 18px -10px rgba(37,99,235,0.5)",
    }}
  >
    <Sparkles className="h-3.5 w-3.5" />
    {children}
  </span>
);

const SectionHead = ({
  eyebrow,
  title,
  sub,
  fadeUp,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
  fadeUp: Variants;
}) => (
  <div className="mx-auto max-w-2xl text-center">
    <motion.div variants={fadeUp}>
      <Eyebrow>{eyebrow}</Eyebrow>
    </motion.div>
    <motion.h2
      variants={fadeUp}
      className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
      style={{ color: INK }}
    >
      {title}
    </motion.h2>
    {sub && (
      <motion.p
        variants={fadeUp}
        className="mt-3 text-base leading-relaxed"
        style={{ color: MUTED }}
      >
        {sub}
      </motion.p>
    )}
  </div>
);

/* Service card — floating iso tile */
const ServiceCard = ({
  service,
  fadeUp,
}: {
  service: Service;
  fadeUp: Variants;
}) => {
  const Icon = service.icon;
  const variant = ICON_FOR[service.id] ?? "consulting";
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative flex flex-col rounded-2xl p-5"
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        boxShadow:
          "0 20px 40px -28px rgba(15,37,71,0.35), 0 2px 0 0 rgba(255,255,255,0.6) inset",
      }}
    >
      <div
        className="absolute inset-x-0 -bottom-px h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${BORDER_HI}, transparent)`,
          opacity: 0,
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,165,0.12))",
            color: BLUE,
            border: `1px solid ${BORDER}`,
          }}
        >
          <Icon className="h-6 w-6" />
        </span>
        {/* iso accent artwork */}
        <IsoIcon
          variant={variant}
          className="h-12 w-12 shrink-0 opacity-90 transition-transform duration-300 group-hover:-translate-y-1"
        />
      </div>
      <h3
        className="mt-4 font-display text-[15px] font-bold leading-snug"
        style={{ color: INK }}
      >
        {service.title}
      </h3>
      <p className="mt-1.5 text-[13px] font-medium" style={{ color: BLUE }}>
        {service.tagline}
      </p>
      <p
        className="mt-2 text-[13px] leading-relaxed"
        style={{ color: MUTED }}
      >
        {service.description}
      </p>
      <Link
        to="/services"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
        style={{ color: TEAL }}
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
};

const ServiceGroup = ({
  label,
  blurb,
  items,
  fadeUp,
  stagger,
}: {
  label: string;
  blurb: string;
  items: Service[];
  fadeUp: Variants;
  stagger: Variants;
}) => (
  <div className="mt-12">
    <motion.div
      variants={fadeUp}
      className="mb-6 flex flex-col items-start gap-1 border-l-2 pl-4"
      style={{ borderColor: BLUE }}
    >
      <h3 className="font-display text-xl font-bold" style={{ color: INK }}>
        {label}
      </h3>
      <p className="text-sm" style={{ color: MUTED }}>
        {blurb}
      </p>
    </motion.div>
    <motion.div
      variants={stagger}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((s) => (
        <ServiceCard key={s.id} service={s} fadeUp={fadeUp} />
      ))}
    </motion.div>
  </div>
);

/* ================================================================== */
/* Page                                                               */
/* ================================================================== */
export default function IsoHome() {
  const { fadeUp, stagger, float } = useMotionKit();

  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${CANVAS_2} 0%, ${CANVAS} 38%, ${CANVAS_2} 100%)`,
        color: INK,
      }}
    >
      <IsoGrid />

      <main className="relative">
        {/* ============================ HERO ============================ */}
        <section className="relative px-6 pt-28 md:pt-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 pb-16 lg:grid-cols-[1.05fr_1fr]">
            {/* copy */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
              className="relative z-10"
            >
              <motion.div variants={fadeUp}>
                <Eyebrow>Founder-led · Nellore, India · since 2022</Eyebrow>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                style={{ color: INK }}
              >
                Infinite Possibilities,{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(120deg, ${BLUE}, ${TEAL})`,
                  }}
                >
                  Logical Solutions
                </span>
                .
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ color: MUTED }}
              >
                IFLEON is a founder-led AI, DevOps, Cloud, and Cybersecurity
                consultancy. We help businesses and individuals across India and
                the globe build, secure, and scale technology that actually
                ships.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href={MAIL}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(120deg, ${BLUE}, ${TEAL})`,
                    boxShadow: "0 18px 30px -14px rgba(37,99,235,0.7)",
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Request a Free Consultation
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                  style={{
                    background: CARD,
                    color: INK,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap items-center gap-2"
              >
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-mono"
                    style={{
                      background: CARD,
                      color: MUTED,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                    {c}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* hero iso scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-square w-full max-w-[460px]"
            >
              {/* centerpiece — connected ecosystem */}
              <motion.div animate={float(0)} className="relative z-10">
                <div
                  className="rounded-3xl p-2"
                  style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    boxShadow:
                      "0 40px 70px -40px rgba(15,37,71,0.5), 0 2px 0 0 rgba(255,255,255,0.7) inset",
                  }}
                >
                  <IsoEcosystem className="h-full w-full rounded-2xl" />
                </div>
              </motion.div>

              {/* scattered floating iso cards */}
              {HERO_CARDS.map(({ Illo, label, accent, className, delay }) => (
                <motion.div
                  key={label}
                  className={`${className} z-20`}
                  animate={float(delay * 2)}
                >
                  <div
                    className="rounded-2xl p-2"
                    style={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      boxShadow:
                        "0 24px 40px -26px rgba(15,37,71,0.45), 0 1px 0 0 rgba(255,255,255,0.7) inset",
                    }}
                  >
                    <Illo className="h-auto w-full rounded-xl" />
                    <p
                      className="mt-1 px-1 pb-0.5 text-center text-[10px] font-bold uppercase tracking-wider font-mono"
                      style={{ color: accent }}
                    >
                      {label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ========================== METRICS ========================== */}
        <section className="relative px-6 py-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto grid max-w-5xl grid-cols-2 gap-4 rounded-2xl p-6 sm:grid-cols-4"
            style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 24px 50px -36px rgba(15,37,71,0.4)",
            }}
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center"
              >
                <div
                  className="font-display text-3xl font-extrabold sm:text-4xl"
                  style={{
                    backgroundImage: `linear-gradient(120deg, ${BLUE}, ${TEAL})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-1 text-xs font-medium uppercase tracking-wide"
                  style={{ color: MUTED }}
                >
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ========================== SERVICES ========================= */}
        <section className="relative px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto max-w-6xl"
          >
            <SectionHead
              eyebrow="What we do"
              title={
                <>
                  Sixteen services, one{" "}
                  <span style={{ color: BLUE }}>logical</span> partner
                </>
              }
              sub="From enterprise platforms to a student's first cloud certification — grouped for businesses, individuals, and specialty needs."
              fadeUp={fadeUp}
            />

            <ServiceGroup
              label="For Business"
              blurb="Platforms, infrastructure, and security that scale with you."
              items={businessServices}
              fadeUp={fadeUp}
              stagger={stagger}
            />
            <ServiceGroup
              label="For Individuals"
              blurb="Personal tech, safety, and career support — minus the jargon."
              items={individualServices}
              fadeUp={fadeUp}
              stagger={stagger}
            />
            <ServiceGroup
              label="Specialty & Add-Ons"
              blurb="Focused builds that drop into an existing product or team."
              items={specialtyServices}
              fadeUp={fadeUp}
              stagger={stagger}
            />
          </motion.div>
        </section>

        {/* ========================= HOW WE WORK ======================= */}
        <section className="relative px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto max-w-6xl"
          >
            <SectionHead
              eyebrow="How we work"
              title="A clear, four-step path"
              sub="Predictable delivery you can follow — from first conversation to long-term support."
              fadeUp={fadeUp}
            />

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_WE_WORK.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    variants={fadeUp}
                    className="relative flex flex-col rounded-2xl p-5"
                    style={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      boxShadow: "0 22px 44px -32px rgba(15,37,71,0.4)",
                    }}
                  >
                    <span
                      className="absolute right-4 top-4 font-display text-4xl font-black leading-none"
                      style={{ color: "rgba(37,99,235,0.12)" }}
                    >
                      0{s.step}
                    </span>
                    <IsoProcess
                      step={s.step}
                      className="h-28 w-full rounded-xl"
                    />
                    <div className="mt-4 flex items-center gap-2">
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-lg"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(14,165,165,0.12))",
                          color: i % 2 ? TEAL : BLUE,
                          border: `1px solid ${BORDER}`,
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3
                        className="font-display text-base font-bold"
                        style={{ color: INK }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className="mt-2 text-[13px] leading-relaxed"
                      style={{ color: MUTED }}
                    >
                      {s.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ===================== TEAM / ECOSYSTEM BAND ================= */}
        <section className="relative px-6 py-10">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto grid max-w-6xl items-center gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2"
            style={{
              background: `linear-gradient(135deg, ${CARD}, ${CANVAS_2})`,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 60px -40px rgba(15,37,71,0.45)",
            }}
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>Built around you</Eyebrow>
              <h2
                className="mt-4 font-display text-2xl font-extrabold sm:text-3xl"
                style={{ color: INK }}
              >
                A connected team and toolchain, working as one
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: MUTED }}>
                Strategy, engineering, data, and security move in the same
                direction. We plug into your stack, ship in the open, and leave
                you with something your own team can run.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { Illo: IsoTeam, k: "Team" },
                  { Illo: IsoDeveloper, k: "Dev" },
                  { Illo: IsoCollab3D, k: "Collab" },
                  { Illo: IsoWorkstation3D, k: "Setup" },
                ].map(({ Illo, k }) => (
                  <div
                    key={k}
                    className="rounded-xl p-1.5"
                    style={{ background: CARD, border: `1px solid ${BORDER}` }}
                  >
                    <Illo className="h-auto w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="relative">
              <div
                className="rounded-2xl p-2"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                <IsoCollab3D className="h-auto w-full rounded-xl" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ======================== TESTIMONIALS ======================= */}
        <section className="relative px-6 py-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto max-w-6xl"
          >
            <SectionHead
              eyebrow="In their words"
              title="Outcomes our clients keep"
              fadeUp={fadeUp}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {QUOTES.map((q) => (
                <motion.figure
                  key={q.name}
                  variants={fadeUp}
                  className="flex flex-col rounded-2xl p-6"
                  style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 22px 44px -32px rgba(15,37,71,0.4)",
                  }}
                >
                  <Quote
                    className="h-7 w-7"
                    style={{ color: "rgba(37,99,235,0.4)" }}
                  />
                  <blockquote
                    className="mt-3 flex-1 text-[14px] leading-relaxed"
                    style={{ color: INK }}
                  >
                    "{q.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${BLUE}, ${TEAL})`,
                      }}
                    >
                      {q.name.charAt(0)}
                    </span>
                    <span>
                      <span
                        className="block text-sm font-semibold"
                        style={{ color: INK }}
                      >
                        {q.name}
                      </span>
                      <span className="block text-xs" style={{ color: MUTED }}>
                        {q.role}
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ========================= CLOSING CTA ======================= */}
        <section className="relative px-6 pb-24 pt-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            variants={stagger}
            className="mx-auto max-w-5xl overflow-hidden rounded-3xl p-8 sm:p-12"
            style={{
              background: `linear-gradient(135deg, ${INK} 0%, #14315E 100%)`,
              boxShadow: "0 40px 80px -44px rgba(15,37,71,0.7)",
            }}
          >
            <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <motion.h2
                  variants={fadeUp}
                  className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl"
                >
                  Let's turn your next idea into something that{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(120deg, #93C5FD, ${TEAL})`,
                    }}
                  >
                    actually ships
                  </span>
                  .
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-xl text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Tell us where you're stuck. A free consultation, a clear plan,
                  and code you own — for teams and individuals alike.
                </motion.p>
                <motion.div
                  variants={fadeUp}
                  className="mt-7 flex flex-wrap items-center gap-3"
                >
                  <a
                    href={MAIL}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(120deg, ${BLUE}, ${TEAL})`,
                      color: "#fff",
                      boxShadow: "0 18px 30px -14px rgba(37,99,235,0.8)",
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Request a Free Consultation
                  </a>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={GH}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <Github className="h-4 w-4" />
                    github.com/ifleonlabs
                  </a>
                </motion.div>
                <motion.p
                  variants={fadeUp}
                  className="mt-4 text-xs font-mono"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  info@ifleon.com · India + global · since 2022
                </motion.p>
              </div>

              <motion.div variants={fadeUp} animate={float(0.4)}>
                <div
                  className="rounded-2xl p-2"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <IsoMail className="h-auto w-full rounded-xl" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
