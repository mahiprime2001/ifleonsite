/* V4 — FORGE: dark, motion-rich combination theme.
   Combines: real R3F 3D centerpiece (glossy distorted icosahedron, mouse-reactive),
   a bento grid layout, glassmorphism tile surfaces, gradient-mesh ambient glow,
   and GSAP/ScrollTrigger section reveals. Self-contained; no Header/Footer. */
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  ShieldCheck,
  Workflow,
  Quote,
  Gauge,
  Layers,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ============================== palette ============================== */
const C = {
  bg: "#05060b",
  bg2: "#0a0d1a",
  panel: "rgba(18, 22, 40, 0.55)",
  panelHi: "rgba(28, 34, 60, 0.65)",
  border: "rgba(125, 145, 220, 0.16)",
  borderHi: "rgba(150, 175, 255, 0.4)",
  text: "#eef1ff",
  textDim: "#a6adcf",
  textFaint: "#6b7299",
  ember: "#ff7a45",
  ember2: "#ff4d6d",
  iris: "#7c8cff",
  iris2: "#5e6bff",
  cyan: "#36e0d0",
};

const MAIL =
  "mailto:info@ifleon.com?subject=Free%20Consultation%20Request&body=Hi%20IFLEON%20team%2C%0A%0AI%27d%20like%20to%20request%20a%20free%20consultation.";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ============================ 3D centerpiece ============================ */
function ForgeCore() {
  const meshRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  // Live pointer target (normalized -1..1), updated outside React for perf.
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = pointer.current.x;
    const py = pointer.current.y;
    const m = meshRef.current;
    if (m) {
      // Ease rotation toward pointer for a "reactive" feel + idle spin.
      m.rotation.y += delta * 0.25;
      m.rotation.x += (py * 0.45 - m.rotation.x) * Math.min(1, delta * 2.5);
      m.rotation.z += (px * 0.35 - m.rotation.z) * Math.min(1, delta * 2.5);
      m.position.x += (px * 0.4 - m.position.x) * Math.min(1, delta * 2);
      m.position.y += (-py * 0.3 - m.position.y) * Math.min(1, delta * 2);
    }
    const r = ringRef.current;
    if (r) {
      r.rotation.z = t * 0.15;
      r.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color={"#bcd0ff"} />
      <pointLight position={[-5, -2, -4]} intensity={28} color={C.ember} distance={22} />
      <pointLight position={[5, 2, 4]} intensity={20} color={C.iris} distance={22} />
      <pointLight position={[0, 4, -6]} intensity={14} color={C.cyan} distance={24} />

      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.45, 12]} />
          <MeshDistortMaterial
            color={"#2a3a8f"}
            emissive={"#ff5a3c"}
            emissiveIntensity={0.18}
            roughness={0.12}
            metalness={0.85}
            distort={0.42}
            speed={2.1}
          />
        </mesh>
      </Float>

      {/* Thin orbiting wire ring for extra depth */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.012, 16, 160]} />
        <meshStandardMaterial
          color={C.iris}
          emissive={C.iris}
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
    </>
  );
}

function HeroCanvas() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <ForgeCore />
      </Suspense>
    </Canvas>
  );
}

/* =============================== shared bits =============================== */
function MeshGlow() {
  // Gradient-mesh ambient glow behind everything.
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-32 -left-24 h-[42rem] w-[42rem] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${C.iris2}38, transparent 70%)` }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{ background: `radial-gradient(circle, ${C.ember}30, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[34rem] w-[34rem] rounded-full blur-[120px]"
        style={{ background: `radial-gradient(circle, ${C.cyan}24, transparent 70%)` }}
      />
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${C.iris} 1px, transparent 1px), linear-gradient(90deg, ${C.iris} 1px, transparent 1px)`,
          backgroundSize: "46px 46px",
        }}
      />
    </div>
  );
}

type TileProps = {
  children: ReactNode;
  className?: string;
  glow?: string;
  reveal?: boolean;
};

/* Glassmorphism tile: frosted surface, thin border, glow on hover.
   `data-reveal` is the hook GSAP/ScrollTrigger animates. */
function Tile({ children, className = "", glow = C.iris, reveal = true }: TileProps) {
  return (
    <div
      data-reveal={reveal ? "" : undefined}
      className={`group relative overflow-hidden rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${className}`}
      style={{
        background: C.panel,
        borderColor: C.border,
        boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = C.borderHi;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${C.borderHi}, 0 18px 50px -20px ${glow}66`;
        e.currentTarget.style.background = C.panelHi;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.04) inset";
        e.currentTarget.style.background = C.panel;
      }}
    >
      <div
        className="pointer-events-none absolute -top-px left-6 right-6 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${glow}, transparent)` }}
      />
      {children}
    </div>
  );
}

function IconBadge({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <span
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border"
      style={{
        color,
        borderColor: `${color}55`,
        background: `linear-gradient(140deg, ${color}26, transparent)`,
      }}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function GroupBadge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
      style={{ color: C.iris, borderColor: C.border, background: "rgba(124,140,255,0.08)" }}
    >
      {children}
    </span>
  );
}

/* maps service tailwind "from-x to-y" gradients to a representative hex glow */
const GLOW_BY_COLOR: Record<string, string> = {
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  red: "#ef4444",
  orange: "#f97316",
  green: "#22c55e",
  teal: "#14b8a6",
  indigo: "#6366f1",
  sky: "#0ea5e9",
  rose: "#f43f5e",
  amber: "#f59e0b",
  yellow: "#eab308",
  fuchsia: "#d946ef",
  emerald: "#10b981",
  violet: "#8b5cf6",
};
function glowFor(service: Service): string {
  const m = service.color.match(/from-(\w+)-/);
  return (m && GLOW_BY_COLOR[m[1]]) || C.iris;
}

function ServiceTile({ service, big = false }: { service: Service; big?: boolean }) {
  const glow = glowFor(service);
  const Icon = service.icon as LucideIcon;
  return (
    <Tile glow={glow} className={big ? "md:col-span-2" : ""}>
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <IconBadge icon={Icon} color={glow} />
          <ArrowRight
            className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: glow }}
          />
        </div>
        <h3 className="text-base font-semibold leading-snug" style={{ color: C.text }}>
          {service.title}
        </h3>
        <p className="mt-1 text-sm font-medium" style={{ color: glow }}>
          {service.tagline}
        </p>
        {big && (
          <p className="mt-3 text-sm leading-relaxed" style={{ color: C.textDim }}>
            {service.description}
          </p>
        )}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap gap-1.5">
            {service.technologies.slice(0, big ? 5 : 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md px-2 py-0.5 text-[11px]"
                style={{ color: C.textFaint, background: "rgba(255,255,255,0.04)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  );
}

/* =============================== content data =============================== */
const METRICS = [
  { value: "25", label: "Projects Delivered", icon: Layers },
  { value: "6", label: "Industries Served", icon: Cpu },
  { value: "50+", label: "Clients Worldwide", icon: Sparkles },
  { value: "99.9%", label: "Uptime", icon: Gauge },
];

const STEPS = [
  {
    title: "Discover",
    desc: "We map your goals, constraints, and the highest-leverage problems worth solving first.",
    icon: Sparkles,
  },
  {
    title: "Design",
    desc: "Architecture, scope, and a phased plan — no surprises, no scope creep, clear milestones.",
    icon: Layers,
  },
  {
    title: "Build",
    desc: "Ship in tight iterations with CI/CD, tests, and security baked in from commit one.",
    icon: Workflow,
  },
  {
    title: "Scale",
    desc: "Monitoring, runbooks, and handover so your team owns it confidently long after launch.",
    icon: ShieldCheck,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Their CI/CD overhaul paid for itself in the first month.",
    name: "Head of Engineering",
    role: "B2B SaaS, India",
  },
  {
    quote:
      "The AI support copilot they built deflects over 40% of our tickets. It actually answers from our docs — not generic fluff.",
    name: "Operations Lead",
    role: "Fintech Platform",
  },
  {
    quote:
      "We passed our ISO 27001 audit on the first attempt. Calm, methodical, and genuinely on our side throughout.",
    name: "CTO",
    role: "Healthcare Startup",
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

/* =============================== main =============================== */
export default function ForgeHome() {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 42, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const businessTiles = useMemo(() => businessServices, []);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: `radial-gradient(120% 90% at 50% -10%, ${C.bg2}, ${C.bg} 60%)`,
        color: C.text,
      }}
    >
      <MeshGlow />

      {/* ============================ HERO (bento) ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:auto-rows-[minmax(0,1fr)]">
          {/* Headline tile */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 lg:row-span-2"
          >
            <Tile reveal={false} glow={C.iris} className="flex h-full flex-col justify-between">
              <div>
                <GroupBadge>
                  <Sparkles className="h-3.5 w-3.5" />
                  Founder-led · Nellore, India · Est. 2022
                </GroupBadge>
                <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Infinite Possibilities,
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(100deg, ${C.iris}, ${C.cyan} 45%, ${C.ember})`,
                    }}
                  >
                    Logical Solutions.
                  </span>
                </h1>
                <p
                  className="mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
                  style={{ color: C.textDim }}
                >
                  IFLEON is a founder-led AI, DevOps, Cloud, and Cybersecurity
                  consultancy. We forge intelligent systems for ambitious teams —
                  and the individuals behind them — across India and worldwide.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={MAIL}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(120deg, ${C.iris2}, ${C.ember2})`,
                    boxShadow: `0 14px 40px -14px ${C.iris2}`,
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Request a Free Consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors duration-200"
                  style={{
                    borderColor: C.borderHi,
                    color: C.text,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  Explore Services
                </Link>
              </div>
            </Tile>
          </motion.div>

          {/* 3D centerpiece tile */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-5 lg:row-span-2"
          >
            <div
              className="relative h-[20rem] overflow-hidden rounded-3xl border backdrop-blur-xl sm:h-full sm:min-h-[24rem]"
              style={{ background: C.panel, borderColor: C.border }}
            >
              {reducedMotion ? (
                // Static glass/gradient fallback — Canvas NOT mounted.
                <div className="absolute inset-0">
                  <div
                    className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                    style={{
                      background: `radial-gradient(circle, ${C.ember}aa, ${C.iris2}55, transparent 70%)`,
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{ borderColor: C.borderHi }}
                  />
                </div>
              ) : (
                <HeroCanvas />
              )}
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span
                  className="rounded-full border px-3 py-1 backdrop-blur"
                  style={{ borderColor: C.border, color: C.textDim }}
                >
                  Live system · interactive
                </span>
                <span style={{ color: C.textFaint }}>github.com/ifleonlabs</span>
              </div>
            </div>
          </motion.div>

          {/* Compliance / trust strip tile */}
          <div className="lg:col-span-7">
            <Tile glow={C.cyan} className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <IconBadge icon={ShieldCheck} color={C.cyan} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: C.text }}>
                    Compliance-ready by design
                  </p>
                  <p className="text-xs" style={{ color: C.textFaint }}>
                    Built to the standards enterprise buyers expect
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                    style={{
                      borderColor: C.border,
                      color: C.textDim,
                      background: "rgba(54,224,208,0.06)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Tile>
          </div>

          {/* small accent tile */}
          <div className="lg:col-span-5">
            <Tile glow={C.ember} className="flex items-center gap-4">
              <IconBadge icon={Github} color={C.ember} />
              <div className="min-w-0">
                <p className="text-sm font-semibold" style={{ color: C.text }}>
                  Open by default
                </p>
                <a
                  href="https://github.com/ifleonlabs"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline-offset-2 hover:underline"
                  style={{ color: C.textDim }}
                >
                  Browse our work on GitHub →
                </a>
              </div>
            </Tile>
          </div>
        </div>
      </section>

      {/* ============================ SERVICES (bento) ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div data-reveal className="mb-8 flex flex-col items-start gap-3">
          <GroupBadge>
            <Layers className="h-3.5 w-3.5" />
            What we forge
          </GroupBadge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sixteen services. One logical system.
          </h2>
          <p className="max-w-2xl text-base" style={{ color: C.textDim }}>
            From enterprise AI to securing your home network — grouped for
            businesses, individuals, and specialty engagements.
          </p>
        </div>

        {/* Business */}
        <div data-reveal className="mb-3">
          <GroupBadge>Business Solutions</GroupBadge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessTiles.map((s, i) => (
            <ServiceTile key={s.id} service={s} big={i === 0} />
          ))}
        </div>

        {/* Individuals */}
        <div data-reveal className="mb-3 mt-10">
          <GroupBadge>For Individuals</GroupBadge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {individualServices.map((s) => (
            <ServiceTile key={s.id} service={s} />
          ))}
        </div>

        {/* Specialty */}
        <div data-reveal className="mb-3 mt-10">
          <GroupBadge>Specialty &amp; Add-Ons</GroupBadge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {specialtyServices.map((s, i) => (
            <ServiceTile key={s.id} service={s} big={i === 0} />
          ))}
        </div>
      </section>

      {/* ============================ METRICS ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRICS.map((m) => (
            <Tile key={m.label} glow={C.iris} className="text-center">
              <span
                className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  color: C.iris,
                  borderColor: C.border,
                  background: "rgba(124,140,255,0.08)",
                }}
              >
                <m.icon className="h-5 w-5" />
              </span>
              <div
                className="bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
                style={{ backgroundImage: `linear-gradient(120deg, ${C.text}, ${C.iris})` }}
              >
                {m.value}
              </div>
              <p className="mt-1 text-sm" style={{ color: C.textDim }}>
                {m.label}
              </p>
            </Tile>
          ))}
        </div>
      </section>

      {/* ============================ HOW WE WORK ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div data-reveal className="mb-8">
          <GroupBadge>
            <Workflow className="h-3.5 w-3.5" />
            How we work
          </GroupBadge>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            A calm, four-step rhythm.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Tile key={step.title} glow={C.iris}>
              <div className="mb-4 flex items-center justify-between">
                <IconBadge icon={step.icon} color={C.iris} />
                <span className="font-mono text-2xl font-bold" style={{ color: C.textFaint }}>
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold" style={{ color: C.text }}>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: C.textDim }}>
                {step.desc}
              </p>
            </Tile>
          ))}
        </div>
      </section>

      {/* ============================ TESTIMONIALS ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <div data-reveal className="mb-8">
          <GroupBadge>
            <Quote className="h-3.5 w-3.5" />
            In their words
          </GroupBadge>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Tile key={t.name} glow={C.ember} className="flex h-full flex-col">
              <Quote className="h-7 w-7" style={{ color: `${C.ember}aa` }} />
              <p className="mt-4 flex-1 text-sm leading-relaxed" style={{ color: C.text }}>
                “{t.quote}”
              </p>
              <div className="mt-5 border-t pt-4" style={{ borderColor: C.border }}>
                <p className="text-sm font-semibold" style={{ color: C.text }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ color: C.textFaint }}>
                  {t.role}
                </p>
              </div>
            </Tile>
          ))}
        </div>
      </section>

      {/* ============================ CLOSING CTA ============================ */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] border p-8 backdrop-blur-xl sm:p-14"
          style={{ borderColor: C.borderHi, background: C.panelHi }}
        >
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full blur-[100px]"
            style={{ background: `radial-gradient(circle, ${C.ember}55, transparent 70%)` }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full blur-[100px]"
            style={{ background: `radial-gradient(circle, ${C.iris2}55, transparent 70%)` }}
          />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Let&apos;s forge what&apos;s next, together.
            </h2>
            <p className="mt-4 text-base sm:text-lg" style={{ color: C.textDim }}>
              Tell us about your project or your goals. We&apos;ll reply with a
              clear, no-pressure plan — whether you&apos;re a growing business or
              an individual leveling up.
            </p>
            <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
              <a
                href={MAIL}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(120deg, ${C.iris2}, ${C.ember2})`,
                  boxShadow: `0 14px 44px -14px ${C.ember2}`,
                }}
              >
                <Mail className="h-4 w-4" />
                Request a Free Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold"
                style={{
                  borderColor: C.borderHi,
                  color: C.text,
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Explore Services
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
                style={{ color: C.textDim }}
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
              </a>
            </div>
            <p className="mt-6 text-sm" style={{ color: C.textFaint }}>
              <a href={MAIL} className="hover:underline" style={{ color: C.iris }}>
                info@ifleon.com
              </a>{" "}
              · Nellore, India · serving India &amp; global
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
