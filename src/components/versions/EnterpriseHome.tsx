/* V17 — ENTERPRISE: a light, corporate-clean B2B SaaS homepage for IFLEON.

   Aesthetic lineage: Stripe / Vanta / Linear-light. Crisp white canvas, a
   faint blue grid + soft radial wash, structured sections, generous
   whitespace, professional blue (#2563EB) as the single accent, tidy feature
   grids with check-lists, a "trusted by / audiences" strip, prominent
   compliance badges (ISO 27001 · DPDP · SOC 2), and clear conversion CTAs.
   Maximum trust and polish — it should read like a funded SaaS.

   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. NO three.js / WebGL, no external assets. Motion is subtle
   and gated behind prefers-reduced-motion. No Header/Footer. The app forces
   LIGHT chrome for this version. Hero starts with pt-28 md:pt-32. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Check,
  Star,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Building2,
  Users,
  Layers,
  Quote,
  Compass,
  Hammer,
  Rocket,
  LifeBuoy,
  Globe,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — light "Enterprise" chrome                                */
/* ------------------------------------------------------------------ */
const CANVAS = "#FFFFFF"; // crisp white page
const SUBTLE = "#F8FAFC"; // off-white band (slate-50)
const SURFACE = "#FFFFFF"; // card surface
const BORDER = "rgba(15,23,42,0.08)"; // crisp 1px border
const BORDER_HI = "rgba(37,99,235,0.40)"; // hover border (brand blue)
const HAIR = "rgba(15,23,42,0.06)"; // hairline / dividers
const INK = "#0F172A"; // primary text (slate-900)
const INK_2 = "#334155"; // body text (slate-700)
const MUTED = "#64748B"; // muted text (slate-500)
const BLUE = "#2563EB"; // brand blue
const BLUE_DK = "#1D4ED8"; // darker blue (hover)
const BLUE_SOFT = "#EFF4FF"; // blue tint surface

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: 25, suffix: "", label: "Projects Delivered", hint: "shipped to production" },
  { value: 6, suffix: "", label: "Industries Served", hint: "SaaS · fintech · retail +" },
  { value: 50, suffix: "+", label: "Clients & Individuals", hint: "B2B and personal" },
  { value: 99.9, suffix: "%", label: "Uptime Maintained", hint: "security-first ops" },
];

const COMPLIANCE: { label: string; icon: LucideIcon; note: string }[] = [
  { label: "ISO 27001", icon: ShieldCheck, note: "Information security" },
  { label: "DPDP", icon: Lock, note: "India data protection" },
  { label: "SOC 2", icon: BadgeCheck, note: "Trust & controls" },
];

const AUDIENCES = [
  "Funded startups",
  "Fintech & SaaS",
  "Retail & D2C",
  "Manufacturing",
  "Solo founders",
  "Students & professionals",
];

const HOW_WE_WORK: { step: string; title: string; body: string; icon: LucideIcon }[] = [
  {
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result, then reverse-engineer the right stack — no tech for tech's sake.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Build in the open",
    body: "Short cycles, working software you can see, and clean code pushed to a repository you own.",
    icon: Hammer,
  },
  {
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives contact with real users.",
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
    label: "Business Solutions",
    blurb: "Enterprise-grade engineering, security, and transformation for teams that need to ship and scale.",
    icon: Building2,
    items: businessServices,
  },
  {
    key: "individual",
    label: "For Individuals",
    blurb: "Hands-on technology help for founders, families, and professionals — done right, explained clearly.",
    icon: Users,
    items: individualServices,
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    blurb: "Focused capabilities you can bolt onto any engagement when a project needs a specialist.",
    icon: Layers,
    items: specialtyServices,
  },
];

const MAILTO =
  "mailto:info@ifleon.com?subject=Free%20consultation%20request&body=Hi%20IFLEON%20team%2C%0A%0AI%27d%20like%20to%20book%20a%20free%20consultation.%20Here%27s%20a%20bit%20about%20what%20we%27re%20looking%20to%20do%3A%0A%0A";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1] as const;

/* A small in-view reveal wrapper that respects reduced-motion. */
function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
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
      transition={{ duration: 0.6, ease: EASE, delay }}
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
    const duration = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
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

/* ------------------------------------------------------------------ */
/* Atoms                                                              */
/* ------------------------------------------------------------------ */
function Eyebrow({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em]"
      style={{ color: BLUE, background: BLUE_SOFT, border: `1px solid ${BORDER_HI}` }}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
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
    "group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5";
  const style = {
    background: BLUE,
    boxShadow: "0 8px 22px -10px rgba(37,99,235,0.65)",
  } as const;
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );
  if (to)
    return (
      <Link
        to={to}
        className={cls}
        style={style}
        onMouseEnter={(e) => (e.currentTarget.style.background = BLUE_DK)}
        onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
      >
        {inner}
      </Link>
    );
  return (
    <a
      href={href}
      className={cls}
      style={style}
      onMouseEnter={(e) => (e.currentTarget.style.background = BLUE_DK)}
      onMouseLeave={(e) => (e.currentTarget.style.background = BLUE)}
    >
      {inner}
    </a>
  );
}

function SecondaryCTA({
  to,
  href,
  icon: Icon,
  children,
}: {
  to?: string;
  href?: string;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const cls =
    "group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-200";
  const style = {
    color: INK,
    background: SURFACE,
    border: `1px solid ${BORDER}`,
  } as const;
  const inner = (
    <>
      {Icon ? <Icon className="h-4 w-4" style={{ color: BLUE }} /> : null}
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} style={style}>
        {inner}
      </Link>
    );
  return (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={cls} style={style}>
      {inner}
    </a>
  );
}

/* Section header (eyebrow + title + optional lede), center or left. */
function SectionHead({
  eyebrow,
  eyebrowIcon,
  title,
  lede,
  align = "center",
}: {
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  title: ReactNode;
  lede?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          style={{ color: INK }}
        >
          {title}
        </h2>
      </Reveal>
      {lede ? (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base leading-relaxed sm:text-lg" style={{ color: MUTED }}>
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Service card                                                       */
/* ------------------------------------------------------------------ */
function ServiceCard({ svc, delay }: { svc: Service; delay: number }) {
  const Icon = svc.icon;
  const [hover, setHover] = useState(false);
  // Show the first 3 features as a tidy check-list.
  const checks = svc.features.slice(0, 3);

  return (
    <Reveal as="article" delay={delay} className="h-full">
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="group flex h-full flex-col rounded-2xl p-6 transition-all duration-300"
        style={{
          background: SURFACE,
          border: `1px solid ${hover ? BORDER_HI : BORDER}`,
          boxShadow: hover
            ? "0 18px 40px -22px rgba(37,99,235,0.35)"
            : "0 1px 2px rgba(15,23,42,0.04)",
          transform: hover ? "translateY(-3px)" : "translateY(0)",
        }}
      >
        <div className="flex items-start justify-between">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors"
            style={{
              color: BLUE,
              background: BLUE_SOFT,
              border: `1px solid ${BORDER_HI}`,
            }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: BLUE, opacity: hover ? 1 : 0 }}
          />
        </div>

        <h3 className="mt-4 text-base font-semibold leading-snug" style={{ color: INK }}>
          {svc.title}
        </h3>
        <p className="mt-1 font-mono text-[12px] uppercase tracking-wide" style={{ color: BLUE }}>
          {svc.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_2 }}>
          {svc.description}
        </p>

        <ul className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: HAIR }}>
          {checks.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13px]" style={{ color: INK_2 }}>
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: BLUE }} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ================================================================== */
/* Main                                                               */
/* ================================================================== */
export default function EnterpriseHome() {
  const reduce = useReducedMotion();

  return (
    <main
      className="min-h-screen w-full overflow-x-hidden antialiased"
      style={{ background: CANVAS, color: INK_2 }}
    >
      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative isolate px-6 pt-28 md:pt-32">
        {/* faint blue grid + radial wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(${HAIR} 1px, transparent 1px), linear-gradient(90deg, ${HAIR} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(120% 80% at 50% 0%, black 35%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(120% 80% at 50% 0%, black 35%, transparent 78%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 50% -5%, rgba(37,99,235,0.12), transparent 70%)",
          }}
        />

        <div className="mx-auto max-w-3xl pb-16 text-center sm:pb-20">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium"
              style={{ color: INK, background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              <span className="relative flex h-2 w-2">
                {!reduce && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ background: BLUE }}
                  />
                )}
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: BLUE }}
                />
              </span>
              Founder-led consultancy · Nellore, India · Since 2022
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1
              className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
              style={{ color: INK }}
            >
              Infinite Possibilities,
              <br className="hidden sm:block" />{" "}
              <span style={{ color: BLUE }}>Logical Solutions.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg"
              style={{ color: MUTED }}
            >
              IFLEON is an AI, DevOps, Cloud, and Cybersecurity consultancy. We help
              businesses and individuals build, secure, and scale technology that
              actually ships — engineered with the rigor of a much larger team.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryCTA href={MAILTO}>Request a Free Consultation</PrimaryCTA>
              <SecondaryCTA to="/services" icon={Layers}>
                Explore Services
              </SecondaryCTA>
            </div>
          </Reveal>

          {/* compliance row */}
          <Reveal delay={0.24}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: MUTED }}
              >
                Compliance-ready
              </span>
              {COMPLIANCE.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium"
                  style={{ color: INK, background: SUBTLE, border: `1px solid ${BORDER}` }}
                >
                  <c.icon className="h-4 w-4" style={{ color: BLUE }} />
                  {c.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUSTED BY / AUDIENCES STRIP                                  */}
      {/* ============================================================ */}
      <section
        className="border-y px-6 py-8"
        style={{ background: SUBTLE, borderColor: BORDER }}
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p
              className="text-center font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: MUTED }}
            >
              Trusted across industries & by individuals
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
              {AUDIENCES.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                  style={{ color: INK_2, background: SURFACE, border: `1px solid ${BORDER}` }}
                >
                  <Check className="h-3.5 w-3.5" style={{ color: BLUE }} />
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SERVICES — all 16, grouped                                    */}
      {/* ============================================================ */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="What we do"
            eyebrowIcon={Sparkles}
            title={<>One partner for the whole stack</>}
            lede="Sixteen services across business engineering, individual support, and specialty add-ons — scoped to your outcome, delivered with care."
          />

          <div className="mt-14 space-y-16">
            {GROUPS.map((group, gi) => (
              <div key={group.key}>
                <Reveal>
                  <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: HAIR }}>
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ color: BLUE, background: BLUE_SOFT, border: `1px solid ${BORDER_HI}` }}
                      >
                        <group.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-tight" style={{ color: INK }}>
                          {group.label}
                        </h3>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed" style={{ color: MUTED }}>
                          {group.blurb}
                        </p>
                      </div>
                    </div>
                    <span
                      className="shrink-0 self-start rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] sm:self-end"
                      style={{ color: MUTED, background: SUBTLE, border: `1px solid ${BORDER}` }}
                    >
                      {group.items.length} services
                    </span>
                  </div>
                </Reveal>

                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((svc, i) => (
                    <ServiceCard key={svc.id} svc={svc} delay={Math.min(i, 2) * 0.05 + gi * 0.02} />
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
      <section
        className="border-y px-6 py-16"
        style={{ background: SUBTLE, borderColor: BORDER }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4"
          style={{ background: BORDER, border: `1px solid ${BORDER}` }}
        >
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center" style={{ background: SURFACE }}>
                <span
                  className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
                  style={{ color: BLUE }}
                >
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-2 text-sm font-medium" style={{ color: INK }}>
                  {s.label}
                </span>
                <span className="mt-1 text-[12px]" style={{ color: MUTED }}>
                  {s.hint}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW WE WORK — 4 steps                                         */}
      {/* ============================================================ */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="How we work"
            eyebrowIcon={Compass}
            title={<>A calm, accountable process</>}
            lede="No black boxes. You always know what's being built, why, and what happens next."
          />

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_WE_WORK.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.07}>
                <div
                  className="relative h-full rounded-2xl p-6"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                >
                  <span
                    className="absolute right-5 top-5 font-display text-3xl font-semibold"
                    style={{ color: "rgba(37,99,235,0.14)" }}
                  >
                    {step.step}
                  </span>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ color: BLUE, background: BLUE_SOFT, border: `1px solid ${BORDER_HI}` }}
                  >
                    <step.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold" style={{ color: INK }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: INK_2 }}>
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
      <section
        className="border-t px-6 py-20 sm:py-24"
        style={{ background: SUBTLE, borderColor: BORDER }}
      >
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="In their words"
            eyebrowIcon={Quote}
            title={<>Outcomes our clients felt</>}
          />

          <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <Reveal key={q.name} delay={i * 0.08}>
                <figure
                  className="flex h-full flex-col rounded-2xl p-6"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-center gap-1" style={{ color: BLUE }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-4 w-4" fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed" style={{ color: INK_2 }}>
                    “{q.quote}”
                  </blockquote>
                  <figcaption className="mt-5 border-t pt-4" style={{ borderColor: HAIR }}>
                    <div className="text-sm font-semibold" style={{ color: INK }}>
                      {q.name}
                    </div>
                    <div className="text-[12px]" style={{ color: MUTED }}>
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
      <section className="px-6 py-20 sm:py-28">
        <Reveal>
          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-16"
            style={{
              background: "linear-gradient(160deg, #1D4ED8 0%, #2563EB 55%, #1E3A8A 100%)",
              boxShadow: "0 30px 60px -30px rgba(37,99,235,0.6)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                maskImage: "radial-gradient(80% 90% at 50% 0%, black, transparent 75%)",
                WebkitMaskImage: "radial-gradient(80% 90% at 50% 0%, black, transparent 75%)",
              }}
            />
            <div className="relative">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
                style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Let's build something solid
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Tell us what you're trying to ship.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                A free, no-pressure consultation to scope the work, the timeline, and
                whether IFLEON is the right fit. You'll leave with a clear plan either way.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:info@ifleon.com"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ color: BLUE_DK }}
                >
                  <Mail className="h-4 w-4" />
                  info@ifleon.com
                </a>
                <Link
                  to="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors duration-200"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-colors duration-200"
                  style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.3)" }}
                >
                  <Github className="h-4 w-4" />
                  github.com/ifleonlabs
                </a>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> India + global
                </span>
                <span className="inline-flex items-center gap-1.5">
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
