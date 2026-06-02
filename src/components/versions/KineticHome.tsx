/* V7 — "KINETIC": a real R3F 3D object + scroll-driven GSAP choreography.
   Dark (#070708) with a single committed accent: electric blue #3B82F6.
   Forced-dark chrome. Bold kinetic type, pinned/scrubbed reveals, mask wipes,
   a velocity-reactive marquee, and a glossy scroll-reactive torus knot. */

import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  Github,
  Building2,
  User,
  Layers,
  Compass,
  PenTool,
  Rocket,
  LifeBuoy,
  Quote,
  ShieldCheck,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const ACCENT = "#3B82F6"; // electric blue — the one accent, committed.
const BG = "#070708";

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const METRICS = [
  { value: "25", suffix: "", label: "Projects Delivered" },
  { value: "6", suffix: "", label: "Industries Served" },
  { value: "50", suffix: "+", label: "Clients & Individuals" },
  { value: "99.9", suffix: "%", label: "Uptime" },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const MARQUEE = [
  "AI / ML",
  "DevOps",
  "Cloud",
  "Cybersecurity",
  "Automation",
  "Data",
  "Mobile",
  "UI / UX",
  "AI Agents",
];

const PROCESS = [
  {
    icon: Compass,
    step: "01",
    title: "Discover",
    body: "We map your goals, constraints, and the single highest-leverage problem worth solving first.",
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
      "I switched into a DevOps role in six months with their guidance. The roadmap and mock interviews made all the difference.",
    name: "Cloud Engineer",
    role: "Individual · Career Switch",
  },
];

const GROUPS: {
  key: string;
  label: string;
  icon: typeof Building2;
  blurb: string;
  services: Service[];
}[] = [
  {
    key: "business",
    label: "Business Solutions",
    icon: Building2,
    blurb: "For startups, SMBs, SaaS & fintech teams shipping fast.",
    services: businessServices,
  },
  {
    key: "individual",
    label: "For Individuals",
    icon: User,
    blurb: "Personal tech, security, and career guidance, done right.",
    services: individualServices,
  },
  {
    key: "specialty",
    label: "Specialty & Add-Ons",
    icon: Layers,
    blurb: "Sharp, focused engagements that slot into your roadmap.",
    services: specialtyServices,
  },
];

const ALL_SERVICES: Service[] = [
  ...businessServices,
  ...individualServices,
  ...specialtyServices,
];

/* ------------------------------------------------------------------ */
/*  3D — scroll & pointer reactive torus knot                          */
/* ------------------------------------------------------------------ */

/** Shared mutable inputs written by window listeners, read in useFrame. */
type KineticInputs = {
  scroll: number; // 0..1 page scroll progress
  px: number; // pointer x, -1..1
  py: number; // pointer y, -1..1
};

function KineticKnot({ inputs }: { inputs: React.MutableRefObject<KineticInputs> }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  // MeshDistortMaterial impl exposes a settable `distort`; type loosely.
  const mat = useRef<{ distort: number } & THREE.Material>(null);

  // eased pointer values for smooth parallax
  const eased = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const { scroll, px, py } = inputs.current;
    const d = Math.min(delta, 0.05);

    // Ease pointer toward target.
    eased.current.x += (px - eased.current.x) * Math.min(1, d * 4);
    eased.current.y += (py - eased.current.y) * Math.min(1, d * 4);

    if (group.current) {
      // Continuous spin, accelerated by scroll progress.
      const spin = 0.25 + scroll * 1.6;
      group.current.rotation.y += d * spin;
      group.current.rotation.x += d * spin * 0.45;
      // Mouse parallax tilt layered on top.
      group.current.rotation.z = eased.current.x * 0.35;
      group.current.position.x = eased.current.x * 0.6;
      group.current.position.y = -eased.current.y * 0.4;
    }

    if (mesh.current) {
      // Scale pulses up as you scroll the hero away.
      const s = 1 + scroll * 0.55;
      mesh.current.scale.setScalar(s);
    }

    if (mat.current) {
      // Distortion intensifies with scroll for a "melting kinetic" feel.
      mat.current.distort = 0.25 + scroll * 0.55;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={mesh} castShadow>
          <torusKnotGeometry args={[1.05, 0.36, 220, 32]} />
          <MeshDistortMaterial
            ref={mat as never}
            color={ACCENT}
            emissive={ACCENT}
            emissiveIntensity={0.18}
            metalness={0.85}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.25}
            distort={0.3}
            speed={2.2}
            radius={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function KineticScene({ inputs }: { inputs: React.MutableRefObject<KineticInputs> }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        {/* Explicit lights only — no Environment, no presets. */}
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 6, 5]} intensity={1.1} color="#cfe0ff" />
        <pointLight position={[-6, -2, -4]} intensity={2.4} color={ACCENT} />
        <pointLight position={[4, -4, 3]} intensity={1.6} color="#7c3aed" />
        <spotLight
          position={[0, 8, 6]}
          angle={0.6}
          penumbra={0.8}
          intensity={1.4}
          color="#bfdbfe"
        />
        <KineticKnot inputs={inputs} />
      </Suspense>
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KineticHome() {
  const reduced = !!useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const inputs = useRef<KineticInputs>({ scroll: 0, px: 0, py: 0 });

  /* ----- window listeners feeding the 3D scene (skip if reduced) ----- */
  useEffect(() => {
    if (reduced) return;

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      inputs.current.scroll = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      inputs.current.px = (e.clientX / window.innerWidth) * 2 - 1;
      inputs.current.py = (e.clientY / window.innerHeight) * 2 - 1;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced]);

  /* ----- GSAP scroll choreography (skip entirely if reduced) ----- */
  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* Hero kinetic headline — lines clip up in sequence. */
      gsap.from(".kx-line", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        delay: 0.15,
      });
      gsap.from(".kx-hero-fade", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.55,
      });

      /* PINNED + scrubbed services reveal: the panel pins while service
         rows slide + clip in across the scroll distance. */
      if (pinnedRef.current) {
        const rows = gsap.utils.toArray<HTMLElement>(".kx-srow");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinnedRef.current,
            start: "top top",
            end: () => "+=" + window.innerHeight * 2.2,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
        tl.from(".kx-pin-title", {
          xPercent: -6,
          opacity: 0,
          filter: "blur(12px)",
          duration: 0.6,
        });
        rows.forEach((row) => {
          tl.from(
            row,
            {
              yPercent: 60,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
              duration: 0.5,
              ease: "power2.out",
            },
            ">-0.15",
          );
        });
      }

      /* Mask / clip wipes for section blocks as they enter. */
      gsap.utils.toArray<HTMLElement>(".kx-wipe").forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 0 100% 0)",
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      /* Generic rise-in reveals. */
      gsap.utils.toArray<HTMLElement>(".kx-rise").forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* Big metrics — scale punch on enter. */
      gsap.utils.toArray<HTMLElement>(".kx-metric").forEach((el, i) => {
        gsap.from(el, {
          scale: 0.7,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      /* Velocity-reactive marquee: base drift + skew/extra-shift on scroll. */
      if (marqueeRef.current) {
        const track = marqueeRef.current;
        const baseDrift = gsap.to(track, {
          xPercent: -50,
          repeat: -1,
          duration: 22,
          ease: "none",
        });
        const skewSetter = gsap.quickSetter(track, "skewX", "deg");
        const xExtra = gsap.quickTo(track, "x", { duration: 0.5, ease: "power3" });
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-1, 1, self.getVelocity() / 1400);
            baseDrift.timeScale(1 + Math.abs(v) * 4);
            skewSetter(v * 8);
            xExtra(-v * 120);
          },
        });
        return () => {
          baseDrift.kill();
          st.kill();
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen w-full overflow-x-clip text-white"
      style={{ background: BG, colorScheme: "dark" }}
    >
      {/* base radial tint */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 110% 80% at 50% -10%, #0a0f1f 0%, #08090f 48%, #070708 100%)",
        }}
      />

      {/* ============================== HERO ============================== */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 pb-20 md:pt-32"
      >
        {/* 3D object behind hero content (static fallback if reduced) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {reduced ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="h-[60vmin] w-[60vmin] rounded-full"
                style={{
                  background: `radial-gradient(circle at 38% 32%, ${ACCENT}cc, ${ACCENT}33 45%, transparent 72%)`,
                  filter: "blur(8px)",
                }}
              />
            </div>
          ) : (
            <KineticScene inputs={inputs} />
          )}
        </div>

        {/* vignette so text stays readable over the 3D */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(7,7,8,0) 0%, rgba(7,7,8,0.55) 70%, rgba(7,7,8,0.9) 100%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="kx-hero-fade mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/70 backdrop-blur-md">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }}
            />
            Founder-led · Nellore, India · Serving Globally
          </div>

          <h1 className="font-display text-[15vw] font-black uppercase leading-[0.86] tracking-tight sm:text-[12vw] md:text-[10rem] lg:text-[12rem]">
            <span className="block overflow-hidden">
              <span className="kx-line block">Infinite</span>
            </span>
            <span className="block overflow-hidden">
              <span
                className="kx-line block"
                style={{
                  color: ACCENT,
                  textShadow: `0 0 60px ${ACCENT}66`,
                }}
              >
                Possibilities
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="kx-line block text-white/85">Logical Solutions</span>
            </span>
          </h1>

          <p className="kx-hero-fade mt-8 max-w-2xl text-lg text-white/70 md:text-xl">
            IFLEON is a founder-led{" "}
            <span className="font-semibold text-white">
              AI, DevOps, Cloud &amp; Cybersecurity
            </span>{" "}
            consultancy — building systems that ship fast, scale calmly, and stay
            secure. For businesses and individuals alike.
          </p>

          <div className="kx-hero-fade mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold text-[#070708] transition-transform hover:scale-[1.03]"
              style={{ background: ACCENT, boxShadow: `0 0 40px ${ACCENT}66` }}
            >
              Explore Services
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:info@ifleon.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.08]"
            >
              <Mail className="h-5 w-5" style={{ color: ACCENT }} />
              Start a Conversation
            </a>
          </div>
        </div>

        {!reduced && (
          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] font-medium uppercase tracking-[0.4em] text-white/40">
            Scroll
          </div>
        )}
      </section>

      {/* ===================== VELOCITY MARQUEE ===================== */}
      <section
        className="relative overflow-hidden border-y border-white/10 py-6"
        style={{ background: "#0a0b12" }}
      >
        <div
          ref={marqueeRef}
          className="flex w-max items-center whitespace-nowrap will-change-transform"
        >
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((m, i) => (
            <span
              key={i}
              className="mx-6 font-display text-3xl font-black uppercase tracking-tight text-white/15 md:text-5xl"
            >
              {m}
              <span style={{ color: ACCENT }} className="px-3">
                /
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* ===================== PINNED SERVICES REVEAL ===================== */}
      <section ref={pinnedRef} className="relative min-h-[100svh] overflow-hidden">
        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 py-24">
          <div className="kx-pin-title mb-10">
            <span
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              What we do · 16 services
            </span>
            <h2 className="font-display mt-4 text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              One team.
              <br />
              <span className="text-white/40">Every layer of the stack.</span>
            </h2>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {ALL_SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className="kx-srow group flex items-center gap-4 py-4 md:gap-8 md:py-5"
                >
                  <span className="w-10 shrink-0 font-mono text-sm text-white/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="shrink-0" style={{ color: ACCENT }}>
                    <Icon className="h-6 w-6 transition-colors" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display truncate text-xl font-bold md:text-3xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="hidden max-w-xs truncate text-sm text-white/45 md:block">
                    {s.tagline}
                  </p>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== SERVICE GROUP DETAIL ===================== */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-7xl space-y-24">
          {GROUPS.map((group) => (
            <div key={group.key} className="kx-wipe">
              <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]"
                    style={{ boxShadow: `0 0 24px ${ACCENT}33`, color: ACCENT }}
                  >
                    <group.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-black md:text-3xl">
                      {group.label}
                    </h3>
                    <p className="text-sm text-white/55">{group.blurb}</p>
                  </div>
                </div>
                <span className="text-sm text-white/35">
                  {group.services.length} services
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== BIG METRICS STATEMENT ===================== */}
      <section className="relative overflow-hidden px-6 py-32">
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-60"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${ACCENT}22, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-6xl">
          <h2 className="kx-wipe font-display mx-auto max-w-4xl text-center text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Real work. Real numbers.
            <span className="block text-white/40">No vanity metrics.</span>
          </h2>

          <div className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="kx-metric rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-md"
              >
                <div
                  className="font-display text-5xl font-black md:text-7xl"
                  style={{ color: ACCENT, textShadow: `0 0 40px ${ACCENT}55` }}
                >
                  {m.value}
                  {m.suffix}
                </div>
                <div className="mt-3 text-xs uppercase tracking-wider text-white/50">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <div className="kx-wipe mx-auto max-w-3xl text-center">
            <span
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              How we work
            </span>
            <h2 className="font-display mt-5 text-4xl font-black tracking-tight md:text-6xl">
              A calm, deliberate path to launch
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p) => (
              <div
                key={p.step}
                className="kx-rise group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-md"
              >
                <div
                  className="font-display pointer-events-none absolute -right-5 -top-8 text-8xl font-black text-white/[0.04]"
                  aria-hidden
                >
                  {p.step}
                </div>
                <span
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl border bg-white/[0.04]"
                  style={{ borderColor: `${ACCENT}33`, color: ACCENT }}
                >
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="font-display relative mt-6 text-xl font-bold">
                  {p.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-white/60">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="kx-wipe font-display mx-auto mb-16 max-w-3xl text-center text-4xl font-black tracking-tight md:text-6xl">
            What people say after launch
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.role}
                className="kx-rise relative flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md"
              >
                <Quote className="h-8 w-8" style={{ color: `${ACCENT}99` }} />
                <blockquote className="mt-5 flex-1 text-base leading-relaxed text-white/80">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-sm text-white/50">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative px-6 pb-32 pt-8">
        <div
          className="kx-wipe relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 p-10 text-center md:p-16"
          style={{
            background: `radial-gradient(ellipse 100% 100% at 50% 0%, ${ACCENT}26, ${ACCENT}0d 45%, rgba(7,7,8,0) 80%)`,
          }}
        >
          <h2 className="font-display mx-auto max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-7xl">
            Got an idea worth building?
            <span
              className="block"
              style={{ color: ACCENT, textShadow: `0 0 40px ${ACCENT}55` }}
            >
              Let's make it real.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            Tell us where you want to go. We'll bring the AI, the cloud, the
            pipelines, and the security to get you there.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-[#070708] transition-transform hover:scale-[1.03]"
              style={{ background: ACCENT, boxShadow: `0 0 40px ${ACCENT}66` }}
            >
              <Mail className="h-5 w-5" />
              info@ifleon.com
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.08]"
            >
              Browse all services
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/[0.08]"
            >
              <Github className="h-5 w-5" />
              github.com/ifleonlabs
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 backdrop-blur-md"
              >
                <ShieldCheck className="h-4 w-4" style={{ color: ACCENT }} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-white/25">
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${ACCENT}22, transparent 70%)`,
        }}
      />
      <div className="relative">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
          style={{ boxShadow: `0 0 20px ${ACCENT}2e`, color: ACCENT }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h4 className="font-display mt-5 text-lg font-bold leading-snug text-white">
          {service.title}
        </h4>
        <p className="mt-1.5 text-sm font-medium" style={{ color: `${ACCENT}cc` }}>
          {service.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/55">
          {service.description}
        </p>
      </div>
    </div>
  );
}
