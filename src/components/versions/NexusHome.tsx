/* V5 — NEXUS combination theme
 * Dark, motion-rich, centered on an interactive 3D network/globe (R3F).
 * IFLEON = "Infinite Logical Elements of Network".
 */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
  type CSSProperties,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Compass,
  Layers,
  Rocket,
  ShieldCheck,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ───────────────────────── Palette (inline) ───────────────────────── */
const COLOR = {
  bg: "#04060f",
  bg2: "#070b1c",
  panel: "rgba(13,19,40,0.55)",
  ink: "#eef2ff",
  sub: "#9aa6d6",
  faint: "#6b76a8",
  cyan: "#35e0ff",
  blue: "#4f7bff",
  violet: "#9a6bff",
  line: "rgba(120,150,255,0.16)",
};

/* ───────────────────────── Globe geometry helpers ───────────────────────── */
type Vec3 = [number, number, number];

function fibonacciSphere(count: number, radius: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return pts;
}

/** Great-circle-ish arc lifted above the sphere surface between two nodes. */
function arcPoints(a: Vec3, b: Vec3, lift: number, segments = 26): Vec3[] {
  const start = new THREE.Vector3(...a);
  const end = new THREE.Vector3(...b);
  const out: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3().lerpVectors(start, end, t);
    const bulge = Math.sin(Math.PI * t) * lift;
    p.normalize().multiplyScalar(start.length() + bulge);
    out.push([p.x, p.y, p.z]);
  }
  return out;
}

/* ───────────────────────── R3F: animated globe ───────────────────────── */
const NODE_COUNT = 520;
const GLOBE_RADIUS = 2.05;

function GlobeNodes({ animate }: { animate: boolean }) {
  const positions = useMemo(() => {
    const pts = fibonacciSphere(NODE_COUNT, GLOBE_RADIUS);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      arr[i * 3] = p[0];
      arr[i * 3 + 1] = p[1];
      arr[i * 3 + 2] = p[2];
    });
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (!animate || !ref.current) return;
    const t = state.clock.elapsedTime;
    const m = ref.current.material as THREE.PointsMaterial;
    m.size = 0.045 + Math.sin(t * 1.4) * 0.012;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={COLOR.cyan}
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.92}
      />
    </Points>
  );
}

function ConnectionArcs({ animate }: { animate: boolean }) {
  const arcs = useMemo(() => {
    const nodes = fibonacciSphere(NODE_COUNT, GLOBE_RADIUS);
    const picked: { points: Vec3[]; hue: string; speed: number; phase: number }[] =
      [];
    const palette = [COLOR.cyan, COLOR.blue, COLOR.violet];
    // Deterministic pseudo-random pairing for stable arcs.
    let seed = 7;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 42; i++) {
      const a = nodes[Math.floor(rnd() * nodes.length)];
      const b = nodes[Math.floor(rnd() * nodes.length)];
      picked.push({
        points: arcPoints(a, b, 0.45 + rnd() * 0.55),
        hue: palette[i % palette.length],
        speed: 0.6 + rnd() * 1.1,
        phase: rnd() * Math.PI * 2,
      });
    }
    return picked;
  }, []);

  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!animate || !group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const a = arcs[i];
      const line = child as THREE.Object3D & {
        material?: THREE.Material & { opacity?: number };
      };
      if (line.material && "opacity" in line.material) {
        line.material.opacity =
          0.18 + (Math.sin(t * a.speed + a.phase) * 0.5 + 0.5) * 0.55;
      }
    });
  });

  return (
    <group ref={group}>
      {arcs.map((a, i) => (
        <Line
          key={i}
          points={a.points}
          color={a.hue}
          lineWidth={1}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      ))}
    </group>
  );
}

function GlobeRig({
  animate,
  pointer,
}: {
  animate: boolean;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (animate) {
      group.current.rotation.y += delta * 0.12;
      // Mouse parallax tilt, smoothed.
      const targetX = pointer.current.y * 0.35;
      const targetY = group.current.rotation.y; // keep auto-spin on Y
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX,
        0.05,
      );
      const extraY = pointer.current.x * 0.4;
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        extraY * 0.15,
        0.05,
      );
      void targetY;
      void state;
    } else {
      group.current.rotation.y = 0.5;
      group.current.rotation.x = 0.18;
    }
  });

  return (
    <group ref={group}>
      <GlobeNodes animate={animate} />
      <ConnectionArcs animate={animate} />
      {/* faint inner shell for depth */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 0.985, 32, 32]} />
        <meshBasicMaterial
          color={COLOR.blue}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

function GlobeScene({ animate }: { animate: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!animate) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [animate]);

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.2], fov: 45 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 6, 8]} intensity={1.1} color={COLOR.cyan} />
        <pointLight position={[-6, -4, -6]} intensity={0.7} color={COLOR.violet} />
        <GlobeRig animate={animate} pointer={pointer} />
      </Suspense>
    </Canvas>
  );
}

/* ───────────────────────── Small UI atoms ───────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]"
      style={{
        borderColor: "rgba(80,123,255,0.35)",
        background: "rgba(79,123,255,0.08)",
        color: COLOR.cyan,
      }}
    >
      {children}
    </span>
  );
}

/* ───────────────────────── Animated stat ───────────────────────── */
function AnimatedStat({
  value,
  suffix,
  label,
  decimals = 0,
  reduce,
}: {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obj = { n: 0 };
    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          gsap.to(obj, {
            n: value,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => setDisplay(obj.n),
          });
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduce]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-4xl font-black tracking-tight md:text-6xl"
        style={{
          background: `linear-gradient(180deg, ${COLOR.ink}, ${COLOR.cyan})`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {display.toFixed(decimals)}
        {suffix}
      </div>
      <div
        className="mt-2 text-xs font-medium uppercase tracking-[0.18em] md:text-sm"
        style={{ color: COLOR.sub }}
      >
        {label}
      </div>
    </div>
  );
}

/* ───────────────────────── Service card ───────────────────────── */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border p-6 transition-colors duration-300"
      style={{
        borderColor: COLOR.line,
        background: COLOR.panel,
        backdropFilter: "blur(10px)",
      }}
      whileHover={{ y: -6 }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: COLOR.blue }}
      />
      <span
        className="relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border"
        style={{
          borderColor: "rgba(80,123,255,0.3)",
          background: "rgba(53,224,255,0.08)",
          color: COLOR.cyan,
        }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3
        className="relative text-base font-bold leading-snug md:text-lg"
        style={{ color: COLOR.ink }}
      >
        {service.title}
      </h3>
      <p className="relative mt-2 text-sm" style={{ color: COLOR.sub }}>
        {service.tagline}
      </p>
    </motion.div>
  );
}

function ServiceGroup({
  title,
  blurb,
  items,
}: {
  title: string;
  blurb: string;
  items: Service[];
}) {
  return (
    <div className="mb-16 last:mb-0">
      <div className="mb-6 flex flex-col gap-1">
        <h3 className="text-xl font-bold md:text-2xl" style={{ color: COLOR.ink }}>
          {title}
        </h3>
        <p className="text-sm" style={{ color: COLOR.faint }}>
          {blurb}
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        {items.map((s, i) => (
          <ServiceCard key={s.id} service={s} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

/* ───────────────────────── Data ───────────────────────── */
const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    text: "We map your goals, constraints, and the highest-leverage problem worth solving first.",
  },
  {
    icon: Layers,
    title: "Architect",
    text: "A pragmatic blueprint — systems, data, and security designed to scale without rewrites.",
  },
  {
    icon: Rocket,
    title: "Build & Ship",
    text: "Tight iterations, CI/CD, and zero-drama deploys. You see progress every single week.",
  },
  {
    icon: ShieldCheck,
    title: "Operate & Scale",
    text: "Monitoring, hardening, and handover so the system stays fast, safe, and yours.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Build times went from 40 minutes to under five — and our 2 AM hotfixes are gone.",
    name: "Head of Engineering",
    role: "B2B SaaS, Bengaluru",
  },
  {
    quote:
      "Their AI assistant now deflects over 40% of our support tickets. It answers from our own docs, accurately, in seconds.",
    name: "Operations Director",
    role: "Fintech, Singapore",
  },
  {
    quote:
      "We closed two enterprise deals faster after the ISO 27001 readiness work. Audit-ready documentation, no penalties, no drama.",
    name: "Founder & CEO",
    role: "HealthTech, Hyderabad",
  },
];

/* ───────────────────────── Main ───────────────────────── */
export default function NexusHome() {
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;
  const rootRef = useRef<HTMLDivElement>(null);

  // Parallax for hero copy + globe layer.
  const { scrollYProgress } = useScroll();
  const heroFade = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroLift = useSpring(
    useTransform(scrollYProgress, [0, 0.18], [0, -120]),
    { stiffness: 120, damping: 30 },
  );
  const globeDrift = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [0, 90]),
    { stiffness: 80, damping: 28 },
  );

  // GSAP section reveals + clip-path cinematic transition.
  useEffect(() => {
    if (prefersReduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });

      const cine = document.querySelector<HTMLElement>("[data-cinematic]");
      if (cine) {
        gsap.fromTo(
          cine,
          { clipPath: "inset(18% 12% round 28px)", opacity: 0.55 },
          {
            clipPath: "inset(0% 0% round 0px)",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: cine,
              start: "top 88%",
              end: "top 32%",
              scrub: true,
            },
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const shellStyle: CSSProperties = {
    background: `radial-gradient(1200px 700px at 70% -10%, rgba(79,123,255,0.18), transparent 60%), radial-gradient(900px 600px at 10% 20%, rgba(154,107,255,0.12), transparent 55%), linear-gradient(180deg, ${COLOR.bg}, ${COLOR.bg2})`,
    color: COLOR.ink,
  };

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden" style={shellStyle}>
      {/* subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,150,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,150,255,0.06) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent 75%)",
        }}
      />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center px-6 pt-28 md:pt-32">
        {/* Globe layer (parallax) */}
        <motion.div
          className="absolute inset-x-0 top-10 mx-auto h-[60vh] max-w-4xl md:h-[78vh]"
          style={{ y: animate ? globeDrift : 0 }}
        >
          <GlobeScene animate={animate} />
        </motion.div>

        {/* Hero copy */}
        <motion.div
          className="relative z-10 mt-[34vh] flex flex-col items-center text-center md:mt-[40vh]"
          style={{ opacity: animate ? heroFade : 1, y: animate ? heroLift : 0 }}
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
          >
            <SectionLabel>
              <Sparkles className="h-3.5 w-3.5" />
              IFLEON · Infinite Logical Elements of Network
            </SectionLabel>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            Infinite Possibilities,{" "}
            <span
              style={{
                background: `linear-gradient(120deg, ${COLOR.cyan}, ${COLOR.blue} 55%, ${COLOR.violet})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Logical Solutions.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: COLOR.sub }}
          >
            A founder-led AI, DevOps, Cloud &amp; Cybersecurity consultancy out of
            Nellore, India — engineering connected systems for businesses and
            individuals, across India and the globe.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="mt-9 flex flex-col gap-4 sm:flex-row"
          >
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(120deg, ${COLOR.cyan}, ${COLOR.blue})`,
                color: "#04060f",
                boxShadow: "0 10px 40px rgba(53,224,255,0.3)",
              }}
            >
              <Mail className="h-4 w-4" />
              Request a Free Consultation
            </a>
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors duration-200"
              style={{
                borderColor: "rgba(120,150,255,0.35)",
                background: "rgba(255,255,255,0.02)",
                color: COLOR.ink,
              }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={4}
            className="mt-8 text-xs uppercase tracking-[0.2em]"
            style={{ color: COLOR.faint }}
          >
            ISO 27001 · DPDP · SOC 2 — compliance-ready by design
          </motion.p>
        </motion.div>
      </section>

      {/* ═══════════ METRICS ═══════════ */}
      <section className="relative mx-auto max-w-6xl px-6 py-20" data-reveal>
        <div
          className="grid grid-cols-2 gap-8 rounded-3xl border px-6 py-12 md:grid-cols-4"
          style={{
            borderColor: COLOR.line,
            background: COLOR.panel,
            backdropFilter: "blur(12px)",
          }}
        >
          <AnimatedStat value={25} label="Projects Delivered" reduce={!animate} />
          <AnimatedStat value={6} label="Industries Served" reduce={!animate} />
          <AnimatedStat
            value={50}
            suffix="+"
            label="Clients Worldwide"
            reduce={!animate}
          />
          <AnimatedStat
            value={99.9}
            suffix="%"
            decimals={1}
            label="Uptime SLA"
            reduce={!animate}
          />
        </div>
      </section>

      {/* ═══════════ SERVICES ═══════════ */}
      <section className="relative mx-auto max-w-7xl px-6 py-16" data-reveal>
        <div className="mb-12 max-w-2xl">
          <SectionLabel>
            <Layers className="h-3.5 w-3.5" />
            Capabilities
          </SectionLabel>
          <h2
            className="mt-5 text-3xl font-black tracking-tight md:text-5xl"
            style={{ color: COLOR.ink }}
          >
            One network, sixteen ways to move forward.
          </h2>
          <p className="mt-4 text-base" style={{ color: COLOR.sub }}>
            From enterprise AI and cloud to securing your home and launching your
            career — every node connects to the same logical core.
          </p>
        </div>

        <ServiceGroup
          title="For Business"
          blurb="Enterprise-grade engineering, security, and transformation."
          items={businessServices}
        />
        <ServiceGroup
          title="For Individuals"
          blurb="Personal tech, security, and guidance that actually helps."
          items={individualServices}
        />
        <ServiceGroup
          title="Specialty & Add-Ons"
          blurb="Focused engagements that plug into any engagement above."
          items={specialtyServices}
        />
      </section>

      {/* ═══════════ HOW WE WORK (cinematic clip-path reveal) ═══════════ */}
      <section className="relative py-20" data-cinematic>
        <div
          className="mx-auto max-w-7xl px-6 py-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(79,123,255,0.06), rgba(4,6,15,0))",
            borderTop: `1px solid ${COLOR.line}`,
            borderBottom: `1px solid ${COLOR.line}`,
          }}
        >
          <div className="mb-12 max-w-2xl">
            <SectionLabel>
              <Compass className="h-3.5 w-3.5" />
              How we work
            </SectionLabel>
            <h2
              className="mt-5 text-3xl font-black tracking-tight md:text-5xl"
              style={{ color: COLOR.ink }}
            >
              A clear path from idea to running system.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative rounded-2xl border p-6"
                  style={{ borderColor: COLOR.line, background: COLOR.panel }}
                >
                  <div
                    className="mb-4 text-xs font-bold"
                    style={{ color: COLOR.cyan }}
                  >
                    STEP {String(i + 1).padStart(2, "0")}
                  </div>
                  <span
                    className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: "rgba(80,123,255,0.3)",
                      background: "rgba(53,224,255,0.08)",
                      color: COLOR.cyan,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: COLOR.ink }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: COLOR.sub }}>
                    {step.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="relative mx-auto max-w-7xl px-6 py-20" data-reveal>
        <div className="mb-12 max-w-2xl">
          <SectionLabel>
            <Quote className="h-3.5 w-3.5" />
            Signal from the field
          </SectionLabel>
          <h2
            className="mt-5 text-3xl font-black tracking-tight md:text-5xl"
            style={{ color: COLOR.ink }}
          >
            Outcomes, not adjectives.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="relative flex flex-col rounded-2xl border p-7"
              style={{
                borderColor: COLOR.line,
                background: COLOR.panel,
                backdropFilter: "blur(10px)",
              }}
            >
              <Quote
                className="mb-4 h-7 w-7"
                style={{ color: COLOR.blue, opacity: 0.7 }}
              />
              <blockquote
                className="flex-1 text-sm leading-relaxed md:text-base"
                style={{ color: COLOR.ink }}
              >
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6">
                <div
                  className="text-sm font-bold"
                  style={{ color: COLOR.cyan }}
                >
                  {t.name}
                </div>
                <div className="text-xs" style={{ color: COLOR.faint }}>
                  {t.role}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ═══════════ CLOSING CTA ═══════════ */}
      <section className="relative mx-auto max-w-5xl px-6 pb-28 pt-8" data-reveal>
        <div
          className="relative overflow-hidden rounded-3xl border px-8 py-16 text-center md:px-16 md:py-20"
          style={{
            borderColor: "rgba(80,123,255,0.35)",
            background:
              "radial-gradient(700px 400px at 50% -20%, rgba(53,224,255,0.16), transparent 60%), linear-gradient(180deg, rgba(13,19,40,0.85), rgba(7,11,28,0.95))",
          }}
        >
          <div
            className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: COLOR.violet }}
          />
          <div
            className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: COLOR.cyan }}
          />
          <h2
            className="relative mx-auto max-w-3xl text-3xl font-black leading-tight tracking-tight md:text-5xl"
            style={{ color: COLOR.ink }}
          >
            Let&apos;s connect your next idea to the network.
          </h2>
          <p
            className="relative mx-auto mt-5 max-w-xl text-base"
            style={{ color: COLOR.sub }}
          >
            Tell us what you&apos;re building. We&apos;ll reply with a clear path,
            honest timeline, and the first node to light up.
          </p>
          <div className="relative mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:info@ifleon.com"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-[1.03]"
              style={{
                background: `linear-gradient(120deg, ${COLOR.cyan}, ${COLOR.blue})`,
                color: "#04060f",
                boxShadow: "0 10px 40px rgba(53,224,255,0.3)",
              }}
            >
              <Mail className="h-4 w-4" />
              info@ifleon.com
            </a>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold"
              style={{
                borderColor: "rgba(120,150,255,0.35)",
                color: COLOR.ink,
              }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-bold transition-colors duration-200"
              style={{
                borderColor: "rgba(120,150,255,0.2)",
                color: COLOR.sub,
              }}
            >
              <Github className="h-4 w-4" />
              github.com/ifleonlabs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
