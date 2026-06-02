/* ============================================================
   C10 — "CANVAS"  (LIGHT, INFINITE DRAGGABLE CANVAS theme)

   The hero is an explorable INFINITE 2D CANVAS you DRAG to pan.
   IFLEON's content lives as cards scattered across the plane:
   the tagline block, all 16 service cards positioned in clusters
   (Business / Individuals / Specialty regions), metric chips,
   compliance badge, and GitHub. A subtle grid moves with the pan,
   a "drag to explore" hint fades, and a recenter button + minimap
   help orientation. Framer-motion drag gives inertial momentum.

   Below the canvas, the standard linear sections render so the
   page is complete and readable: services showcase (all 16
   grouped), metrics row, "how we work" 4-step, testimonials, CTA.

   MOTION DESIGN SYSTEM: shared easing / duration / spring tokens
   reused for entrances, hovers, and the drag transition.

   Self-contained. Allowed imports only: react, framer-motion,
   lucide-react, react-router-dom. NO three.js / WebGL.
   Honors prefers-reduced-motion (no momentum; static-friendly).
   Does NOT render Header / Footer.
   ============================================================ */

import { useRef, useState, useCallback, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  type Variants,
  type Transition,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Quote,
  Briefcase,
  Users,
  Layers,
  ShieldCheck,
  Hand,
  Crosshair,
  Search,
  PenTool,
  Wrench,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";

/* ---------------- theme tokens (self-defined, LIGHT) ---------------- */
const PAGE_BG = "#F4F6FB";
const CANVAS_BG = "#EEF1F8";
const INK = "#101936";
const INK_SOFT = "#4A5573";
const INK_FAINT = "#8B93AC";
const CARD = "#FFFFFF";
const BORDER = "rgba(16,25,54,0.09)";
const BORDER_STRONG = "rgba(16,25,54,0.14)";
const ACCENT = "#3B5BFF";
const ACCENT_SOFT = "#EAEEFF";
const GRID_LINE = "rgba(16,25,54,0.05)";

/* region accents (cluster identity) */
const REGION = {
  business: { hue: "#3B5BFF", soft: "#E9EDFF", label: "Business" },
  individual: { hue: "#12A594", soft: "#E2F6F2", label: "Individuals" },
  specialty: { hue: "#B7471F", soft: "#FBEAE2", label: "Specialty" },
} as const;

/* ================= MOTION DESIGN SYSTEM (shared tokens) ============= */
const EASE = [0.22, 1, 0.36, 1] as const; // signature ease-out-expo
const DUR = { fast: 0.28, base: 0.5, slow: 0.8 } as const;

const tEntrance: Transition = { duration: DUR.base, ease: EASE };

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: tEntrance },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const reveal = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.25 },
  variants: stagger,
};

/* ---------------- canvas geometry ---------------- */
const CANVAS_W = 2600;
const CANVAS_H = 1700;
const VIEW_H = 620; // canvas viewport height (px)
const WIN_W = 1100; // approx visible width used for minimap rect

type Placed = { service: Service; x: number; y: number };

/* Hand-placed clusters across the infinite plane. Coordinates are
   absolute within the CANVAS_W x CANVAS_H plane. */
function placeCluster(
  list: Service[],
  originX: number,
  originY: number,
  cols: number,
  gapX: number,
  gapY: number
): Placed[] {
  return list.map((service, i) => ({
    service,
    x: originX + (i % cols) * gapX,
    y: originY + Math.floor(i / cols) * gapY,
  }));
}

const PLACED: Placed[] = [
  ...placeCluster(businessServices, 760, 250, 3, 280, 300),
  ...placeCluster(individualServices, 360, 1060, 2, 290, 300),
  ...placeCluster(specialtyServices, 1700, 980, 3, 280, 300),
];

/* canvas translate we want to land on initially (tagline region) */
const HOME = { x: -780, y: -560 };

const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "99.9%", label: "Uptime SLA" },
];

const STEPS = [
  { icon: Search, title: "Discover", body: "We map your goals, constraints, and the highest-leverage problems worth solving." },
  { icon: PenTool, title: "Design", body: "We architect a pragmatic solution and a roadmap you can actually execute." },
  { icon: Wrench, title: "Build", body: "We ship in tested increments with CI/CD, clean code, and clear handover." },
  { icon: Rocket, title: "Scale", body: "We monitor, optimize, and iterate so the system keeps paying off." },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to daily deploys. Build times went from 40 minutes to under five — our engineers actually trust the pipeline now.",
    name: "Priya Nair",
    role: "VP Engineering, FinTech SaaS",
  },
  {
    quote:
      "Their AI support copilot deflects over 40% of our tickets and answers from our own docs. It paid for itself in the first quarter.",
    name: "Marcus Webb",
    role: "Head of Support, eCommerce",
  },
  {
    quote:
      "We passed our ISO 27001 audit on the first attempt. The evidence packs and runbooks they delivered made enterprise deals close far faster.",
    name: "Anjali Rao",
    role: "CISO, HealthTech",
  },
];

/* ---------------- small reusable pieces ---------------- */
function regionOf(c: Service["category"]) {
  return REGION[c];
}

function FloatingCard({ placed, reduce }: { placed: Placed; reduce: boolean }) {
  const { service, x, y } = placed;
  const r = regionOf(service.category);
  const Icon = service.icon as LucideIcon;
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
      transition={{ duration: DUR.fast, ease: EASE }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 244,
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: "18px 18px 16px",
        boxShadow: "0 10px 30px -16px rgba(16,25,54,0.28)",
        cursor: "grab",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 11,
          background: r.soft,
          color: r.hue,
          marginBottom: 12,
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div style={{ fontSize: 15.5, fontWeight: 700, color: INK, lineHeight: 1.25 }}>
        {service.title}
      </div>
      <div style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 6, lineHeight: 1.4 }}>
        {service.tagline}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: r.hue,
        }}
      >
        {r.label}
      </div>
    </motion.div>
  );
}

function RegionLabel({
  x,
  y,
  icon: Icon,
  text,
  hue,
}: {
  x: number;
  y: number;
  icon: LucideIcon;
  text: string;
  hue: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: 1.4,
        textTransform: "uppercase",
        color: hue,
        opacity: 0.85,
      }}
    >
      <Icon className="h-4 w-4" />
      {text}
    </div>
  );
}

/* ================================================================== */
export default function CanvasHome() {
  const reduce = useReducedMotion() ?? false;
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(HOME.x);
  const y = useMotionValue(HOME.y);
  const rafRef = useRef<number | null>(null);
  const [hintGone, setHintGone] = useState(false);
  const [pos, setPos] = useState(HOME); // tracked for the minimap rectangle

  const recenter = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    if (reduce) {
      x.set(HOME.x);
      y.set(HOME.y);
      setPos(HOME);
      return;
    }
    const startX = x.get();
    const startY = y.get();
    const t0 = performance.now();
    const dur = 600;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      x.set(startX + (HOME.x - startX) * e);
      y.set(startY + (HOME.y - startY) * e);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        setPos(HOME);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [reduce, x, y]);

  /* minimap geometry */
  const mmW = 132;
  const mmH = 86;
  const mmScaleX = mmW / CANVAS_W;
  const mmScaleY = mmH / CANVAS_H;
  // visible window top-left in canvas coords is (-pos.x, -pos.y)
  const winLeft = Math.max(0, Math.min(-pos.x * mmScaleX, mmW - WIN_W * mmScaleX));
  const winTop = Math.max(0, Math.min(-pos.y * mmScaleY, mmH - VIEW_H * mmScaleY));

  const dragProps = reduce
    ? ({ dragMomentum: false } as const)
    : ({
        dragMomentum: true,
        dragTransition: { power: 0.28, timeConstant: 320, bounceStiffness: 200, bounceDamping: 32 },
      } as const);

  return (
    <main style={{ background: PAGE_BG, color: INK, overflowX: "hidden" }}>
      {/* ===================== HERO: INFINITE CANVAS ===================== */}
      <section className="pt-28 md:pt-32" style={{ paddingBottom: 40, paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* header strip above the canvas */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={tEntrance}
            style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 16 }}
          >
            <div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: ACCENT,
                  background: ACCENT_SOFT,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 999,
                  padding: "6px 13px",
                }}
              >
                <Sparkles className="h-4 w-4" />
                IFLEON · Infinite Canvas
              </span>
              <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: -0.6, margin: "14px 0 0", lineHeight: 1.08 }}>
                Infinite Possibilities,
                <br />
                <span style={{ color: ACCENT }}>Logical Solutions.</span>
              </h1>
            </div>
            <p style={{ maxWidth: 360, fontSize: 14.5, color: INK_SOFT, lineHeight: 1.55, margin: 0 }}>
              A founder-led AI, DevOps, Cloud &amp; Cybersecurity studio. Drag the canvas
              below to explore what we build — or scroll down for the full tour.
            </p>
          </motion.div>

          {/* the draggable viewport */}
          <motion.div
            ref={viewportRef}
            initial={reduce ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DUR.slow, ease: EASE }}
            style={{
              position: "relative",
              height: VIEW_H,
              borderRadius: 24,
              border: `1px solid ${BORDER_STRONG}`,
              background: CANVAS_BG,
              overflow: "hidden",
              touchAction: "pan-y", // let the page scroll vertically; drag handles panning
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 30px 60px -40px rgba(16,25,54,0.4)",
            }}
          >
            {/* draggable plane */}
            <motion.div
              drag
              dragConstraints={{
                left: -(CANVAS_W - WIN_W),
                right: 200,
                top: -(CANVAS_H - VIEW_H + 80),
                bottom: 200,
              }}
              dragElastic={0.12}
              {...dragProps}
              onDragStart={() => setHintGone(true)}
              onDragEnd={() => setPos({ x: x.get(), y: y.get() })}
              style={{
                x,
                y,
                position: "absolute",
                width: CANVAS_W,
                height: CANVAS_H,
                cursor: "grab",
                /* moving grid background — pans with the plane */
                backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
                backgroundSize: "44px 44px",
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {/* region labels */}
              <RegionLabel x={760} y={210} icon={Briefcase} text="Business Solutions" hue={REGION.business.hue} />
              <RegionLabel x={360} y={1020} icon={Users} text="For Individuals" hue={REGION.individual.hue} />
              <RegionLabel x={1700} y={940} icon={Layers} text="Specialty & Add-Ons" hue={REGION.specialty.hue} />

              {/* central tagline / CTA card */}
              <div
                style={{
                  position: "absolute",
                  left: 1160,
                  top: 690,
                  width: 380,
                  background: "linear-gradient(160deg, #FFFFFF 0%, #F2F5FF 100%)",
                  border: `1px solid ${BORDER_STRONG}`,
                  borderRadius: 22,
                  padding: 26,
                  boxShadow: "0 24px 60px -30px rgba(59,91,255,0.5)",
                  cursor: "grab",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: ACCENT }}>
                  IFLEON · Nellore, India · 2022
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: INK, marginTop: 10, lineHeight: 1.2 }}>
                  We turn ambitious ideas into shipped, scalable software.
                </div>
                <p style={{ fontSize: 13.5, color: INK_SOFT, marginTop: 10, lineHeight: 1.55 }}>
                  AI &amp; ML · DevOps · Cloud · Cybersecurity — for businesses and
                  individuals, in India and worldwide.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
                  <a
                    href="mailto:info@ifleon.com"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      background: ACCENT,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13.5,
                      padding: "10px 16px",
                      borderRadius: 11,
                      textDecoration: "none",
                    }}
                  >
                    <Mail className="h-4 w-4" />
                    Request a Free Consultation
                  </a>
                  <Link
                    to="/services"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      background: "#fff",
                      color: INK,
                      fontWeight: 700,
                      fontSize: 13.5,
                      padding: "10px 16px",
                      borderRadius: 11,
                      border: `1px solid ${BORDER_STRONG}`,
                      textDecoration: "none",
                    }}
                  >
                    Explore Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* metric chips scattered near tagline */}
              {METRICS.map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    position: "absolute",
                    left: 1180 + (i % 2) * 210,
                    top: 1000 + Math.floor(i / 2) * 92,
                    width: 190,
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 14,
                    padding: "12px 14px",
                    boxShadow: "0 8px 24px -16px rgba(16,25,54,0.3)",
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>{m.value}</div>
                  <div style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}

              {/* compliance badge */}
              <div
                style={{
                  position: "absolute",
                  left: 700,
                  top: 760,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: INK_SOFT,
                  boxShadow: "0 8px 24px -16px rgba(16,25,54,0.3)",
                }}
              >
                <ShieldCheck className="h-5 w-5" style={{ color: REGION.individual.hue }} />
                ISO 27001 · DPDP · SOC 2
              </div>

              {/* GitHub card */}
              <a
                href="https://github.com/ifleonlabs"
                target="_blank"
                rel="noreferrer"
                style={{
                  position: "absolute",
                  left: 980,
                  top: 760,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 9,
                  background: INK,
                  color: "#fff",
                  borderRadius: 14,
                  padding: "12px 16px",
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 10px 26px -16px rgba(16,25,54,0.6)",
                }}
              >
                <Github className="h-5 w-5" />
                github.com/ifleonlabs
              </a>

              {/* the 16 service cards */}
              {PLACED.map((p) => (
                <FloatingCard key={p.service.id} placed={p} reduce={reduce} />
              ))}
            </motion.div>

            {/* drag hint overlay */}
            <motion.div
              initial={false}
              animate={{ opacity: hintGone ? 0 : 1, y: hintGone ? 8 : 0 }}
              transition={{ duration: DUR.base, ease: EASE }}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 18,
                transform: "translateX(-50%)",
                pointerEvents: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(16,25,54,0.86)",
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 999,
              }}
            >
              <Hand className="h-4 w-4" />
              Drag to explore the canvas
            </motion.div>

            {/* recenter button */}
            <button
              onClick={recenter}
              aria-label="Recenter canvas"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: CARD,
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 11,
                padding: "8px 12px",
                fontSize: 12.5,
                fontWeight: 700,
                color: INK,
                cursor: "pointer",
                boxShadow: "0 8px 20px -14px rgba(16,25,54,0.4)",
              }}
            >
              <Crosshair className="h-4 w-4" style={{ color: ACCENT }} />
              Recenter
            </button>

            {/* minimap */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                bottom: 14,
                right: 14,
                width: mmW,
                height: mmH,
                background: "rgba(255,255,255,0.9)",
                border: `1px solid ${BORDER_STRONG}`,
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 8px 20px -14px rgba(16,25,54,0.4)",
              }}
            >
              {PLACED.map((p) => (
                <span
                  key={`mm-${p.service.id}`}
                  style={{
                    position: "absolute",
                    left: p.x * mmScaleX,
                    top: p.y * mmScaleY,
                    width: 4,
                    height: 4,
                    borderRadius: 999,
                    background: regionOf(p.service.category).hue,
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: winLeft,
                  top: winTop,
                  width: WIN_W * mmScaleX,
                  height: VIEW_H * mmScaleY,
                  border: `1.5px solid ${ACCENT}`,
                  borderRadius: 3,
                  background: "rgba(59,91,255,0.1)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== LINEAR: SERVICES SHOWCASE ===================== */}
      <SectionShell>
        <SectionHead
          kicker="What we do"
          title="Sixteen ways IFLEON can help"
          sub="Every card on the canvas, organized for easy reading. Three practice areas, one team."
        />
        <ServiceGroup label="Business Solutions" icon={Briefcase} hue={REGION.business.hue} list={businessServices} />
        <ServiceGroup label="For Individuals" icon={Users} hue={REGION.individual.hue} list={individualServices} />
        <ServiceGroup label="Specialty & Add-Ons" icon={Layers} hue={REGION.specialty.hue} list={specialtyServices} />
      </SectionShell>

      {/* ===================== METRICS ROW ===================== */}
      <SectionShell tint>
        <motion.div
          {...reveal}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16 }}
        >
          {METRICS.map((m) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
                padding: "26px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 38, fontWeight: 800, color: ACCENT, letterSpacing: -1 }}>{m.value}</div>
              <div style={{ fontSize: 13.5, color: INK_SOFT, marginTop: 6 }}>{m.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </SectionShell>

      {/* ===================== HOW WE WORK ===================== */}
      <SectionShell>
        <SectionHead kicker="How we work" title="A straight line from idea to impact" sub="No mystery, no bloat — four deliberate steps." />
        <motion.div
          {...reveal}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}
        >
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -5 }}
                transition={{ duration: DUR.fast, ease: EASE }}
                style={{
                  position: "relative",
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 18,
                  padding: 22,
                  boxShadow: "0 10px 30px -22px rgba(16,25,54,0.35)",
                }}
              >
                <span style={{ position: "absolute", top: 16, right: 18, fontSize: 13, fontWeight: 800, color: INK_FAINT }}>
                  0{i + 1}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    width: 42,
                    height: 42,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    background: ACCENT_SOFT,
                    color: ACCENT,
                    marginBottom: 12,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>{s.title}</div>
                <p style={{ fontSize: 13.5, color: INK_SOFT, marginTop: 7, lineHeight: 1.55 }}>{s.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionShell>

      {/* ===================== TESTIMONIALS ===================== */}
      <SectionShell tint>
        <SectionHead kicker="Proof" title="Teams that trusted us" sub="Real outcomes from AI, DevOps, and security engagements." />
        <motion.div
          {...reveal}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18 }}
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
                padding: 24,
                margin: 0,
                boxShadow: "0 10px 30px -22px rgba(16,25,54,0.35)",
              }}
            >
              <Quote className="h-6 w-6" style={{ color: ACCENT, opacity: 0.5 }} />
              <blockquote style={{ fontSize: 14.5, color: INK, lineHeight: 1.6, margin: "12px 0 0" }}>
                "{t.quote}"
              </blockquote>
              <figcaption style={{ marginTop: 16, fontSize: 13.5 }}>
                <span style={{ fontWeight: 700, color: INK }}>{t.name}</span>
                <span style={{ color: INK_FAINT }}> · {t.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </SectionShell>

      {/* ===================== CLOSING CTA ===================== */}
      <SectionShell>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={tEntrance}
          style={{
            background: "linear-gradient(150deg, #101936 0%, #1F2C5C 60%, #2C3F8F 100%)",
            borderRadius: 26,
            padding: "44px 32px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, letterSpacing: -0.5, margin: 0 }}>
            Let's map your next build.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", maxWidth: 560, margin: "14px auto 0", lineHeight: 1.6 }}>
            Tell us what you're trying to ship. We'll come back with a pragmatic plan,
            a timeline, and an honest estimate.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <a
              href="mailto:info@ifleon.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                color: INK,
                fontWeight: 700,
                fontSize: 14.5,
                padding: "12px 22px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <Mail className="h-4 w-4" />
              info@ifleon.com
            </a>
            <Link
              to="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14.5,
                padding: "12px 22px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)",
                textDecoration: "none",
              }}
            >
              Explore Services
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/ifleonlabs"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14.5,
                padding: "12px 22px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.25)",
                textDecoration: "none",
              }}
            >
              <Github className="h-4 w-4" />
              github.com/ifleonlabs
            </a>
          </div>
        </motion.div>
      </SectionShell>
    </main>
  );
}

/* ---------------- linear-section helpers ---------------- */
function SectionShell({ children, tint }: { children: ReactNode; tint?: boolean }) {
  return (
    <section style={{ background: tint ? "#ECEFF7" : PAGE_BG, padding: "56px 16px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={tEntrance}
      style={{ marginBottom: 28, maxWidth: 640 }}
    >
      <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", color: ACCENT }}>
        {kicker}
      </span>
      <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: -0.5, margin: "8px 0 0", color: INK }}>
        {title}
      </h2>
      <p style={{ fontSize: 14.5, color: INK_SOFT, marginTop: 8, lineHeight: 1.55 }}>{sub}</p>
    </motion.div>
  );
}

function ServiceGroup({
  label,
  icon: Icon,
  hue,
  list,
}: {
  label: string;
  icon: LucideIcon;
  hue: string;
  list: Service[];
}) {
  return (
    <div style={{ marginBottom: 34 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
        <span
          style={{
            display: "inline-flex",
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            background: "#fff",
            border: `1px solid ${BORDER}`,
            color: hue,
          }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: INK }}>
          {label}
        </span>
      </div>
      <motion.div
        {...reveal}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}
      >
        {list.map((s) => {
          const Ic = s.icon as LucideIcon;
          return (
            <motion.div
              key={s.id}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              transition={{ duration: DUR.fast, ease: EASE }}
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 18,
                padding: 20,
                boxShadow: "0 10px 30px -24px rgba(16,25,54,0.35)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 40,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 11,
                  background: `${hue}14`,
                  color: hue,
                  marginBottom: 13,
                }}
              >
                <Ic className="h-5 w-5" />
              </span>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.25 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: hue, fontWeight: 600, marginTop: 5 }}>{s.tagline}</div>
              <p style={{ fontSize: 13, color: INK_SOFT, marginTop: 9, lineHeight: 1.5 }}>{s.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
