/* ============================================================
   C11 — "SHADER"
   DARK, full-screen WebGL SHADER EXPERIENCE driving SCROLLYTELLING.

   - A FIXED full-screen background rendered by a custom OGL fragment
     shader: an evolving aurora / plasma / fbm-noise field in brand
     blue / cyan / violet on near-black, animated by u_time.
   - SCROLLYTELLING: as the user scrolls through "scenes" (chapters of
     IFLEON's story), u_scroll + u_scene shift the shader's palette,
     turbulence and zoom so the SAME shader morphs mood per scene while
     DOM text scenes fade / swap on top.
   - OGL: fullscreen triangle + Program (passthrough vertex + fbm
     fragment). u_time / u_scroll / u_scene / u_res updated in rAF.
     DPR cap 1.6, IntersectionObserver + visibility pause, dispose on
     unmount.
   - 100% procedural (no textures). prefers-reduced-motion OR low-end
     (deviceMemory<=2 || hardwareConcurrency<=2): skip the shader loop,
     render a static CSS gradient + stack all scene text statically.

   Self-contained. Allowed imports only. No three.js / R3F. No external
   assets. Does NOT render Header / Footer. Hero starts pt-28 md:pt-32.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Renderer, Triangle, Program, Mesh } from "ogl";
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
  ChevronDown,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ---------------- theme tokens (self-defined, DARK) ---------------- */
const NEAR_BLACK = "#05070F";
const INK_0 = "#F4F7FF"; // brightest text
const INK_1 = "#C7D2F0";
const INK_2 = "#8C9AC4";
const INK_3 = "#5B6790";
const BLUE = "#3B82F6";
const CYAN = "#22D3EE";
const VIOLET = "#8B5CF6";
const PINK = "#EC4899";
const EMERALD = "#34D399";
const AMBER = "#FBBF24";
const GLASS = "rgba(16,22,44,0.55)";
const GLASS_STRONG = "rgba(20,28,56,0.72)";
const HAIR = "rgba(140,154,196,0.16)";

const DISPLAY =
  'var(--font-display, "Fraunces"), Georgia, "Times New Roman", serif';
const MONO =
  'var(--font-mono, "JetBrains Mono"), ui-monospace, SFMono-Regular, Menlo, monospace';

/* ---------------- shared content ---------------- */
const METRICS = [
  { value: "25", label: "Projects Delivered", accent: BLUE },
  { value: "6", label: "Industries Served", accent: CYAN },
  { value: "50+", label: "Clients Worldwide", accent: VIOLET },
  { value: "99.9%", label: "Uptime Maintained", accent: EMERALD },
];

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    blurb:
      "We map your goals, constraints, and the single highest-value problem worth solving first — no jargon, no fluff.",
    accent: CYAN,
  },
  {
    icon: Hammer,
    title: "Design & Build",
    blurb:
      "Tight, iterative delivery. Architecture, code, and review in short loops so you see real progress every week.",
    accent: BLUE,
  },
  {
    icon: Rocket,
    title: "Ship",
    blurb:
      "Automated pipelines, zero-downtime cutover, and measurable outcomes — shipped to production with confidence.",
    accent: VIOLET,
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
    accent: CYAN,
  },
];

const COMPLIANCE = ["ISO 27001", "DPDP", "SOC 2"];

const CONSULT_MAILTO =
  "mailto:info@ifleon.com?subject=Free%20Consultation%20Request&body=Hi%20IFLEON%20team%2C%0A%0AI'd%20like%20to%20request%20a%20free%20consultation.";

/* The narrative "scenes" the shader morphs between. The shader reads a
   continuous u_scene index derived from the active scene index. */
const SCENES = [
  {
    kicker: "Chapter 01 · The field",
    title: "Infinite Possibilities, Logical Solutions.",
    body: "A founder-led AI, DevOps, cloud, and cybersecurity consultancy from Nellore, India — building for businesses and individuals across India and the globe.",
    accent: CYAN,
  },
  {
    kicker: "Chapter 02 · Intelligence",
    title: "We turn data into systems that decide.",
    body: "AI & machine learning, autonomous agents, and data engineering that automate workflows, surface insight, and drive smarter decisions.",
    accent: VIOLET,
  },
  {
    kicker: "Chapter 03 · Velocity",
    title: "We make shipping software feel effortless.",
    body: "DevOps, cloud migration, and custom software — pipelines that turn quarterly releases into daily ones, with zero-downtime cutovers.",
    accent: BLUE,
  },
  {
    kicker: "Chapter 04 · Trust",
    title: "We secure what you can't afford to lose.",
    body: "Cybersecurity, compliance, and digital transformation aligned to ISO 27001, DPDP, and SOC 2 — so growth never outruns safety.",
    accent: EMERALD,
  },
  {
    kicker: "Chapter 05 · Everyone",
    title: "And we show up for individuals, too.",
    body: "Tech support, personal security, smart-home integration, and AI / cloud career guidance — the same rigor, scaled to one person.",
    accent: PINK,
  },
];

/* ============================================================
   FULLSCREEN OGL FBM / AURORA SHADER
   ============================================================ */
const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 v_uv;
  void main(){
    v_uv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_scroll;   // 0..1 across full page
  uniform float u_scene;    // continuous scene index 0..(N-1)
  uniform vec2  u_res;

  // --- hash / noise / fbm ---
  vec2 hash2(vec2 p){
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0,0.0)), f - vec2(0.0,0.0)),
          dot(hash2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
          dot(hash2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
  }
  float fbm(vec2 p, float turb){
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for(int i = 0; i < 6; i++){
      v += a * noise(p);
      p = m * p + turb * 0.15;
      a *= 0.5;
    }
    return v;
  }

  // brand palette as a function of scene + value
  vec3 palette(float t, float scene){
    vec3 nearBlack = vec3(0.020, 0.027, 0.059);
    vec3 blue   = vec3(0.231, 0.510, 0.965);
    vec3 cyan   = vec3(0.133, 0.827, 0.933);
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 pink   = vec3(0.925, 0.282, 0.600);
    vec3 emerald= vec3(0.204, 0.827, 0.600);

    // scene picks a dominant pair
    // 0: cyan/blue, 1: violet, 2: blue, 3: emerald, 4: pink
    float s = scene;
    vec3 hi = cyan;
    vec3 lo = blue;
    hi = mix(hi, violet,  smoothstep(0.5, 1.5, s));
    lo = mix(lo, violet,  smoothstep(0.5, 1.5, s) * 0.6);
    hi = mix(hi, blue,    smoothstep(1.5, 2.5, s));
    lo = mix(lo, cyan,    smoothstep(1.5, 2.5, s));
    hi = mix(hi, emerald, smoothstep(2.5, 3.5, s));
    lo = mix(lo, blue,    smoothstep(2.5, 3.5, s));
    hi = mix(hi, pink,    smoothstep(3.5, 4.5, s));
    lo = mix(lo, violet,  smoothstep(3.5, 4.5, s));

    vec3 c = mix(nearBlack, lo, smoothstep(0.0, 0.55, t));
    c = mix(c, hi, smoothstep(0.45, 1.0, t));
    return c;
  }

  void main(){
    vec2 uv = v_uv;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

    // scene-driven zoom + turbulence
    float zoom = 1.6 - 0.18 * u_scene + 0.25 * u_scroll;
    float turb = 0.6 + 0.5 * u_scene + 1.2 * u_scroll;
    p *= zoom;

    float t = u_time * 0.06;

    // domain-warped fbm -> aurora ribbons
    vec2 q = vec2(
      fbm(p + vec2(0.0, t), turb),
      fbm(p + vec2(5.2, -t * 0.8), turb)
    );
    vec2 r = vec2(
      fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.5, turb),
      fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.4, turb)
    );
    float f = fbm(p + 2.4 * r + t * 0.3, turb);

    // shape into flowing bands
    float v = 0.5 + 0.5 * f;
    v = pow(v, 1.4);
    float bands = 0.5 + 0.5 * sin((p.y * 2.0 + r.x * 3.0 + t * 2.0) * 1.6);
    v = mix(v, v * bands, 0.45);

    vec3 col = palette(v, u_scene);

    // glow accents along high-energy ridges
    float ridge = smoothstep(0.55, 0.95, length(r));
    col += ridge * 0.18 * palette(0.95, u_scene);

    // subtle center spotlight so DOM text stays readable
    float vign = smoothstep(1.25, 0.15, length(p) * 0.7);
    col *= 0.65 + 0.5 * vign;

    // deepen toward edges for premium dark feel
    col = mix(vec3(0.012, 0.016, 0.035), col, 0.55 + 0.45 * vign);

    // gentle grain to avoid banding
    float g = (hash2(uv * u_res + t).x) * 0.012;
    col += g;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function isLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    (nav.deviceMemory ?? 4) <= 2 || (navigator.hardwareConcurrency ?? 4) <= 2
  );
}

/* ============================================================
   ShaderBackground — fixed full-screen OGL canvas.
   Drives u_scroll from window scroll and u_scene from a smoothed
   target index reported by the page (sceneTargetRef).
   ============================================================ */
function ShaderBackground({
  sceneTargetRef,
}: {
  sceneTargetRef: React.MutableRefObject<number>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, isMobile ? 1.3 : 1.6),
    });
    const gl = renderer.gl;
    gl.clearColor(0.02, 0.027, 0.059, 1);
    container.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        u_time: { value: 0 },
        u_scroll: { value: 0 },
        u_scene: { value: 0 },
        u_res: { value: [1, 1] },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = container.clientWidth || window.innerWidth || 1;
      const h = container.clientHeight || window.innerHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.u_res.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("resize", resize);

    // scroll progress 0..1 across the whole page
    let scrollTarget = 0;
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      scrollTarget = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // perf gating
    let visible = true;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => (visible = en.isIntersecting)),
      { threshold: 0.01 }
    );
    io.observe(container);
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    let raf = 0;
    const start = performance.now();
    let last = start;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.visibilityState !== "visible") return;
      // throttle ~50fps
      if (now - last < 18) return;
      last = now;

      const u = program.uniforms;
      u.u_time.value = (now - start) / 1000;
      // ease scroll
      u.u_scroll.value += (scrollTarget - (u.u_scroll.value as number)) * 0.06;
      // ease scene index toward the page-reported target
      u.u_scene.value +=
        (sceneTargetRef.current - (u.u_scene.value as number)) * 0.05;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
      if (gl.canvas.parentNode) gl.canvas.parentNode.removeChild(gl.canvas);
    };
  }, [sceneTargetRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

/* Static CSS fallback for reduced-motion / low-end. */
function StaticShaderFallback() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: `
          radial-gradient(70% 55% at 20% 15%, ${VIOLET}33, transparent 60%),
          radial-gradient(60% 50% at 85% 25%, ${CYAN}2E, transparent 60%),
          radial-gradient(80% 60% at 50% 95%, ${BLUE}33, transparent 65%),
          ${NEAR_BLACK}
        `,
      }}
    />
  );
}

/* ============================================================
   Dark glassmorphism service card.
   icon component takes only className → color via wrapper span.
   ============================================================ */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  const palette = [CYAN, BLUE, VIOLET, PINK, EMERALD, AMBER];
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
        border: `1px solid ${HAIR}`,
        boxShadow: "0 18px 44px -28px rgba(0,0,0,0.8)",
      }}
    >
      <span
        className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl"
        style={{
          color: accent,
          background: `${accent}1F`,
          border: `1px solid ${accent}3D`,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h4 className="text-base font-semibold leading-snug" style={{ color: INK_0 }}>
        {service.title}
      </h4>
      <p
        className="mt-1"
        style={{ color: accent, fontFamily: MONO, fontSize: "0.72rem" }}
      >
        {service.tagline}
      </p>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: INK_2 }}>
        {service.description}
      </p>
      <div className="mt-4 h-px w-full" style={{ background: `${accent}26` }} />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {service.technologies.slice(0, 3).map((tch) => (
          <span
            key={tch}
            className="rounded-full px-2 py-0.5 text-[0.66rem]"
            style={{
              fontFamily: MONO,
              color: INK_2,
              background: "rgba(140,154,196,0.08)",
              border: `1px solid ${HAIR}`,
            }}
          >
            {tch}
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
        style={{ color: accent, background: `${accent}1F` }}
      >
        <Icon style={{ width: 18, height: 18 }} />
      </span>
      <div>
        <p
          className="text-[0.68rem] uppercase tracking-[0.2em]"
          style={{ fontFamily: MONO, color: INK_3 }}
        >
          {kicker}
        </p>
        <h3
          className="text-xl font-semibold"
          style={{ color: INK_0, fontFamily: DISPLAY }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
}

/* A single scrollytelling scene panel. Tracks its own in-view state and
   reports its index to the parent so the shader can morph. */
function ScrollScene({
  index,
  scene,
  onActive,
  reduced,
}: {
  index: number;
  scene: (typeof SCENES)[number];
  onActive: (i: number) => void;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <div ref={ref} className="flex min-h-screen items-center justify-center px-5">
      <motion.div
        initial={false}
        animate={
          reduced
            ? { opacity: 1, y: 0 }
            : { opacity: inView ? 1 : 0.18, y: inView ? 0 : 24 }
        }
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <p
          className="text-[0.72rem] uppercase tracking-[0.28em]"
          style={{ fontFamily: MONO, color: scene.accent }}
        >
          {scene.kicker}
        </p>
        <h2
          className="mt-4 text-3xl font-semibold leading-[1.08] sm:text-4xl md:text-5xl"
          style={{
            fontFamily: DISPLAY,
            color: INK_0,
            letterSpacing: "-0.02em",
            textShadow: "0 2px 30px rgba(0,0,0,0.6)",
          }}
        >
          {scene.title}
        </h2>
        <p
          className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
          style={{ color: INK_1, textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
        >
          {scene.body}
        </p>
      </motion.div>
    </div>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function ShaderHome() {
  const reduced = useReducedMotion();
  const [lowEnd, setLowEnd] = useState(false);
  const sceneTargetRef = useRef<number>(0);
  const [activeScene, setActiveScene] = useState(0);

  useEffect(() => {
    setLowEnd(isLowEnd());
  }, []);

  // shader runs only when motion is allowed and device is capable
  const shaderActive = !reduced && !lowEnd;

  const handleSceneActive = (i: number) => {
    sceneTargetRef.current = i;
    setActiveScene(i);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: NEAR_BLACK, color: INK_0 }}
    >
      {/* ---------- FIXED full-screen SHADER background ---------- */}
      {shaderActive ? (
        <ShaderBackground sceneTargetRef={sceneTargetRef} />
      ) : (
        <StaticShaderFallback />
      )}

      {/* readability scrim over the shader */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(5,7,15,0) 35%, rgba(5,7,15,0.55) 100%)",
        }}
      />

      {/* ============================ HERO ============================ */}
      <header
        className="relative z-10 px-5 pt-28 md:pt-32"
        style={{ minHeight: "100vh" }}
      >
        <div className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
            style={{
              fontFamily: MONO,
              color: INK_1,
              background: GLASS_STRONG,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: `1px solid ${HAIR}`,
            }}
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: CYAN }} />
            Founder-led · AI · DevOps · Cloud · Security · Est. 2022
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="mt-6 text-4xl font-semibold leading-[1.04] sm:text-5xl md:text-6xl"
            style={{
              fontFamily: DISPLAY,
              color: INK_0,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 40px rgba(0,0,0,0.6)",
            }}
          >
            Infinite Possibilities,{" "}
            <span
              style={{
                background: `linear-gradient(100deg, ${CYAN}, ${BLUE} 50%, ${VIOLET})`,
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
            style={{ color: INK_1, textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
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
                background: `linear-gradient(100deg, ${BLUE}, ${VIOLET})`,
                boxShadow: "0 16px 36px -14px rgba(59,130,246,0.7)",
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
                color: INK_0,
                background: GLASS_STRONG,
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: `1px solid ${HAIR}`,
              }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.34 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: EMERALD }} />
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 text-[0.68rem]"
                style={{
                  fontFamily: MONO,
                  color: INK_2,
                  background: "rgba(140,154,196,0.08)",
                  border: `1px solid ${HAIR}`,
                }}
              >
                {c}
              </span>
            ))}
          </motion.div>

          {!reduced && (
            <motion.div
              aria-hidden
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-14 flex flex-col items-center gap-1"
              style={{ color: INK_3 }}
            >
              <span
                className="text-[0.62rem] uppercase tracking-[0.28em]"
                style={{ fontFamily: MONO }}
              >
                Scroll the story
              </span>
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      </header>

      {/* ============== SCROLLYTELLING SCENES ============== */}
      <section className="relative z-10">
        {/* scene progress dots (fixed, right side) */}
        {!reduced && (
          <div className="pointer-events-none fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
            {SCENES.map((s, i) => (
              <span
                key={s.kicker}
                className="h-2 w-2 rounded-full transition-all duration-500"
                style={{
                  background:
                    i === activeScene ? s.accent : "rgba(140,154,196,0.3)",
                  transform: i === activeScene ? "scale(1.5)" : "scale(1)",
                  boxShadow: i === activeScene ? `0 0 14px ${s.accent}` : "none",
                }}
              />
            ))}
          </div>
        )}

        {SCENES.map((s, i) => (
          <ScrollScene
            key={s.kicker}
            index={i}
            scene={s}
            onActive={handleSceneActive}
            reduced={!!reduced}
          />
        ))}
      </section>

      {/* ================= SERVICES SHOWCASE (all 16) ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: MONO, color: CYAN }}
          >
            What we do
          </p>
          <h2
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{
              fontFamily: DISPLAY,
              color: INK_0,
              letterSpacing: "-0.02em",
            }}
          >
            Sixteen ways we turn problems into shipped solutions.
          </h2>
        </div>

        <GroupHeading
          icon={Building2}
          kicker="For Business"
          title="Business Solutions"
          accent={BLUE}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businessServices.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} />
          ))}
        </div>

        <div className="mt-14">
          <GroupHeading
            icon={User}
            kicker="For Individuals"
            title="Individual Solutions"
            accent={CYAN}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {individualServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i + 1} />
            ))}
          </div>
        </div>

        <div className="mt-14">
          <GroupHeading
            icon={Layers}
            kicker="Specialty & Add-Ons"
            title="Specialty Services"
            accent={VIOLET}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialtyServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i + 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== METRICS ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-8">
        <div
          className="grid grid-cols-2 gap-4 rounded-3xl p-6 md:grid-cols-4 md:p-10"
          style={{
            background: GLASS,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${HAIR}`,
            boxShadow: "0 30px 70px -40px rgba(0,0,0,0.85)",
          }}
        >
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="text-center md:text-left"
            >
              <div
                className="text-4xl font-semibold md:text-5xl"
                style={{ fontFamily: DISPLAY, color: m.accent }}
              >
                {m.value}
              </div>
              <p className="mt-1 text-sm" style={{ color: INK_2 }}>
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== HOW WE WORK ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="mb-10 max-w-xl">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: MONO, color: EMERALD }}
          >
            How we work
          </p>
          <h2
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{
              fontFamily: DISPLAY,
              color: INK_0,
              letterSpacing: "-0.02em",
            }}
          >
            A tight, transparent delivery loop.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col rounded-2xl p-6"
                style={{
                  background: GLASS,
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: `1px solid ${HAIR}`,
                }}
              >
                <span
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    color: s.accent,
                    background: `${s.accent}1F`,
                    border: `1px solid ${s.accent}3D`,
                  }}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <p
                  className="text-xs"
                  style={{ fontFamily: MONO, color: s.accent }}
                >
                  Step {i + 1} / {STEPS.length}
                </p>
                <h3
                  className="mt-1 text-lg font-semibold"
                  style={{ fontFamily: DISPLAY, color: INK_0 }}
                >
                  {s.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: INK_2 }}
                >
                  {s.blurb}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="mb-10 max-w-xl">
          <p
            className="text-[0.7rem] uppercase tracking-[0.24em]"
            style={{ fontFamily: MONO, color: PINK }}
          >
            In their words
          </p>
          <h2
            className="mt-2 text-3xl font-semibold md:text-4xl"
            style={{
              fontFamily: DISPLAY,
              color: INK_0,
              letterSpacing: "-0.02em",
            }}
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
                border: `1px solid ${HAIR}`,
                boxShadow: "0 18px 44px -28px rgba(0,0,0,0.8)",
              }}
            >
              <Quote className="h-6 w-6" style={{ color: t.accent }} />
              <blockquote
                className="mt-3 flex-1 text-sm leading-relaxed"
                style={{ color: INK_1 }}
              >
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5">
                <p className="text-sm font-semibold" style={{ color: INK_0 }}>
                  {t.name}
                </p>
                <p className="text-xs" style={{ fontFamily: MONO, color: INK_3 }}>
                  {t.org}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ===================== CLOSING CTA ===================== */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-24">
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-center md:p-14"
          style={{
            background: GLASS_STRONG,
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: `1px solid ${HAIR}`,
            boxShadow: "0 40px 90px -50px rgba(0,0,0,0.9)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background: `radial-gradient(60% 80% at 18% 0%, ${VIOLET}2E, transparent 60%), radial-gradient(60% 80% at 90% 100%, ${CYAN}26, transparent 60%)`,
            }}
          />
          <div className="relative">
            <h2
              className="mx-auto max-w-2xl text-3xl font-semibold md:text-4xl"
              style={{
                fontFamily: DISPLAY,
                color: INK_0,
                letterSpacing: "-0.02em",
              }}
            >
              Let's build something logical, scalable, and a little bit infinite.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base" style={{ color: INK_1 }}>
              Tell us about your project. We'll reply with a clear, honest plan —
              no obligation.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(100deg, ${BLUE}, ${VIOLET})`,
                  boxShadow: "0 16px 36px -14px rgba(59,130,246,0.7)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                style={{
                  color: INK_0,
                  background: "rgba(140,154,196,0.1)",
                  border: `1px solid ${HAIR}`,
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
                  color: INK_0,
                  background: "rgba(140,154,196,0.1)",
                  border: `1px solid ${HAIR}`,
                }}
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
              </a>
            </div>
            <p className="mt-8 text-xs" style={{ color: INK_3, fontFamily: MONO }}>
              IFLEON · Nellore, India · Founded 2022 · Infinite Possibilities,
              Logical Solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
