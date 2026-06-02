/* V5 — ORBIT: a clean, modern, LIGHT homepage for IFLEON with a real
   glossy 3D object hero built in React-Three-Fiber.

   Aesthetic: bright airy off-white canvas (#F7F8FA) with a faint blue/teal
   radial wash, generous whitespace, crisp modern type, brand blue #2563EB +
   teal #0D9488 accents. ONE premium tactile 3D centerpiece (a glass-like
   transmission icosahedron) floating to the right of the headline.

   The Canvas is 100% procedural — explicit lights + ContactShadows only,
   no Environment presets, no remote HDRIs / GLTFs / textures. Mouse parallax
   is read from a window pointermove listener (the canvas is decorative and
   sits behind / beside content). If the user prefers reduced motion we never
   mount the Canvas and render a tasteful static CSS gradient orb instead.

   The app forces a LIGHT chrome for this version. Self-contained, no
   Header/Footer. Hero starts with pt-28 md:pt-32. */

import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Sparkles,
  ShieldCheck,
  Activity,
  Compass,
  Quote,
  Building2,
  User,
  Layers,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette — light "Orbit" chrome                                     */
/* ------------------------------------------------------------------ */
const CANVAS = "#F7F8FA"; // soft off-white page canvas
const SURFACE = "#FFFFFF"; // card surface
const BORDER = "rgba(15,23,42,0.08)"; // crisp 1px border
const BORDER_HI = "rgba(37,99,235,0.45)"; // hover border (brand blue)
const HAIR = "rgba(15,23,42,0.07)"; // hairline / dividers
const INK = "#0F172A"; // primary text (slate-900)
const INK_2 = "#1E293B"; // strong secondary text
const MUTED = "#64748B"; // muted text (slate-500)
const BLUE = "#2563EB"; // brand blue
const TEAL = "#0D9488"; // brand teal

/* ------------------------------------------------------------------ */
/* Static content                                                     */
/* ------------------------------------------------------------------ */
const STATS = [
  { value: 25, suffix: "", label: "Projects Delivered", hint: "shipped to production" },
  { value: 6, suffix: "", label: "Industries Served", hint: "SaaS · fintech · retail +" },
  { value: 50, suffix: "+", label: "Clients & Individuals", hint: "B2B and personal" },
  { value: 99.9, suffix: "%", label: "Uptime Maintained", hint: "security-first ops" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const HOW_WE_WORK = [
  {
    step: "01",
    title: "Scope the outcome",
    body: "We start from the business result, then reverse-engineer the right stack — no tech for tech's sake.",
  },
  {
    step: "02",
    title: "Build in the open",
    body: "Short cycles, working software you can see, and clean code pushed to a repo you own.",
  },
  {
    step: "03",
    title: "Ship & secure",
    body: "Automated delivery, monitoring, and security baked in — so it survives contact with real users.",
  },
  {
    step: "04",
    title: "Hand over & support",
    body: "Runbooks, training, and a maintenance plan so your team stays in control after launch.",
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

/* Shared, module-level pointer target. The window listener writes here and
   the R3F useFrame loop reads it. Kept outside the component so the listener
   and the frame loop reference the exact same object. */
const POINTER = { x: 0, y: 0 };

/* ================================================================== */
/* 3D HERO — glossy transmission icosahedron                          */
/* ================================================================== */
function GlassOrbit() {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // clamp delta so a backgrounded tab doesn't jump the rotation
    const d = Math.min(delta, 0.05);

    if (mesh.current) {
      // slow, continuous auto-rotation of the object itself
      mesh.current.rotation.y += d * 0.32;
      mesh.current.rotation.x += d * 0.12;
    }

    if (group.current) {
      // lerp the whole group toward the pointer for a soft parallax tilt
      const targetY = POINTER.x * 0.5;
      const targetX = -POINTER.y * 0.35;
      group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
      group.current.rotation.x += (targetX - group.current.rotation.x) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.9}>
        <mesh ref={mesh} castShadow>
          <icosahedronGeometry args={[1.4, 8]} />
          <MeshTransmissionMaterial
            samples={8}
            resolution={512}
            thickness={1.1}
            roughness={0.06}
            transmission={1}
            ior={1.35}
            chromaticAberration={0.05}
            anisotropy={0.2}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationDistance={2.4}
            attenuationColor="#bcd4ff"
            color="#dbeafe"
          />
        </mesh>
      </Float>

      {/* a small inner teal core so the glass refracts something colorful */}
      <Float speed={2.2} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color={TEAL}
            emissive={TEAL}
            emissiveIntensity={0.6}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function HeroCanvas() {
  // window-level pointer listener (canvas may be pointer-events-none / behind)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      POINTER.x = (e.clientX / window.innerWidth) * 2 - 1;
      POINTER.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      shadows
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {/* explicit, procedural lighting only — no Environment / HDRI */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#ffffff" castShadow />
        {/* brand-blue key rim from the left */}
        <pointLight position={[-5, 2, 3]} intensity={42} color={BLUE} distance={18} />
        {/* teal rim from the lower right */}
        <pointLight position={[4, -3, 2]} intensity={36} color={TEAL} distance={18} />
        {/* gentle top fill so the glass top edge catches light */}
        <directionalLight position={[0, 5, -4]} intensity={0.7} color="#e0ecff" />

        <GlassOrbit />

        {/* soft contact shadow grounding the object */}
        <ContactShadows
          position={[0, -2.05, 0]}
          opacity={0.32}
          scale={9}
          blur={2.6}
          far={4}
          color="#1e3a8a"
        />
      </Suspense>
    </Canvas>
  );
}

/* Static, dependency-free fallback for reduced-motion users. */
function StaticOrb() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div
        className="h-[58%] w-[58%] max-h-[420px] max-w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #ffffff 0%, #bfdbfe 30%, #2563eb 64%, #0d9488 100%)",
          boxShadow:
            "0 40px 90px -30px rgba(37,99,235,0.55), inset -18px -22px 50px rgba(13,148,136,0.45), inset 16px 18px 44px rgba(255,255,255,0.7)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Motion helpers                                                     */
/* ------------------------------------------------------------------ */
const useReveal = () => {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };
  return { reduce, variants };
};

/* Animated count-up for the metrics row. Calm, gated behind reduced-motion. */
function CountUp({
  to,
  suffix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  decimals?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setVal(to);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* Stagger container so groups reveal in sequence */
function Stagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* Mono eyebrow label */
function Eyebrow({
  children,
  color = MUTED,
  icon: Icon,
}: {
  children: ReactNode;
  color?: string;
  icon?: LucideIcon;
}) {
  return (
    <div
      className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]"
      style={{ color }}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      <span>{children}</span>
    </div>
  );
}

/* Section heading */
function SectionHead({
  eyebrow,
  title,
  desc,
  icon,
  accent = BLUE,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  icon?: LucideIcon;
  accent?: string;
}) {
  const { variants } = useReveal();
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mb-10 flex flex-col gap-3"
    >
      <Eyebrow color={accent} icon={icon}>
        {eyebrow}
      </Eyebrow>
      <h2
        className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
        style={{ color: INK }}
      >
        {title}
      </h2>
      {desc && (
        <p className="max-w-2xl text-[15px] leading-relaxed md:text-base" style={{ color: MUTED }}>
          {desc}
        </p>
      )}
    </motion.div>
  );
}

/* Service card */
function ServiceCard({
  service,
  accent,
}: {
  service: Service;
  accent: string;
}) {
  const { reduce, variants } = useReveal();
  const Icon = service.icon;
  return (
    <motion.div
      variants={variants}
      whileHover={reduce ? undefined : { y: -4 }}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6 transition-colors"
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.25)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = BORDER_HI)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = BORDER)}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}2e` }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          style={{ color: accent }}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <h4 className="text-[15px] font-semibold leading-snug" style={{ color: INK }}>
          {service.title}
        </h4>
        <p className="text-[13px] leading-snug" style={{ color: accent }}>
          {service.tagline}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed" style={{ color: MUTED }}>
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

/* Primary / secondary buttons */
function PrimaryBtn({ to, href, children }: { to?: string; href?: string; children: ReactNode }) {
  const cls =
    "group/btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:-translate-y-0.5";
  const style = { background: BLUE };
  const inner = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
    </>
  );
  if (to) return <Link to={to} className={cls} style={style}>{inner}</Link>;
  return <a href={href} className={cls} style={style}>{inner}</a>;
}

function SecondaryBtn({
  to,
  href,
  external,
  icon: Icon,
  children,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  const cls =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors hover:bg-slate-50";
  const style = { color: INK_2, border: `1px solid ${BORDER}`, background: SURFACE };
  const inner = (
    <>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls} style={style}>{inner}</Link>;
  return (
    <a
      href={href}
      className={cls}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}

/* ================================================================== */
/* MAIN                                                               */
/* ================================================================== */
export default function OrbitHome() {
  const reduce = useReducedMotion();
  const { variants } = useReveal();

  // Only mount the live Canvas when motion is allowed AND we're client-side.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const show3D = mounted && !reduce;

  const heroEase = useMemo<Variants>(
    () => ({
      hidden: { opacity: 0, y: reduce ? 0 : 24 },
      show: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
      }),
    }),
    [reduce],
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: CANVAS, color: INK }}>
      {/* ambient backdrop: faint blue/teal radial wash + soft grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 70% 8%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(ellipse 70% 50% at 12% 30%, rgba(13,148,136,0.08), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, #000 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 55% at 50% 0%, #000 30%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-28 sm:px-6 md:pt-32 lg:px-8">
        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}
        <section className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8">
          {/* 3D object — on mobile it sits behind the headline; on desktop, right */}
          <div className="pointer-events-none absolute inset-0 -z-0 opacity-60 lg:relative lg:order-2 lg:opacity-100">
            <div className="relative h-[340px] w-full sm:h-[420px] lg:h-[540px]">
              {show3D ? <HeroCanvas /> : <StaticOrb />}
            </div>
          </div>

          {/* Headline + copy + CTAs */}
          <div className="relative z-10 flex flex-col gap-7 lg:order-1">
            <motion.div custom={0} variants={heroEase} initial="hidden" animate="show">
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: BLUE, background: `${BLUE}12`, border: `1px solid ${BLUE}2e` }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Founder-led · Nellore, India · since 2022
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={heroEase}
              initial="hidden"
              animate="show"
              className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
              style={{ color: INK }}
            >
              Infinite possibilities,{" "}
              <span
                style={{
                  background: `linear-gradient(100deg, ${BLUE}, ${TEAL})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                logical solutions.
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={heroEase}
              initial="hidden"
              animate="show"
              className="max-w-xl text-base leading-relaxed md:text-lg"
              style={{ color: MUTED }}
            >
              AI, DevOps, cloud and cybersecurity — engineered for startups, SMBs and
              individuals. From Nellore, India, serving teams and people worldwide. We
              scope the outcome first, then build the system that gets you there.
            </motion.p>

            <motion.div
              custom={3}
              variants={heroEase}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-3"
            >
              <PrimaryBtn href="mailto:info@ifleon.com?subject=Free%20consultation%20request">
                Request a Free Consultation
              </PrimaryBtn>
              <SecondaryBtn to="/services" icon={Compass}>
                Explore Services
              </SecondaryBtn>
            </motion.div>

            {/* compliance trust row */}
            <motion.div
              custom={4}
              variants={heroEase}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                Security-first
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {COMPLIANCE.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    style={{ color: INK_2, border: `1px solid ${BORDER}`, background: SURFACE }}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SERVICES                                                     */}
        {/* ============================================================ */}
        <section className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="Capabilities · 16 services"
            title="A full-stack toolkit for teams and individuals."
            desc="Whether you're scaling a SaaS platform or just locking down your home network, there's a track built for you."
            icon={Layers}
          />

          {/* Business */}
          <div className="mb-4 flex items-center gap-3">
            <Eyebrow color={BLUE} icon={Building2}>
              For Business
            </Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessServices.map((s) => (
              <ServiceCard key={s.id} service={s} accent={BLUE} />
            ))}
          </Stagger>

          {/* Individuals */}
          <div className="mb-4 mt-12 flex items-center gap-3">
            <Eyebrow color={TEAL} icon={User}>
              For Individuals
            </Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {individualServices.map((s) => (
              <ServiceCard key={s.id} service={s} accent={TEAL} />
            ))}
          </Stagger>

          {/* Specialty */}
          <div className="mb-4 mt-12 flex items-center gap-3">
            <Eyebrow color={MUTED} icon={Sparkles}>
              Specialty &amp; Add-ons
            </Eyebrow>
            <div className="h-px flex-1" style={{ background: HAIR }} />
          </div>
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} accent={i % 2 === 0 ? BLUE : TEAL} />
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* METRICS                                                      */}
        {/* ============================================================ */}
        <section className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="By the numbers"
            title="Outcomes we can point to."
            icon={Activity}
            accent={TEAL}
          />
          <Stagger className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={variants}
                className="flex flex-col gap-2 rounded-2xl p-6"
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)",
                }}
              >
                <div className="text-4xl font-semibold tracking-tight md:text-5xl" style={{ color: BLUE }}>
                  <CountUp to={s.value} suffix={s.suffix} decimals={s.value % 1 !== 0 ? 1 : 0} />
                </div>
                <div className="text-sm font-medium" style={{ color: INK }}>
                  {s.label}
                </div>
                <div className="font-mono text-[11px] tracking-wide" style={{ color: MUTED }}>
                  {s.hint}
                </div>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* HOW WE WORK                                                  */}
        {/* ============================================================ */}
        <section className="mt-28 md:mt-36">
          <SectionHead
            eyebrow="The method"
            title="How we work."
            desc="Calm, transparent, and built to hand over. No black boxes."
            icon={Compass}
          />
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_WE_WORK.map((s, i) => (
              <motion.div
                key={s.step}
                variants={variants}
                className="relative flex flex-col gap-3 rounded-2xl p-6"
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)",
                }}
              >
                <span
                  className="font-mono text-2xl font-semibold"
                  style={{ color: i % 2 === 0 ? BLUE : TEAL }}
                >
                  {s.step}
                </span>
                <h4 className="text-base font-semibold" style={{ color: INK }}>
                  {s.title}
                </h4>
                <p className="text-[13px] leading-relaxed" style={{ color: MUTED }}>
                  {s.body}
                </p>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* TESTIMONIALS                                                 */}
        {/* ============================================================ */}
        <section className="mt-28 md:mt-36">
          <SectionHead eyebrow="Signal" title="What people say after we ship." icon={Quote} accent={TEAL} />
          <Stagger className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {QUOTES.map((q, i) => (
              <motion.div
                key={q.name}
                variants={variants}
                className="flex flex-col justify-between gap-6 rounded-2xl p-7"
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 18px 40px -28px rgba(15,23,42,0.22)",
                }}
              >
                <Quote className="h-7 w-7" style={{ color: i % 2 === 0 ? BLUE : TEAL }} />
                <p className="text-[15px] leading-relaxed" style={{ color: INK_2 }}>
                  “{q.quote}”
                </p>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold" style={{ color: INK }}>
                    {q.name}
                  </span>
                  <span className="font-mono text-[11px] tracking-wide" style={{ color: MUTED }}>
                    {q.role}
                  </span>
                </div>
              </motion.div>
            ))}
          </Stagger>
        </section>

        {/* ============================================================ */}
        {/* CLOSING CTA                                                  */}
        {/* ============================================================ */}
        <section className="mt-28 md:mt-36">
          <motion.div
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-14"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
              border: `1px solid ${BORDER}`,
              boxShadow: "0 30px 70px -40px rgba(37,99,235,0.45)",
            }}
          >
            {/* soft brand glows */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[110px]"
              style={{ background: `radial-gradient(circle, ${BLUE}33, transparent 70%)` }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full blur-[110px]"
              style={{ background: `radial-gradient(circle, ${TEAL}26, transparent 70%)` }}
            />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-4">
                <Eyebrow color={BLUE} icon={Sparkles}>
                  Let's build something
                </Eyebrow>
                <h2
                  className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl"
                  style={{ color: INK }}
                >
                  Have a problem worth solving? Let's scope it together.
                </h2>
                <a
                  href="mailto:info@ifleon.com"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline"
                  style={{ color: MUTED }}
                >
                  <Mail className="h-4 w-4" style={{ color: TEAL }} />
                  info@ifleon.com
                </a>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <PrimaryBtn to="/services">Explore Services</PrimaryBtn>
                <SecondaryBtn href="https://github.com/ifleonlabs" external icon={Github}>
                  github.com/ifleonlabs
                </SecondaryBtn>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
