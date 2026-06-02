/* ============================================================
   C9 — "LUMEN"
   Dark, cinematic 3D theme. Combines:
     (1) DYNAMIC LIGHTING — colored point + spot key lights that
         FOLLOW the pointer in useFrame, raking dramatic moving
         highlights across procedural objects and a dark floor;
     (2) VOLUMETRIC EFFECT — fake god-rays via a large soft
         additive cone/sprite glow from the key light, scene fog,
         bloom-ish emissive glows, and drei <Sparkles> dust motes
         catching the light;
     (3) DEPTH MAPPING / PARALLAX — several object layers at
         different Z that parallax with the pointer (closer layers
         move more), creating cinematic depth.

   Self-contained. Allowed imports only: react, @react-three/fiber,
   @react-three/drei, three, framer-motion, lucide-react,
   react-router-dom. NO GLTF / external textures / HDRIs /
   <Environment preset>. Explicit lights only. Honors
   prefers-reduced-motion (renders a static, unanimated frame).
   ============================================================ */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles as SparklesIcon,
  Compass,
  PencilRuler,
  Rocket,
  LifeBuoy,
  Quote,
  Star,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ---------------- theme tokens (dark, inline) ---------------- */
const BG = "#04060f"; // near-black navy
const PANEL = "rgba(255,255,255,0.04)";
const BORDER = "rgba(255,255,255,0.10)";
const TEXT = "#eef1ff";
const MUTED = "#9aa3c4";
const CYAN = "#4cc9ff";
const VIOLET = "#9b6bff";
const AMBER = "#ffb454";
const EMAIL = "mailto:info@ifleon.com";
const GITHUB = "https://github.com/ifleonlabs";

/* =====================================================================
   3D SCENE
   ===================================================================== */

type Ptr = { x: number; y: number };

/** A dramatically lit procedural object that parallaxes by depth. */
function LitShape({
  position,
  geometry,
  color,
  emissive,
  ptr,
  depth,
  reduced,
  rotationSpeed = 0.15,
}: {
  position: [number, number, number];
  geometry: "ico" | "torus" | "box" | "octa";
  color: string;
  emissive: string;
  ptr: React.MutableRefObject<Ptr>;
  depth: number; // 0 (far) .. 1 (near) -> parallax strength
  reduced: boolean;
  rotationSpeed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    if (!reduced) {
      m.rotation.x += delta * rotationSpeed;
      m.rotation.y += delta * rotationSpeed * 0.8;
      // parallax: closer (higher depth) layers move more with pointer
      const px = ptr.current.x * depth * 1.6;
      const py = ptr.current.y * depth * 1.6;
      m.position.x = THREE.MathUtils.lerp(m.position.x, base.x + px, 0.06);
      m.position.y = THREE.MathUtils.lerp(m.position.y, base.y - py, 0.06);
      const float = Math.sin(state.clock.elapsedTime * 0.6 + base.x) * 0.12;
      m.position.z = base.z + float;
    } else {
      m.position.copy(base);
      m.rotation.set(0.4, 0.7, 0);
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      {geometry === "ico" && <icosahedronGeometry args={[0.9, 0]} />}
      {geometry === "torus" && <torusGeometry args={[0.7, 0.26, 24, 64]} />}
      {geometry === "box" && <boxGeometry args={[1.1, 1.1, 1.1]} />}
      {geometry === "octa" && <octahedronGeometry args={[0.95, 0]} />}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.35}
        metalness={0.85}
        roughness={0.25}
      />
    </mesh>
  );
}

/** Soft additive cone = fake volumetric god-ray from the key light. */
function VolumetricCone({
  ptr,
  reduced,
}: {
  ptr: React.MutableRefObject<Ptr>;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m || reduced) return;
    const tx = ptr.current.x * 3.2;
    const ty = ptr.current.y * 2.0;
    m.position.x = THREE.MathUtils.lerp(m.position.x, tx, 0.05);
    m.position.y = THREE.MathUtils.lerp(m.position.y, 3.2 - ty, 0.05);
    m.lookAt(tx, -2, 0);
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
  });
  return (
    <mesh ref={ref} position={[0, 3.2, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.4, 6.5, 32, 1, true]} />
      <meshBasicMaterial
        color={CYAN}
        transparent
        opacity={0.16}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Big soft additive halo glow behind the key light. */
function GlowSprite({ ptr, reduced }: { ptr: React.MutableRefObject<Ptr>; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m || reduced) return;
    m.position.x = THREE.MathUtils.lerp(m.position.x, ptr.current.x * 4, 0.05);
    m.position.y = THREE.MathUtils.lerp(m.position.y, 1.5 - ptr.current.y * 2.5, 0.05);
  });
  return (
    <mesh ref={ref} position={[0, 1.5, -2]}>
      <circleGeometry args={[2.6, 48]} />
      <meshBasicMaterial
        color={VIOLET}
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Pointer-following key lights + scene rig. */
function Rig({ ptr, reduced }: { ptr: React.MutableRefObject<Ptr>; reduced: boolean }) {
  const key = useRef<THREE.PointLight>(null);
  const spot = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (reduced) return;
    const tx = ptr.current.x * 4;
    const ty = -ptr.current.y * 3;
    if (key.current) {
      key.current.position.x = THREE.MathUtils.lerp(key.current.position.x, tx, 0.08);
      key.current.position.y = THREE.MathUtils.lerp(key.current.position.y, ty + 1.5, 0.08);
    }
    if (spot.current) {
      spot.current.position.x = THREE.MathUtils.lerp(spot.current.position.x, tx, 0.06);
      spot.current.position.y = THREE.MathUtils.lerp(spot.current.position.y, 5, 0.06);
    }
  });

  return (
    <>
      {/* base ambience so the dark scene isn't pitch black */}
      <ambientLight intensity={0.12} color={CYAN} />
      <hemisphereLight args={[VIOLET, BG, 0.25]} />

      {/* moving colored key light (follows pointer) */}
      <pointLight
        ref={key}
        position={[0, 1.5, 2.5]}
        intensity={reduced ? 24 : 40}
        distance={16}
        color={CYAN}
      />
      {/* warm accent fill from the other side */}
      <pointLight position={[-4, -1, 3]} intensity={14} distance={14} color={AMBER} />

      {/* dramatic spot raking down the scene, follows pointer on X */}
      <primitive object={target} position={[0, -1.5, 0]} />
      <spotLight
        ref={spot}
        position={[0, 5, 3]}
        angle={0.6}
        penumbra={1}
        intensity={reduced ? 30 : 55}
        distance={18}
        color={VIOLET}
        target={target}
      />
    </>
  );
}

/** Dark reflective-ish floor that catches the moving highlights. */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#070a18" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

function SceneContents({ ptr, reduced }: { ptr: React.MutableRefObject<Ptr>; reduced: boolean }) {
  return (
    <>
      <Rig ptr={ptr} reduced={reduced} />
      <Floor />

      {/* far layer */}
      <LitShape position={[-3.6, 1.2, -4]} geometry="octa" color="#1a2547" emissive={VIOLET} ptr={ptr} depth={0.25} reduced={reduced} rotationSpeed={0.08} />
      <LitShape position={[3.4, -0.6, -3.2]} geometry="ico" color="#16294a" emissive={CYAN} ptr={ptr} depth={0.35} reduced={reduced} rotationSpeed={0.1} />

      {/* mid layer */}
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.4} floatIntensity={reduced ? 0 : 0.6}>
        <LitShape position={[-1.6, -0.4, -1]} geometry="torus" color="#20305c" emissive={CYAN} ptr={ptr} depth={0.6} reduced={reduced} />
      </Float>
      <Float speed={reduced ? 0 : 1.1} rotationIntensity={reduced ? 0 : 0.5} floatIntensity={reduced ? 0 : 0.5}>
        <LitShape position={[2.0, 1.0, -0.5]} geometry="box" color="#241a4d" emissive={VIOLET} ptr={ptr} depth={0.7} reduced={reduced} />
      </Float>

      {/* near layer (most parallax) */}
      <LitShape position={[0.2, -1.1, 1.4]} geometry="ico" color="#2a2150" emissive={AMBER} ptr={ptr} depth={1.0} reduced={reduced} rotationSpeed={0.22} />

      {/* volumetric glow */}
      <GlowSprite ptr={ptr} reduced={reduced} />
      <VolumetricCone ptr={ptr} reduced={reduced} />

      {/* dust motes catching the light */}
      <Sparkles count={reduced ? 40 : 110} scale={[14, 8, 8]} size={2.4} speed={reduced ? 0 : 0.4} color={CYAN} opacity={0.5} />
      <Sparkles count={reduced ? 20 : 60} scale={[10, 6, 6]} size={1.6} speed={reduced ? 0 : 0.25} color={VIOLET} opacity={0.4} />
    </>
  );
}

function LumenScene({ reduced }: { reduced: boolean }) {
  const ptr = useRef<Ptr>({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 6, 18]} />
      <Suspense fallback={null}>
        <SceneContents ptr={ptr} reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}

/* =====================================================================
   DOM SECTIONS (dark)
   ===================================================================== */

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function SectionHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
        style={{ color: CYAN, background: PANEL, border: `1px solid ${BORDER}` }}
      >
        <SparklesIcon className="h-3.5 w-3.5" />
        {kicker}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-base leading-relaxed" style={{ color: MUTED }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function ServiceCard({ s }: { s: Service }) {
  const Icon = s.icon;
  return (
    <motion.div
      variants={fadeUp}
      className="group relative overflow-hidden rounded-2xl p-5 backdrop-blur-sm transition-all duration-300"
      style={{ background: PANEL, border: `1px solid ${BORDER}` }}
      whileHover={{ y: -4 }}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${CYAN}, transparent 70%)` }}
      />
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ background: "rgba(76,201,255,0.12)", border: `1px solid ${BORDER}`, color: CYAN }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-base font-semibold" style={{ color: TEXT }}>
        {s.title}
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: CYAN }}>
        {s.tagline}
      </p>
      <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
        {s.description}
      </p>
    </motion.div>
  );
}

function ServiceGroup({ label, items }: { label: string; items: Service[] }) {
  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]"
          style={{ color: VIOLET, background: "rgba(155,107,255,0.10)", border: `1px solid ${BORDER}` }}
        >
          {label}
        </span>
        <span className="h-px flex-1" style={{ background: BORDER }} />
      </div>
      <motion.div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        {items.map((s) => (
          <ServiceCard key={s.id} s={s} />
        ))}
      </motion.div>
    </div>
  );
}

const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "99.9%", label: "Uptime Maintained" },
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Compass, title: "Discover", body: "We map your goals, constraints, and the highest-value problems worth solving first." },
  { icon: PencilRuler, title: "Design", body: "Clear architecture, UX flows, and a pragmatic roadmap you can actually ship." },
  { icon: Rocket, title: "Build & Ship", body: "Iterative delivery with CI/CD, tests, and zero-drama deployments." },
  { icon: LifeBuoy, title: "Support & Scale", body: "Monitoring, optimization, and ongoing iteration so it keeps paying off." },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Their DevOps pipeline paid for itself in the first month.",
    name: "Priya Nair",
    role: "CTO, FinEdge",
  },
  {
    quote:
      "The AI support copilot they built deflects 40% of our tickets. Setup was painless and the guardrails just work.",
    name: "Marcus Reed",
    role: "Head of Support, Northwind SaaS",
  },
  {
    quote:
      "We passed our ISO 27001 audit on the first try. Their gap analysis and runbooks made the whole thing calm.",
    name: "Anita Desai",
    role: "Founder, LedgerLeap",
  },
];

/* =====================================================================
   PAGE
   ===================================================================== */

export default function LumenHome() {
  const reducedPref = useReducedMotion();
  const reduced = !!reducedPref;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main style={{ background: BG, color: TEXT }} className="relative min-h-screen overflow-hidden">
      {/* ----------------------------- HERO ----------------------------- */}
      <section className="relative isolate flex min-h-[88vh] items-center pt-28 md:pt-32">
        {/* 3D scene */}
        <div className="absolute inset-0 -z-10">
          {mounted && <LumenScene reduced={reduced} />}
        </div>
        {/* readability vignette */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 30%, transparent 40%, rgba(4,6,15,0.55) 100%)",
          }}
        />

        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
              style={{ color: CYAN, background: PANEL, border: `1px solid ${BORDER}` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: CYAN }} />
              IFLEON · Nellore, India · Est. 2022
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Infinite Possibilities,
              <span
                className="block bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${VIOLET})` }}
              >
                Logical Solutions.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed" style={{ color: MUTED }}>
              A founder-led AI, DevOps, Cloud, and Cybersecurity consultancy.
              We design intelligent systems, ship them reliably, and keep them
              secure — for teams in India and around the world.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={EMAIL}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#04060f] transition-transform hover:scale-[1.03]"
                style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${VIOLET})` }}
              >
                <Mail className="h-4 w-4" />
                Request a Free Consultation
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ color: TEXT, border: `1px solid ${BORDER}` }}
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs" style={{ color: MUTED }}>
              <ShieldCheck className="h-4 w-4" style={{ color: CYAN }} />
              ISO 27001 · DPDP · SOC 2 aligned
            </div>
          </motion.div>
        </div>
      </section>

      {/* --------------------------- SERVICES --------------------------- */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          kicker="What we do"
          title="Sixteen ways we move your tech forward"
          sub="From enterprise AI platforms to securing your home network — a full spectrum of services under one roof."
        />
        <ServiceGroup label="Business Solutions" items={businessServices} />
        <ServiceGroup label="For Individuals" items={individualServices} />
        <ServiceGroup label="Specialty & Add-Ons" items={specialtyServices} />
      </section>

      {/* ---------------------------- METRICS --------------------------- */}
      <section className="relative border-y px-6 py-16" style={{ borderColor: BORDER, background: PANEL }}>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl"
                style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${VIOLET})` }}
              >
                {m.value}
              </div>
              <div className="mt-2 text-sm" style={{ color: MUTED }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------------- HOW WE WORK ------------------------- */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionHeading kicker="How we work" title="A calm, four-step path to shipped" />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative rounded-2xl p-6"
                style={{ background: PANEL, border: `1px solid ${BORDER}` }}
              >
                <span className="text-xs font-bold" style={{ color: VIOLET }}>
                  0{i + 1}
                </span>
                <span
                  className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: "rgba(76,201,255,0.12)", color: CYAN, border: `1px solid ${BORDER}` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: TEXT }}>
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>
                  {step.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* -------------------------- TESTIMONIALS ------------------------ */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading kicker="In their words" title="Teams that trust IFLEON" />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex flex-col rounded-2xl p-6"
              style={{ background: PANEL, border: `1px solid ${BORDER}` }}
            >
              <Quote className="h-6 w-6" style={{ color: VIOLET }} />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: TEXT }}>
                "{t.quote}"
              </blockquote>
              <div className="mt-4 flex items-center gap-1" style={{ color: AMBER }}>
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <figcaption className="mt-3">
                <div className="text-sm font-semibold" style={{ color: TEXT }}>
                  {t.name}
                </div>
                <div className="text-xs" style={{ color: MUTED }}>
                  {t.role}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ---------------------------- CLOSING CTA ----------------------- */}
      <section className="relative px-6 pb-28">
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl px-8 py-14 text-center"
          style={{ border: `1px solid ${BORDER}`, background: PANEL }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-2/3 blur-3xl"
            style={{ background: `radial-gradient(circle, ${VIOLET}, transparent 70%)`, opacity: 0.4 }}
          />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
            Let's turn your hardest problem into your next advantage.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base" style={{ color: MUTED }}>
            Tell us what you're building. We'll reply with a clear, honest next step — no
            obligation, no jargon.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={EMAIL}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#04060f] transition-transform hover:scale-[1.03]"
              style={{ backgroundImage: `linear-gradient(90deg, ${CYAN}, ${VIOLET})` }}
            >
              <Mail className="h-4 w-4" />
              info@ifleon.com
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
              style={{ color: TEXT, border: `1px solid ${BORDER}` }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/5"
              style={{ color: TEXT, border: `1px solid ${BORDER}` }}
            >
              <Github className="h-4 w-4" />
              github.com/ifleonlabs
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
