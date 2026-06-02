/* THEME C8 — "TRAIL"
 * Dark, interaction-rich landing for IFLEON.
 * Mouse trail (canvas) + card/chip trail (DOM + framer) + cinematic
 * curtain-wipe section transitions + smooth scroll polish.
 * Trails gated behind (pointer: fine) AND no prefers-reduced-motion.
 * DOM/canvas only — no WebGL.
 */
import * as React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Quote,
  Search,
  PenTool,
  Rocket,
  LifeBuoy,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ------------------------------------------------------------------ */
/* Palette (inline)                                                    */
/* ------------------------------------------------------------------ */
const INK = "#05060c";
const INK_2 = "#0a0c18";
const BLUE = "#4d7cff";
const VIOLET = "#9b5cff";
const CYAN = "#3ad0ff";
const TEXT = "#eef0fb";
const MUTED = "#9aa0c2";
const BORDER = "rgba(155,170,255,0.14)";

/* ------------------------------------------------------------------ */
/* Interaction gate                                                    */
/* ------------------------------------------------------------------ */
function useTrailEnabled(): boolean {
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return finePointer && !reduced;
}

/* ------------------------------------------------------------------ */
/* Mouse trail — canvas line/particle trail, rAF-driven                */
/* ------------------------------------------------------------------ */
function MouseTrailCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type Pt = { x: number; y: number; life: number };
    const pts: Pt[] = [];
    const MAX = 26;

    let lerpX = width / 2;
    let lerpY = height / 2;
    let targetX = width / 2;
    let targetY = height / 2;
    let moving = false;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      moving = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const loop = () => {
      // ease the head toward the pointer
      lerpX += (targetX - lerpX) * 0.22;
      lerpY += (targetY - lerpY) * 0.22;

      if (moving) {
        pts.push({ x: lerpX, y: lerpY, life: 1 });
        if (pts.length > MAX) pts.shift();
      }

      ctx.clearRect(0, 0, width, height);

      // draw the connecting glowing trail
      ctx.globalCompositeOperation = "lighter";
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const t = i / pts.length;
        a.life *= 0.96;

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, BLUE);
        grad.addColorStop(1, VIOLET);
        ctx.strokeStyle = grad;
        ctx.globalAlpha = Math.max(0, a.life) * t * 0.85;
        ctx.lineWidth = 1 + t * 6;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // glowing head
      if (pts.length) {
        const head = pts[pts.length - 1];
        const r = 9;
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r * 2.4);
        g.addColorStop(0, "rgba(58,208,255,0.9)");
        g.addColorStop(0.5, "rgba(77,124,255,0.45)");
        g.addColorStop(1, "rgba(77,124,255,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(head.x, head.y, r * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      moving = false;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Chip trail — spawn fading brand chips at past pointer positions     */
/* ------------------------------------------------------------------ */
const CHIP_WORDS = [
  "AI",
  "DevOps",
  "Cloud",
  "Security",
  "Automation",
  "RAG",
  "K8s",
  "CI/CD",
  "Data",
  "Agents",
  "Scale",
  "Ship",
];

type Chip = { id: number; x: number; y: number; word: string; hue: string };

function ChipTrail({ hostRef }: { hostRef: React.RefObject<HTMLDivElement> }) {
  const [chips, setChips] = React.useState<Chip[]>([]);
  const lastSpawn = React.useRef(0);
  const idRef = React.useRef(0);
  const wordRef = React.useRef(0);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawn.current < 90) return; // throttle spawns
      lastSpawn.current = now;

      const rect = host.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

      const word = CHIP_WORDS[wordRef.current % CHIP_WORDS.length];
      wordRef.current += 1;
      const hue = [BLUE, VIOLET, CYAN][idRef.current % 3];
      const id = idRef.current++;

      setChips((prev) => {
        const next = [...prev, { id, x, y, word, hue }];
        return next.length > 14 ? next.slice(next.length - 14) : next; // cap count
      });
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => host.removeEventListener("pointermove", onMove);
  }, [hostRef]);

  const remove = (id: number) =>
    setChips((prev) => prev.filter((c) => c.id !== id));

  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}
    >
      <AnimatePresence>
        {chips.map((c) => (
          <motion.span
            key={c.id}
            initial={{ opacity: 0, scale: 0.4, y: 0 }}
            animate={{ opacity: 0.9, scale: 1, y: -18 }}
            exit={{ opacity: 0, scale: 0.7, y: -34 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            onAnimationComplete={() => remove(c.id)}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              transform: "translate(-50%, -50%)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.04em",
              padding: "3px 9px",
              borderRadius: 999,
              color: c.hue,
              border: `1px solid ${c.hue}55`,
              background: "rgba(8,10,22,0.6)",
              boxShadow: `0 0 14px ${c.hue}40`,
              backdropFilter: "blur(2px)",
              whiteSpace: "nowrap",
            }}
          >
            {c.word}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cinematic curtain-wipe section wrapper                              */
/* ------------------------------------------------------------------ */
function CurtainSection({
  children,
  id,
  reduced,
}: {
  children: React.ReactNode;
  id?: string;
  reduced: boolean | null;
}) {
  return (
    <motion.section
      id={id}
      initial={reduced ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0 }}
      whileInView={
        reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)", opacity: 1 }
      }
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/* Service card                                                        */
/* ------------------------------------------------------------------ */
function ServiceCard({ s, hue }: { s: Service; hue: string }) {
  const Icon = s.icon;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={{
        position: "relative",
        borderRadius: 16,
        padding: 18,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(120% 80% at 0% 0%, ${hue}1f, transparent 60%)`,
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: 12,
          color: hue,
          background: `${hue}1a`,
          border: `1px solid ${hue}40`,
          marginBottom: 12,
        }}
      >
        <Icon className="w-5 h-5" />
      </span>
      <h4 style={{ fontSize: 15, fontWeight: 700, color: TEXT, lineHeight: 1.25 }}>
        {s.title}
      </h4>
      <p style={{ fontSize: 12.5, color: hue, marginTop: 4, fontWeight: 500 }}>
        {s.tagline}
      </p>
      <p style={{ fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 1.5 }}>
        {s.description}
      </p>
    </motion.div>
  );
}

function ServiceGroup({
  label,
  items,
  hue,
}: {
  label: string;
  items: Service[];
  hue: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: hue,
            boxShadow: `0 0 12px ${hue}`,
          }}
        />
        <h3
          style={{
            fontSize: 13,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: TEXT,
            fontWeight: 700,
          }}
        >
          {label}
        </h3>
        <span style={{ flex: 1, height: 1, background: BORDER }} />
        <span style={{ fontSize: 12, color: MUTED }}>{items.length}</span>
      </div>
      <div
        style={{
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))",
        }}
      >
        {items.map((s) => (
          <ServiceCard key={s.id} s={s} hue={hue} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */
const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "99.9%", label: "Uptime" },
];

const STEPS = [
  {
    icon: Search,
    title: "Discover",
    text: "We map your goals, constraints, and the highest-value problems worth solving first.",
  },
  {
    icon: PenTool,
    title: "Design",
    text: "Architecture, UX, and a phased roadmap — logical solutions, not guesswork.",
  },
  {
    icon: Rocket,
    title: "Deliver",
    text: "We build, test, and ship in tight iterations with CI/CD and clear handover.",
  },
  {
    icon: LifeBuoy,
    title: "Support",
    text: "Monitoring, optimization, and a partner who stays after launch.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to daily deploys. Build times dropped from 40 minutes to under five.",
    name: "Operations Lead",
    role: "B2B SaaS, India",
  },
  {
    quote:
      "Their AI assistant deflects over 40% of our support tickets and answers straight from our own docs.",
    name: "Head of Support",
    role: "Fintech",
  },
  {
    quote:
      "ISO 27001 readiness in weeks, not months. We closed enterprise deals we couldn't touch before.",
    name: "Founder",
    role: "Cloud Startup",
  },
];

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function TrailHome() {
  const trailEnabled = useTrailEnabled();
  const reduced = useReducedMotion();
  const heroRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const beamScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // smooth-scroll polish
  React.useEffect(() => {
    if (reduced) return;
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, [reduced]);

  const wrap: React.CSSProperties = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "0 24px",
  };

  return (
    <div
      style={{
        background: `radial-gradient(1200px 700px at 70% -10%, ${INK_2}, ${INK})`,
        color: TEXT,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      {/* scroll progress beam */}
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          transformOrigin: "0% 50%",
          scaleX: beamScale,
          background: `linear-gradient(90deg, ${BLUE}, ${VIOLET}, ${CYAN})`,
          zIndex: 70,
        }}
      />

      {trailEnabled && <MouseTrailCanvas />}

      {/* ---------------- HERO ---------------- */}
      <section
        ref={heroRef}
        style={{ position: "relative", overflow: "hidden" }}
        className="pt-28 md:pt-32"
      >
        {trailEnabled && (
          <ChipTrail hostRef={heroRef as React.RefObject<HTMLDivElement>} />
        )}

        {/* ambient grid glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(155,170,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(155,170,255,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(70% 60% at 50% 20%, black, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(70% 60% at 50% 20%, black, transparent 80%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ ...wrap, position: "relative", zIndex: 6, paddingBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${BORDER}`,
              background: "rgba(255,255,255,0.03)",
              fontSize: 12.5,
              color: MUTED,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: CYAN }} />
            Founder-led · Nellore, India · since 2022
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              marginTop: 22,
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 1.04,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Infinite Possibilities,{" "}
            <span
              style={{
                background: `linear-gradient(100deg, ${CYAN}, ${BLUE}, ${VIOLET})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Logical Solutions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            style={{
              marginTop: 20,
              fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
              color: MUTED,
              maxWidth: 620,
              lineHeight: 1.6,
            }}
          >
            IFLEON is a founder-led consultancy building AI, DevOps, cloud, and
            cybersecurity solutions for teams in India and around the world — from
            first prototype to production at scale.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            style={{ marginTop: 30, display: "flex", flexWrap: "wrap", gap: 14 }}
          >
            <a
              href="mailto:info@ifleon.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14.5,
                color: "#fff",
                background: `linear-gradient(100deg, ${BLUE}, ${VIOLET})`,
                boxShadow: `0 10px 30px -8px ${BLUE}`,
                textDecoration: "none",
              }}
            >
              <Mail className="w-4 h-4" />
              Request a Free Consultation
            </a>
            <Link
              to="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14.5,
                color: TEXT,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${BORDER}`,
                textDecoration: "none",
              }}
            >
              Explore Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {trailEnabled && (
            <p
              style={{
                marginTop: 26,
                fontSize: 12,
                color: "rgba(154,160,194,0.7)",
              }}
            >
              Move your cursor across the hero — the trail follows.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <CurtainSection id="services" reduced={reduced}>
        <div style={{ ...wrap, padding: "72px 24px" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            What we build
          </h2>
          <p style={{ color: MUTED, marginTop: 10, maxWidth: 560, lineHeight: 1.6 }}>
            Sixteen services across business solutions, individual support, and
            specialty add-ons — pick a starting point or talk through a custom mix.
          </p>
          <div style={{ marginTop: 36 }}>
            <ServiceGroup label="Business" items={businessServices} hue={BLUE} />
            <ServiceGroup label="Individuals" items={individualServices} hue={CYAN} />
            <ServiceGroup label="Specialty" items={specialtyServices} hue={VIOLET} />
          </div>
        </div>
      </CurtainSection>

      {/* ---------------- METRICS ---------------- */}
      <CurtainSection reduced={reduced}>
        <div style={{ ...wrap, padding: "20px 24px 60px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 16,
              padding: 28,
              borderRadius: 20,
              border: `1px solid ${BORDER}`,
              background:
                "linear-gradient(120deg, rgba(77,124,255,0.06), rgba(155,92,255,0.05))",
            }}
          >
            {METRICS.map((m) => (
              <div key={m.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                    fontWeight: 800,
                    background: `linear-gradient(100deg, ${CYAN}, ${VIOLET})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4 }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 12,
              color: "rgba(154,160,194,0.75)",
            }}
          >
            Compliance-ready: ISO 27001 · DPDP · SOC 2
          </p>
        </div>
      </CurtainSection>

      {/* ---------------- HOW WE WORK ---------------- */}
      <CurtainSection reduced={reduced}>
        <div style={{ ...wrap, padding: "40px 24px 72px" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            How we work
          </h2>
          <div
            style={{
              marginTop: 36,
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    position: "relative",
                    padding: 20,
                    borderRadius: 16,
                    border: `1px solid ${BORDER}`,
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: VIOLET,
                      letterSpacing: "0.1em",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      color: CYAN,
                      background: "rgba(58,208,255,0.1)",
                      border: `1px solid ${CYAN}33`,
                      margin: "12px 0",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>{step.title}</h4>
                  <p
                    style={{
                      fontSize: 13,
                      color: MUTED,
                      marginTop: 6,
                      lineHeight: 1.5,
                    }}
                  >
                    {step.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CurtainSection>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <CurtainSection reduced={reduced}>
        <div style={{ ...wrap, padding: "20px 24px 72px" }}>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            What clients say
          </h2>
          <div
            style={{
              marginTop: 36,
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name + t.role}
                style={{
                  padding: 22,
                  borderRadius: 16,
                  border: `1px solid ${BORDER}`,
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                }}
              >
                <Quote className="w-6 h-6" style={{ color: BLUE, opacity: 0.7 }} />
                <p
                  style={{
                    fontSize: 14.5,
                    color: TEXT,
                    marginTop: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {t.quote}
                </p>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CurtainSection>

      {/* ---------------- CLOSING CTA ---------------- */}
      <CurtainSection reduced={reduced}>
        <div style={{ ...wrap, padding: "20px 24px 96px" }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "48px 32px",
              borderRadius: 24,
              textAlign: "center",
              border: `1px solid ${BORDER}`,
              background:
                "linear-gradient(135deg, rgba(77,124,255,0.12), rgba(155,92,255,0.12))",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(60% 80% at 50% 0%, ${BLUE}22, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
            <h2
              style={{
                position: "relative",
                fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Let's build something logical.
            </h2>
            <p
              style={{
                position: "relative",
                color: MUTED,
                marginTop: 12,
                maxWidth: 520,
                marginInline: "auto",
                lineHeight: 1.6,
              }}
            >
              Tell us what you're trying to solve. We'll come back with a clear,
              practical path forward — no jargon, no lock-in.
            </p>
            <div
              style={{
                position: "relative",
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "center",
              }}
            >
              <a
                href="mailto:info@ifleon.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 22px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: "#fff",
                  background: `linear-gradient(100deg, ${BLUE}, ${VIOLET})`,
                  textDecoration: "none",
                }}
              >
                <Mail className="w-4 h-4" />
                info@ifleon.com
              </a>
              <Link
                to="/services"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 22px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: TEXT,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${BORDER}`,
                  textDecoration: "none",
                }}
              >
                Explore Services
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 22px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: TEXT,
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${BORDER}`,
                  textDecoration: "none",
                }}
              >
                <Github className="w-4 h-4" />
                github.com/ifleonlabs
              </a>
            </div>
          </div>
        </div>
      </CurtainSection>
    </div>
  );
}
