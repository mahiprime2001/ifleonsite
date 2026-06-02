/* V2 — Bento product-OS homepage for IFLEON.
   Dark neutral canvas, one electric-blue accent (+teal), crisp 1px borders,
   rounded panels, soft shadows, hover = border brightens + slight lift.
   Layout is a real CSS bento grid of varying-sized tiles.
   Self-contained. The app forces a DARK chrome for this version.
   Motion is calm (whileInView reveals + hover lift) and gated behind
   useReducedMotion. No WebGL / three.js. */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Sparkles,
  ShieldCheck,
  Activity,
  Terminal,
  Boxes,
  Layers,
  Quote,
  CircleDot,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — forced dark product-OS chrome                            */
/* ------------------------------------------------------------------ */
const CANVAS = "#0A0A0B"; // near-black page canvas
const PANEL = "#111317"; // tile surface
const PANEL_2 = "#0E1014"; // slightly deeper surface
const BORDER = "rgba(255,255,255,0.08)"; // crisp 1px border
const BORDER_HI = "rgba(59,130,246,0.45)"; // hover border (electric blue)
const HAIR = "rgba(255,255,255,0.06)"; // hairline / dividers
const INK = "#F4F5F7"; // primary text
const MUTED = "#8A8F98"; // muted text
const BLUE = "#3B82F6"; // electric blue accent
const TEAL = "#2DD4BF"; // occasional teal

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: 25, suffix: "", label: "Projects Delivered", hint: "shipped to production" },
  { value: 6, suffix: "", label: "Industries Served", hint: "SaaS · fintech · retail +" },
  { value: 50, suffix: "+", label: "Clients & Individuals", hint: "B2B and personal" },
  { value: 99.9, suffix: "%", label: "Uptime Maintained", hint: "security-first ops" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK = [
  {
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result, then reverse-engineer the right stack — no tech for tech's sake.",
  },
  {
    step: "02",
    title: "Build in the open",
    body: "Short cycles, working software you can see, and clean code pushed to a repo you own.",
  },
  {
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives contact with real users.",
  },
  {
    step: "04",
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays in control after launch.",
  },
];

const QUOTES = [
  {
    quote:
      "They migrated us to AWS without a minute of downtime and our infra bill dropped by a third. Felt less like a vendor, more like our own team.",
    name: "Operations Lead",
    role: "Logistics SaaS · Bengaluru",
  },
  {
    quote:
      "We needed ISO 27001 to close an enterprise deal. IFLEON got us audit-ready in weeks, not quarters.",
    name: "Founder",
    role: "Fintech startup · Hyderabad",
  },
  {
    quote:
      "Set up my entire home network, security, and smart devices in an afternoon. Everything just works now.",
    name: "Individual client",
    role: "Remote professional · Nellore",
  },
];

const STACK_TAGS = [
  "AWS",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Python",
  "React",
  "LangChain",
  "dbt",
];

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const useReveal = () => {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };
  return { reduce, variants };
};

/* Animated count-up for the headline metric. Calm, gated. */
function CountUp({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  const display =
    decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Primitive tile                                                     */
/* ------------------------------------------------------------------ */
type TileProps = {
  className?: string;
  children: React.ReactNode;
  surface?: string;
  hoverable?: boolean;
  delay?: number;
};

function Tile({
  className = "",
  children,
  surface = PANEL,
  hoverable = true,
  delay = 0,
}: TileProps) {
  const { reduce, variants } = useReveal();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay }}
      whileHover={
        hoverable && !reduce
          ? { y: -3, borderColor: BORDER_HI }
          : undefined
      }
      className={`group relative overflow-hidden rounded-3xl ${className}`}
      style={{
        background: surface,
        border: `1px solid ${BORDER}`,
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 48px -28px rgba(0,0,0,0.8)",
      }}
    >
      {/* subtle top inner highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}

/* Mono eyebrow label */
function Eyebrow({
  children,
  color = MUTED,
  icon: Icon,
}: {
  children: React.ReactNode;
  color?: string;
  icon?: LucideIcon;
}) {
  return (
    <div
      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]"
      style={{ color }}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : <CircleDot className="h-3 w-3" />}
      <span>{children}</span>
    </div>
  );
}

/* Small tag chip */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide"
      style={{
        color: MUTED,
        border: `1px solid ${HAIR}`,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {children}
    </span>
  );
}

/* Service mini-tile */
function ServiceTile({
  service,
  accent,
  delay = 0,
  large = false,
}: {
  service: Service;
  accent: string;
  delay?: number;
  large?: boolean;
}) {
  const Icon = service.icon;
  return (
    <Tile
      delay={delay}
      surface={PANEL_2}
      className={`flex flex-col gap-3 p-5 ${large ? "md:p-6" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors"
          style={{
            color: accent,
            background: `${accent}14`,
            border: `1px solid ${accent}33`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          style={{ color: accent }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <h4
          className={`font-semibold leading-tight ${large ? "text-lg" : "text-[15px]"}`}
          style={{ color: INK }}
        >
          {service.title}
        </h4>
        <p className="text-[13px] leading-snug" style={{ color: MUTED }}>
          {service.tagline}
        </p>
      </div>
      {large && (
        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>
          {service.description}
        </p>
      )}
    </Tile>
  );
}

/* Stagger container so groups reveal in sequence */
function Stagger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : 0.06 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Section heading */
function SectionHead({
  eyebrow,
  title,
  desc,
  icon,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  icon?: LucideIcon;
}) {
  const { variants } = useReveal();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mb-8 flex flex-col gap-3"
    >
      <Eyebrow color={BLUE} icon={icon}>
        {eyebrow}
      </Eyebrow>
      <h2
        className="max-w-3xl text-2xl font-semibold leading-tight md:text-3xl"
        style={{ color: INK }}
      >
        {title}
      </h2>
      {desc && (
        <p className="max-w-2xl text-[15px] leading-relaxed" style={{ color: MUTED }}>
          {desc}
        </p>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */
export default function BentoHome() {
  const reduce = useReducedMotion();
  const { variants } = useReveal();

  // pick a couple of marquee-ish highlight services for the hero
  const heroHighlights = useMemo(
    () => [businessServices[0], businessServices[3]].filter(Boolean),
    [],
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: CANVAS, color: INK }}
    >
      {/* ambient backdrop: faint grid + radial glow (CSS only, calm) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${BLUE}22, transparent 70%)` }}
        />
        <div
          className="absolute right-[-10%] top-[30%] h-[420px] w-[520px] rounded-full blur-[120px]"
          style={{ background: `radial-gradient(circle, ${TEAL}14, transparent 70%)` }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-28 sm:px-6 md:pt-32 lg:px-8">
        {/* ============================================================ */}
        {/* HERO BENTO                                                   */}
        {/* ============================================================ */}
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(0,auto)]">
          {/* Big headline + CTA tile */}
          <motion.div variants={variants} className="md:col-span-4 md:row-span-2">
            <Tile className="flex h-full flex-col justify-between gap-8 p-7 md:p-9" hoverable={false}>
              <div className="flex flex-col gap-5">
                <Eyebrow color={BLUE} icon={Sparkles}>
                  IFLEON · founder-led consultancy
                </Eyebrow>
                <h1
                  className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.4rem]"
                  style={{ color: INK }}
                >
                  Infinite possibilities,{" "}
                  <span
                    style={{
                      background: `linear-gradient(100deg, ${BLUE}, ${TEAL})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    logical solutions.
                  </span>
                </h1>
                <p className="max-w-xl text-[15px] leading-relaxed md:text-base" style={{ color: MUTED }}>
                  AI, DevOps, cloud and cybersecurity — engineered for startups,
                  SMBs and individuals. From Nellore, India, serving teams and
                  people worldwide. We scope the outcome, then build the system
                  that gets you there.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/services"
                    className="group/btn inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{ background: BLUE, color: "#04070D" }}
                  >
                    Explore services
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                  <a
                    href="https://github.com/ifleonlabs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                    style={{
                      color: INK,
                      border: `1px solid ${BORDER}`,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <Github className="h-4 w-4" />
                    github.com/ifleonlabs
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {STACK_TAGS.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </Tile>
          </motion.div>

          {/* Metric tile — big animated number */}
          <motion.div variants={variants} className="md:col-span-2">
            <Tile className="flex h-full flex-col justify-between gap-5 p-6" delay={0.05}>
              <Eyebrow color={TEAL} icon={Activity}>
                Track record
              </Eyebrow>
              <div>
                <div
                  className="text-5xl font-semibold tracking-tight md:text-6xl"
                  style={{ color: INK }}
                >
                  <CountUp to={25} />
                </div>
                <p className="mt-1 text-sm" style={{ color: MUTED }}>
                  Projects delivered across 6 industries
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: TEAL }}>
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ background: TEAL, boxShadow: `0 0 8px ${TEAL}` }}
                />
                <span className="font-mono tracking-wide">SHIPPED TO PRODUCTION</span>
              </div>
            </Tile>
          </motion.div>

          {/* What we build / GitHub tile */}
          <motion.div variants={variants} className="md:col-span-2">
            <Tile className="flex h-full flex-col gap-4 p-6" delay={0.1}>
              <Eyebrow icon={Terminal}>What we build</Eyebrow>
              <div
                className="rounded-xl p-4 font-mono text-[12px] leading-relaxed"
                style={{ background: "#08090C", border: `1px solid ${HAIR}` }}
              >
                <div style={{ color: MUTED }}>
                  <span style={{ color: TEAL }}>$</span> ifleon deploy --prod
                </div>
                <div className="mt-1" style={{ color: BLUE }}>
                  → pipelines · clusters · agents
                </div>
                <div style={{ color: "#5BD18C" }}>✓ 99.9% uptime · secured</div>
              </div>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-between gap-2 text-sm font-medium transition-colors"
                style={{ color: INK }}
              >
                <span className="inline-flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  Open-source labs
                </span>
                <ArrowUpRight className="h-4 w-4" style={{ color: BLUE }} />
              </a>
            </Tile>
          </motion.div>

          {/* Hero service highlight tiles */}
          {heroHighlights.map((s, i) => (
            <motion.div key={s.id} variants={variants} className="md:col-span-3">
              <ServiceTile service={s} accent={i === 0 ? BLUE : TEAL} large />
            </motion.div>
          ))}

          {/* Compliance badges tile (spans full width row) */}
          <motion.div variants={variants} className="md:col-span-6">
            <Tile className="flex flex-col items-start justify-between gap-5 p-6 md:flex-row md:items-center" delay={0.05}>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ color: BLUE, background: `${BLUE}14`, border: `1px solid ${BLUE}33` }}
                >
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <Eyebrow color={MUTED}>Security-first by default</Eyebrow>
                  <p className="mt-1 text-sm" style={{ color: INK }}>
                    Built to compliance frameworks your auditors already trust.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                    style={{
                      color: INK,
                      border: `1px solid ${BORDER}`,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                    {c}
                  </span>
                ))}
              </div>
            </Tile>
          </motion.div>
        </Stagger>

        {/* ============================================================ */}
        {/* SERVICES BENTO                                               */}
        {/* ============================================================ */}
        <section className="mt-24">
          <SectionHead
            eyebrow="Capabilities · 16 services"
            title="A full-stack toolkit for teams and individuals."
            desc="Whether you're scaling a SaaS platform or just trying to lock down your home network, there's a track for you."
            icon={Boxes}
          />

          {/* For Business */}
          <div className="mb-3 flex items-center gap-3">
            <Eyebrow color={BLUE}>For Business</Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {businessServices.map((s, i) => (
              <motion.div
                key={s.id}
                variants={variants}
                className={i === 0 ? "lg:col-span-3" : i === 1 ? "lg:col-span-3" : "lg:col-span-2"}
              >
                <ServiceTile service={s} accent={BLUE} large={i < 2} />
              </motion.div>
            ))}
          </Stagger>

          {/* For Individuals */}
          <div className="mb-3 mt-10 flex items-center gap-3">
            <Eyebrow color={TEAL}>For Individuals</Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {individualServices.map((s) => (
              <motion.div key={s.id} variants={variants}>
                <ServiceTile service={s} accent={TEAL} />
              </motion.div>
            ))}
          </Stagger>

          {/* Specialty */}
          <div className="mb-3 mt-10 flex items-center gap-3">
            <Eyebrow color={MUTED} icon={Layers}>
              Specialty &amp; Add-ons
            </Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyServices.map((s, i) => (
              <motion.div key={s.id} variants={variants}>
                <ServiceTile service={s} accent={i % 2 === 0 ? BLUE : TEAL} />
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* METRICS ROW                                                  */}
        {/* ============================================================ */}
        <section className="mt-24">
          <SectionHead
            eyebrow="By the numbers"
            title="Outcomes we can point to."
            icon={Activity}
          />
          <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={variants}>
                <Tile className="flex h-full flex-col gap-2 p-6">
                  <div
                    className="text-4xl font-semibold tracking-tight md:text-5xl"
                    style={{ color: INK }}
                  >
                    <CountUp
                      to={s.value}
                      suffix={s.suffix}
                      decimals={s.value % 1 !== 0 ? 1 : 0}
                    />
                  </div>
                  <div className="text-sm font-medium" style={{ color: INK }}>
                    {s.label}
                  </div>
                  <div className="font-mono text-[11px] tracking-wide" style={{ color: MUTED }}>
                    {s.hint}
                  </div>
                </Tile>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* HOW WE WORK                                                  */}
        {/* ============================================================ */}
        <section className="mt-24">
          <SectionHead
            eyebrow="The method"
            title="How we work."
            desc="Calm, transparent, and built to hand over. No black boxes."
            icon={Terminal}
          />
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_WE_WORK.map((s) => (
              <motion.div key={s.step} variants={variants}>
                <Tile className="flex h-full flex-col gap-3 p-6">
                  <span
                    className="font-mono text-2xl font-semibold"
                    style={{ color: BLUE }}
                  >
                    {s.step}
                  </span>
                  <h4 className="text-base font-semibold" style={{ color: INK }}>
                    {s.title}
                  </h4>
                  <p className="text-[13px] leading-relaxed" style={{ color: MUTED }}>
                    {s.body}
                  </p>
                </Tile>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* TESTIMONIALS                                                 */}
        {/* ============================================================ */}
        <section className="mt-24">
          <SectionHead
            eyebrow="Signal"
            title="What people say after we ship."
            icon={Quote}
          />
          <Stagger className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <motion.div
                key={q.name}
                variants={variants}
                className={i === 0 ? "lg:col-span-1" : ""}
              >
                <Tile className="flex h-full flex-col justify-between gap-6 p-6">
                  <Quote
                    className="h-7 w-7"
                    style={{ color: i % 2 === 0 ? BLUE : TEAL }}
                  />
                  <p className="text-[15px] leading-relaxed" style={{ color: INK }}>
                    “{q.quote}”
                  </p>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold" style={{ color: INK }}>
                      {q.name}
                    </span>
                    <span className="font-mono text-[11px] tracking-wide" style={{ color: MUTED }}>
                      {q.role}
                    </span>
                  </div>
                </Tile>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* CLOSING CONTACT CTA                                          */}
        {/* ============================================================ */}
        <section className="mt-24">
          <motion.div
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            whileHover={reduce ? undefined : { y: -3 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-12"
            style={{
              background:
                "linear-gradient(135deg, #0E1014 0%, #0B0D11 100%)",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)",
            }}
          >
            {/* glow accents */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[100px]"
              style={{ background: `radial-gradient(circle, ${BLUE}33, transparent 70%)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-[100px]"
              style={{ background: `radial-gradient(circle, ${TEAL}22, transparent 70%)` }}
            />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-4">
                <Eyebrow color={BLUE} icon={Sparkles}>
                  Let's build something
                </Eyebrow>
                <h2
                  className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
                  style={{ color: INK }}
                >
                  Have a problem worth solving? Let's scope it together.
                </h2>
                <a
                  href="mailto:info@ifleon.com"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: MUTED }}
                >
                  <Mail className="h-4 w-4" style={{ color: TEAL }} />
                  info@ifleon.com
                </a>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/services"
                  className="group/cta inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                  style={{ background: BLUE, color: "#04070D" }}
                >
                  Explore services
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors"
                  style={{
                    color: INK,
                    border: `1px solid ${BORDER}`,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <Github className="h-4 w-4" />
                  View our code
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
