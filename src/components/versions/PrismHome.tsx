/* ============================================================
   V8 — "PRISM"
   Light, motion-rich COMBINATION theme: polished SaaS product
   page energy + marketing punch. Combines:
     (1) light GLASSMORPHISM — frosted panels, hairline borders,
         soft shadow, gentle hover glow;
     (2) BENTO grid layout (varied tile sizes);
     (3) INTERACTIVE LIVE STATISTICS — hand-drawn animated SVG
         charts: an area/line chart that draws in, sparklines,
         count-up tickers, a radial uptime gauge;
     (4) animated gradient-MESH background (soft, light, drifting);
     (5) GSAP + framer section reveals + subtle parallax.

   Self-contained. Allowed imports only:
   react, framer-motion, gsap, gsap/ScrollTrigger, lucide-react,
   react-router-dom. NO three.js / WebGL / chart libs / assets.
   Charts are drawn by hand with SVG. Honors prefers-reduced-motion.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Activity,
  Gauge,
  TrendingUp,
  ShieldCheck,
  Zap,
  Quote,
  Compass,
  PencilRuler,
  Rocket,
  LifeBuoy,
  Star,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- theme tokens (self-defined, light) ---------------- */
const INK = "#0E1430"; // primary deep ink text
const INK_SOFT = "#475078"; // secondary text
const INK_FAINT = "#8A92B2"; // tertiary text
const BORDER = "rgba(20,32,80,0.10)"; // hairline
const BORDER_STRONG = "rgba(20,32,80,0.16)";
const GLASS = "rgba(255,255,255,0.62)";
const GLASS_SOLID = "rgba(255,255,255,0.78)";
const VIOLET = "#7C5CFF";
const BLUE = "#2E7DFF";
const CYAN = "#21C7E6";
const PINK = "#FF6BC1";
const GREEN = "#22C58B";
const AMBER = "#FFB23E";

const SANS =
  'var(--font-sans, "Inter"), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const SHADOW =
  "0 1px 2px rgba(16,24,60,0.04), 0 12px 32px -12px rgba(40,60,140,0.22)";
const SHADOW_LG =
  "0 1px 2px rgba(16,24,60,0.05), 0 28px 60px -22px rgba(40,60,140,0.32)";

/* ============================================================
   Animated gradient-mesh background. A few soft blurred blobs
   that drift slowly. Reduced motion → static, no animation.
   ============================================================ */
function MeshBackground() {
  const reduced = useReducedMotion();
  const blobs = [
    { c: VIOLET, size: 620, top: "-12%", left: "-8%", dur: 26, dx: 60, dy: 40 },
    { c: BLUE, size: 560, top: "8%", left: "62%", dur: 30, dx: -70, dy: 50 },
    { c: CYAN, size: 480, top: "58%", left: "-6%", dur: 34, dx: 50, dy: -40 },
    { c: PINK, size: 520, top: "64%", left: "58%", dur: 28, dx: -50, dy: -60 },
  ];
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#F6F8FF 0%,#EEF2FF 38%,#F3F0FF 70%,#FFF4FB 100%)",
        pointerEvents: "none",
      }}
    >
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          animate={
            reduced
              ? undefined
              : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.08, 1] }
          }
          transition={
            reduced
              ? undefined
              : { duration: b.dur, repeat: Infinity, ease: "easeInOut" }
          }
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 30% 30%, ${b.c}66, ${b.c}00 70%)`,
            filter: "blur(60px)",
            mixBlendMode: "multiply",
          }}
        />
      ))}
      {/* faint grid for that product-page precision */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(20,32,80,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(20,32,80,0.045) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 30%, #000 30%, transparent 80%)",
        }}
      />
    </div>
  );
}

/* ---------------- glass panel primitive ---------------- */
function Glass({
  children,
  style,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  hover?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        position: "relative",
        borderRadius: 22,
        border: `1px solid ${h ? BORDER_STRONG : BORDER}`,
        background: GLASS,
        backdropFilter: "blur(18px) saturate(150%)",
        WebkitBackdropFilter: "blur(18px) saturate(150%)",
        boxShadow: h ? SHADOW_LG : SHADOW,
        transition:
          "box-shadow .4s ease, border-color .4s ease, transform .4s ease",
        transform: h && hover ? "translateY(-3px)" : "translateY(0)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* top sheen */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 38%)",
          pointerEvents: "none",
        }}
      />
      {/* hover glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "inherit",
          background: `radial-gradient(140% 120% at 50% -10%, ${VIOLET}1f, transparent 55%)`,
          opacity: h ? 1 : 0,
          transition: "opacity .4s ease",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ---------------- count-up ticker ---------------- */
function useCountUp(target: number, active: boolean, duration = 1400) {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) {
      setVal(target);
      return;
    }
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduced]);
  return val;
}

function Ticker({
  to,
  active,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  to: number;
  active: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const v = useCountUp(to, active);
  return (
    <span>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------- helpers for path building ---------------- */
function buildPath(
  values: number[],
  w: number,
  h: number,
  pad = 4,
): { line: string; area: string } {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  // smooth-ish line via simple segments
  const line = pts
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${
    h - pad
  } Z`;
  return { line, area };
}

/* ---------------- animated draw-in line/area chart ---------------- */
function AreaChart({
  active,
  values,
  stroke,
  fill,
}: {
  active: boolean;
  values: number[];
  stroke: string;
  fill: string;
}) {
  const reduced = useReducedMotion();
  const W = 520;
  const H = 200;
  const { line, area } = useMemo(() => buildPath(values, W, H, 10), [values]);
  const lineRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (lineRef.current) setLen(lineRef.current.getTotalLength());
  }, [line]);

  const gid = "prism-area-grad";
  const draw = reduced || !active ? 1 : undefined;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={0.34} />
          <stop offset="100%" stopColor={fill} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={10}
          x2={W - 10}
          y1={10 + g * (H - 20)}
          y2={10 + g * (H - 20)}
          stroke="rgba(20,32,80,0.07)"
          strokeWidth={1}
        />
      ))}
      <motion.path
        d={area}
        fill={`url(#${gid})`}
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={{ opacity: active || reduced ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.path
        ref={lineRef}
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          draw
            ? undefined
            : { strokeDasharray: len, strokeDashoffset: active ? 0 : len }
        }
        initial={false}
        animate={
          draw
            ? undefined
            : { strokeDashoffset: active ? 0 : len }
        }
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* ---------------- sparkline ---------------- */
function Sparkline({
  active,
  values,
  stroke,
}: {
  active: boolean;
  values: number[];
  stroke: string;
}) {
  const reduced = useReducedMotion();
  const W = 130;
  const H = 40;
  const { line } = useMemo(() => buildPath(values, W, H, 3), [values]);
  const ref = useRef<SVGPathElement>(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (ref.current) setLen(ref.current.getTotalLength());
  }, [line]);
  const drawn = reduced;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={40}>
      <motion.path
        ref={ref}
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          drawn ? undefined : { strokeDasharray: len, strokeDashoffset: active ? 0 : len }
        }
        animate={drawn ? undefined : { strokeDashoffset: active ? 0 : len }}
        transition={{ duration: 1.3, ease: "easeInOut" }}
      />
      <circle
        cx={W - 3}
        cy={
          3 +
          (1 -
            (values[values.length - 1] - Math.min(...values)) /
              (Math.max(...values) - Math.min(...values) || 1)) *
            (H - 6)
        }
        r={2.6}
        fill={stroke}
      />
    </svg>
  );
}

/* ---------------- radial gauge (uptime) ---------------- */
function RadialGauge({ active, value }: { active: boolean; value: number }) {
  const reduced = useReducedMotion();
  const size = 132;
  const r = 54;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = value / 100;
  const offset = circ * (1 - pct);
  const display = useCountUp(value, active);
  return (
    <div
      style={{ position: "relative", width: size, height: size, margin: "0 auto" }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="prism-gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GREEN} />
            <stop offset="100%" stopColor={CYAN} />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(20,32,80,0.08)"
          strokeWidth={10}
        />
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="url(#prism-gauge)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: reduced ? offset : circ }}
          animate={{ strokeDashoffset: active || reduced ? offset : circ }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 800, color: INK }}>
          {display.toFixed(1)}%
        </span>
        <span
          style={{
            fontSize: 10,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: INK_FAINT,
            fontWeight: 700,
          }}
        >
          Uptime
        </span>
      </div>
    </div>
  );
}

/* ---------------- live bar pulse (mini "live traffic") ---------------- */
function LivePulse({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  const bars = 16;
  const heights = useMemo(
    () => Array.from({ length: bars }, () => 0.3 + Math.random() * 0.7),
    [],
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height: 44,
      }}
    >
      {heights.map((hbase, i) => (
        <motion.div
          key={i}
          animate={
            reduced || !active
              ? { height: `${hbase * 100}%` }
              : {
                  height: [
                    `${hbase * 100}%`,
                    `${Math.min(100, hbase * 130) }%`,
                    `${hbase * 70}%`,
                    `${hbase * 100}%`,
                  ],
                }
          }
          transition={
            reduced || !active
              ? undefined
              : {
                  duration: 1.6 + (i % 4) * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.06,
                }
          }
          style={{
            flex: 1,
            borderRadius: 3,
            background: `linear-gradient(180deg, ${BLUE}, ${VIOLET})`,
            minHeight: 4,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- section reveal wrapper (framer in-view) ---------------- */
function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduced ? false : { opacity: 0, y }}
      animate={
        reduced
          ? undefined
          : inView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y }
      }
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- eyebrow pill ---------------- */
function Eyebrow({
  icon: Icon,
  children,
  color = VIOLET,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 14px",
        borderRadius: 999,
        border: `1px solid ${BORDER}`,
        background: GLASS_SOLID,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: ".04em",
        color: INK_SOFT,
        boxShadow: SHADOW,
      }}
    >
      <span style={{ color, display: "inline-flex" }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </span>
  );
}

/* ============================================================
   Hero live-stats panel — bundles charts; whole panel parallaxes.
   ============================================================ */
function HeroStatsPanel({ y }: { y: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const areaData = [22, 30, 26, 38, 34, 48, 44, 58, 64, 72, 68, 82];
  const reduced = useReducedMotion();

  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }}>
      <Glass style={{ padding: 22 }}>
        {/* header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`,
                color: "#fff",
                boxShadow: `0 6px 16px -6px ${VIOLET}aa`,
              }}
            >
              <Activity className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            </span>
            <div>
              <div style={{ fontWeight: 800, color: INK, fontSize: 14.5 }}>
                Delivery Health
              </div>
              <div style={{ fontSize: 11.5, color: INK_FAINT }}>
                live · last 12 sprints
              </div>
            </div>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: GREEN,
            }}
          >
            <motion.span
              animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
              transition={
                reduced
                  ? undefined
                  : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
              }
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: GREEN,
                display: "inline-block",
              }}
            />
            LIVE
          </span>
        </div>

        {/* big area chart */}
        <div style={{ height: 168 }}>
          <AreaChart active={inView} values={areaData} stroke={BLUE} fill={VIOLET} />
        </div>

        {/* mini stat row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 14,
          }}
        >
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              background: "rgba(255,255,255,0.55)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ fontSize: 11, color: INK_FAINT, fontWeight: 600 }}>
              Deploy frequency
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>
                <Ticker to={14} active={inView} suffix="×" />
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: GREEN,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <TrendingUp style={{ width: 12, height: 12 }} /> faster
              </span>
            </div>
            <Sparkline
              active={inView}
              values={[3, 4, 4, 6, 7, 9, 11, 14]}
              stroke={GREEN}
            />
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 14,
              background: "rgba(255,255,255,0.55)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ fontSize: 11, color: INK_FAINT, fontWeight: 600 }}>
              Build time
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: INK }}>
                <Ticker to={4.7} active={inView} decimals={1} suffix="m" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: BLUE }}>
                ↓ from 40m
              </span>
            </div>
            <Sparkline
              active={inView}
              values={[40, 33, 28, 22, 16, 11, 7, 5]}
              stroke={BLUE}
            />
          </div>
        </div>
      </Glass>
    </motion.div>
  );
}

/* ============================================================
   Service bento tile
   ============================================================ */
const accentFor = (id: string): string => {
  const map: Record<string, string> = {
    "ai-solutions": VIOLET,
    devops: BLUE,
    "cloud-migration": CYAN,
    cybersecurity: "#FF5E5E",
    "custom-development": GREEN,
    "digital-transformation": "#6C5CE7",
    "tech-support": BLUE,
    "personal-security": "#FF5E8A",
    "smart-home": "#13C29A",
    "career-guidance": AMBER,
    "mobile-apps": PINK,
    "ui-ux": "#E15CD8",
    "data-engineering": AMBER,
    "seo-performance": GREEN,
    automation: "#F2A93B",
    "ai-agents": VIOLET,
  };
  return map[id] ?? VIOLET;
};

function ServiceTile({
  service,
  large,
  index,
}: {
  service: Service;
  large?: boolean;
  index: number;
}) {
  const Icon = service.icon;
  const accent = accentFor(service.id);
  return (
    <Reveal
      delay={Math.min(index * 0.05, 0.3)}
      style={{
        gridColumn: large ? "span 2" : "span 1",
        height: "100%",
      }}
    >
      <Glass style={{ padding: large ? 24 : 20, height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                display: "grid",
                placeItems: "center",
                color: accent,
                background: `${accent}14`,
                border: `1px solid ${accent}26`,
              }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <ArrowRight
              className="h-4 w-4"
              style={{ color: INK_FAINT, opacity: 0.7 }}
            />
          </div>
          <h3
            style={{
              fontSize: large ? 18 : 15.5,
              fontWeight: 800,
              color: INK,
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {service.title}
          </h3>
          <p
            style={{
              fontSize: 12.5,
              fontWeight: 600,
              color: accent,
              margin: 0,
            }}
          >
            {service.tagline}
          </p>
          {large && (
            <p
              style={{
                fontSize: 13,
                color: INK_SOFT,
                lineHeight: 1.55,
                margin: "2px 0 0",
              }}
            >
              {service.description}
            </p>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {service.technologies.slice(0, large ? 4 : 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: INK_SOFT,
                  padding: "3px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${BORDER}`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Glass>
    </Reveal>
  );
}

/* ---------------- group of services in a bento grid ---------------- */
function ServiceGroup({
  label,
  accent,
  services,
}: {
  label: string;
  accent: string;
  services: Service[];
}) {
  return (
    <div style={{ marginTop: 40 }}>
      <Reveal>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: accent,
              boxShadow: `0 0 0 4px ${accent}22`,
            }}
          />
          <h3
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: INK_SOFT,
              margin: 0,
            }}
          >
            {label}
          </h3>
          <span
            style={{
              fontSize: 12,
              color: INK_FAINT,
              fontWeight: 600,
            }}
          >
            {services.length} services
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${BORDER}, transparent)`,
            }}
          />
        </div>
      </Reveal>
      <div className="prism-bento">
        {services.map((s, i) => (
          <ServiceTile
            key={s.id}
            service={s}
            index={i}
            large={i === 0 || (services.length > 4 && i === 3)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- metric chart card ---------------- */
function MetricCard({
  active,
  label,
  value,
  suffix,
  decimals = 0,
  accent,
  spark,
  gauge,
}: {
  active: boolean;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  accent: string;
  spark?: number[];
  gauge?: boolean;
}) {
  return (
    <Glass style={{ padding: 20, height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: INK_FAINT,
          }}
        >
          {label}
        </div>
        {gauge ? (
          <div style={{ marginTop: 4 }}>
            <RadialGauge active={active} value={value} />
          </div>
        ) : (
          <>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: INK,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              <Ticker to={value} active={active} decimals={decimals} suffix={suffix} />
            </div>
            <div style={{ flex: 1 }} />
            {spark && <Sparkline active={active} values={spark} stroke={accent} />}
          </>
        )}
      </div>
    </Glass>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function PrismHome() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  /* hero parallax via framer scroll */
  const { scrollY } = useScroll();
  const heroYRaw = useTransform(scrollY, [0, 600], [0, -60]);
  const panelYRaw = useTransform(scrollY, [0, 600], [0, 40]);
  const heroY = useSpring(heroYRaw, { stiffness: 90, damping: 22, mass: 0.4 });
  const panelY = useSpring(panelYRaw, { stiffness: 90, damping: 22, mass: 0.4 });

  /* metrics in-view */
  const metricsRef = useRef<HTMLDivElement>(null);
  const metricsInView = useInView(metricsRef, { once: true, margin: "-15% 0px" });

  /* GSAP: gentle staggered rise of section headers + subtle parallax of
     the marquee divider strips. Cleaned up on unmount. */
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".prism-gsap-head").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
          },
        });
      });
      gsap.utils.toArray<HTMLElement>(".prism-parallax").forEach((el) => {
        gsap.to(el, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const metrics = [
    {
      label: "Projects Delivered",
      value: 25,
      suffix: "",
      accent: VIOLET,
      spark: [4, 8, 11, 14, 18, 21, 23, 25],
    },
    {
      label: "Industries Served",
      value: 6,
      suffix: "",
      accent: BLUE,
      spark: [1, 2, 2, 3, 4, 5, 5, 6],
    },
    {
      label: "Happy Clients",
      value: 50,
      suffix: "+",
      accent: PINK,
      spark: [6, 12, 19, 27, 34, 41, 47, 50],
    },
  ];

  const steps = [
    {
      icon: Compass,
      title: "Discover",
      body: "We map your goals, constraints, and the highest-value problems worth solving first.",
      accent: VIOLET,
    },
    {
      icon: PencilRuler,
      title: "Design",
      body: "Architecture, UX, and a phased plan you can actually fund and ship.",
      accent: BLUE,
    },
    {
      icon: Rocket,
      title: "Deliver",
      body: "We build in tight loops — tested, CI/CD-driven, and demoable every step.",
      accent: GREEN,
    },
    {
      icon: LifeBuoy,
      title: "Sustain",
      body: "Monitoring, docs, and handover so your team owns it with confidence.",
      accent: AMBER,
    },
  ];

  const testimonials = [
    {
      quote:
        "IFLEON took us from quarterly releases to shipping daily. Build times went from 40 minutes to under five — and nobody fears deploys anymore.",
      name: "Head of Engineering",
      role: "B2B SaaS · India",
      accent: BLUE,
    },
    {
      quote:
        "Their AI assistant deflects over 40% of our support tickets and answers straight from our own docs. It paid for itself in a quarter.",
      name: "Founder",
      role: "Customer Support Platform",
      accent: VIOLET,
    },
    {
      quote:
        "We passed our ISO 27001 audit on the first attempt. The evidence packs and runbooks they left behind made it effortless.",
      name: "CTO",
      role: "Fintech · DPDP-regulated",
      accent: GREEN,
    },
  ];

  const btnPrimary: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 22px",
    borderRadius: 14,
    fontSize: 14.5,
    fontWeight: 700,
    color: "#fff",
    background: `linear-gradient(135deg, ${VIOLET}, ${BLUE})`,
    boxShadow: `0 10px 26px -10px ${VIOLET}cc`,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
  };
  const btnGhost: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "13px 22px",
    borderRadius: 14,
    fontSize: 14.5,
    fontWeight: 700,
    color: INK,
    background: GLASS_SOLID,
    border: `1px solid ${BORDER_STRONG}`,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: SHADOW,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div
      ref={rootRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        fontFamily: SANS,
        color: INK,
        isolation: "isolate",
      }}
    >
      {/* scoped responsive styles */}
      <style>{`
        .prism-wrap { max-width: 1160px; margin: 0 auto; padding-left: 22px; padding-right: 22px; }
        .prism-hero-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
        .prism-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .prism-metrics { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .prism-steps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .prism-quotes { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 760px) {
          .prism-bento { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 900px) {
          .prism-hero-grid { grid-template-columns: 1.05fr 0.95fr; gap: 56px; }
          .prism-metrics { grid-template-columns: 2fr 1fr 1fr 1.2fr; }
          .prism-steps { grid-template-columns: repeat(4, 1fr); }
          .prism-quotes { grid-template-columns: repeat(3, 1fr); }
          .prism-bento { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      <MeshBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ===================== HERO ===================== */}
        <section className="prism-wrap" style={{ paddingTop: 0 }}>
          <div
            className="pt-28 md:pt-32"
            style={{ paddingBottom: 64 }}
          >
            <motion.div className="prism-hero-grid" style={reduced ? undefined : { y: heroY }}>
              {/* left: copy */}
              <div>
                <Reveal>
                  <Eyebrow icon={Sparkles}>
                    Founder-led · AI · DevOps · Cloud · Security
                  </Eyebrow>
                </Reveal>
                <Reveal delay={0.06}>
                  <h1
                    style={{
                      fontSize: "clamp(34px, 5.6vw, 62px)",
                      lineHeight: 1.04,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      margin: "20px 0 0",
                      color: INK,
                    }}
                  >
                    Infinite Possibilities,{" "}
                    <span
                      style={{
                        background: `linear-gradient(120deg, ${VIOLET}, ${BLUE} 45%, ${CYAN})`,
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
                <Reveal delay={0.12}>
                  <p
                    style={{
                      fontSize: 17,
                      lineHeight: 1.6,
                      color: INK_SOFT,
                      maxWidth: 540,
                      margin: "20px 0 0",
                    }}
                  >
                    IFLEON is a founder-led consultancy from Nellore, India,
                    shipping AI, DevOps, cloud and cybersecurity work for
                    businesses and individuals — across India and worldwide.
                  </p>
                </Reveal>
                <Reveal delay={0.18}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      marginTop: 28,
                    }}
                  >
                    <a href="mailto:info@ifleon.com" style={btnPrimary}>
                      Request a Free Consultation
                      <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link to="/services" style={btnGhost}>
                      Explore Services
                    </Link>
                  </div>
                </Reveal>
                <Reveal delay={0.24}>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 18,
                      marginTop: 30,
                      alignItems: "center",
                    }}
                  >
                    {[
                      { icon: ShieldCheck, t: "ISO 27001" },
                      { icon: ShieldCheck, t: "DPDP" },
                      { icon: ShieldCheck, t: "SOC 2" },
                    ].map((c) => (
                      <span
                        key={c.t}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 7,
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: INK_SOFT,
                        }}
                      >
                        <c.icon
                          className="h-4 w-4"
                          style={{ color: GREEN }}
                        />
                        {c.t}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 12.5,
                        color: INK_FAINT,
                        fontWeight: 600,
                      }}
                    >
                      Est. 2022 · Nellore, India
                    </span>
                  </div>
                </Reveal>
              </div>

              {/* right: live stats panel + supporting tiles (bento-ish) */}
              <div style={{ display: "grid", gap: 16 }}>
                <HeroStatsPanel y={panelY} />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr",
                    gap: 16,
                  }}
                >
                  <Reveal delay={0.1}>
                    <Glass style={{ padding: 18, height: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Zap
                          className="h-4 w-4"
                          style={{ color: AMBER }}
                        />
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: INK_FAINT,
                            letterSpacing: ".06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Live requests
                        </span>
                      </div>
                      <LivePulse active />
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 12,
                          color: INK_SOFT,
                          fontWeight: 600,
                        }}
                      >
                        99.9% uptime, monitored 24/7
                      </div>
                    </Glass>
                  </Reveal>
                  <Reveal delay={0.16}>
                    <Glass style={{ padding: 18, height: "100%" }}>
                      <RadialGauge active value={99.9} />
                    </Glass>
                  </Reveal>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===================== SERVICES ===================== */}
        <section className="prism-wrap" style={{ paddingTop: 24, paddingBottom: 72 }}>
          <div className="prism-gsap-head">
            <Eyebrow icon={Sparkles} color={BLUE}>
              What we do
            </Eyebrow>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: INK,
                margin: "16px 0 8px",
              }}
            >
              Sixteen ways we move you forward
            </h2>
            <p
              style={{
                fontSize: 16,
                color: INK_SOFT,
                maxWidth: 620,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              From enterprise transformation to your home network — grouped for
              businesses, individuals, and specialty add-ons.
            </p>
          </div>

          <ServiceGroup
            label="For Business"
            accent={VIOLET}
            services={businessServices}
          />
          <ServiceGroup
            label="For Individuals"
            accent={BLUE}
            services={individualServices}
          />
          <ServiceGroup
            label="Specialty & Add-ons"
            accent={PINK}
            services={specialtyServices}
          />
        </section>

        {/* ===================== METRICS (live charts) ===================== */}
        <section
          ref={metricsRef}
          className="prism-wrap"
          style={{ paddingTop: 8, paddingBottom: 72 }}
        >
          <div className="prism-gsap-head" style={{ marginBottom: 24 }}>
            <Eyebrow icon={Gauge} color={GREEN}>
              By the numbers
            </Eyebrow>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: INK,
                margin: "16px 0 0",
              }}
            >
              Proof, not promises
            </h2>
          </div>
          <div className="prism-metrics">
            {/* big featured area metric */}
            <Reveal>
              <Glass style={{ padding: 22, height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: INK_FAINT,
                    }}
                  >
                    Cumulative delivery
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: GREEN,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <motion.span
                      animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
                      transition={
                        reduced
                          ? undefined
                          : { duration: 1.6, repeat: Infinity }
                      }
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: GREEN,
                        display: "inline-block",
                      }}
                    />
                    trending up
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: INK,
                    lineHeight: 1,
                  }}
                >
                  <Ticker to={25} active={metricsInView} /> projects
                </div>
                <div style={{ height: 120, marginTop: 10 }}>
                  <AreaChart
                    active={metricsInView}
                    values={[3, 6, 9, 12, 14, 17, 19, 22, 23, 24, 25]}
                    stroke={VIOLET}
                    fill={BLUE}
                  />
                </div>
              </Glass>
            </Reveal>

            {metrics.slice(1).map((m, i) => (
              <Reveal key={m.label} delay={0.08 * (i + 1)}>
                <MetricCard
                  active={metricsInView}
                  label={m.label}
                  value={m.value}
                  suffix={m.suffix}
                  accent={m.accent}
                  spark={m.spark}
                />
              </Reveal>
            ))}
            {/* first metric (projects) is featured above; show clients in slot already.
                Add uptime gauge as the last slot. */}
            <Reveal delay={0.3}>
              <MetricCard
                active={metricsInView}
                label="Uptime SLA"
                value={99.9}
                accent={GREEN}
                gauge
              />
            </Reveal>
          </div>
        </section>

        {/* ===================== HOW WE WORK ===================== */}
        <section className="prism-wrap" style={{ paddingTop: 8, paddingBottom: 72 }}>
          <div className="prism-gsap-head" style={{ marginBottom: 24 }}>
            <Eyebrow icon={Compass} color={VIOLET}>
              How we work
            </Eyebrow>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: INK,
                margin: "16px 0 0",
              }}
            >
              A calm, four-step path to shipped
            </h2>
          </div>
          <div className="prism-steps">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <Glass style={{ padding: 22, height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 13,
                        display: "grid",
                        placeItems: "center",
                        color: s.accent,
                        background: `${s.accent}14`,
                        border: `1px solid ${s.accent}26`,
                      }}
                    >
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: `${s.accent}3a`,
                        lineHeight: 1,
                      }}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: INK,
                      margin: "0 0 6px",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      color: INK_SOFT,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {s.body}
                  </p>
                </Glass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===================== TESTIMONIALS ===================== */}
        <section className="prism-wrap" style={{ paddingTop: 8, paddingBottom: 72 }}>
          <div className="prism-gsap-head" style={{ marginBottom: 24 }}>
            <Eyebrow icon={Star} color={AMBER}>
              In their words
            </Eyebrow>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                color: INK,
                margin: "16px 0 0",
              }}
            >
              Outcomes clients felt
            </h2>
          </div>
          <div className="prism-quotes">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <Glass style={{ padding: 24, height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      gap: 14,
                    }}
                  >
                    <Quote
                      className="h-7 w-7"
                      style={{ color: t.accent, opacity: 0.6 }}
                    />
                    <p
                      style={{
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: INK,
                        fontWeight: 500,
                        margin: 0,
                        flex: 1,
                      }}
                    >
                      “{t.quote}”
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        paddingTop: 6,
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      <span
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 800,
                          color: "#fff",
                          background: `linear-gradient(135deg, ${t.accent}, ${t.accent}99)`,
                        }}
                      >
                        {t.name.charAt(0)}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 800,
                            color: INK,
                          }}
                        >
                          {t.name}
                        </div>
                        <div style={{ fontSize: 12, color: INK_FAINT }}>
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </Glass>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ===================== CLOSING CTA ===================== */}
        <section className="prism-wrap" style={{ paddingTop: 8, paddingBottom: 96 }}>
          <Reveal>
            <Glass hover={false} style={{ padding: 0 }}>
              <div
                style={{
                  position: "relative",
                  padding: "48px 32px",
                  textAlign: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(120% 140% at 50% 0%, ${VIOLET}1a, transparent 60%)`,
                  }}
                />
                <div style={{ position: "relative" }}>
                  <h2
                    style={{
                      fontSize: "clamp(28px, 4.4vw, 48px)",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: INK,
                      margin: "0 0 12px",
                      lineHeight: 1.08,
                    }}
                  >
                    Let's turn your idea into
                    <br />
                    <span
                      style={{
                        background: `linear-gradient(120deg, ${VIOLET}, ${BLUE} 50%, ${CYAN})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      something live.
                    </span>
                  </h2>
                  <p
                    style={{
                      fontSize: 16,
                      color: INK_SOFT,
                      maxWidth: 540,
                      margin: "0 auto 28px",
                      lineHeight: 1.6,
                    }}
                  >
                    Tell us what you're building. We'll reply with a clear,
                    no-pressure plan and a rough timeline.
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      justifyContent: "center",
                    }}
                  >
                    <a href="mailto:info@ifleon.com" style={btnPrimary}>
                      <Mail className="h-4 w-4" />
                      info@ifleon.com
                    </a>
                    <Link to="/services" style={btnGhost}>
                      Explore Services
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="https://github.com/ifleonlabs"
                      target="_blank"
                      rel="noreferrer"
                      style={btnGhost}
                    >
                      <Github className="h-4 w-4" />
                      github.com/ifleonlabs
                    </a>
                  </div>
                </div>
              </div>
            </Glass>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
