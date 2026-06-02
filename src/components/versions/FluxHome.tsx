/* ============================================================
   V3 — "FLUX"
   Light, motion-rich COMBINATION theme. One cohesive scroll-driven
   homepage that layers six techniques:

   (1) Animated GRADIENT-MESH background — large soft multi-color
       blobs drifting via CSS @keyframes behind frosted glass.
   (2) SCROLLYTELLING — gsap + ScrollTrigger PIN a story section
       while a scrubbed "how we work" narrative advances step by step.
   (3) PARALLAX depth layers — foreground / mid / back move at
       different speeds via framer useScroll + useTransform.
   (4) INTERACTIVE STATISTICS — animated count-ups + hand-drawn SVG
       sparkline + donut that draw themselves in on view.
   (5) Light GLASSMORPHISM cards — frosted, subtle, over the mesh.
   (6) GSAP section reveals + clip-path cinematic transitions.

   Self-contained. Imports limited to:
   react, framer-motion, gsap, gsap/ScrollTrigger, lucide-react,
   react-router-dom. No three.js / WebGL / external assets.

   prefers-reduced-motion: every gsap pin/scrub/loop is gated and the
   effect early-returns; CSS drift / count-up render static fallbacks.
   ============================================================ */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Compass,
  Hammer,
  Rocket,
  LifeBuoy,
  Quote,
  Building2,
  User,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- theme tokens (self-defined, light) ---------------- */
const INK = "#0E1430"; // deep navy ink for text
const INK_SOFT = "#3A4366";
const INK_DIM = "#6B7396";
const PAPER = "#F7F8FC"; // light paper base
const VIOLET = "#7C5CFF";
const BLUE = "#3B82F6";
const CYAN = "#22D3EE";
const PINK = "#F472B6";
const AMBER = "#FBBF24";
const EMERALD = "#34D399";
const CARD_BORDER = "rgba(14,20,48,0.08)";
const GLASS = "rgba(255,255,255,0.55)";
const GLASS_STRONG = "rgba(255,255,255,0.72)";

const DISPLAY =
  'var(--font-display, "Fraunces"), Georgia, "Times New Roman", serif';
const MONO =
  'var(--font-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, Menlo, monospace';

/* ---------------- shared content ---------------- */
const METRICS = [
  { value: 25, suffix: "", label: "Projects Delivered", accent: VIOLET },
  { value: 6, suffix: "", label: "Industries Served", accent: BLUE },
  { value: 50, suffix: "+", label: "Clients Worldwide", accent: PINK },
  { value: 99.9, suffix: "%", label: "Uptime Maintained", accent: EMERALD },
];

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    blurb:
      "We map your goals, constraints, and the highest-value problem worth solving first — no jargon, no fluff.",
    accent: VIOLET,
  },
  {
    icon: Hammer,
    title: "Design & Build",
    blurb:
      "Tight, iterative delivery. Architecture, code, and review in short loops so you see progress every week.",
    accent: BLUE,
  },
  {
    icon: Rocket,
    title: "Ship",
    blurb:
      "Automated pipelines, zero-downtime cutover, and measurable outcomes — shipped to production with confidence.",
    accent: PINK,
  },
  {
    icon: LifeBuoy,
    title: "Support & Scale",
    blurb:
      "Monitoring, runbooks, and a partner on call. We harden, optimize, and grow with you long after launch.",
    accent: EMERALD,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Their DevOps overhaul paid for itself in the first month.",
    name: "Operations Lead",
    org: "Logistics SaaS · India",
    accent: BLUE,
  },
  {
    quote:
      "The AI assistant they built now deflects over 40% of our support tickets. It reads like it actually understands our docs.",
    name: "Head of Support",
    org: "Fintech · Singapore",
    accent: VIOLET,
  },
  {
    quote:
      "Hands-on, founder-led, and genuinely invested. They closed our ISO 27001 gaps and unlocked enterprise deals.",
    name: "Founder",
    org: "B2B Platform · UAE",
    accent: PINK,
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const CONSULT_MAILTO =
  "mailto:info@ifleon.com?subject=Free%20Consultation%20Request&body=Hi%20IFLEON%20team%2C%0A%0AI'd%20like%20to%20request%20a%20free%20consultation.";

/* ============================================================
   Animated count-up. Springs to value when in view.
   Reduced motion → renders the final value immediately.
   ============================================================ */
function CountUp({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduced]);

  const shown =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

/* ============================================================
   Hand-drawn SVG sparkline that draws itself in on view via
   stroke-dashoffset. Reduced motion → shows fully drawn.
   ============================================================ */
function Sparkline({ color }: { color: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  // gentle hand-drawn upward trend (jittered, not perfectly straight)
  const pts = [4, 9, 7, 13, 11, 18, 16, 24, 28, 26, 34, 40];
  const W = 132;
  const H = 46;
  const max = Math.max(...pts);
  const step = W / (pts.length - 1);
  const d = pts
    .map((p, i) => {
      const x = i * step;
      const y = H - (p / max) * (H - 6) - 3;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const draw = reduced || inView;

  return (
    <svg
      ref={ref}
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="flux-spark" x1="0" y1="0" x2={W} y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke="url(#flux-spark)"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 360,
          strokeDashoffset: draw ? 0 : 360,
          transition: reduced
            ? "none"
            : "stroke-dashoffset 1.6s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <circle
        cx={(pts.length - 1) * step}
        cy={H - (pts[pts.length - 1] / max) * (H - 6) - 3}
        r={3.4}
        fill={color}
        style={{
          opacity: draw ? 1 : 0,
          transition: reduced ? "none" : "opacity 0.5s ease 1.2s",
        }}
      />
    </svg>
  );
}

/* ============================================================
   Hand-drawn donut (uptime gauge) that sweeps in on view.
   ============================================================ */
function DonutGauge({
  percent,
  color,
}: {
  percent: number;
  color: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const R = 22;
  const C = 2 * Math.PI * R;
  const draw = reduced || inView;
  const offset = draw ? C * (1 - percent / 100) : C;

  return (
    <svg ref={ref} width={60} height={60} viewBox="0 0 60 60" aria-hidden>
      <circle
        cx={30}
        cy={30}
        r={R}
        fill="none"
        stroke="rgba(14,20,48,0.08)"
        strokeWidth={6}
      />
      <circle
        cx={30}
        cy={30}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
        style={{
          strokeDasharray: C,
          strokeDashoffset: offset,
          transition: reduced
            ? "none"
            : "stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

/* ============================================================
   Light glassmorphism service card.
   icon component takes only className → color via wrapper span
   using currentColor.
   ============================================================ */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  // derive an accent from a small palette cycle (don't rely on tailwind tokens)
  const palette = [VIOLET, BLUE, CYAN, PINK, AMBER, EMERALD];
  const accent = palette[index % palette.length];
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col rounded-2xl p-5"
      style={{
        background: GLASS,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: "0 10px 30px -18px rgba(14,20,48,0.35)",
      }}
    >
      <span
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          color: accent,
          background: `${accent}1A`,
          border: `1px solid ${accent}33`,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h4
        className="text-base font-semibold leading-snug"
        style={{ color: INK }}
      >
        {service.title}
      </h4>
      <p
        className="mt-1 text-sm"
        style={{ color: accent, fontFamily: MONO, fontSize: "0.72rem" }}
      >
        {service.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_SOFT }}>
        {service.description}
      </p>
      <div
        className="mt-4 h-px w-full"
        style={{ background: `${accent}22` }}
      />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {service.technologies.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-full px-2 py-0.5 text-[0.66rem]"
            style={{
              fontFamily: MONO,
              color: INK_DIM,
              background: "rgba(14,20,48,0.04)",
              border: `1px solid ${CARD_BORDER}`,
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function GroupHeading({
  icon: Icon,
  kicker,
  title,
  accent,
}: {
  icon: typeof Building2;
  kicker: string;
  title: string;
  accent: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ color: accent, background: `${accent}1A` }}
      >
        <Icon className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
      </span>
      <div>
        <p
          className="text-[0.68rem] uppercase tracking-[0.2em]"
          style={{ fontFamily: MONO, color: INK_DIM }}
        >
          {kicker}
        </p>
        <h3
          className="text-xl font-semibold"
          style={{ color: INK, fontFamily: DISPLAY }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function FluxHome() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);

  /* ---- parallax depth layers (framer useScroll/useTransform) ---- */
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  // back / mid / fore move at different speeds
  const backY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const midY = useTransform(heroProgress, [0, 1], ["0%", "42%"]);
  const foreY = useTransform(heroProgress, [0, 1], ["0%", "-14%"]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const smoothBackY = useSpring(backY, { stiffness: 120, damping: 30 });
  const smoothMidY = useSpring(midY, { stiffness: 120, damping: 30 });

  /* ---- scrollytelling step index (driven by GSAP scrub) ---- */
  const [activeStep, setActiveStep] = useState(0);

  /* ---- GSAP: pin + scrub the story, plus section reveals ---- */
  useLayoutEffect(() => {
    if (reduced) return; // gate ALL gsap pins/scrubs/loops
    const root = rootRef.current;
    const story = storyRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      /* (6) section reveals — clip-path cinematic wipe + rise */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 40,
            clipPath: "inset(12% 0% 12% 0% round 18px)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      /* (2) scrollytelling — PIN the story while steps advance */
      if (story) {
        const panels = gsap.utils.toArray<HTMLElement>(
          "[data-story-panel]",
          story
        );
        ScrollTrigger.create({
          trigger: story,
          start: "top top",
          end: () => `+=${panels.length * 70}%`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(
              panels.length - 1,
              Math.floor(self.progress * panels.length)
            );
            setActiveStep(idx);
          },
        });

        // the connecting progress rail fills as you scrub
        gsap.fromTo(
          "[data-story-rail]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: story,
              start: "top top",
              end: () => `+=${panels.length * 70}%`,
              scrub: 0.6,
            },
          }
        );
      }
    }, root);

    return () => ctx.revert(); // clean up ALL triggers
  }, [reduced]);

  /* refresh triggers after first paint (fonts/layout) */
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-hidden"
      style={{ background: PAPER, color: INK }}
    >
      {/* ---------- (1) animated GRADIENT-MESH background ---------- */}
      <FluxMesh reduced={!!reduced} />

      {/* subtle grain / vignette for premium feel */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(255,255,255,0) 40%, rgba(247,248,252,0.7) 100%)",
        }}
      />

      {/* ============================ HERO ============================ */}
      <header
        ref={heroRef}
        className="relative z-10 px-5 pt-28 md:pt-32"
        style={{ minHeight: "100vh" }}
      >
        <div className="mx-auto max-w-6xl">
          {/* (3) parallax BACK layer — drifting soft accent ring */}
          <motion.div
            aria-hidden
            style={{ y: reduced ? 0 : smoothBackY }}
            className="pointer-events-none absolute inset-x-0 top-24 mx-auto flex justify-center"
          >
            <div
              style={{
                width: 520,
                height: 520,
                borderRadius: "9999px",
                background:
                  "conic-gradient(from 90deg, rgba(124,92,255,0.10), rgba(34,211,238,0.10), rgba(244,114,182,0.10), rgba(124,92,255,0.10))",
                filter: "blur(8px)",
              }}
            />
          </motion.div>

          {/* (3) parallax MID layer — content */}
          <motion.div
            style={{ y: reduced ? 0 : smoothMidY, opacity: reduced ? 1 : heroFade }}
            className="relative mx-auto max-w-3xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{
                fontFamily: MONO,
                color: INK_SOFT,
                background: GLASS_STRONG,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: VIOLET }} />
              Founder-led · AI · DevOps · Cloud · Security · Est. 2022
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl"
              style={{ fontFamily: DISPLAY, color: INK, letterSpacing: "-0.02em" }}
            >
              Infinite Possibilities,{" "}
              <span
                style={{
                  background: `linear-gradient(100deg, ${VIOLET}, ${BLUE} 45%, ${PINK})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Logical Solutions.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: INK_SOFT }}
            >
              IFLEON is a founder-led technology consultancy from Nellore, India —
              building AI, DevOps, cloud, and cybersecurity solutions for
              businesses and individuals across India and the globe.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <a
                href={CONSULT_MAILTO}
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(100deg, ${VIOLET}, ${BLUE})`,
                  boxShadow: "0 14px 30px -12px rgba(124,92,255,0.6)",
                }}
              >
                <Mail className="h-4 w-4" />
                Request a Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  color: INK,
                  background: GLASS_STRONG,
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* compliance pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-2"
            >
              <ShieldCheck
                className="h-3.5 w-3.5"
                style={{ color: EMERALD }}
              />
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-2.5 py-1 text-[0.68rem]"
                  style={{
                    fontFamily: MONO,
                    color: INK_DIM,
                    background: "rgba(14,20,48,0.04)",
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                >
                  {c}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* (3) parallax FORE layer — floating glass stat chips */}
          <motion.div
            aria-hidden
            style={{ y: reduced ? 0 : foreY }}
            className="pointer-events-none relative mx-auto mt-12 hidden max-w-4xl md:block"
          >
            <FloatingChip
              text="35% fewer stockouts"
              accent={VIOLET}
              className="absolute left-0 top-0"
            />
            <FloatingChip
              text="build times 40m → <5m"
              accent={BLUE}
              className="absolute right-2 top-6"
            />
            <FloatingChip
              text="40%+ tickets deflected"
              accent={PINK}
              className="absolute left-10 top-20"
            />
          </motion.div>
        </div>
      </header>

      {/* ============== (4) INTERACTIVE STATISTICS ============== */}
      <section
        data-reveal
        className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20"
      >
        <div
          className="rounded-3xl p-6 md:p-10"
          style={{
            background: GLASS,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: "0 24px 60px -32px rgba(14,20,48,0.4)",
          }}
        >
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
            {/* count-ups */}
            <div className="grid grid-cols-2 gap-6">
              {METRICS.map((m) => (
                <div key={m.label}>
                  <div
                    className="text-4xl font-semibold md:text-5xl"
                    style={{ fontFamily: DISPLAY, color: m.accent }}
                  >
                    <CountUp
                      value={m.value}
                      suffix={m.suffix}
                      decimals={m.value % 1 !== 0 ? 1 : 0}
                    />
                  </div>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: INK_SOFT }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            {/* hand-drawn charts */}
            <div
              className="flex flex-col justify-center gap-5 rounded-2xl p-5"
              style={{
                background: GLASS_STRONG,
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="flex items-center gap-1.5 text-xs"
                    style={{ fontFamily: MONO, color: INK_DIM }}
                  >
                    <TrendingUp className="h-3.5 w-3.5" style={{ color: BLUE }} />
                    Client growth
                  </p>
                  <p className="text-sm font-medium" style={{ color: INK }}>
                    Trending up
                  </p>
                </div>
                <Sparkline color={BLUE} />
              </div>
              <div
                className="h-px w-full"
                style={{ background: CARD_BORDER }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs"
                    style={{ fontFamily: MONO, color: INK_DIM }}
                  >
                    Uptime SLA
                  </p>
                  <p className="text-sm font-medium" style={{ color: INK }}>
                    99.9% maintained
                  </p>
                </div>
                <DonutGauge percent={99.9} color={EMERALD} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SHOWCASE (all 16) ================= */}
      <section
        data-reveal
        className="relative z-10 mx-auto max-w-6xl px-5 py-12 md:py-16"
      >
        <div className="mb-10 max-w-2xl">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: MONO, color: VIOLET }}
          >
            What we do
          </p>
          <h2
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{ fontFamily: DISPLAY, color: INK, letterSpacing: "-0.02em" }}
          >
            Sixteen ways we turn problems into shipped solutions.
          </h2>
        </div>

        <GroupHeading
          icon={Building2}
          kicker="For Business"
          title="Business Solutions"
          accent={VIOLET}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessServices.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <GroupHeading
            icon={User}
            kicker="For Individuals"
            title="Individual Solutions"
            accent={BLUE}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {individualServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i + 1} />
            ))}
          </div>
        </div>

        <div className="mt-12">
          <GroupHeading
            icon={Layers}
            kicker="Specialty & Add-Ons"
            title="Specialty Services"
            accent={PINK}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i + 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ (2) SCROLLYTELLING — pinned "How we work" ============ */}
      <section
        ref={storyRef}
        className="relative z-10 flex min-h-screen items-center px-5 py-16"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1fr_1.1fr]">
          {/* LEFT: sticky narrative + progress rail */}
          <div className="relative">
            <p
              className="text-[0.7rem] uppercase tracking-[0.24em]"
              style={{ fontFamily: MONO, color: BLUE }}
            >
              How we work
            </p>
            <h2
              className="mt-2 text-3xl font-semibold md:text-4xl"
              style={{
                fontFamily: DISPLAY,
                color: INK,
                letterSpacing: "-0.02em",
              }}
            >
              Four steps, scrubbed as you scroll.
            </h2>
            <p className="mt-3 max-w-md text-sm" style={{ color: INK_SOFT }}>
              A tight, transparent delivery loop — from first conversation to
              long-term partnership.
            </p>

            {/* progress rail */}
            <div className="relative mt-8 hidden pl-6 md:block">
              <div
                className="absolute left-2 top-1 h-full w-0.5 rounded-full"
                style={{ background: CARD_BORDER }}
              />
              <div
                data-story-rail
                className="absolute left-2 top-1 h-full w-0.5 rounded-full"
                style={{
                  background: `linear-gradient(${VIOLET}, ${BLUE}, ${PINK}, ${EMERALD})`,
                  transform: reduced ? "scaleY(1)" : "scaleY(0)",
                  transformOrigin: "top",
                }}
              />
              <ul className="space-y-5">
                {STEPS.map((s, i) => (
                  <li
                    key={s.title}
                    className="flex items-center gap-3 transition-all"
                    style={{
                      opacity: reduced || i <= activeStep ? 1 : 0.4,
                    }}
                  >
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-semibold"
                      style={{
                        color:
                          reduced || i <= activeStep ? "#fff" : INK_DIM,
                        background:
                          reduced || i <= activeStep
                            ? s.accent
                            : "rgba(14,20,48,0.06)",
                        fontFamily: MONO,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: INK }}
                    >
                      {s.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: stacked story panels (active one elevated) */}
          <div className="relative min-h-[300px]">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = reduced ? true : i === activeStep;
              return (
                <div
                  key={s.title}
                  data-story-panel
                  className="md:absolute md:inset-0"
                  style={{
                    position: reduced ? "static" : undefined,
                    marginBottom: reduced ? 16 : undefined,
                    opacity: active ? 1 : 0,
                    transform: active
                      ? "translateY(0) scale(1)"
                      : "translateY(18px) scale(0.98)",
                    transition: reduced
                      ? "none"
                      : "opacity 0.5s ease, transform 0.5s ease",
                    pointerEvents: active ? "auto" : "none",
                  }}
                >
                  <div
                    className="rounded-3xl p-7 md:p-9"
                    style={{
                      background: GLASS_STRONG,
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      border: `1px solid ${CARD_BORDER}`,
                      boxShadow: "0 26px 60px -34px rgba(14,20,48,0.45)",
                    }}
                  >
                    <span
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                      style={{
                        color: s.accent,
                        background: `${s.accent}1A`,
                        border: `1px solid ${s.accent}33`,
                      }}
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                    <p
                      className="mt-5 text-xs"
                      style={{ fontFamily: MONO, color: s.accent }}
                    >
                      Step {i + 1} / {STEPS.length}
                    </p>
                    <h3
                      className="mt-1 text-2xl font-semibold md:text-3xl"
                      style={{ fontFamily: DISPLAY, color: INK }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mt-3 text-base leading-relaxed"
                      style={{ color: INK_SOFT }}
                    >
                      {s.blurb}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section
        data-reveal
        className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20"
      >
        <div className="mb-10 max-w-xl">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: MONO, color: PINK }}
          >
            In their words
          </p>
          <h2
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{ fontFamily: DISPLAY, color: INK, letterSpacing: "-0.02em" }}
          >
            Outcomes clients can measure.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.org}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl p-6"
              style={{
                background: GLASS,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1px solid ${CARD_BORDER}`,
                boxShadow: "0 14px 36px -22px rgba(14,20,48,0.35)",
              }}
            >
              <Quote className="h-6 w-6" style={{ color: t.accent }} />
              <blockquote
                className="mt-3 flex-1 text-sm leading-relaxed"
                style={{ color: INK }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-semibold" style={{ color: INK }}>
                  {t.name}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: MONO, color: INK_DIM }}
                >
                  {t.org}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section data-reveal className="relative z-10 mx-auto max-w-6xl px-5 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center md:p-14"
          style={{
            background: GLASS_STRONG,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: `1px solid ${CARD_BORDER}`,
            boxShadow: "0 30px 80px -40px rgba(14,20,48,0.5)",
          }}
        >
          {/* mesh glow inside the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(60% 80% at 20% 0%, ${VIOLET}22, transparent 60%), radial-gradient(60% 80% at 90% 100%, ${PINK}22, transparent 60%)`,
            }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-2xl text-3xl font-semibold md:text-4xl"
              style={{
                fontFamily: DISPLAY,
                color: INK,
                letterSpacing: "-0.02em",
              }}
            >
              Let's build something logical, scalable, and a little bit infinite.
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-base"
              style={{ color: INK_SOFT }}
            >
              Tell us about your project. We'll reply with a clear, honest plan —
              no obligation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(100deg, ${VIOLET}, ${BLUE})`,
                  boxShadow: "0 14px 30px -12px rgba(124,92,255,0.6)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  color: INK,
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  color: INK,
                  background: "rgba(255,255,255,0.6)",
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
              </a>
            </div>
            <p className="mt-8 text-xs" style={{ color: INK_DIM, fontFamily: MONO }}>
              IFLEON · Nellore, India · Founded 2022 · Infinite Possibilities,
              Logical Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* keyframes for the drifting mesh blobs */}
      <style>{FLUX_KEYFRAMES}</style>
    </div>
  );
}

/* ============================================================
   (1) Gradient-mesh background — large soft blobs drifting via
   CSS @keyframes. Reduced motion → blobs sit still (no animation).
   ============================================================ */
function FluxMesh({ reduced }: { reduced: boolean }) {
  const blobs: {
    color: string;
    style: CSSProperties;
    anim: string;
  }[] = [
    {
      color: VIOLET,
      anim: "flux-drift-a",
      style: { width: 560, height: 560, left: "-8%", top: "-6%" },
    },
    {
      color: CYAN,
      anim: "flux-drift-b",
      style: { width: 520, height: 520, right: "-6%", top: "4%" },
    },
    {
      color: PINK,
      anim: "flux-drift-c",
      style: { width: 600, height: 600, left: "18%", top: "42%" },
    },
    {
      color: BLUE,
      anim: "flux-drift-d",
      style: { width: 480, height: 480, right: "6%", top: "62%" },
    },
    {
      color: AMBER,
      anim: "flux-drift-a",
      style: { width: 420, height: 420, left: "-4%", top: "78%" },
    },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            borderRadius: "9999px",
            background: `radial-gradient(circle at 30% 30%, ${b.color}55, ${b.color}00 70%)`,
            filter: "blur(48px)",
            mixBlendMode: "multiply",
            animation: reduced ? "none" : `${b.anim} ${18 + i * 4}s ease-in-out infinite`,
            ...b.style,
          }}
        />
      ))}
    </div>
  );
}

/* floating glass stat chip used in hero foreground parallax layer */
function FloatingChip({
  text,
  accent,
  className,
}: {
  text: string;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-full px-3.5 py-2 text-xs ${className ?? ""}`}
      style={{
        fontFamily: MONO,
        color: INK_SOFT,
        background: GLASS_STRONG,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: `0 10px 24px -16px ${accent}`,
      }}
    >
      <span
        className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
        style={{ background: accent }}
      />
      {text}
    </div>
  );
}

const FLUX_KEYFRAMES = `
@keyframes flux-drift-a {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  33% { transform: translate3d(40px,30px,0) scale(1.08); }
  66% { transform: translate3d(-30px,20px,0) scale(0.96); }
}
@keyframes flux-drift-b {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  33% { transform: translate3d(-36px,28px,0) scale(1.05); }
  66% { transform: translate3d(24px,-22px,0) scale(0.98); }
}
@keyframes flux-drift-c {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(30px,-34px,0) scale(1.1); }
}
@keyframes flux-drift-d {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(-28px,30px,0) scale(0.94); }
}
`;
