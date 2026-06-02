/* ============================================================
   V6 — "MOTION"  (LIGHT, motion-rich COMBINATION theme)
   Centered on MOVING ILLUSTRATIONS / ANIMATED SCENES.

   Combines:
   (1) Hand-built LOOPING animated SVG "scenes" that depict what
       IFLEON does — a CI/CD pipeline with dots flowing along
       paths, a cloud with pulsing data packets, a security shield
       with a scanning sweep, and an AI brain/network with firing
       nodes. Animated via SMIL <animate>/<animateMotion> +
       stroke-dashoffset flow + framer pulses.
   (2) SVG MORPHING section dividers (a wavy blob path that morphs
       between two shapes on a loop).
   (3) BENTO grid layouts for the scenes + services.
   (4) gradient-MESH soft background.
   (5) framer-motion section reveals.
   (6) ONE optional Lottie scene (DotLottieReact + local asset).

   Self-contained. Allowed imports only: react, framer-motion,
   lucide-react, react-router-dom, @lottiefiles/dotlottie-react,
   + the local about-lottie.json. NO three.js / WebGL.
   Honors prefers-reduced-motion (freezes loops to a static still).
   Does NOT render Header / Footer.
   ============================================================ */

import { useId } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  ArrowRight,
  Mail,
  Github,
  Sparkles,
  Quote,
  Briefcase,
  User,
  Layers,
  ShieldCheck,
  Search,
  FileSearch,
  Wrench,
  Rocket,
} from "lucide-react";
import {
  businessServices,
  individualServices,
  specialtyServices,
  type Service,
} from "../../data/services";
import aboutLottie from "../../assets/about-lottie.json";

/* ---------------- theme tokens (self-defined, LIGHT) ---------------- */
const PAGE_BG = "#F6F8FF";
const INK = "#0E1430";
const INK_SOFT = "#4B5573";
const INK_FAINT = "#8A92AD";
const CARD = "#FFFFFF";
const BORDER = "rgba(14,20,48,0.08)";
const BORDER_STRONG = "rgba(14,20,48,0.12)";

const INDIGO = "#5B6CFF";
const VIOLET = "#9B5BFF";
const PINK = "#FF5BA8";
const CYAN = "#1FC8DB";
const TEAL = "#19C7A0";
const AMBER = "#FFB23E";
const SKY = "#3EA6FF";

const FONT =
  'var(--font-sans, "Inter"), ui-sans-serif, system-ui, -apple-system, sans-serif';

/* ============================================================
   Section reveal helpers (framer-motion)
   ============================================================ */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

function Reveal({
  children,
  className,
  i = 0,
}: {
  children: React.ReactNode;
  className?: string;
  i?: number;
}) {
  return (
    <motion.div
      className={className}
      custom={i}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Gradient-MESH soft background. Several large blurred radial
   blobs that slowly drift (frozen when reduced motion).
   ============================================================ */
function MeshBackground() {
  const reduced = useReducedMotion();
  const blob = (
    color: string,
    style: React.CSSProperties,
    dx: number,
    dy: number,
    dur: number,
  ) => (
    <motion.div
      aria-hidden
      style={{
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        background: color,
        ...style,
      }}
      animate={reduced ? undefined : { x: [0, dx, 0], y: [0, dy, 0] }}
      transition={
        reduced
          ? undefined
          : { duration: dur, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );
  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}
    >
      {blob(
        "rgba(91,108,255,0.32)",
        { width: 520, height: 520, top: -140, left: -120 },
        60,
        40,
        18,
      )}
      {blob(
        "rgba(255,91,168,0.20)",
        { width: 460, height: 460, top: -80, right: -140 },
        -50,
        50,
        22,
      )}
      {blob(
        "rgba(31,200,219,0.20)",
        { width: 520, height: 520, bottom: -180, left: "30%" },
        40,
        -40,
        26,
      )}
      {blob(
        "rgba(155,91,255,0.16)",
        { width: 380, height: 380, bottom: -120, right: 40 },
        -40,
        -30,
        20,
      )}
      {/* subtle dotted grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(14,20,48,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)",
        }}
      />
    </div>
  );
}

/* ============================================================
   MORPHING wavy divider. A blob/wave path that smoothly morphs
   between two shapes on a loop using framer-motion path `d`.
   ============================================================ */
function MorphDivider({
  flip = false,
  from = "#FFFFFF",
}: {
  flip?: boolean;
  from?: string;
}) {
  const reduced = useReducedMotion();
  const gid = useId();
  const A =
    "M0,64 C240,128 480,16 720,56 C960,96 1200,8 1440,72 L1440,160 L0,160 Z";
  const B =
    "M0,96 C240,24 480,120 720,80 C960,40 1200,128 1440,48 L1440,160 L0,160 Z";
  return (
    <div
      aria-hidden
      style={{
        lineHeight: 0,
        transform: flip ? "rotate(180deg)" : undefined,
        position: "relative",
        zIndex: 1,
      }}
    >
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        style={{ width: "100%", height: 90, display: "block" }}
      >
        <defs>
          <linearGradient id={`mg-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={from} />
            <stop offset="0.5" stopColor={from} />
            <stop offset="1" stopColor={from} />
          </linearGradient>
        </defs>
        <motion.path
          fill={`url(#mg-${gid})`}
          initial={{ d: A }}
          animate={reduced ? { d: A } : { d: [A, B, A] }}
          transition={
            reduced
              ? undefined
              : { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </svg>
    </div>
  );
}

/* ============================================================
   ANIMATED SVG SCENE 1 — CI/CD PIPELINE
   Dots flow along connecting paths between stages; the connecting
   line "draws" via stroke-dashoffset; stage nodes pulse.
   ============================================================ */
function SceneCICD({ reduced }: { reduced: boolean }) {
  const gid = useId();
  const stages = [
    { x: 40, label: "Code", c: INDIGO },
    { x: 130, label: "Build", c: SKY },
    { x: 220, label: "Test", c: CYAN },
    { x: 310, label: "Deploy", c: TEAL },
  ];
  const flowPath = "M40,70 H310";
  return (
    <svg viewBox="0 0 350 130" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`ci-${gid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={INDIGO} />
          <stop offset="1" stopColor={TEAL} />
        </linearGradient>
      </defs>

      {/* base rail */}
      <path d={flowPath} stroke={BORDER_STRONG} strokeWidth={3} fill="none" />
      {/* animated drawn rail */}
      <path
        d={flowPath}
        stroke={`url(#ci-${gid})`}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="270"
        strokeDashoffset={reduced ? 0 : 270}
      >
        {!reduced && (
          <animate
            attributeName="stroke-dashoffset"
            from="270"
            to="0"
            dur="2.2s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* flowing dots along the rail */}
      {!reduced &&
        [0, 0.5, 1].map((delay, k) => (
          <circle key={k} r={4.5} fill={VIOLET}>
            <animateMotion
              dur="2.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
              path={flowPath}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.85;1"
              dur="2.2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {/* stage nodes */}
      {stages.map((s, k) => (
        <g key={s.label}>
          <circle cx={s.x} cy={70} r={13} fill={CARD} stroke={s.c} strokeWidth={2.5} />
          <circle cx={s.x} cy={70} r={5} fill={s.c}>
            {!reduced && (
              <animate
                attributeName="r"
                values="4;7;4"
                dur="1.6s"
                begin={`${k * 0.4}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
          <text
            x={s.x}
            y={104}
            textAnchor="middle"
            fontSize={11}
            fill={INK_SOFT}
            fontFamily={FONT}
            fontWeight={600}
          >
            {s.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   ANIMATED SVG SCENE 2 — CLOUD with pulsing data packets
   A cloud shape; packets rise from servers into the cloud,
   pulsing rings emanate from the cloud center.
   ============================================================ */
function SceneCloud({ reduced }: { reduced: boolean }) {
  const gid = useId();
  return (
    <svg viewBox="0 0 350 130" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`cl-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={SKY} />
          <stop offset="1" stopColor={CYAN} />
        </linearGradient>
      </defs>

      {/* pulsing rings behind cloud */}
      {!reduced &&
        [0, 1].map((d) => (
          <circle
            key={d}
            cx={175}
            cy={48}
            r={22}
            fill="none"
            stroke={CYAN}
            strokeWidth={2}
            opacity={0}
          >
            <animate
              attributeName="r"
              values="22;52"
              dur="2.6s"
              begin={`${d * 1.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0"
              dur="2.6s"
              begin={`${d * 1.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

      {/* cloud */}
      <path
        d="M135,58 a22,22 0 0 1 8,-42 a26,26 0 0 1 48,-6 a22,22 0 0 1 26,26 a18,18 0 0 1 -6,22 Z"
        fill={`url(#cl-${gid})`}
        opacity={0.95}
      />

      {/* servers */}
      {[110, 175, 240].map((x, k) => (
        <g key={x}>
          <rect
            x={x - 14}
            y={96}
            width={28}
            height={22}
            rx={4}
            fill={CARD}
            stroke={BORDER_STRONG}
            strokeWidth={1.5}
          />
          <circle cx={x - 8} cy={107} r={2} fill={TEAL} />
          {/* rising data packet */}
          {!reduced && (
            <circle r={3.5} fill={INDIGO}>
              <animate
                attributeName="cy"
                values="96;52"
                dur="1.8s"
                begin={`${k * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values={`${x};175`}
                dur="1.8s"
                begin={`${k * 0.6}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0"
                keyTimes="0;0.7;1"
                dur="1.8s"
                begin={`${k * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ============================================================
   ANIMATED SVG SCENE 3 — SECURITY SHIELD with scanning sweep
   A shield outline that "draws"; a scan line sweeps top→bottom;
   a check mark pulses when scan completes.
   ============================================================ */
function SceneShield({ reduced }: { reduced: boolean }) {
  const gid = useId();
  const shieldPath =
    "M175,20 L218,36 V70 C218,98 200,114 175,124 C150,114 132,98 132,70 V36 Z";
  return (
    <svg viewBox="0 0 350 140" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id={`sh-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={VIOLET} />
          <stop offset="1" stopColor={PINK} />
        </linearGradient>
        <clipPath id={`shc-${gid}`}>
          <path d={shieldPath} />
        </clipPath>
      </defs>

      {/* shield fill */}
      <path d={shieldPath} fill="rgba(155,91,255,0.10)" />

      {/* scanning sweep clipped to shield */}
      {!reduced && (
        <g clipPath={`url(#shc-${gid})`}>
          <rect x={132} width={86} height={10} fill={CYAN} opacity={0.55}>
            <animate
              attributeName="y"
              values="18;124;18"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      )}

      {/* shield outline that draws */}
      <path
        d={shieldPath}
        fill="none"
        stroke={`url(#sh-${gid})`}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeDasharray="360"
        strokeDashoffset={reduced ? 0 : 360}
      >
        {!reduced && (
          <animate
            attributeName="stroke-dashoffset"
            from="360"
            to="0"
            dur="2.8s"
            repeatCount="indefinite"
          />
        )}
      </path>

      {/* check mark */}
      <path
        d="M158,72 l12,12 l24,-26"
        fill="none"
        stroke={TEAL}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {!reduced && (
          <animate
            attributeName="opacity"
            values="0;0;1;1;0"
            keyTimes="0;0.6;0.7;0.95;1"
            dur="2.8s"
            repeatCount="indefinite"
          />
        )}
      </path>
    </svg>
  );
}

/* ============================================================
   ANIMATED SVG SCENE 4 — AI BRAIN / NEURAL NETWORK
   Layered nodes connected by lines; signals fire along edges
   (dots travel), nodes pulse, output node glows.
   ============================================================ */
function SceneAI({ reduced }: { reduced: boolean }) {
  const gid = useId();
  const layers = [
    [40, 95],
    [115, 65, 155],
    [195, 65, 155],
    [270],
  ].map((ys, li) => ys.map((y) => ({ x: 40 + li * 90, y })));
  // build edges between consecutive layers
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < layers.length - 1; l++) {
    layers[l].forEach((a) =>
      layers[l + 1].forEach((b) =>
        edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y }),
      ),
    );
  }
  return (
    <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id={`ai-${gid}`}>
          <stop offset="0" stopColor={AMBER} />
          <stop offset="1" stopColor={PINK} />
        </radialGradient>
      </defs>

      {/* edges */}
      {edges.map((e, k) => (
        <line
          key={k}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          stroke={BORDER_STRONG}
          strokeWidth={1}
        />
      ))}

      {/* firing signals on a subset of edges */}
      {!reduced &&
        edges
          .filter((_, k) => k % 3 === 0)
          .map((e, k) => (
            <circle key={`s${k}`} r={3} fill={INDIGO}>
              <animateMotion
                dur="1.4s"
                begin={`${(k % 5) * 0.28}s`}
                repeatCount="indefinite"
                path={`M${e.x1},${e.y1} L${e.x2},${e.y2}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="1.4s"
                begin={`${(k % 5) * 0.28}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

      {/* nodes */}
      {layers.flatMap((layer, li) =>
        layer.map((n, ni) => {
          const isOut = li === layers.length - 1;
          return (
            <circle
              key={`${li}-${ni}`}
              cx={n.x}
              cy={n.y}
              r={isOut ? 13 : 9}
              fill={isOut ? `url(#ai-${gid})` : CARD}
              stroke={isOut ? PINK : VIOLET}
              strokeWidth={2.2}
            >
              {!reduced && (
                <animate
                  attributeName="r"
                  values={isOut ? "12;16;12" : "8;11;8"}
                  dur="1.8s"
                  begin={`${(li + ni) * 0.25}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
          );
        }),
      )}
    </svg>
  );
}

/* ---------- scene card wrapper for the hero bento grid ---------- */
function SceneCard({
  title,
  desc,
  accent,
  children,
  className,
  i,
}: {
  title: string;
  desc: string;
  accent: string;
  children: React.ReactNode;
  className?: string;
  i: number;
}) {
  return (
    <Reveal i={i} className={className}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{
          height: "100%",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 22,
          padding: 16,
          boxShadow: "0 12px 40px -22px rgba(14,20,48,0.35)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: 110,
            borderRadius: 16,
            background:
              "linear-gradient(180deg, rgba(91,108,255,0.05), rgba(255,91,168,0.04))",
            padding: 8,
            marginBottom: 12,
          }}
        >
          {children}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: accent,
              flex: "none",
            }}
          />
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: INK,
              fontFamily: FONT,
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            lineHeight: 1.5,
            color: INK_SOFT,
            fontFamily: FONT,
          }}
        >
          {desc}
        </p>
      </motion.div>
    </Reveal>
  );
}

/* ---------------- shared chip / button styles ---------------- */
const pillBtn = (filled: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "13px 22px",
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: FONT,
  textDecoration: "none",
  cursor: "pointer",
  border: filled ? "none" : `1.5px solid ${BORDER_STRONG}`,
  background: filled
    ? `linear-gradient(135deg, ${INDIGO}, ${VIOLET})`
    : CARD,
  color: filled ? "#fff" : INK,
  boxShadow: filled ? "0 14px 32px -12px rgba(91,108,255,0.65)" : "none",
});

/* ============================================================
   Service card (bento). icon takes only className → color via
   wrapper span using currentColor.
   ============================================================ */
function ServiceCard({ s, i, accent }: { s: Service; i: number; accent: string }) {
  const Icon = s.icon;
  return (
    <Reveal i={i}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          height: "100%",
          background: CARD,
          border: `1px solid ${BORDER}`,
          borderRadius: 18,
          padding: 18,
          boxShadow: "0 10px 30px -22px rgba(14,20,48,0.4)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: 12,
            color: accent,
            background: "rgba(91,108,255,0.08)",
            marginBottom: 12,
          }}
        >
          <Icon className="w-5 h-5" />
        </span>
        <h4
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: INK,
            fontFamily: FONT,
            lineHeight: 1.3,
          }}
        >
          {s.title}
        </h4>
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: accent,
            fontWeight: 600,
            fontFamily: FONT,
          }}
        >
          {s.tagline}
        </p>
      </motion.div>
    </Reveal>
  );
}

/* ============================================================
   "How we work" step — each step a small animated mini-SVG.
   ============================================================ */
function StepMini({
  kind,
  reduced,
  accent,
}: {
  kind: "discover" | "design" | "build" | "launch";
  reduced: boolean;
  accent: string;
}) {
  if (kind === "discover") {
    return (
      <svg viewBox="0 0 60 60" width={54} height={54}>
        <circle cx={26} cy={26} r={14} fill="none" stroke={accent} strokeWidth={3} />
        <line
          x1={36}
          y1={36}
          x2={48}
          y2={48}
          stroke={accent}
          strokeWidth={3}
          strokeLinecap="round"
        />
        {!reduced && (
          <circle cx={26} cy={26} r={5} fill={accent} opacity={0.5}>
            <animate attributeName="r" values="3;9;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    );
  }
  if (kind === "design") {
    return (
      <svg viewBox="0 0 60 60" width={54} height={54}>
        <rect x={14} y={14} width={32} height={32} rx={6} fill="none" stroke={accent} strokeWidth={3} />
        {!reduced ? (
          <rect x={20} y={20} width={20} height={6} rx={3} fill={accent}>
            <animate attributeName="width" values="6;20;6" dur="1.8s" repeatCount="indefinite" />
          </rect>
        ) : (
          <rect x={20} y={20} width={20} height={6} rx={3} fill={accent} />
        )}
        <circle cx={23} cy={36} r={4} fill={accent} opacity={0.6} />
      </svg>
    );
  }
  if (kind === "build") {
    return (
      <svg viewBox="0 0 60 60" width={54} height={54}>
        <circle
          cx={30}
          cy={30}
          r={13}
          fill="none"
          stroke={accent}
          strokeWidth={3}
          strokeDasharray="6 5"
        >
          {!reduced && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 30 30"
              to="360 30 30"
              dur="4s"
              repeatCount="indefinite"
            />
          )}
        </circle>
        <circle cx={30} cy={30} r={4} fill={accent} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 60" width={54} height={54}>
      <path
        d="M30,12 C36,20 36,32 30,44 C24,32 24,20 30,12 Z"
        fill="none"
        stroke={accent}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      {!reduced ? (
        <circle cx={30} cy={44} r={4} fill={accent}>
          <animate attributeName="cy" values="44;52;44" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="1.4s" repeatCount="indefinite" />
        </circle>
      ) : (
        <circle cx={30} cy={44} r={4} fill={accent} />
      )}
    </svg>
  );
}

/* ============================================================
   DATA
   ============================================================ */
const METRICS = [
  { value: "25", label: "Projects Delivered" },
  { value: "6", label: "Industries Served" },
  { value: "50+", label: "Clients Worldwide" },
  { value: "99.9%", label: "Uptime Achieved" },
];

const STEPS: {
  kind: "discover" | "design" | "build" | "launch";
  title: string;
  desc: string;
  accent: string;
  Icon: typeof Search;
}[] = [
  {
    kind: "discover",
    title: "Discover",
    desc: "We map your goals, constraints, and the highest-value problems worth solving first.",
    accent: INDIGO,
    Icon: Search,
  },
  {
    kind: "design",
    title: "Design",
    desc: "Architecture, UX flows, and a clear roadmap — so everyone sees the plan before we build.",
    accent: VIOLET,
    Icon: FileSearch,
  },
  {
    kind: "build",
    title: "Build",
    desc: "Iterative delivery with CI/CD, tests, and reviews. You see working software every sprint.",
    accent: CYAN,
    Icon: Wrench,
  },
  {
    kind: "launch",
    title: "Launch & Scale",
    desc: "Zero-downtime rollout, monitoring, and a maintenance plan that keeps it healthy.",
    accent: TEAL,
    Icon: Rocket,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "IFLEON took us from quarterly releases to shipping daily. Their CI/CD pipeline paid for itself in the first month.",
    name: "Operations Lead",
    role: "B2B SaaS, India",
    accent: INDIGO,
  },
  {
    quote:
      "The AI support copilot they built deflects over 40% of our tickets. It actually understands our docs.",
    name: "Head of Support",
    role: "Fintech, Global",
    accent: VIOLET,
  },
  {
    quote:
      "Friendly, fast, and genuinely senior. They secured my whole home network and explained every step in plain language.",
    name: "Individual Client",
    role: "Nellore, India",
    accent: PINK,
  },
];

/* ============================================================
   MAIN
   ============================================================ */
export default function MotionHome() {
  const reduced = useReducedMotion() ?? false;

  const sectionTitle = (eyebrow: string, title: string, sub?: string) => (
    <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
      <Reveal>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: INDIGO,
            fontFamily: FONT,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
        </span>
      </Reveal>
      <Reveal i={1}>
        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 800,
            color: INK,
            margin: "10px 0 0",
            fontFamily: FONT,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal i={2}>
          <p
            style={{
              fontSize: 16,
              color: INK_SOFT,
              margin: "14px 0 0",
              fontFamily: FONT,
              lineHeight: 1.6,
            }}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );

  return (
    <div
      style={{
        background: PAGE_BG,
        color: INK,
        fontFamily: FONT,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ============ HERO ============ */}
      <section
        className="pt-28 md:pt-32"
        style={{
          position: "relative",
          paddingBottom: 40,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <MeshBackground />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 36,
              alignItems: "center",
            }}
            className="motion-hero-grid"
          >
            {/* copy */}
            <div>
              <Reveal>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 14px",
                    borderRadius: 999,
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    fontSize: 13,
                    fontWeight: 600,
                    color: INK_SOFT,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: TEAL,
                    }}
                  />
                  Founder-led · AI · DevOps · Cloud · Security
                </span>
              </Reveal>

              <Reveal i={1}>
                <h1
                  style={{
                    fontSize: "clamp(34px, 6vw, 60px)",
                    lineHeight: 1.05,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    margin: "20px 0 0",
                    color: INK,
                  }}
                >
                  Infinite Possibilities,{" "}
                  <span
                    style={{
                      background: `linear-gradient(120deg, ${INDIGO}, ${VIOLET}, ${PINK})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    Logical Solutions.
                  </span>
                </h1>
              </Reveal>

              <Reveal i={2}>
                <p
                  style={{
                    fontSize: 18,
                    lineHeight: 1.6,
                    color: INK_SOFT,
                    margin: "20px 0 0",
                    maxWidth: 520,
                  }}
                >
                  We're IFLEON — a founder-led consultancy out of Nellore, India,
                  building AI, DevOps, cloud and cybersecurity solutions for teams
                  and individuals across India and the globe.
                </p>
              </Reveal>

              <Reveal i={3}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    margin: "28px 0 0",
                  }}
                >
                  <a href="mailto:info@ifleon.com" style={pillBtn(true)}>
                    Request a Free Consultation <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link to="/services" style={pillBtn(false)}>
                    Explore Services <Layers className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal i={4}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    margin: "26px 0 0",
                    fontSize: 13,
                    color: INK_FAINT,
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck className="w-4 h-4" /> ISO 27001
                  </span>
                  <span>· DPDP</span>
                  <span>· SOC 2</span>
                  <span>· Est. 2022</span>
                </div>
              </Reveal>
            </div>

            {/* HERO bento of animated SVG scenes */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "minmax(130px, auto)",
                gap: 14,
              }}
            >
              <SceneCard
                i={0}
                className="motion-span-2"
                title="CI/CD Pipelines"
                desc="Code flows to production — built, tested, deployed, automatically."
                accent={INDIGO}
              >
                <SceneCICD reduced={reduced} />
              </SceneCard>
              <SceneCard
                i={1}
                title="Cloud at Scale"
                desc="Pulsing data, elastic infra on AWS & Azure."
                accent={CYAN}
              >
                <SceneCloud reduced={reduced} />
              </SceneCard>
              <SceneCard
                i={2}
                title="Always Secured"
                desc="Continuous scanning, compliance built in."
                accent={VIOLET}
              >
                <SceneShield reduced={reduced} />
              </SceneCard>
              <SceneCard
                i={3}
                className="motion-span-2"
                title="AI & Agents That Work"
                desc="Neural networks and tool-using agents wired into your data."
                accent={PINK}
              >
                <SceneAI reduced={reduced} />
              </SceneCard>
            </motion.div>
          </div>
        </div>
      </section>

      <MorphDivider from={CARD} />

      {/* ============ SERVICES ============ */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          background: CARD,
          padding: "20px 20px 70px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {sectionTitle(
            "What we do",
            "Sixteen services, one logical partner",
            "From enterprise transformation to securing your home network — grouped for businesses, individuals, and specialty add-ons.",
          )}

          {/* Business */}
          <Reveal>
            <GroupHeader icon={<Briefcase className="w-4 h-4" />} label="Business Solutions" accent={INDIGO} />
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="motion-svc-grid">
            {businessServices.map((s, i) => (
              <ServiceCard key={s.id} s={s} i={i} accent={INDIGO} />
            ))}
          </motion.div>

          {/* Individuals */}
          <Reveal>
            <GroupHeader icon={<User className="w-4 h-4" />} label="For Individuals" accent={TEAL} />
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="motion-svc-grid">
            {individualServices.map((s, i) => (
              <ServiceCard key={s.id} s={s} i={i} accent={TEAL} />
            ))}
          </motion.div>

          {/* Specialty */}
          <Reveal>
            <GroupHeader icon={<Sparkles className="w-4 h-4" />} label="Specialty & Add-Ons" accent={PINK} />
          </Reveal>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="motion-svc-grid">
            {specialtyServices.map((s, i) => (
              <ServiceCard key={s.id} s={s} i={i} accent={PINK} />
            ))}
          </motion.div>
        </div>
      </section>

      <MorphDivider flip from={CARD} />

      {/* ============ METRICS ============ */}
      <section style={{ position: "relative", zIndex: 2, padding: "10px 20px 60px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 16,
            }}
          >
            {METRICS.map((m, i) => (
              <Reveal key={m.label} i={i}>
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 18,
                    padding: "26px 18px",
                    textAlign: "center",
                    boxShadow: "0 10px 30px -24px rgba(14,20,48,0.4)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      background: `linear-gradient(120deg, ${INDIGO}, ${PINK})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: 13, color: INK_SOFT, marginTop: 6, fontWeight: 600 }}>
                    {m.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ HOW WE WORK ============ */}
      <section style={{ position: "relative", zIndex: 2, padding: "10px 20px 40px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {sectionTitle("How we work", "A clear path from idea to impact")}

          <div className="motion-steps-grid">
            {STEPS.map((step, i) => {
              const StepIcon = step.Icon;
              return (
                <Reveal key={step.title} i={i}>
                  <div
                    style={{
                      background: CARD,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 20,
                      padding: 22,
                      height: "100%",
                      boxShadow: "0 10px 30px -24px rgba(14,20,48,0.4)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <StepMini kind={step.kind} reduced={reduced} accent={step.accent} />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: step.accent,
                          background: "rgba(91,108,255,0.08)",
                          width: 30,
                          height: 30,
                          borderRadius: 99,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <h4
                      style={{
                        margin: "14px 0 0",
                        fontSize: 17,
                        fontWeight: 700,
                        color: INK,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span style={{ color: step.accent, display: "inline-flex" }}>
                        <StepIcon className="w-4 h-4" />
                      </span>
                      {step.title}
                    </h4>
                    <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55, color: INK_SOFT }}>
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <MorphDivider from={CARD} />

      {/* ============ TESTIMONIALS + LOTTIE ============ */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          background: CARD,
          padding: "20px 20px 70px",
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {sectionTitle("In their words", "Teams and people who trust IFLEON")}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 22,
              alignItems: "center",
            }}
            className="motion-testi-grid"
          >
            {/* Lottie scene (one allowed playful illustration) */}
            <Reveal>
              <div
                style={{
                  borderRadius: 24,
                  background:
                    "linear-gradient(180deg, rgba(91,108,255,0.08), rgba(255,91,168,0.06))",
                  border: `1px solid ${BORDER}`,
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 280,
                  overflow: "hidden",
                }}
              >
                <DotLottieReact
                  data={aboutLottie}
                  autoplay={!reduced}
                  loop={!reduced}
                  style={{ width: "100%", maxWidth: 380, height: 300 }}
                />
              </div>
            </Reveal>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              style={{ display: "grid", gap: 16 }}
            >
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} i={i}>
                  <div
                    style={{
                      background: PAGE_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 18,
                      padding: 20,
                      borderLeft: `4px solid ${t.accent}`,
                    }}
                  >
                    <Quote
                      className="w-5 h-5"
                      style={{ color: t.accent, marginBottom: 8 }}
                    />
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: INK }}>
                      "{t.quote}"
                    </p>
                    <div style={{ marginTop: 12, fontSize: 13, color: INK_SOFT }}>
                      <strong style={{ color: INK }}>{t.name}</strong> · {t.role}
                    </div>
                  </div>
                </Reveal>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section style={{ position: "relative", zIndex: 2, padding: "50px 20px 80px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 28,
                padding: "clamp(32px, 5vw, 56px)",
                background: `linear-gradient(135deg, ${INK}, #1b2456)`,
                textAlign: "center",
                boxShadow: "0 30px 70px -30px rgba(14,20,48,0.7)",
              }}
            >
              {/* drifting glow */}
              {!reduced && (
                <motion.div
                  aria-hidden
                  style={{
                    position: "absolute",
                    width: 360,
                    height: 360,
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    background:
                      "radial-gradient(circle, rgba(155,91,255,0.55), transparent 70%)",
                    top: -120,
                    left: -60,
                  }}
                  animate={{ x: [0, 200, 0], y: [0, 60, 0] }}
                  transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    fontSize: "clamp(26px, 4vw, 40px)",
                    fontWeight: 800,
                    color: "#fff",
                    margin: 0,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Let's build something that moves.
                </h2>
                <p
                  style={{
                    fontSize: 17,
                    color: "rgba(255,255,255,0.75)",
                    margin: "16px auto 0",
                    maxWidth: 520,
                    lineHeight: 1.6,
                  }}
                >
                  Tell us what you're trying to solve. We'll come back with a logical,
                  buildable plan — and a free consultation to get there.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                    justifyContent: "center",
                    margin: "30px 0 0",
                  }}
                >
                  <a
                    href="mailto:info@ifleon.com"
                    style={{ ...pillBtn(true), background: "#fff", color: INK, boxShadow: "none" }}
                  >
                    <Mail className="w-4 h-4" /> info@ifleon.com
                  </a>
                  <Link
                    to="/services"
                    style={{
                      ...pillBtn(false),
                      background: "transparent",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    Explore Services <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://github.com/ifleonlabs"
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      ...pillBtn(false),
                      background: "transparent",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <Github className="w-4 h-4" /> github.com/ifleonlabs
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* responsive helpers (scoped, no external css) */}
      <style>{`
        @media (min-width: 880px) {
          .motion-hero-grid { grid-template-columns: 1.05fr 0.95fr !important; }
          .motion-testi-grid { grid-template-columns: 0.9fr 1.1fr !important; }
        }
        .motion-span-2 { grid-column: span 2; }
        .motion-svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 36px;
        }
        .motion-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 18px;
        }
      `}</style>
    </div>
  );
}

/* ---------------- group header (light) ---------------- */
function GroupHeader({
  icon,
  label,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "8px 0 18px",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 9,
          color: accent,
          background: "rgba(91,108,255,0.08)",
        }}
      >
        {icon}
      </span>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: INK, fontFamily: FONT }}>
        {label}
      </h3>
      <span style={{ flex: 1, height: 1, background: BORDER, marginLeft: 6 }} />
    </div>
  );
}
