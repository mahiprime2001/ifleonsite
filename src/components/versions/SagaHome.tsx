/* ============================================================================
 * V7 — "SAGA"  ·  Dark, cinematic SCROLLYTELLING journey for IFLEON
 * ----------------------------------------------------------------------------
 * A pinned, scrubbed narrative ("We build → automate → secure → scale") with:
 *   (1) GSAP + ScrollTrigger pinned/scrubbed scenes
 *   (2) a central SVG path that MORPHS between scenes
 *   (3) parallax depth layers moving at different rates
 *   (4) cinematic curtain / fade-through-black transitions
 *   (5) animated interactive statistics at the payoff
 *
 * Self-contained. Honors prefers-reduced-motion with a complete static render.
 * ==========================================================================*/

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Cpu,
  Workflow,
  ShieldCheck,
  Rocket,
  Quote,
  Building2,
  User,
  Layers,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ----------------------------- palette (inline) --------------------------- */
const C = {
  ink: "#05060d", // deepest background
  ink2: "#0a0c18", // panel
  navy: "#0d1230",
  blue: "#3b82f6", // electric blue
  blueSoft: "#60a5fa",
  cyan: "#22d3ee",
  violet: "#8b5cf6",
  amber: "#f59e0b",
  emerald: "#34d399",
  rose: "#fb7185",
  text: "#eef2ff",
  sub: "#9aa6c7",
  line: "rgba(120,140,200,0.14)",
};

/* ------------------------------ scene script ------------------------------ */
type Scene = {
  key: string;
  verb: string;
  kicker: string;
  title: string;
  body: string;
  accent: string;
  icon: typeof Cpu;
  /** central morph target path (drawn in a 0 0 200 200 viewBox) */
  d: string;
};

const SCENES: Scene[] = [
  {
    key: "build",
    verb: "Build",
    kicker: "Chapter I",
    title: "We build the foundation.",
    body: "Custom software, AI, and cloud-native systems — engineered from first principles for businesses and individuals alike.",
    accent: C.blue,
    icon: Cpu,
    // a solid block / monolith
    d: "M60 60 H140 V140 H60 Z",
  },
  {
    key: "automate",
    verb: "Automate",
    kicker: "Chapter II",
    title: "We automate the work.",
    body: "CI/CD pipelines, agents, and workflows so the repetitive parts route, approve, and report themselves.",
    accent: C.cyan,
    icon: Workflow,
    // interlocking gear-ish ring
    d: "M100 40 A60 60 0 1 1 99 40 M100 78 A22 22 0 1 0 101 78",
  },
  {
    key: "secure",
    verb: "Secure",
    kicker: "Chapter III",
    title: "We secure everything.",
    body: "ISO 27001, DPDP and SOC 2 aligned — threat detection, compliance, and proactive hardening baked in.",
    accent: C.emerald,
    icon: ShieldCheck,
    // shield
    d: "M100 36 L150 58 V104 C150 134 128 156 100 166 C72 156 50 134 50 104 V58 Z",
  },
  {
    key: "scale",
    verb: "Scale",
    kicker: "Chapter IV",
    title: "We scale without limits.",
    body: "Right-sized infrastructure that grows with demand. Infinite possibilities, logical solutions.",
    accent: C.violet,
    icon: Rocket,
    // upward arrow / chevron
    d: "M100 32 L168 132 H128 V168 H72 V132 H32 Z",
  },
];

/* --------------------------------- data ----------------------------------- */
const METRICS = [
  { value: 25, suffix: "", label: "Projects Delivered" },
  { value: 6, suffix: "", label: "Industries Served" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 99.9, suffix: "%", label: "Uptime SLA" },
];

const STEPS = [
  {
    n: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the highest-value problems worth solving first.",
  },
  {
    n: "02",
    title: "Architect",
    body: "A clear plan: the right stack, timeline, and milestones — no over-engineering.",
  },
  {
    n: "03",
    title: "Build & Secure",
    body: "We ship in iterations with tests, CI/CD, and security designed in from day one.",
  },
  {
    n: "04",
    title: "Scale & Support",
    body: "We optimize, monitor, and stay on as a partner long after launch.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Our build times dropped from 40 minutes to under five.",
    name: "Head of Engineering",
    role: "B2B SaaS Platform",
  },
  {
    quote:
      "The ISO 27001 readiness work closed two enterprise deals that had been stuck on security review for months.",
    name: "Founder & CEO",
    role: "Fintech Startup",
  },
  {
    quote:
      "As an individual, the career-guidance track got me from curious to a cloud role in under six months.",
    name: "Junior DevOps Engineer",
    role: "Career Switcher",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

/* ============================== component ================================= */
export default function SagaHome() {
  const root = useRef<HTMLDivElement>(null);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [reduced] = useState(prefersReduced);

  // refs for the pinned narrative
  const stageRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<SVGPathElement>(null);
  const haloRef = useRef<SVGCircleElement>(null);
  const sceneRefs = useRef<HTMLDivElement[]>([]);
  const layerFar = useRef<HTMLDivElement>(null);
  const layerMid = useRef<HTMLDivElement>(null);
  const layerNear = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const metricRefs = useRef<HTMLSpanElement[]>([]);
  const metricsSection = useRef<HTMLElement>(null);

  const setScene = (el: HTMLDivElement | null, i: number) => {
    if (el) sceneRefs.current[i] = el;
  };
  const setMetric = (el: HTMLSpanElement | null, i: number) => {
    if (el) metricRefs.current[i] = el;
  };

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* ---- pinned scrollytelling timeline ---- */
      const scenes = sceneRefs.current;
      const total = SCENES.length;

      // initial states
      gsap.set(scenes, { autoAlpha: 0, y: 40 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: () => `+=${total * 90}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current)
              gsap.set(progressRef.current, {
                scaleX: self.progress,
              });
          },
        },
      });

      for (let i = 0; i < total; i++) {
        const cur = scenes[i];
        const next = scenes[i + 1];
        const scene = SCENES[i];
        const nextScene = SCENES[i + 1];

        // hold the current scene
        tl.to(cur, { duration: 0.5 }, ">");

        if (next && nextScene) {
          const label = `t${i}`;
          tl.addLabel(label);
          // fade through black (curtain) between scenes
          tl.to(cur, { autoAlpha: 0, y: -40, duration: 0.4 }, label);
          tl.to(
            morphRef.current,
            {
              attr: { d: nextScene.d },
              stroke: nextScene.accent,
              duration: 0.6,
              ease: "power2.inOut",
            },
            label
          );
          tl.to(
            haloRef.current,
            { stroke: nextScene.accent, duration: 0.6 },
            label
          );
          tl.fromTo(
            next,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.4 },
            label + "+=0.25"
          );
        }
        void scene;
      }

      // continuous slow rotation on the morph group for life
      gsap.to(morphRef.current, {
        rotation: 360,
        transformOrigin: "100px 100px",
        repeat: -1,
        duration: 60,
        ease: "none",
      });

      /* ---- parallax depth layers across the whole page ---- */
      const par = (el: HTMLElement | null, rate: number) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: rate,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      };
      par(layerFar.current, -12);
      par(layerMid.current, -26);
      par(layerNear.current, -44);

      /* ---- animated statistics at the payoff ---- */
      metricRefs.current.forEach((node, i) => {
        const m = METRICS[i];
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: metricsSection.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              v: m.value,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                const isFloat = !Number.isInteger(m.value);
                node.textContent = isFloat
                  ? obj.v.toFixed(1) + m.suffix
                  : Math.round(obj.v).toString() + m.suffix;
              },
            });
          },
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  /* ======================= STATIC (reduced motion) ======================= */
  if (reduced) {
    return (
      <main
        className="min-h-screen w-full pt-28 md:pt-32"
        style={{ background: C.ink, color: C.text }}
      >
        <StaticHero />
        <div className="mx-auto max-w-5xl space-y-24 px-6 py-20">
          {SCENES.map((s) => (
            <section key={s.key} className="text-center">
              <SceneGlyph d={s.d} accent={s.accent} />
              <p
                className="mt-6 text-xs font-semibold uppercase tracking-[0.35em]"
                style={{ color: s.accent }}
              >
                {s.kicker} · {s.verb}
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">{s.title}</h2>
              <p
                className="mx-auto mt-4 max-w-xl text-base leading-relaxed"
                style={{ color: C.sub }}
              >
                {s.body}
              </p>
            </section>
          ))}
        </div>
        <ServicesShowcase />
        <MetricsStatic />
        <StepsSection />
        <Testimonials />
        <ClosingCTA />
      </main>
    );
  }

  /* ============================ MOTION VERSION =========================== */
  return (
    <main
      ref={root}
      className="relative min-h-screen w-full overflow-x-clip pt-28 md:pt-32"
      style={{ background: C.ink, color: C.text }}
    >
      {/* fixed parallax atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          ref={layerFar}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(1100px 700px at 18% 8%, ${C.navy} 0%, transparent 60%), radial-gradient(900px 600px at 88% 92%, rgba(59,130,246,0.10) 0%, transparent 60%)`,
          }}
        />
        <div ref={layerMid} className="absolute inset-0">
          <StarField count={60} opacity={0.5} />
        </div>
        <div ref={layerNear} className="absolute inset-0">
          <StarField count={28} opacity={0.9} large />
        </div>
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>

      {/* top scroll progress */}
      <div className="fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent">
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{
            transform: "scaleX(0)",
            background: `linear-gradient(90deg, ${C.blue}, ${C.cyan}, ${C.violet})`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ---- opening hero scene ---- */}
        <Hero />

        {/* ---- PINNED scrollytelling stage ---- */}
        <section
          ref={stageRef}
          className="relative h-screen w-full overflow-hidden"
        >
          {/* central morphing SVG */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="h-[min(62vh,560px)] w-[min(62vh,560px)] opacity-90"
              aria-hidden
            >
              <defs>
                <filter id="saga-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                ref={haloRef}
                cx="100"
                cy="100"
                r="86"
                fill="none"
                stroke={SCENES[0].accent}
                strokeOpacity="0.25"
                strokeWidth="0.75"
              />
              <path
                ref={morphRef}
                d={SCENES[0].d}
                fill="none"
                stroke={SCENES[0].accent}
                strokeWidth="2.2"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#saga-glow)"
              />
            </svg>
          </div>

          {/* scene text — stacked, cross-faded by GSAP */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            {SCENES.map((s, i) => (
              <div
                key={s.key}
                ref={(el) => setScene(el, i)}
                className="absolute max-w-2xl text-center"
              >
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em]"
                  style={{ borderColor: C.line, color: s.accent }}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.kicker} · {s.verb}
                </span>
                <h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                  {s.title}
                </h2>
                <p
                  className="mx-auto mt-5 max-w-xl text-lg leading-relaxed"
                  style={{ color: C.sub }}
                >
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* chapter dots */}
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3">
            {SCENES.map((s) => (
              <span
                key={s.key}
                className="h-2 w-2 rounded-full"
                style={{ background: s.accent, opacity: 0.55 }}
              />
            ))}
          </div>

          {/* curtain edges for cinematic framing */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24"
            style={{ background: `linear-gradient(${C.ink}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{ background: `linear-gradient(transparent, ${C.ink})` }}
          />
        </section>

        {/* fade-through-black transition into showcase */}
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, transparent, ${C.line}, transparent)` }}
        />

        <ServicesShowcase />
        <MetricsAnimated metricsSection={metricsSection} setMetric={setMetric} />
        <StepsSection />
        <Testimonials />
        <ClosingCTA />
      </div>
    </main>
  );
}

/* ============================ sub-components ============================== */

function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
      <motion.span
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em]"
        style={{ borderColor: C.line, color: C.blueSoft }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        IFLEON · Founder-led since 2022 · Nellore, India
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08 }}
        className="mt-7 text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
      >
        Infinite Possibilities,{" "}
        <span
          style={{
            background: `linear-gradient(90deg, ${C.blueSoft}, ${C.cyan}, ${C.violet})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Logical Solutions.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.16 }}
        className="mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
        style={{ color: C.sub }}
      >
        A founder-led AI, DevOps, Cloud, and Cybersecurity consultancy. Scroll to
        follow the story of how we take an idea from foundation to scale.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.24 }}
        className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
      >
        <a
          href="mailto:info@ifleon.com"
          className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.violet})` }}
        >
          Request a Free Consultation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
          style={{ borderColor: C.line, color: C.text }}
        >
          Explore Services
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.4em]"
        style={{ color: C.sub }}
      >
        Scroll to begin ↓
      </motion.div>
    </section>
  );
}

function StaticHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.3em]"
        style={{ borderColor: C.line, color: C.blueSoft }}
      >
        <Sparkles className="h-3.5 w-3.5" />
        IFLEON · Founder-led since 2022
      </span>
      <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
        Infinite Possibilities,{" "}
        <span style={{ color: C.blueSoft }}>Logical Solutions.</span>
      </h1>
      <p
        className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed"
        style={{ color: C.sub }}
      >
        A founder-led AI, DevOps, Cloud, and Cybersecurity consultancy serving
        businesses and individuals in India and worldwide.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="mailto:info@ifleon.com"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
          style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.violet})` }}
        >
          Request a Free Consultation <ArrowRight className="h-4 w-4" />
        </a>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold"
          style={{ borderColor: C.line, color: C.text }}
        >
          Explore Services
        </Link>
      </div>
    </section>
  );
}

function SceneGlyph({ d, accent }: { d: string; accent: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto h-28 w-28"
      aria-hidden
    >
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke={accent}
        strokeOpacity="0.25"
        strokeWidth="0.75"
      />
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarField({
  count,
  opacity,
  large,
}: {
  count: number;
  opacity: number;
  large?: boolean;
}) {
  // deterministic pseudo-random so SSR/CSR match and no asset needed
  const dots = Array.from({ length: count }, (_, i) => {
    const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const y = (Math.sin(i * 78.233) * 12543.987) % 1;
    return {
      left: Math.abs(x) * 100,
      top: Math.abs(y) * 100,
      size: large ? 2.5 : 1.5,
    };
  });
  return (
    <>
      {dots.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity,
            background: i % 3 === 0 ? C.cyan : C.blueSoft,
            boxShadow: `0 0 ${large ? 8 : 4}px ${C.blueSoft}`,
          }}
        />
      ))}
    </>
  );
}

/* --------------------------- services showcase ---------------------------- */
function ServiceCard({ s }: { s: Service }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border p-5 transition-colors"
      style={{ borderColor: C.line, background: C.ink2 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${C.blue}, transparent)` }}
      />
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "rgba(59,130,246,0.12)", color: C.blueSoft }}
      >
        <s.icon className="h-5 w-5" />
      </span>
      <h4 className="mt-4 text-base font-semibold leading-snug">{s.title}</h4>
      <p className="mt-1.5 text-sm" style={{ color: C.sub }}>
        {s.tagline}
      </p>
    </motion.div>
  );
}

function ServiceGroup({
  icon: Icon,
  label,
  items,
}: {
  icon: typeof Building2;
  label: string;
  items: Service[];
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: "rgba(139,92,246,0.14)", color: C.violet }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-lg font-semibold uppercase tracking-[0.18em]">
          {label}
        </h3>
        <span className="text-xs" style={{ color: C.sub }}>
          {items.length} services
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <ServiceCard key={s.id} s={s} />
        ))}
      </div>
    </div>
  );
}

function ServicesShowcase() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24">
      <header className="mb-14 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ color: C.cyan }}
        >
          The full arsenal
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-5xl">
          Sixteen ways we move you forward
        </h2>
        <p className="mx-auto mt-4 max-w-2xl" style={{ color: C.sub }}>
          From enterprise transformation to setting up your first secure laptop —
          every engagement runs the same Build → Automate → Secure → Scale story.
        </p>
      </header>

      <div className="space-y-16">
        <ServiceGroup icon={Building2} label="Business" items={businessServices} />
        <ServiceGroup icon={User} label="Individuals" items={individualServices} />
        <ServiceGroup icon={Layers} label="Specialty" items={specialtyServices} />
      </div>
    </section>
  );
}

/* -------------------------------- metrics --------------------------------- */
function MetricsAnimated({
  metricsSection,
  setMetric,
}: {
  metricsSection: RefObject<HTMLElement>;
  setMetric: (el: HTMLSpanElement | null, i: number) => void;
}) {
  return (
    <section
      ref={metricsSection}
      className="relative border-y py-24"
      style={{ borderColor: C.line, background: C.ink2 }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          The payoff, in numbers
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <div key={m.label} className="text-center">
              <span
                ref={(el) => setMetric(el, i)}
                className="block text-5xl font-bold tabular-nums md:text-6xl"
                style={{
                  background: `linear-gradient(90deg, ${C.blueSoft}, ${C.cyan})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                0{m.suffix}
              </span>
              <p
                className="mt-2 text-sm uppercase tracking-[0.18em]"
                style={{ color: C.sub }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <ComplianceRow />
      </div>
    </section>
  );
}

function MetricsStatic() {
  return (
    <section
      className="border-y py-20"
      style={{ borderColor: C.line, background: C.ink2 }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold md:text-4xl">
          The payoff, in numbers
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <span
                className="block text-5xl font-bold tabular-nums md:text-6xl"
                style={{ color: C.cyan }}
              >
                {Number.isInteger(m.value) ? m.value : m.value.toFixed(1)}
                {m.suffix}
              </span>
              <p
                className="mt-2 text-sm uppercase tracking-[0.18em]"
                style={{ color: C.sub }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <ComplianceRow />
      </div>
    </section>
  );
}

function ComplianceRow() {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
      <span className="text-xs uppercase tracking-[0.3em]" style={{ color: C.sub }}>
        Aligned with
      </span>
      {COMPLIANCE.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
          style={{ borderColor: C.line, color: C.text }}
        >
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: C.emerald }} />
          {c}
        </span>
      ))}
    </div>
  );
}

/* --------------------------------- steps ---------------------------------- */
function StepsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <header className="mb-14 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.35em]"
          style={{ color: C.violet }}
        >
          How we work
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-5xl">
          Four steps, one outcome
        </h2>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="relative rounded-2xl border p-6"
            style={{ borderColor: C.line, background: C.ink2 }}
          >
            <span
              className="text-5xl font-bold"
              style={{ color: "rgba(96,165,250,0.18)" }}
            >
              {s.n}
            </span>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: C.sub }}>
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ testimonials ------------------------------ */
function Testimonials() {
  return (
    <section
      className="border-y py-24"
      style={{ borderColor: C.line, background: C.ink2 }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">
          What partners say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border p-6"
              style={{ borderColor: C.line, background: C.ink }}
            >
              <Quote className="h-7 w-7" style={{ color: C.blue }} />
              <blockquote
                className="mt-4 text-base leading-relaxed"
                style={{ color: C.text }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="block" style={{ color: C.sub }}>
                  {t.role}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- closing CTA ------------------------------ */
function ClosingCTA() {
  const wrap: CSSProperties = {
    background: `radial-gradient(800px 400px at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 70%), ${C.ink}`,
  };
  return (
    <section className="relative px-6 py-28" style={wrap}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold leading-tight md:text-5xl">
          Your story starts with one conversation.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg" style={{ color: C.sub }}>
          Tell us where you are today, and we'll map the path from foundation to
          scale. No obligation, no jargon.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:info@ifleon.com"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: `linear-gradient(90deg, ${C.blue}, ${C.violet})` }}
          >
            <Mail className="h-4 w-4" />
            info@ifleon.com
          </a>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
            style={{ borderColor: C.line, color: C.text }}
          >
            Explore Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/ifleonlabs"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
            style={{ borderColor: C.line, color: C.text }}
          >
            <Github className="h-4 w-4" />
            github.com/ifleonlabs
          </a>
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.3em]" style={{ color: C.sub }}>
          IFLEON · Nellore, India · India + Global · Since 2022
        </p>
      </div>
    </section>
  );
}
