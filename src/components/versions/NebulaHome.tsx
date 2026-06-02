/* V6 — Nebula: deep-dark immersive 3D scene homepage (React-Three-Fiber). */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles as SparklesIcon,
  ShieldCheck,
  Github,
  Mail,
  Building2,
  User,
  Layers,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ================================================================== */
/*  Static content                                                     */
/* ================================================================== */

const METRICS = [
  { value: "25", suffix: "", label: "Projects Delivered" },
  { value: "6", suffix: "", label: "Industries Served" },
  { value: "50", suffix: "+", label: "Clients & Individuals" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the highest-leverage problem worth solving first.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design",
    body: "Architecture, UX, and a delivery plan you can actually read — no black boxes.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Build & Ship",
    body: "Iterative builds with CI/CD, tests, and observability baked in from day one.",
  },
  {
    icon: LifeBuoy,
    step: "04",
    title: "Operate & Scale",
    body: "Monitoring, hardening, and a clean hand-off so it stays yours — and stays fast.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "They migrated us to AWS without a single minute of downtime and trimmed our cloud bill by nearly 40%. The runbooks they left behind are gold.",
    name: "Founder",
    role: "Fintech SaaS · India",
  },
  {
    quote:
      "Our support copilot now answers from our own docs and deflects almost half our tickets. It felt less like a vendor and more like an in-house team.",
    name: "Head of Product",
    role: "B2B Platform · Global",
  },
  {
    quote:
      "I switched into a DevOps role in six months with their guidance. The certification roadmap and mock interviews made all the difference.",
    name: "Cloud Engineer",
    role: "Individual · Career Switch",
  },
];

type Group = {
  key: string;
  label: string;
  icon: typeof Building2;
  blurb: string;
  services: Service[];
  glow: string;
};

const GROUPS: Group[] = [
  {
    key: "business",
    label: "Business Solutions",
    icon: Building2,
    blurb: "For startups, SMBs, SaaS & fintech teams shipping fast.",
    services: businessServices,
    glow: "#3B82F6",
  },
  {
    key: "individual",
    label: "For Individuals",
    icon: User,
    blurb: "Personal tech, security, and career guidance done right.",
    services: individualServices,
    glow: "#22D3EE",
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    icon: Layers,
    blurb: "Sharp, focused engagements that slot into your roadmap.",
    services: specialtyServices,
    glow: "#7C3AED",
  },
];

const BRAND = {
  blue: "#3B82F6",
  cyan: "#22D3EE",
  violet: "#7C3AED",
};

/* ================================================================== */
/*  3D Scene primitives                                                */
/* ================================================================== */

type FloatingShapeProps = {
  position: [number, number, number];
  scale: number;
  color: string;
  kind: "ico" | "sphere" | "torus";
  speed: number;
  distort?: number;
};

function FloatingShape({
  position,
  scale,
  color,
  kind,
  speed,
  distort = 0.35,
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const m = meshRef.current;
    if (!m) return;
    const t = state.clock.getElapsedTime();
    m.rotation.x = t * speed * 0.4;
    m.rotation.y = t * speed * 0.55;
  });

  return (
    <Float speed={speed * 1.6} rotationIntensity={0.8} floatIntensity={1.4}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {kind === "ico" && <icosahedronGeometry args={[1, 4]} />}
        {kind === "sphere" && <sphereGeometry args={[1, 48, 48]} />}
        {kind === "torus" && <torusKnotGeometry args={[0.8, 0.28, 160, 32]} />}
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.45}
          roughness={0.18}
          metalness={0.65}
          distort={distort}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

const SHAPES: FloatingShapeProps[] = [
  { position: [-3.6, 1.4, -2.5], scale: 1.15, color: BRAND.blue, kind: "ico", speed: 0.6, distort: 0.4 },
  { position: [3.8, -0.8, -3.5], scale: 1.4, color: BRAND.violet, kind: "sphere", speed: 0.45, distort: 0.5 },
  { position: [2.4, 2.0, -1.5], scale: 0.7, color: BRAND.cyan, kind: "torus", speed: 0.8, distort: 0.3 },
  { position: [-2.6, -1.8, -1.0], scale: 0.85, color: BRAND.cyan, kind: "ico", speed: 0.7, distort: 0.45 },
  { position: [0.4, -2.4, -4.5], scale: 1.7, color: BRAND.blue, kind: "sphere", speed: 0.35, distort: 0.35 },
  { position: [-4.6, -0.4, -5.0], scale: 1.0, color: BRAND.violet, kind: "torus", speed: 0.5, distort: 0.3 },
  { position: [4.4, 1.8, -5.5], scale: 1.1, color: BRAND.cyan, kind: "sphere", speed: 0.4, distort: 0.5 },
  { position: [-0.8, 2.6, -3.0], scale: 0.6, color: BRAND.blue, kind: "ico", speed: 0.9, distort: 0.5 },
  { position: [1.6, 0.2, -1.2], scale: 0.5, color: BRAND.violet, kind: "torus", speed: 1.0, distort: 0.25 },
];

/** Camera drift + smooth mouse parallax, driven by a shared pointer ref. */
function CameraRig({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame((state, delta) => {
    const { camera, clock } = state;
    const t = clock.getElapsedTime();
    // Constant slow cinematic drift + parallax target.
    const driftX = Math.sin(t * 0.12) * 0.5;
    const driftY = Math.cos(t * 0.1) * 0.35;
    const targetX = pointer.current.x * 1.6 + driftX;
    const targetY = pointer.current.y * 1.1 + driftY;
    const lerp = 1 - Math.pow(0.001, delta);
    camera.position.x += (targetX - camera.position.x) * lerp;
    camera.position.y += (targetY - camera.position.y) * lerp;
    camera.position.z = 8;
    camera.lookAt(0, 0, -2);
  });
  return null;
}

function NebulaScene({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <color attach="background" args={["#05060A"]} />
      <fog attach="fog" args={["#05060A", 7, 18]} />

      <ambientLight intensity={0.18} />
      <pointLight position={[6, 4, 6]} intensity={120} distance={40} color={BRAND.blue} />
      <pointLight position={[-7, -3, 4]} intensity={110} distance={40} color={BRAND.violet} />
      <pointLight position={[0, 5, -2]} intensity={90} distance={40} color={BRAND.cyan} />

      <Suspense fallback={null}>
        {SHAPES.map((s, i) => (
          <FloatingShape key={i} {...s} />
        ))}

        <Sparkles
          count={120}
          scale={[16, 12, 12]}
          size={2.2}
          speed={0.3}
          opacity={0.7}
          color={BRAND.cyan}
        />
        <Stars
          radius={60}
          depth={40}
          count={2400}
          factor={3.5}
          saturation={0}
          fade
          speed={0.6}
        />
      </Suspense>

      <CameraRig pointer={pointer} />
    </>
  );
}

function NebulaCanvas() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      className="absolute inset-0 h-full w-full"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <Suspense fallback={null}>
        <NebulaScene pointer={pointer} />
      </Suspense>
    </Canvas>
  );
}

/** Static CSS fallback for reduced-motion / non-WebGL. */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#05060A]">
      <div
        className="absolute -left-32 top-[-10%] h-[42rem] w-[42rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.55), transparent 70%)" }}
      />
      <div
        className="absolute -right-40 top-[20%] h-[40rem] w-[40rem] rounded-full opacity-35 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)" }}
      />
      <div
        className="absolute left-1/2 top-[55%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.45), transparent 70%)" }}
      />
    </div>
  );
}

/* ================================================================== */
/*  DOM helpers                                                        */
/* ================================================================== */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function GlassChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md">
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {blurb && <p className="mt-4 text-base leading-relaxed text-slate-400">{blurb}</p>}
    </motion.div>
  );
}

function ServiceCard({ service, glow }: { service: Service; glow: string }) {
  const Icon = service.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors duration-300 hover:border-white/20"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
      />
      <div
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5"
        style={{ boxShadow: `0 0 24px -8px ${glow}` }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white">{service.title}</h3>
      <p className="mt-1 text-sm font-medium" style={{ color: glow }}>
        {service.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400 line-clamp-3">
        {service.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function NebulaHome() {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const totalServices = useMemo(
    () => businessServices.length + individualServices.length + specialtyServices.length,
    []
  );

  const animate3D = mounted && !prefersReduced;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060A] text-slate-100 antialiased">
      {/* Global ambient overlay so glass sections read against the scene */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.12),transparent_55%)]" />

      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative isolate min-h-[92vh] pt-28 md:pt-32">
        {/* 3D scene / fallback */}
        <div className="absolute inset-0 -z-10">
          {animate3D ? <NebulaCanvas /> : <StaticBackdrop />}
          {/* readability gradient over the scene */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#05060A]/30 via-transparent to-[#05060A]" />
        </div>

        <motion.div
          style={prefersReduced ? undefined : { y: heroTextY, opacity: heroFade }}
          className="relative z-10 mx-auto max-w-5xl px-6 pb-24 text-center"
        >
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-md"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            Founder-led · AI · DevOps · Cloud · Security
          </motion.div>

          <motion.h1
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Infinite Possibilities,
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(34,211,238,0.25)]">
              Logical Solutions.
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-slate-300 md:text-lg"
          >
            IFLEON is a founder-led consultancy engineering AI, DevOps, cloud, and
            cybersecurity solutions for businesses and individuals — from Nellore, India to
            the world.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-[#05060A] shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)] transition-transform hover:scale-[1.03]"
            >
              Explore Services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="mailto:info@ifleon.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
              Start a Conversation
            </a>
          </motion.div>

          {/* Floating glass stat / compliance chips */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-2.5"
          >
            {METRICS.map((m) => (
              <GlassChip key={m.label}>
                <span className="font-semibold text-white">
                  {m.value}
                  {m.suffix}
                </span>
                <span className="text-slate-400">{m.label}</span>
              </GlassChip>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-white/10 sm:block" />
            {COMPLIANCE.map((c) => (
              <GlassChip key={c}>
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                {c}
              </GlassChip>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="What we build"
          title={`${totalServices} ways we move you forward`}
          blurb="One team across AI, DevOps, cloud, and security — for businesses scaling fast and individuals leveling up."
        />

        <div className="mt-16 space-y-20">
          {GROUPS.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.key}>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="mb-8 flex items-center gap-3"
                >
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                    style={{ boxShadow: `0 0 28px -10px ${group.glow}` }}
                  >
                    <GroupIcon className="h-5 w-5" style={{ color: group.glow }} />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{group.label}</h3>
                    <p className="text-sm text-slate-400">{group.blurb}</p>
                  </div>
                </motion.div>

                <motion.div
                  variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {group.services.map((service) => (
                    <ServiceCard key={service.id} service={service} glow={group.glow} />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- METRICS BAND ---------------- */}
      <section className="relative z-10 px-6 py-20">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl md:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.25), transparent 50%), radial-gradient(circle at 80% 100%, rgba(124,58,237,0.25), transparent 50%)",
            }}
          />
          <motion.div
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="relative grid grid-cols-2 gap-8 text-center md:grid-cols-4"
          >
            {METRICS.map((m) => (
              <motion.div key={m.label} variants={fadeUp}>
                <div className="bg-gradient-to-b from-white to-cyan-200 bg-clip-text text-5xl font-bold tracking-tight text-transparent [text-shadow:0_0_30px_rgba(34,211,238,0.2)] md:text-6xl">
                  {m.value}
                  {m.suffix}
                </div>
                <div className="mt-2 text-sm text-slate-400">{m.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------------- HOW WE WORK ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading
          eyebrow="How we work"
          title="A sequence you can actually follow"
          blurb="No black boxes. Every engagement runs the same clear arc — from first conversation to a system you own."
        />

        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {PROCESS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.step}
                variants={fadeUp}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
              >
                <div className="font-mono text-5xl font-bold text-white/[0.06]">{p.step}</div>
                <div
                  className="-mt-8 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5"
                  style={{
                    boxShadow: `0 0 24px -8px ${
                      [BRAND.blue, BRAND.cyan, BRAND.violet, BRAND.cyan][i % 4]
                    }`,
                  }}
                >
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <SectionHeading eyebrow="In their words" title="Outcomes, not promises" />

        <motion.div
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={i}
              variants={fadeUp}
              className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md"
            >
              <Quote className="h-7 w-7 text-cyan-300/40" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/10 pt-4">
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-slate-400">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      {/* ---------------- CLOSING CTA ---------------- */}
      <section className="relative z-10 px-6 pb-32 pt-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-16 text-center backdrop-blur-xl md:px-16 md:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.28), transparent 60%), radial-gradient(circle at 50% 120%, rgba(124,58,237,0.3), transparent 60%)",
            }}
          />
          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
              Let&apos;s engineer your next leap.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300">
              Tell us what you&apos;re building. We&apos;ll bring the architecture, the
              automation, and the security to make it real.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-7 py-3 text-sm font-semibold text-[#05060A] shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)] transition-transform hover:scale-[1.03]"
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                Browse all services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
