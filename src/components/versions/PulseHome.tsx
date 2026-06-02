/* V26 — "PULSE": dark data-viz / live-ops dashboard. The whole homepage is a
   sleek monitoring console — animated SVG line charts, area sparklines, bar
   charts, animated metric tickers/counters, a "live" status grid, and gauge
   rings — all hand-drawn with SVG + framer-motion (no chart library). Dark
   slate base, electric-green/blue "healthy" accents, mono numerals. Conveys
   reliability / observability (fits DevOps / uptime). App forces dark chrome.

   Self-contained. Allowed imports only: react, framer-motion, lucide-react,
   react-router-dom. No WebGL, no chart libs, no external assets/fonts/images. */

import { useEffect, useId, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Activity,
  Building2,
  User,
  Layers,
  Search,
  PenTool,
  Rocket,
  CheckCircle2,
  Quote,
  ShieldCheck,
  ChevronRight,
  Circle,
  TrendingUp,
  Cpu,
  Gauge as GaugeIcon,
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

const BG = "#070b12"; // deep slate base
const PANEL = "rgba(15,21,32,0.72)";
const PANEL_SOLID = "#0d131e";
const BORDER = "rgba(148,163,184,0.14)";
const BORDER_HOT = "rgba(52,211,153,0.4)";
const GRID = "rgba(148,163,184,0.07)";

const GREEN = "#34d399"; // healthy
const BLUE = "#38bdf8"; // info
const VIOLET = "#a78bfa"; // accent
const AMBER = "#fbbf24"; // warn
const TXT = "#e6edf6";
const MUT = "#8a98ad";
const FAINT = "#5b6b82";

const MAILTO = "mailto:info@ifleon.com";
const GITHUB = "https://github.com/ifleonlabs";

const ACCENTS = [GREEN, BLUE, VIOLET, AMBER];

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS: {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
  spark: number[];
  color: string;
}[] = [
  {
    value: 25,
    suffix: "",
    decimals: 0,
    label: "Projects Delivered",
    spark: [4, 7, 6, 11, 14, 13, 18, 22, 25],
    color: GREEN,
  },
  {
    value: 6,
    suffix: "",
    decimals: 0,
    label: "Industries Served",
    spark: [1, 2, 2, 3, 4, 4, 5, 6, 6],
    color: BLUE,
  },
  {
    value: 50,
    suffix: "+",
    decimals: 0,
    label: "Clients & Individuals",
    spark: [6, 12, 18, 21, 29, 34, 40, 46, 50],
    color: VIOLET,
  },
  {
    value: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Uptime",
    spark: [99.4, 99.6, 99.5, 99.7, 99.8, 99.8, 99.9, 99.9, 99.9],
    color: AMBER,
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HERO_STATS = [
  { label: "AI / ML", color: GREEN },
  { label: "DevOps", color: BLUE },
  { label: "Cloud", color: VIOLET },
  { label: "Security", color: AMBER },
];

const PROCESS = [
  {
    step: "01",
    title: "Discover",
    desc: "We map your stack, goals, and constraints — then scope the highest-value work.",
    icon: Search,
    color: GREEN,
  },
  {
    step: "02",
    title: "Design",
    desc: "Architecture, UX flows, and a delivery plan you can actually read and approve.",
    icon: PenTool,
    color: BLUE,
  },
  {
    step: "03",
    title: "Deploy",
    desc: "We build, test, and ship in tight iterations with CI/CD and observability baked in.",
    icon: Rocket,
    color: VIOLET,
  },
  {
    step: "04",
    title: "Sustain",
    desc: "Monitoring, alerts, and an iteration playbook so it stays fast, secure, and yours.",
    icon: CheckCircle2,
    color: AMBER,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took our deploys from a quarterly ordeal to daily, boring, one-click releases. Build times dropped under five minutes.",
    name: "Priya Nair",
    role: "VP Engineering · FinTech SaaS",
    color: GREEN,
  },
  {
    quote:
      "Their team got us audit-ready for ISO 27001 and DPDP without slowing us down. We closed two enterprise deals we'd been stuck on.",
    name: "Daniel Okafor",
    role: "CTO · HealthTech Platform",
    color: BLUE,
  },
  {
    quote:
      "The AI support copilot they shipped deflects 40%+ of our tickets. It reads our docs and actually answers correctly.",
    name: "Meera Shah",
    role: "Head of Support · D2C Brand",
    color: VIOLET,
  },
];

const STATUS_NODES = [
  { name: "api-gateway", uptime: "99.99%", color: GREEN },
  { name: "ci-pipeline", uptime: "100%", color: GREEN },
  { name: "ml-inference", uptime: "99.97%", color: GREEN },
  { name: "data-stream", uptime: "99.92%", color: BLUE },
  { name: "edge-cdn", uptime: "100%", color: GREEN },
  { name: "auth-service", uptime: "99.98%", color: GREEN },
  { name: "vector-db", uptime: "99.95%", color: BLUE },
  { name: "alerting", uptime: "99.99%", color: GREEN },
];

const GROUPS: {
  key: string;
  title: string;
  tag: string;
  icon: typeof Building2;
  color: string;
  services: Service[];
}[] = [
  {
    key: "business",
    title: "Business Solutions",
    tag: "B2B",
    icon: Building2,
    color: GREEN,
    services: businessServices,
  },
  {
    key: "individual",
    title: "For Individuals",
    tag: "1:1",
    icon: User,
    color: BLUE,
    services: individualServices,
  },
  {
    key: "specialty",
    title: "Specialty & Add-Ons",
    tag: "EXT",
    icon: Layers,
    color: VIOLET,
    services: specialtyServices,
  },
];

/* ------------------------------------------------------------------ */
/*  SVG chart helpers                                                  */
/* ------------------------------------------------------------------ */

/** Build a smooth-ish polyline path from normalized [0..1] y-values. */
function buildPath(
  values: number[],
  w: number,
  h: number,
  pad = 0,
): { line: string; area: string } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerW = w - pad * 2;
  const innerH = h - pad * 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * innerW;
    const y = pad + innerH - ((v - min) / range) * innerH;
    return [x, y] as const;
  });
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  const area =
    line +
    ` L${(w - pad).toFixed(2)},${(h - pad).toFixed(2)}` +
    ` L${pad.toFixed(2)},${(h - pad).toFixed(2)} Z`;
  return { line, area };
}

/* ------------------------------------------------------------------ */
/*  Animated counter (ticker)                                          */
/* ------------------------------------------------------------------ */

function Counter({
  to,
  decimals,
  suffix,
  active,
}: {
  to: number;
  decimals: number;
  suffix: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    if (!active) return;
    let raf = 0;
    const dur = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active, reduce]);

  return (
    <span>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Sparkline / area chart                                             */
/* ------------------------------------------------------------------ */

function Sparkline({
  values,
  color,
  active,
}: {
  values: number[];
  color: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const W = 120;
  const H = 36;
  const { line, area } = buildPath(values, W, H, 2);
  const animate = active && !reduce;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={`sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.28} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill={`url(#sp-${uid})`}
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: animate ? 1 : reduce ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: animate ? 1 : 1 }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Gauge ring                                                         */
/* ------------------------------------------------------------------ */

function GaugeRing({
  pct,
  color,
  label,
  value,
  active,
}: {
  pct: number;
  color: string;
  label: string;
  value: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const R = 34;
  const C = 2 * Math.PI * R;
  const target = (pct / 100) * C;
  const animate = active && !reduce;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 92, height: 92 }}>
        <svg viewBox="0 0 92 92" width={92} height={92} aria-hidden>
          <circle
            cx={46}
            cy={46}
            r={R}
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth={7}
          />
          <motion.circle
            cx={46}
            cy={46}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            transform="rotate(-90 46 46)"
            strokeDasharray={C}
            initial={{ strokeDashoffset: reduce ? C - target : C }}
            animate={{ strokeDashoffset: animate ? C - target : C - target }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: TXT }}
          >
            {value}
          </span>
        </div>
      </div>
      <span
        className="mt-1 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: MUT }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero throughput line chart                                         */
/* ------------------------------------------------------------------ */

const HERO_SERIES = [
  18, 24, 21, 30, 27, 38, 34, 45, 41, 52, 49, 60, 57, 68, 64, 76, 80, 74, 88,
  92, 86, 96,
];
const HERO_SERIES_B = [
  10, 14, 13, 18, 16, 22, 20, 27, 25, 31, 29, 36, 34, 40, 38, 45, 47, 44, 51,
  55, 52, 58,
];

function HeroChart({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const W = 520;
  const H = 220;
  const a = buildPath(HERO_SERIES, W, H, 8);
  const b = buildPath(HERO_SERIES_B, W, H, 8);
  const animate = active && !reduce;

  // last point coords for the pulsing dot
  const lastX = W - 8;
  const min = Math.min(...HERO_SERIES);
  const max = Math.max(...HERO_SERIES);
  const lastY =
    8 + (H - 16) - ((HERO_SERIES[HERO_SERIES.length - 1] - min) / (max - min)) * (H - 16);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden
      className="block"
    >
      <defs>
        <linearGradient id={`hero-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GREEN} stopOpacity={0.32} />
          <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* grid lines */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={0}
          x2={W}
          y1={H * p}
          y2={H * p}
          stroke={GRID}
          strokeWidth={1}
        />
      ))}
      {[0.2, 0.4, 0.6, 0.8].map((p) => (
        <line
          key={p}
          y1={0}
          y2={H}
          x1={W * p}
          x2={W * p}
          stroke={GRID}
          strokeWidth={1}
        />
      ))}

      <motion.path
        d={a.area}
        fill={`url(#hero-${uid})`}
        initial={{ opacity: reduce ? 1 : 0 }}
        animate={{ opacity: animate || reduce ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
      {/* secondary line */}
      <motion.path
        d={b.line}
        fill="none"
        stroke={BLUE}
        strokeWidth={1.6}
        strokeOpacity={0.7}
        strokeDasharray="4 4"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
      />
      {/* primary line */}
      <motion.path
        d={a.line}
        fill="none"
        stroke={GREEN}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 5px ${GREEN}55)` }}
      />

      {/* pulsing live dot */}
      <circle cx={lastX} cy={lastY} r={3.5} fill={GREEN} />
      {!reduce && (
        <motion.circle
          cx={lastX}
          cy={lastY}
          r={3.5}
          fill="none"
          stroke={GREEN}
          strokeWidth={1.5}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: [1, 3.2], opacity: [0.8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${lastX}px ${lastY}px` }}
        />
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini bar chart (per service group)                                 */
/* ------------------------------------------------------------------ */

function BarMini({
  bars,
  color,
  active,
}: {
  bars: number[];
  color: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const W = 84;
  const H = 28;
  const gap = 3;
  const bw = (W - gap * (bars.length - 1)) / bars.length;
  const max = Math.max(...bars) || 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden>
      {bars.map((b, i) => {
        const bh = (b / max) * H;
        return (
          <motion.rect
            key={i}
            x={i * (bw + gap)}
            width={bw}
            rx={1.5}
            fill={color}
            fillOpacity={0.55}
            initial={{ height: reduce ? bh : 0, y: reduce ? H - bh : H }}
            animate={
              active || reduce
                ? { height: bh, y: H - bh }
                : { height: 0, y: H }
            }
            transition={{ duration: 0.5, delay: 0.05 * i, ease: "easeOut" }}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable animated section wrapper                                  */
/* ------------------------------------------------------------------ */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* Section heading shared style */
function SectionLabel({
  kicker,
  title,
  desc,
}: {
  kicker: string;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <div
        className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
        style={{
          color: GREEN,
          border: `1px solid ${BORDER_HOT}`,
          background: "rgba(52,211,153,0.06)",
        }}
      >
        <Activity className="h-3 w-3" />
        {kicker}
      </div>
      <h2
        className="font-display text-3xl font-semibold leading-tight md:text-4xl"
        style={{ color: TXT }}
      >
        {title}
      </h2>
      {desc && (
        <p className="mt-3 text-base leading-relaxed" style={{ color: MUT }}>
          {desc}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Panel chrome (the dashboard card frame)                            */
/* ------------------------------------------------------------------ */

function Panel({
  children,
  className,
  title,
  badge,
  badgeColor = GREEN,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl backdrop-blur-sm ${className ?? ""}`}
      style={{
        background: PANEL,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between border-b px-4 py-2.5"
          style={{ borderColor: BORDER }}
        >
          <div className="flex items-center gap-2">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#ef4444aa" }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#fbbf24aa" }} />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#34d399aa" }} />
            </span>
            <span
              className="font-mono text-[11px] uppercase tracking-wider"
              style={{ color: MUT }}
            >
              {title}
            </span>
          </div>
          {badge && (
            <span
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider"
              style={{ color: badgeColor }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: badgeColor }}
              />
              {badge}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PulseHome() {
  const reduce = useReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const heroIn = useInView(heroRef, { once: true, amount: 0.3 });

  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsIn = useInView(metricsRef, { once: true, amount: 0.3 });

  const gaugeRef = useRef<HTMLDivElement>(null);
  const gaugeIn = useInView(gaugeRef, { once: true, amount: 0.3 });

  const statusRef = useRef<HTMLDivElement>(null);
  const statusIn = useInView(statusRef, { once: true, amount: 0.2 });

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: BG, color: TXT }}
    >
      {/* ambient backdrop: dotted grid + radial glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${GRID} 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background: `radial-gradient(60% 100% at 20% 0%, ${GREEN}14, transparent 60%), radial-gradient(60% 100% at 85% 10%, ${BLUE}12, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        {/* ============================================================ */}
        {/*  HERO                                                        */}
        {/* ============================================================ */}
        <header ref={heroRef} className="pt-28 md:pt-32">
          {/* live status bar */}
          <Reveal>
            <div
              className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full px-4 py-2 font-mono text-xs"
              style={{
                width: "fit-content",
                background: PANEL,
                border: `1px solid ${BORDER}`,
                color: MUT,
              }}
            >
              <span className="flex items-center gap-2" style={{ color: GREEN }}>
                <span className="relative flex h-2 w-2">
                  {!reduce && (
                    <motion.span
                      className="absolute inline-flex h-full w-full rounded-full"
                      style={{ background: GREEN }}
                      animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ background: GREEN }}
                  />
                </span>
                ALL SYSTEMS OPERATIONAL
              </span>
              <span style={{ color: FAINT }}>·</span>
              <span>IFLEON · Nellore, India · since 2022</span>
            </div>
          </Reveal>

          <div className="grid items-center gap-10 pb-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* left: copy */}
            <div>
              <Reveal delay={0.05}>
                <h1
                  className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: TXT }}
                >
                  Infinite Possibilities,{" "}
                  <span
                    style={{
                      background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Logical Solutions.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p
                  className="mt-5 max-w-xl text-lg leading-relaxed"
                  style={{ color: MUT }}
                >
                  A founder-led AI, DevOps, Cloud, and Cybersecurity consultancy.
                  We instrument your systems, automate the boring parts, and keep
                  the dashboard green — for businesses and individuals alike.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={MAILTO}
                    className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`,
                      color: "#06250f",
                      boxShadow: `0 8px 28px -8px ${GREEN}88`,
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Request a Free Consultation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors"
                    style={{
                      color: TXT,
                      border: `1px solid ${BORDER}`,
                      background: PANEL,
                    }}
                  >
                    Explore Services
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-8 flex flex-wrap gap-2">
                  {HERO_STATS.map((s) => (
                    <span
                      key={s.label}
                      className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 font-mono text-[11px]"
                      style={{
                        border: `1px solid ${BORDER}`,
                        background: PANEL,
                        color: MUT,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.label}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* right: live throughput panel */}
            <Reveal delay={0.2}>
              <Panel title="ops / throughput.live" badge="STREAMING" badgeColor={GREEN}>
                <div className="px-4 pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <div
                        className="font-mono text-[11px] uppercase tracking-wider"
                        style={{ color: FAINT }}
                      >
                        requests / sec
                      </div>
                      <div
                        className="font-mono text-3xl font-semibold"
                        style={{ color: GREEN }}
                      >
                        <Counter to={1284} decimals={0} suffix="" active={heroIn} />
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-1 font-mono text-xs"
                      style={{ color: GREEN }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" />
                      +18.4%
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-[200px] w-full px-1 pb-2">
                  <HeroChart active={heroIn} />
                </div>
                <div
                  className="grid grid-cols-3 divide-x border-t font-mono"
                  style={{ borderColor: BORDER, color: MUT }}
                >
                  {[
                    { k: "p99", v: "42ms", c: GREEN },
                    { k: "err", v: "0.01%", c: GREEN },
                    { k: "sat", v: "100%", c: BLUE },
                  ].map((m) => (
                    <div
                      key={m.k}
                      className="px-3 py-3 text-center"
                      style={{ borderColor: BORDER }}
                    >
                      <div className="text-[10px] uppercase tracking-wider" style={{ color: FAINT }}>
                        {m.k}
                      </div>
                      <div className="text-sm font-semibold" style={{ color: m.c }}>
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </Reveal>
          </div>
        </header>

        {/* ============================================================ */}
        {/*  METRICS — stat panels with sparklines + counters           */}
        {/* ============================================================ */}
        <section ref={metricsRef} className="py-14">
          <Reveal>
            <div className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]" style={{ color: FAINT }}>
              <GaugeIcon className="h-3.5 w-3.5" /> metrics / snapshot
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.07}>
                <div
                  className="group relative overflow-hidden rounded-xl p-5 transition-colors"
                  style={{
                    background: PANEL_SOLID,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${m.color}, transparent)` }}
                  />
                  <div className="flex items-start justify-between">
                    <span
                      className="font-mono text-[11px] uppercase tracking-wider"
                      style={{ color: MUT }}
                    >
                      {m.label}
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }}
                    />
                  </div>
                  <div
                    className="mt-3 font-mono text-4xl font-semibold tabular-nums"
                    style={{ color: TXT }}
                  >
                    <Counter
                      to={m.value}
                      decimals={m.decimals}
                      suffix={m.suffix}
                      active={metricsIn}
                    />
                  </div>
                  <div className="mt-3" style={{ color: m.color }}>
                    <Sparkline values={m.spark} color={m.color} active={metricsIn} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* compliance row */}
          <Reveal delay={0.1}>
            <div
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl px-5 py-4 font-mono text-xs"
              style={{ background: PANEL, border: `1px solid ${BORDER}`, color: MUT }}
            >
              <span className="flex items-center gap-2" style={{ color: GREEN }}>
                <ShieldCheck className="h-4 w-4" /> COMPLIANCE
              </span>
              {COMPLIANCE.map((c) => (
                <span key={c} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: GREEN }} />
                  {c}
                </span>
              ))}
              <span className="ml-auto" style={{ color: FAINT }}>
                last audit: passing
              </span>
            </div>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/*  SERVICES — all 16, grouped, dashboard panels                */}
        {/* ============================================================ */}
        <section className="py-14">
          <Reveal>
            <SectionLabel
              kicker="capabilities / 16 modules"
              title="Everything you need on one console"
              desc="Sixteen services across Business, Individuals, and Specialty add-ons — each a building block we instrument, ship, and keep healthy."
            />
          </Reveal>

          <div className="space-y-10">
            {GROUPS.map((group, gi) => {
              const GroupIcon = group.icon;
              return (
                <Reveal key={group.key} delay={gi * 0.05}>
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{
                          color: group.color,
                          background: `${group.color}14`,
                          border: `1px solid ${group.color}33`,
                        }}
                      >
                        <GroupIcon className="h-[18px] w-[18px]" />
                      </span>
                      <div>
                        <h3
                          className="font-display text-xl font-semibold"
                          style={{ color: TXT }}
                        >
                          {group.title}
                        </h3>
                      </div>
                      <span
                        className="ml-2 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                        style={{
                          color: group.color,
                          border: `1px solid ${group.color}44`,
                        }}
                      >
                        {group.tag}
                      </span>
                      <span
                        className="ml-auto font-mono text-[11px]"
                        style={{ color: FAINT }}
                      >
                        {group.services.length.toString().padStart(2, "0")} active
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.services.map((svc, i) => {
                        const accent = ACCENTS[i % ACCENTS.length];
                        const Icon = svc.icon;
                        const bars = [
                          5 + ((i * 7) % 9),
                          8 + ((i * 3) % 7),
                          6 + ((i * 5) % 8),
                          10 + ((i * 2) % 6),
                          7 + ((i * 4) % 9),
                          11 + ((i * 6) % 5),
                        ];
                        return (
                          <ServiceCard
                            key={svc.id}
                            svc={svc}
                            Icon={Icon}
                            accent={accent}
                            bars={bars}
                          />
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  GAUGES — reliability snapshot                               */}
        {/* ============================================================ */}
        <section ref={gaugeRef} className="py-14">
          <Reveal>
            <Panel title="reliability / gauges" badge="LIVE" badgeColor={GREEN} className="">
              <div className="grid grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
                <GaugeRing pct={99.9} color={GREEN} label="Uptime" value="99.9%" active={gaugeIn} />
                <GaugeRing pct={96} color={BLUE} label="Lighthouse" value="96" active={gaugeIn} />
                <GaugeRing pct={92} color={VIOLET} label="Coverage" value="92%" active={gaugeIn} />
                <GaugeRing pct={88} color={AMBER} label="CSAT" value="88%" active={gaugeIn} />
              </div>
            </Panel>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/*  HOW WE WORK — pipeline                                      */}
        {/* ============================================================ */}
        <section className="py-14">
          <Reveal>
            <SectionLabel
              kicker="pipeline / 4 stages"
              title="A delivery pipeline, not a black box"
              desc="Every engagement runs through the same observable stages — so you always know what's shipping and why."
            />
          </Reveal>

          <div className="relative">
            {/* connecting line */}
            <div
              className="absolute left-0 right-0 top-7 hidden h-px lg:block"
              style={{
                background: `linear-gradient(90deg, ${GREEN}, ${BLUE}, ${VIOLET}, ${AMBER})`,
                opacity: 0.35,
              }}
            />
            <div className="grid gap-4 lg:grid-cols-4">
              {PROCESS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <Reveal key={p.step} delay={i * 0.08}>
                    <div
                      className="relative h-full rounded-xl p-5"
                      style={{ background: PANEL_SOLID, border: `1px solid ${BORDER}` }}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            color: p.color,
                            background: `${p.color}14`,
                            border: `1px solid ${p.color}33`,
                          }}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span
                          className="font-mono text-2xl font-semibold"
                          style={{ color: `${p.color}` }}
                        >
                          {p.step}
                        </span>
                      </div>
                      <h3
                        className="font-display text-lg font-semibold"
                        style={{ color: TXT }}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: MUT }}>
                        {p.desc}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  STATUS GRID — "live" service health                         */}
        {/* ============================================================ */}
        <section ref={statusRef} className="py-14">
          <Reveal>
            <Panel title="status / nodes" badge="8 / 8 HEALTHY" badgeColor={GREEN}>
              <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ background: BORDER }}>
                {STATUS_NODES.map((n, i) => (
                  <div
                    key={n.name}
                    className="flex items-center justify-between px-4 py-3.5"
                    style={{ background: PANEL_SOLID }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-2 w-2">
                        {!reduce && statusIn && (
                          <motion.span
                            className="absolute inline-flex h-full w-full rounded-full"
                            style={{ background: n.color }}
                            animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              delay: i * 0.18,
                            }}
                          />
                        )}
                        <span
                          className="relative inline-flex h-2 w-2 rounded-full"
                          style={{ background: n.color }}
                        />
                      </span>
                      <span className="font-mono text-xs" style={{ color: TXT }}>
                        {n.name}
                      </span>
                    </div>
                    <span className="font-mono text-[11px]" style={{ color: n.color }}>
                      {n.uptime}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </Reveal>
        </section>

        {/* ============================================================ */}
        {/*  TESTIMONIALS                                                */}
        {/* ============================================================ */}
        <section className="py-14">
          <Reveal>
            <SectionLabel
              kicker="signal / what clients report"
              title="The numbers that move after we ship"
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure
                  className="flex h-full flex-col rounded-xl p-6"
                  style={{ background: PANEL_SOLID, border: `1px solid ${BORDER}` }}
                >
                  <Quote className="h-6 w-6" style={{ color: t.color }} />
                  <blockquote
                    className="mt-4 flex-1 text-sm leading-relaxed"
                    style={{ color: TXT }}
                  >
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3 border-t pt-4" style={{ borderColor: BORDER }}>
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-semibold"
                      style={{
                        background: `${t.color}1a`,
                        color: t.color,
                        border: `1px solid ${t.color}40`,
                      }}
                    >
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold" style={{ color: TXT }}>
                        {t.name}
                      </span>
                      <span className="block font-mono text-[11px]" style={{ color: MUT }}>
                        {t.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/*  CLOSING CTA                                                 */}
        {/* ============================================================ */}
        <section className="pb-24 pt-10">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-2xl px-7 py-12 text-center sm:px-12"
              style={{
                background: PANEL_SOLID,
                border: `1px solid ${BORDER_HOT}`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(60% 120% at 50% 0%, ${GREEN}1f, transparent 60%)`,
                }}
              />
              <div className="relative">
                <div
                  className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]"
                  style={{ color: GREEN, border: `1px solid ${BORDER_HOT}` }}
                >
                  <Cpu className="h-3 w-3" /> ready to deploy
                </div>
                <h2
                  className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight md:text-4xl"
                  style={{ color: TXT }}
                >
                  Let's get your systems green and your roadmap moving.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: MUT }}>
                  Tell us what you're building. We'll reply with a clear scope, a
                  realistic timeline, and the first questions worth answering.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={MAILTO}
                    className="group inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`,
                      color: "#06250f",
                      boxShadow: `0 8px 28px -8px ${GREEN}88`,
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    info@ifleon.com
                  </a>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold"
                    style={{ color: TXT, border: `1px solid ${BORDER}`, background: PANEL }}
                  >
                    Explore Services
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={GITHUB}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-sm font-semibold"
                    style={{ color: MUT, border: `1px solid ${BORDER}`, background: PANEL }}
                  >
                    <Github className="h-4 w-4" />
                    github.com/ifleonlabs
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card (own in-view so bars animate when scrolled to)        */
/* ------------------------------------------------------------------ */

function ServiceCard({
  svc,
  Icon,
  accent,
  bars,
}: {
  svc: Service;
  Icon: Service["icon"];
  accent: string;
  bars: number[];
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden rounded-xl p-4"
      style={{ background: PANEL_SOLID, border: `1px solid ${BORDER}` }}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      {/* hover accent glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(70% 60% at 80% 0%, ${accent}14, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            color: accent,
            background: `${accent}14`,
            border: `1px solid ${accent}33`,
          }}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className="opacity-70">
          <BarMini bars={bars} color={accent} active={inView} />
        </span>
      </div>
      <h4
        className="relative mt-3 font-semibold leading-snug"
        style={{ color: TXT }}
      >
        {svc.title}
      </h4>
      <p className="relative mt-1 text-sm leading-relaxed" style={{ color: MUT }}>
        {svc.tagline}
      </p>
      <div
        className="relative mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: accent }}
      >
        <Circle className="h-2 w-2 fill-current" />
        operational
      </div>
    </motion.div>
  );
}
