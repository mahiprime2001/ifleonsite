import { useEffect, useRef, useState } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Compass,
  Hammer,
  Rocket,
  Quote,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/*  Brand palette (inline, near-black + blue / cyan / violet)          */
/* ------------------------------------------------------------------ */
const COLORS = {
  bg: "#04060f",
  ink: "#e8ecff",
  blue: "#2563ff",
  cyan: "#22d3ee",
  violet: "#8b5cf6",
};

/* ------------------------------------------------------------------ */
/*  WebGL distortion shader                                            */
/* ------------------------------------------------------------------ */
const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float u_time;
  uniform vec2  u_mouse;   // 0..1, y already flipped to match uv
  uniform float u_scroll;  // 0..1 intensity
  uniform vec2  u_res;

  varying vec2 vUv;

  // ---- hash / value noise --------------------------------------------------
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
  }

  // ---- fractal brownian motion ---------------------------------------------
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 5; i++) {
      v += a * gnoise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  // ---- domain-warped curl-ish field ----------------------------------------
  float field(vec2 p, float t) {
    vec2 q = vec2(fbm(p + vec2(0.0, t * 0.10)),
                  fbm(p + vec2(5.2, 1.3 - t * 0.08)));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.12),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8) - t * 0.09));
    return fbm(p + 4.0 * r);
  }

  void main() {
    vec2 res = u_res;
    float aspect = res.x / max(res.y, 1.0);
    vec2 uv = vUv;

    // pointer in same space
    vec2 m = u_mouse;
    vec2 duv = uv - m;
    duv.x *= aspect;
    float dist = length(duv);

    // ---- LIQUID DISTORTION toward the pointer ------------------------------
    // a soft well that warps the field around the cursor; scroll boosts it
    float pull = exp(-dist * 4.5);
    float warpAmt = 0.18 + u_scroll * 0.55;
    vec2 dir = normalize(duv + 1e-4);
    vec2 warped = uv - dir * pull * warpAmt;

    // base sampling coords (animated flow)
    vec2 p = warped;
    p.x *= aspect;
    p *= 2.6;
    float t = u_time * 0.35;

    // plasma / liquid field value
    float f = field(p + vec2(0.0, t * 0.25), t);

    // ---- PIXEL DISPLACEMENT / quantization near cursor ---------------------
    // closer to mouse => coarser blocks (chunky pixel-displacement look)
    float pix = smoothstep(0.55, 0.0, dist) * (0.6 + u_scroll * 0.4);
    if (pix > 0.001) {
      float blocks = mix(420.0, 26.0, pix);   // fewer blocks = bigger pixels
      vec2 grid = floor(warped * blocks) / blocks;
      vec2 gp = grid;
      gp.x *= aspect;
      gp *= 2.6;
      float fq = field(gp + vec2(0.0, t * 0.25), t);
      f = mix(f, fq, pix);
    }

    // ---- RGB SPLIT strengthening near cursor -------------------------------
    float splitAmt = (0.004 + u_scroll * 0.010) + smoothstep(0.5, 0.0, dist) * 0.022;
    vec2 off = dir * splitAmt;

    vec2 pr = (warped + off);  pr.x *= aspect; pr *= 2.6;
    vec2 pb = (warped - off);  pb.x *= aspect; pb *= 2.6;
    float fr = field(pr + vec2(0.0, t * 0.25), t);
    float fb = field(pb + vec2(0.0, t * 0.25), t);

    // remap field -> 0..1 ridges
    float vr = smoothstep(-0.6, 0.7, fr);
    float vg = smoothstep(-0.6, 0.7, f);
    float vb = smoothstep(-0.6, 0.7, fb);

    // ---- brand gradient: deep navy -> blue -> cyan -> violet ----------------
    vec3 c1 = vec3(0.016, 0.024, 0.059);   // near-black navy
    vec3 c2 = vec3(0.145, 0.388, 1.0);     // electric blue  #2563ff
    vec3 c3 = vec3(0.133, 0.827, 0.933);   // cyan           #22d3ee
    vec3 c4 = vec3(0.545, 0.361, 0.965);   // violet         #8b5cf6

    vec3 colR = mix(c1, c2, vr);
    colR = mix(colR, c3, smoothstep(0.45, 0.95, vr));
    vec3 colG = mix(c1, c2, vg);
    colG = mix(colG, c3, smoothstep(0.45, 0.95, vg));
    colG = mix(colG, c4, smoothstep(0.7, 1.0, vg) * 0.6);
    vec3 colB = mix(c1, c2, vb);
    colB = mix(colB, c4, smoothstep(0.4, 0.95, vb));

    // compose RGB-split: take R from colR, G from colG, B from colB
    vec3 col = vec3(colR.r, colG.g, colB.b);

    // glow well around the cursor
    col += vec3(0.15, 0.45, 0.9) * pull * (0.35 + u_scroll * 0.45);

    // bright filament ridges
    float ridge = pow(vg, 3.0);
    col += vec3(0.2, 0.55, 1.0) * ridge * 0.25;

    // subtle energy shimmer
    col += 0.02 * sin((uv.y * res.y) * 0.7 + u_time * 2.0);

    // vignette toward near-black edges
    vec2 vc = vUv - 0.5;
    float vig = 1.0 - dot(vc, vc) * 1.15;
    col *= clamp(vig, 0.25, 1.0);

    // floor to keep it dark & rich
    col = max(col, vec3(0.012, 0.016, 0.035));

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/*  Distortion canvas component                                        */
/* ------------------------------------------------------------------ */
type Uniforms = {
  u_time: { value: number };
  u_mouse: { value: [number, number] };
  u_scroll: { value: number };
  u_res: { value: [number, number] };
};

function DistortionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ---- capability / preference gating ----
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowEnd =
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
      (typeof nav.hardwareConcurrency === "number" &&
        nav.hardwareConcurrency <= 2);

    if (reduced || lowEnd) {
      setFallback(true);
      return;
    }

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio || 1, 1.6),
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      setFallback(true);
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0.016, 0.024, 0.059, 1);

    const geometry = new Triangle(gl);

    const uniforms: Uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: [0.5, 0.55] },
      u_scroll: { value: 0 },
      u_res: { value: [1, 1] },
    };

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms,
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.u_res.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- pointer (smoothed) ----
    const targetMouse: [number, number] = [
      uniforms.u_mouse.value[0],
      uniforms.u_mouse.value[1],
    ];
    const onPointer = (e: PointerEvent) => {
      targetMouse[0] = e.clientX / window.innerWidth;
      targetMouse[1] = 1 - e.clientY / window.innerHeight; // flip to uv space
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // ---- scroll intensity ----
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      uniforms.u_scroll.value = Math.min(1, window.scrollY / max);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- run/pause gating ----
    let running = true;
    let visible = true;

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---- rAF loop ----
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!running || !visible) return;

      uniforms.u_time.value += dt;
      // ease the mouse for the liquid feel
      const mv = uniforms.u_mouse.value;
      const k = Math.min(1, dt * 6);
      mv[0] += (targetMouse[0] - mv[0]) * k;
      mv[1] += (targetMouse[1] - mv[1]) * k;

      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      const ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    };
  }, []);

  if (fallback) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 10%, rgba(37,99,255,0.32), transparent 55%)," +
            "radial-gradient(90% 80% at 15% 80%, rgba(139,92,246,0.28), transparent 55%)," +
            "radial-gradient(70% 60% at 50% 50%, rgba(34,211,238,0.18), transparent 60%)," +
            `${COLORS.bg}`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-10 h-full w-full"
      style={{ pointerEvents: "none", display: "block" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md ${className}`}
      style={{ boxShadow: "0 10px 40px -20px rgba(37,99,255,0.5)" }}
    >
      {children}
    </div>
  );
}

const GROUPS = [
  { key: "Business", items: businessServices, tint: COLORS.blue },
  { key: "For Individuals", items: individualServices, tint: COLORS.cyan },
  { key: "Specialty & Add-ons", items: specialtyServices, tint: COLORS.violet },
];

const STEPS = [
  {
    icon: Compass,
    title: "Discover",
    body: "We map your goals, stack, and constraints — then scope the highest-value work first.",
  },
  {
    icon: Hammer,
    title: "Design & Build",
    body: "Clean architecture, iterative delivery, and tests so what we ship stays maintainable.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    body: "Zero-downtime rollouts with monitoring, runbooks, and a clear handover to your team.",
  },
  {
    icon: Sparkles,
    title: "Optimize",
    body: "We measure, tune, and iterate — cost, performance, and reliability over the long run.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Build times dropped from 40 minutes to under five.",
    name: "Platform Lead",
    role: "B2B SaaS, India",
  },
  {
    quote:
      "Their ISO 27001 and DPDP work unblocked two enterprise deals. Audit-ready documentation, no drama.",
    name: "CTO",
    role: "Fintech Startup",
  },
  {
    quote:
      "The AI support copilot answers from our own docs and cut response time in half. It just works.",
    name: "Head of Support",
    role: "E-commerce",
  },
];

const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "99.9%", label: "Uptime Maintained" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function DistortHome() {
  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ background: COLORS.bg, color: COLORS.ink }}
    >
      {/* ===== HERO ===== */}
      <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-28 pb-20 md:pt-32">
        <DistortionCanvas />

        {/* readability scrim */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5]"
          style={{
            background:
              "radial-gradient(110% 80% at 50% 30%, transparent 40%, rgba(4,6,15,0.55) 100%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: COLORS.cyan }}
            />
            Founder-led · AI · DevOps · Cloud · Cybersecurity
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-7 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="block">Infinite Possibilities,</span>
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(100deg, ${COLORS.blue}, ${COLORS.cyan} 55%, ${COLORS.violet})`,
              }}
            >
              Logical Solutions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            IFLEON is a founder-led consultancy from Nellore, India — building
            intelligent, secure, and scalable systems for teams and individuals
            across India and the globe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <a
              href="mailto:info@ifleon.com"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{
                background: `linear-gradient(100deg, ${COLORS.blue}, ${COLORS.violet})`,
                boxShadow: "0 12px 40px -12px rgba(37,99,255,0.7)",
              }}
            >
              <Mail className="h-4 w-4" />
              Request a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
            >
              Explore Services
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-7 text-xs text-white/40"
          >
            Move your cursor — the field distorts. ISO 27001 · DPDP · SOC 2
          </motion.p>
        </div>
      </section>

      {/* ===== SERVICES SHOWCASE (all 16) ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything we build, in one place
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            Sixteen services across business, individuals, and specialty
            add-ons — one team, end to end.
          </p>
        </div>

        <div className="space-y-16">
          {GROUPS.map((group) => (
            <div key={group.key}>
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: group.tint }}
                />
                <h3 className="text-lg font-semibold tracking-wide text-white/90">
                  {group.key}
                </h3>
                <span className="text-xs text-white/40">
                  {group.items.length} services
                </span>
              </div>

              <motion.div
                variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {group.items.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.id} variants={fadeUp}>
                      <GlassCard className="group h-full p-5 transition-colors hover:bg-white/[0.07]">
                        <div className="flex items-start gap-4">
                          <span
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10"
                            style={{
                              background: `${group.tint}22`,
                              color: group.tint,
                            }}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <h4 className="font-semibold leading-tight text-white">
                              {s.title}
                            </h4>
                            <p
                              className="mt-0.5 text-xs font-medium"
                              style={{ color: group.tint }}
                            >
                              {s.tagline}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-white/60">
                          {s.description}
                        </p>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== METRICS ===== */}
      <section className="relative border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-6 py-4 md:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="px-4 py-8 text-center">
              <div
                className="text-4xl font-extrabold tracking-tight md:text-5xl"
                style={{
                  backgroundImage: `linear-gradient(120deg, ${COLORS.cyan}, ${COLORS.blue})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {m.value}
              </div>
              <div className="mt-2 text-sm text-white/55">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW WE WORK ===== */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How we work
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">
            A clear, four-step path from first conversation to long-term
            reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard className="h-full p-6">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        background: `${COLORS.blue}22`,
                        color: COLORS.cyan,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-3xl font-black text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {step.body}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard className="flex h-full flex-col p-6">
                <Quote className="h-7 w-7" style={{ color: COLORS.violet }} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/75">
                  “{t.quote}”
                </p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-white/50">{t.role}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CLOSING CTA ===== */}
      <section className="relative px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 p-10 text-center md:p-16"
            style={{
              background:
                "radial-gradient(120% 140% at 50% 0%, rgba(37,99,255,0.22), transparent 60%), rgba(255,255,255,0.03)",
            }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Let’s build something that lasts.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/65">
              Tell us what you’re trying to ship. We’ll come back with a clear
              plan, an honest timeline, and the first high-value step.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:info@ifleon.com"
                className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                style={{
                  background: `linear-gradient(100deg, ${COLORS.blue}, ${COLORS.violet})`,
                  boxShadow: "0 12px 40px -12px rgba(37,99,255,0.7)",
                }}
              >
                <Mail className="h-4 w-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
              >
                <Github className="h-4 w-4" />
                github.com/ifleonlabs
              </a>
            </div>

            <p className="mt-8 text-xs text-white/40">
              IFLEON · Nellore, India · Est. 2022 · ISO 27001 · DPDP · SOC 2
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
