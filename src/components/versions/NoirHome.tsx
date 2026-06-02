/* V20 — NOIR: a dark, monochrome black-&-white, cinematic homepage for IFLEON.

   Aesthetic lineage: editorial photography / film title sequences / luxury
   fashion houses. Pure high-contrast grayscale — black canvas, white type,
   grays for depth, NO color. Mood is built entirely from gradients, vignettes,
   film grain, and fine hairlines. Huge confident display type, vast negative
   space, restraint over decoration. Elegance through reduction.

   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. NO three.js / WebGL, no external assets. Motion is subtle
   and gated behind prefers-reduced-motion. No Header/Footer. The app forces
   DARK chrome for this version. Hero starts with pt-28 md:pt-32. */

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Plus,
  Building2,
  Users,
  Layers,
  Quote,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  ShieldCheck,
  Globe,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — pure monochrome "Noir" chrome                            */
/* ------------------------------------------------------------------ */
const BLACK = "#000000"; // pure black canvas
const NEAR_BLACK = "#060607"; // panel base
const SURFACE = "#0B0B0D"; // card surface
const SURFACE_HI = "#111114"; // raised surface
const WHITE = "#FFFFFF"; // primary type / max contrast
const INK_1 = "#EDEDEF"; // near-white body
const INK_2 = "#A7A7AD"; // secondary text
const MUTED = "#6E6E76"; // muted / captions
const FAINT = "#3A3A40"; // faintest labels
const HAIR = "rgba(255,255,255,0.10)"; // hairline border
const HAIR_HI = "rgba(255,255,255,0.30)"; // hover hairline
const GLOW = "rgba(255,255,255,0.06)"; // faint surface glow

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: 25, suffix: "", label: "Projects Delivered" },
  { value: 6, suffix: "", label: "Industries Served" },
  { value: 50, suffix: "+", label: "Clients & Individuals" },
  { value: 99.9, suffix: "%", label: "Uptime Maintained" },
];

const HOW_WE_WORK: { step: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result, then reverse-engineer the right stack. No tech for tech's sake.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Design the system",
    body: "Architecture, security, and UX mapped up front, in plain language you can sign off on.",
    icon: PenTool,
  },
  {
    step: "03",
    title: "Build & ship",
    body: "Short cycles, working software, automated delivery — and clean code in a repo you own.",
    icon: Rocket,
  },
  {
    step: "04",
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays in control after launch.",
    icon: LifeBuoy,
  },
];

const QUOTES = [
  {
    quote:
      "They migrated us to the cloud without a minute of downtime and cut our infrastructure bill by a third. It felt less like a vendor and more like our own team.",
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
      "Set up my entire home network, security, and devices in an afternoon. Everything simply works now.",
    name: "Individual client",
    role: "Remote professional · Nellore",
  },
];

type Group = {
  key: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  items: Service[];
};

const GROUPS: Group[] = [
  {
    key: "business",
    label: "Business",
    blurb: "Engineering, security, and transformation for teams that need to ship and scale.",
    icon: Building2,
    items: businessServices,
  },
  {
    key: "individual",
    label: "Individuals",
    blurb: "Hands-on technology help for founders, families, and professionals — explained clearly.",
    icon: Users,
    items: individualServices,
  },
  {
    key: "specialty",
    label: "Specialty",
    blurb: "Focused capabilities to bolt onto any engagement when a project needs a specialist.",
    icon: Layers,
    items: specialtyServices,
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const MAILTO =
  "mailto:info@ifleon.com?subject=Free%20consultation%20request&body=Hi%20IFLEON%20team%2C%0A%0AI%27d%20like%20to%20book%20a%20free%20consultation.%20Here%27s%20a%20bit%20about%20what%20we%27re%20looking%20to%20do%3A%0A%0A";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "figure";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/* Count-up number that animates once on scroll-in (static if reduced motion). */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const decimals = value % 1 !== 0 ? 1 : 0;
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* Reusable, deterministic SVG film-grain overlay (no external asset). */
function Grain({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-0"
      style={{
        opacity,
        mixBlendMode: "screen",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Atoms                                                              */
/* ------------------------------------------------------------------ */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.32em]"
      style={{ color: MUTED }}
    >
      <span className="inline-block h-px w-8" style={{ background: HAIR_HI }} />
      {children}
    </span>
  );
}

function PrimaryCTA({
  to,
  href,
  children,
}: {
  to?: string;
  href?: string;
  children: ReactNode;
}) {
  const cls =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5";
  const style: CSSProperties = {
    background: WHITE,
    color: BLACK,
    boxShadow: "0 12px 36px -14px rgba(255,255,255,0.45)",
  };
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} style={style}>
        {inner}
      </Link>
    );
  return (
    <a href={href} className={cls} style={style}>
      {inner}
    </a>
  );
}

function GhostCTA({
  to,
  href,
  icon: Icon,
  external,
  children,
}: {
  to?: string;
  href?: string;
  icon?: LucideIcon;
  external?: boolean;
  children: ReactNode;
}) {
  const cls =
    "group inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors duration-200";
  const style: CSSProperties = {
    color: INK_1,
    background: "transparent",
    border: `1px solid ${HAIR}`,
  };
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = HAIR_HI;
    e.currentTarget.style.background = GLOW;
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = HAIR;
    e.currentTarget.style.background = "transparent";
  };
  const inner = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {inner}
      </Link>
    );
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cls}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {inner}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Service card — editorial, hairline-framed                          */
/* ------------------------------------------------------------------ */
function ServiceCard({ svc, index }: { svc: Service; index: number }) {
  const Icon = svc.icon;
  const [hover, setHover] = useState(false);

  return (
    <Reveal as="article" delay={Math.min(index, 2) * 0.05} className="h-full">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-all duration-300"
        style={{
          background: hover ? SURFACE_HI : SURFACE,
          border: `1px solid ${hover ? HAIR_HI : HAIR}`,
          transform: hover ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* spotlight wash on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hover ? 1 : 0,
            background:
              "radial-gradient(120% 90% at 50% -10%, rgba(255,255,255,0.10), transparent 65%)",
          }}
        />
        <div className="relative flex items-start justify-between">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
            style={{
              color: hover ? WHITE : INK_1,
              background: NEAR_BLACK,
              border: `1px solid ${hover ? HAIR_HI : HAIR}`,
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <span
            className="font-mono text-[11px] tabular-nums tracking-[0.2em]"
            style={{ color: FAINT }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3
          className="relative mt-6 font-display text-lg font-semibold leading-snug tracking-tight"
          style={{ color: WHITE }}
        >
          {svc.title}
        </h3>
        <p
          className="relative mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: MUTED }}
        >
          {svc.tagline}
        </p>
        <p className="relative mt-4 flex-1 text-sm leading-relaxed" style={{ color: INK_2 }}>
          {svc.description}
        </p>

        <div
          className="relative mt-6 flex items-center gap-2 pt-5 text-[12px] font-medium"
          style={{ borderTop: `1px solid ${HAIR}`, color: hover ? INK_1 : MUTED }}
        >
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          {svc.features[0]}
        </div>
      </div>
    </Reveal>
  );
}

/* ================================================================== */
/* Main                                                               */
/* ================================================================== */
export default function NoirHome() {
  const reduce = useReducedMotion();

  return (
    <main
      className="relative min-h-screen w-full overflow-x-hidden antialiased selection:bg-white selection:text-black"
      style={{ background: BLACK, color: INK_2 }}
    >
      <Grain opacity={0.05} />

      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative isolate px-6 pt-28 md:pt-32">
        {/* top cinematic glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 55% at 50% -8%, rgba(255,255,255,0.16), transparent 62%)",
          }}
        />
        {/* fine hairline grid, masked into the vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)`,
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(95% 70% at 50% 0%, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(95% 70% at 50% 0%, black 30%, transparent 80%)",
          }}
        />
        {/* bottom vignette into pure black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48"
          style={{ background: "linear-gradient(to bottom, transparent, #000000)" }}
        />

        <div className="mx-auto max-w-5xl pb-20 text-center sm:pb-28">
          <Reveal>
            <span
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em]"
              style={{ color: INK_2, background: SURFACE, border: `1px solid ${HAIR}` }}
            >
              <span className="relative flex h-1.5 w-1.5">
                {!reduce && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: WHITE }}
                  />
                )}
                <span
                  className="relative inline-flex h-1.5 w-1.5 rounded-full"
                  style={{ background: WHITE }}
                />
              </span>
              Founder-led · Nellore, India · Est. 2022
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="mt-8 font-display font-semibold leading-[0.95] tracking-tight"
              style={{ color: WHITE, fontSize: "clamp(2.75rem, 9vw, 6.5rem)" }}
            >
              Infinite Possibilities,
              <br />
              <span
                style={{
                  // gradient white→gray for cinematic depth on the second line
                  background: "linear-gradient(180deg, #FFFFFF 0%, #8A8A90 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Logical Solutions.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p
              className="mx-auto mt-7 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: INK_2 }}
            >
              IFLEON is a founder-led AI, DevOps, Cloud, and Cybersecurity consultancy.
              We help businesses and individuals build, secure, and scale technology
              that actually ships — engineered with the rigor of a much larger team.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryCTA href={MAILTO}>Request a Free Consultation</PrimaryCTA>
              <GhostCTA to="/services" icon={Layers}>
                Explore Services
              </GhostCTA>
            </div>
          </Reveal>

          {/* compliance hairline strip */}
          <Reveal delay={0.32}>
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: FAINT }}>
                Compliance
              </span>
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="font-mono text-[12px] uppercase tracking-[0.18em]"
                  style={{ color: INK_2 }}
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES — all 16, grouped                                    */}
      {/* ============================================================ */}
      <section className="relative px-6 py-24 sm:py-28" style={{ background: NEAR_BLACK }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
        />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>What we do</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="mt-5 font-display font-semibold tracking-tight"
                style={{ color: WHITE, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
              >
                One partner for the
                <br />
                whole stack.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: INK_2 }}>
                Sixteen services across business engineering, individual support, and
                specialty add-ons — scoped to your outcome, delivered with care.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 space-y-20">
            {GROUPS.map((group) => (
              <div key={group.key}>
                <Reveal>
                  <div
                    className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between"
                    style={{ borderBottom: `1px solid ${HAIR}` }}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ color: WHITE, background: SURFACE, border: `1px solid ${HAIR}` }}
                      >
                        <group.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3
                          className="font-display text-2xl font-semibold tracking-tight"
                          style={{ color: WHITE }}
                        >
                          {group.label}
                        </h3>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
                          {group.blurb}
                        </p>
                      </div>
                    </div>
                    <span
                      className="shrink-0 self-start font-mono text-[11px] uppercase tracking-[0.2em] sm:self-end"
                      style={{ color: FAINT }}
                    >
                      {String(group.items.length).padStart(2, "0")} services
                    </span>
                  </div>
                </Reveal>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((svc, i) => (
                    <ServiceCard key={svc.id} svc={svc} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* METRICS ROW                                                   */}
      {/* ============================================================ */}
      <section className="relative px-6 py-20" style={{ background: BLACK }}>
        <div className="mx-auto max-w-6xl">
          <div
            className="grid grid-cols-2 lg:grid-cols-4"
            style={{ borderTop: `1px solid ${HAIR}`, borderLeft: `1px solid ${HAIR}` }}
          >
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.07}>
                <div
                  className="flex h-full flex-col items-start justify-center px-6 py-10 sm:px-8 sm:py-12"
                  style={{ borderRight: `1px solid ${HAIR}`, borderBottom: `1px solid ${HAIR}` }}
                >
                  <span
                    className="font-display font-semibold tabular-nums tracking-tight"
                    style={{ color: WHITE, fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1 }}
                  >
                    <CountUp value={s.value} suffix={s.suffix} />
                  </span>
                  <span
                    className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em]"
                    style={{ color: MUTED }}
                  >
                    {s.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW WE WORK — 4 steps                                         */}
      {/* ============================================================ */}
      <section className="relative px-6 py-24 sm:py-28" style={{ background: NEAR_BLACK }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
        />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>How we work</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="mt-5 font-display font-semibold tracking-tight"
                style={{ color: WHITE, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
              >
                A calm, accountable process.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-5 max-w-xl text-base leading-relaxed" style={{ color: INK_2 }}>
                No black boxes. You always know what is being built, why, and what
                happens next.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: HAIR }}>
            {HOW_WE_WORK.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.08}>
                <div
                  className="group relative h-full overflow-hidden p-8"
                  style={{ background: NEAR_BLACK }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ color: WHITE, background: SURFACE, border: `1px solid ${HAIR}` }}
                    >
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span
                      className="font-display text-5xl font-semibold leading-none tabular-nums"
                      style={{ color: "rgba(255,255,255,0.07)" }}
                    >
                      {step.step}
                    </span>
                  </div>
                  <h3 className="mt-7 text-base font-semibold" style={{ color: WHITE }}>
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed" style={{ color: INK_2 }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TESTIMONIALS                                                  */}
      {/* ============================================================ */}
      <section className="relative px-6 py-24 sm:py-28" style={{ background: BLACK }}>
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow>In their words</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                className="mt-5 font-display font-semibold tracking-tight"
                style={{ color: WHITE, fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1.05 }}
              >
                Outcomes our clients felt.
              </h2>
            </Reveal>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} as="figure" delay={i * 0.08} className="h-full">
                <figure
                  className="relative flex h-full flex-col rounded-2xl p-8"
                  style={{ background: SURFACE, border: `1px solid ${HAIR}` }}
                >
                  <Quote className="h-7 w-7" style={{ color: "rgba(255,255,255,0.16)" }} />
                  <blockquote
                    className="mt-5 flex-1 text-[15px] leading-relaxed"
                    style={{ color: INK_1 }}
                  >
                    {q.quote}
                  </blockquote>
                  <figcaption className="mt-6 pt-5" style={{ borderTop: `1px solid ${HAIR}` }}>
                    <div className="text-sm font-semibold" style={{ color: WHITE }}>
                      {q.name}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                      {q.role}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CLOSING CTA                                                   */}
      {/* ============================================================ */}
      <section className="relative px-6 pb-28 pt-8 sm:pb-32" style={{ background: BLACK }}>
        <Reveal>
          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20"
            style={{
              background: "linear-gradient(180deg, #141417 0%, #060607 100%)",
              border: `1px solid ${HAIR}`,
            }}
          >
            {/* top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 60% at 50% -5%, rgba(255,255,255,0.14), transparent 60%)",
              }}
            />
            <div className="relative">
              <Reveal>
                <span className="inline-flex items-center justify-center">
                  <Plus className="h-5 w-5" style={{ color: MUTED }} />
                </span>
              </Reveal>
              <h2
                className="mt-6 font-display font-semibold tracking-tight"
                style={{ color: WHITE, fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1 }}
              >
                Tell us what you are
                <br />
                trying to ship.
              </h2>
              <p
                className="mx-auto mt-6 max-w-xl text-base leading-relaxed"
                style={{ color: INK_2 }}
              >
                A free, no-pressure consultation to scope the work, the timeline, and
                whether IFLEON is the right fit. You will leave with a clear plan either way.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <PrimaryCTA href="mailto:info@ifleon.com">
                  <Mail className="h-4 w-4" />
                  info@ifleon.com
                </PrimaryCTA>
                <GhostCTA to="/services" icon={Layers}>
                  Explore Services
                </GhostCTA>
                <GhostCTA href="https://github.com/ifleonlabs" icon={Github} external>
                  github.com/ifleonlabs
                </GhostCTA>
              </div>

              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{ color: MUTED }}
              >
                <span className="inline-flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" /> India + Global
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> ISO 27001 · DPDP · SOC 2
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
