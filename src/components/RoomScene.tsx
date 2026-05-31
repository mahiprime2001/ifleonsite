import { useEffect, useState } from "react";

/* ============================================================
   RoomScene — a cozy lo-fi study room rendered as a single
   animated SVG. A character types at a desk in front of a window
   whose sky changes with the time of day; at night the ceiling
   light switches on and fills the room.
   Pure SVG + CSS keyframes (see index.css .anim-*), reduced-motion
   aware. Self-contained: reads the clock and re-checks each minute.
   ============================================================ */

type Tod = "morning" | "day" | "evening" | "night";

function todFromHour(h: number): Tod {
  if (h >= 5 && h < 11) return "morning";
  if (h >= 11 && h < 16) return "day";
  if (h >= 16 && h < 20) return "evening";
  return "night";
}

type Palette = {
  wall: string;
  wallShade: string;
  floor: string;
  baseboard: string;
  skyTop: string;
  skyBot: string;
  orb: string;
  orbGlow: string;
  moon: boolean;
  orbX: number;
  orbY: number;
  orbR: number;
  beam: string;
  beamOp: number;
  ambient: string;
  ambientOp: number;
  lampOn: boolean;
  stars: boolean;
  deskTop: string;
  deskFront: string;
  chair: string;
  hoodie: string;
  hair: string;
  rim: string;
  city: string;
};

const PALETTES: Record<Tod, Palette> = {
  morning: {
    wall: "#caa98a", wallShade: "#b9926f", floor: "#a07a55", baseboard: "#8a6646",
    skyTop: "#ffe0b0", skyBot: "#bfe1ff", orb: "#fff1c8", orbGlow: "#ffd98a", moon: false,
    orbX: 300, orbY: 122, orbR: 20, beam: "#fff4d6", beamOp: 0.22, ambient: "#ffd9a0", ambientOp: 0.1,
    lampOn: false, stars: false, deskTop: "#7c5a3c", deskFront: "#5f4329", chair: "#3a3f4d",
    hoodie: "#41506b", hair: "#2a2230", rim: "#ffe9c4", city: "#9c8fb0",
  },
  day: {
    wall: "#c2a684", wallShade: "#ad8e68", floor: "#9a7850", baseboard: "#7e5c3c",
    skyTop: "#7fb8ff", skyBot: "#dcefff", orb: "#fffbe6", orbGlow: "#fff3b0", moon: false,
    orbX: 332, orbY: 96, orbR: 16, beam: "#ffffff", beamOp: 0.16, ambient: "#fff6e0", ambientOp: 0.05,
    lampOn: false, stars: false, deskTop: "#7c5a3c", deskFront: "#5f4329", chair: "#3a3f4d",
    hoodie: "#41506b", hair: "#2a2230", rim: "#eaf4ff", city: "#a7b6cf",
  },
  evening: {
    wall: "#7a5246", wallShade: "#5f3d36", floor: "#4a3038", baseboard: "#3a242c",
    skyTop: "#ff8a4c", skyBot: "#b85a93", orb: "#ff8038", orbGlow: "#ffb15a", moon: false,
    orbX: 300, orbY: 152, orbR: 28, beam: "#ffb070", beamOp: 0.3, ambient: "#ff7a3c", ambientOp: 0.16,
    lampOn: false, stars: false, deskTop: "#6e4a30", deskFront: "#4f3420", chair: "#332f3c",
    hoodie: "#3c3a52", hair: "#241f2b", rim: "#ffcf9a", city: "#6a4a63",
  },
  night: {
    wall: "#1c2748", wallShade: "#141d39", floor: "#121a33", baseboard: "#0d142a",
    skyTop: "#0a1430", skyBot: "#16275c", orb: "#eef2ff", orbGlow: "#b9c8ff", moon: true,
    orbX: 312, orbY: 104, orbR: 21, beam: "#9db4ff", beamOp: 0, ambient: "#0a1430", ambientOp: 0.22,
    lampOn: true, stars: true, deskTop: "#3a2f42", deskFront: "#251c2e", chair: "#222637",
    hoodie: "#2b3450", hair: "#1a1722", rim: "#ffe6b8", city: "#0d1b40",
  },
};

export default function RoomScene({ className = "" }: { className?: string }) {
  const [tod, setTod] = useState<Tod>(() => todFromHour(new Date().getHours()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setTod(todFromHour(new Date().getHours()));
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const p = PALETTES[tod];

  return (
    <svg
      viewBox="0 0 480 480"
      className={className}
      role="img"
      aria-label="A cozy room where a person works at a desk by a window; the lighting changes with the time of day"
      style={{ transition: "opacity 0.6s ease" }}
    >
      <defs>
        <clipPath id="roomClip">
          <rect x="0" y="0" width="480" height="480" rx="26" />
        </clipPath>
        <clipPath id="winClip">
          <rect x="270" y="62" width="174" height="156" rx="6" />
        </clipPath>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.skyTop} />
          <stop offset="1" stopColor={p.skyBot} />
        </linearGradient>
        <radialGradient id="orbGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={p.orbGlow} stopOpacity="0.9" />
          <stop offset="1" stopColor={p.orbGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a82ff" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3a82ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#3a82ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6a8" stopOpacity="0.42" />
          <stop offset="1" stopColor="#ffe6a8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor={p.beam} stopOpacity={p.beamOp} />
          <stop offset="1" stopColor={p.beam} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="vign" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.42" />
        </radialGradient>
      </defs>

      <g clipPath="url(#roomClip)">
        {/* ---------- room shell ---------- */}
        <rect x="0" y="0" width="480" height="348" fill={p.wall} />
        <rect x="0" y="0" width="150" height="348" fill={p.wallShade} opacity="0.5" />
        <rect x="0" y="348" width="480" height="132" fill={p.floor} />
        <rect x="0" y="344" width="480" height="8" fill={p.baseboard} />

        {/* ---------- window ---------- */}
        <rect x="262" y="54" width="190" height="172" rx="10" fill={p.baseboard} />
        <g clipPath="url(#winClip)">
          <rect x="270" y="62" width="174" height="156" fill="url(#sky)" />
          {/* sun / moon + glow */}
          <circle cx={p.orbX} cy={p.orbY} r={p.orbR * 2.4} fill="url(#orbGlow)" />
          <circle cx={p.orbX} cy={p.orbY} r={p.orbR} fill={p.orb} />
          {p.moon && (
            <circle cx={p.orbX + 8} cy={p.orbY - 6} r={p.orbR} fill={p.skyTop} opacity="0.9" />
          )}
          {/* stars (night) */}
          {p.stars &&
            [[286, 84], [300, 110], [330, 78], [360, 132], [410, 92], [428, 150], [392, 104], [314, 150]].map(
              ([cx, cy], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="1.6"
                  fill="#ffffff"
                  className="anim-twinkle"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ),
            )}
          {/* clouds (morning/day) */}
          {!p.moon && tod !== "evening" && (
            <g className="anim-cloud" opacity="0.85">
              <ellipse cx="300" cy="100" rx="22" ry="8" fill="#ffffff" opacity="0.7" />
              <ellipse cx="318" cy="96" rx="14" ry="7" fill="#ffffff" opacity="0.7" />
              <ellipse cx="400" cy="140" rx="18" ry="7" fill="#ffffff" opacity="0.55" />
            </g>
          )}
          {/* distant city silhouette */}
          <g fill={p.city} opacity="0.9">
            <rect x="270" y="190" width="20" height="28" />
            <rect x="294" y="178" width="16" height="40" />
            <rect x="314" y="196" width="22" height="22" />
            <rect x="342" y="184" width="14" height="34" />
            <rect x="362" y="172" width="20" height="46" />
            <rect x="388" y="192" width="18" height="26" />
            <rect x="412" y="182" width="16" height="36" />
            <rect x="432" y="198" width="14" height="20" />
          </g>
        </g>
        {/* window frame mullions */}
        <rect x="354" y="54" width="6" height="172" fill={p.baseboard} />
        <rect x="262" y="136" width="190" height="6" fill={p.baseboard} />

        {/* ---------- sun beam into room ---------- */}
        {p.beamOp > 0 && (
          <polygon points="300,80 372,140 210,348 70,318" fill="url(#beam)" />
        )}

        {/* ---------- wall decor ---------- */}
        <g opacity="0.92">
          {/* framed poster */}
          <rect x="46" y="92" width="74" height="92" rx="4" fill={p.wallShade} />
          <rect x="52" y="98" width="62" height="80" rx="3" fill={p.skyBot} opacity="0.4" />
          <circle cx="70" cy="124" r="10" fill={p.orbGlow} opacity="0.8" />
          <polygon points="60,168 84,138 104,168" fill={p.baseboard} opacity="0.7" />
          {/* wall clock */}
          <circle cx="170" cy="120" r="18" fill={p.wallShade} />
          <circle cx="170" cy="120" r="14" fill={p.floor} opacity="0.5" />
          <line x1="170" y1="120" x2="170" y2="110" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <line x1="170" y1="120" x2="178" y2="120" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ---------- ceiling lamp ---------- */}
        <line x1="220" y1="0" x2="220" y2="40" stroke={p.baseboard} strokeWidth="3" />
        <path d="M200 58 L240 58 L232 40 L208 40 Z" fill={p.baseboard} />
        {p.lampOn && (
          <>
            <polygon points="220,58 150,348 300,348" fill="url(#lampCone)" />
            <circle cx="220" cy="60" r="30" fill="url(#lampGlow)" className="anim-lamp" />
            <circle cx="220" cy="58" r="6" fill="#fff3c4" />
          </>
        )}

        {/* ---------- desk ---------- */}
        <rect x="40" y="300" width="400" height="16" rx="3" fill={p.deskTop} />
        <rect x="40" y="316" width="400" height="30" fill={p.deskFront} />
        <rect x="60" y="316" width="10" height="56" fill={p.deskFront} />
        <rect x="410" y="316" width="10" height="56" fill={p.deskFront} />

        {/* monitor */}
        <circle cx="344" cy="262" r="70" fill="url(#screenGlow)" />
        <rect x="300" y="226" width="92" height="62" rx="5" fill="#10182e" />
        <rect x="305" y="231" width="82" height="52" rx="3" fill="url(#screen)" className="anim-flicker" />
        {/* code lines on screen */}
        <g className="anim-flicker">
          <rect x="311" y="238" width="34" height="3" rx="1.5" fill="#bcd4ff" />
          <rect x="311" y="246" width="52" height="3" rx="1.5" fill="#8fb6ff" opacity="0.8" />
          <rect x="319" y="254" width="40" height="3" rx="1.5" fill="#bcd4ff" opacity="0.7" />
          <rect x="319" y="262" width="56" height="3" rx="1.5" fill="#8fb6ff" opacity="0.7" />
          <rect x="311" y="270" width="30" height="3" rx="1.5" fill="#bcd4ff" opacity="0.6" />
        </g>
        <rect x="340" y="288" width="8" height="10" fill="#10182e" />
        <rect x="326" y="298" width="36" height="4" rx="2" fill="#10182e" />

        {/* mug + steam */}
        <g>
          <rect x="120" y="286" width="20" height="16" rx="3" fill="#d9d2c4" />
          <path d="M140 289 q8 0 8 6 q0 6 -8 6" fill="none" stroke="#d9d2c4" strokeWidth="3" />
          <path d="M126 282 q-4 -6 0 -12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="anim-steam" opacity="0.6" />
          <path d="M134 282 q4 -6 0 -12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="anim-steam" opacity="0.6" style={{ animationDelay: "1.4s" }} />
        </g>

        {/* desk plant */}
        <g>
          <path d="M86 300 L102 300 L99 282 L89 282 Z" fill={p.baseboard} />
          <g className="anim-sway" style={{ transformOrigin: "94px 282px" }}>
            <path d="M94 282 q-14 -16 -4 -34 q8 12 4 34" fill="#3f7d52" />
            <path d="M94 282 q14 -14 6 -32 q-6 12 -6 32" fill="#4f9a64" />
            <path d="M94 282 q0 -20 0 -38" fill="none" stroke="#3f7d52" strokeWidth="3" />
          </g>
        </g>

        {/* ---------- keyboard ---------- */}
        <rect x="196" y="306" width="96" height="14" rx="3" fill={p.chair} opacity="0.9" />

        {/* ---------- character (back view) ---------- */}
        <g>
          {/* chair back */}
          <rect x="170" y="318" width="100" height="120" rx="16" fill={p.chair} />
          {/* body + gentle breathing */}
          <g className="anim-breathe">
            {/* hoodie torso */}
            <path d="M176 360 q4 -82 44 -82 q40 0 44 82 Z" fill={p.hoodie} />
            {/* shoulders rim light */}
            <path d="M176 360 q4 -82 44 -82 q40 0 44 82" fill="none" stroke={p.rim} strokeWidth="2" opacity="0.45" />
            {/* hood */}
            <path d="M196 300 q24 -26 48 0 q-24 -10 -48 0" fill={p.hair} opacity="0.6" />
            {/* head (back of) */}
            <circle cx="220" cy="252" r="30" fill={p.hair} />
            {/* hair highlight / rim from monitor + lamp */}
            <path d="M204 232 q16 -16 32 0" fill="none" stroke={p.rim} strokeWidth="2.5" opacity="0.5" />
            {/* ponytail */}
            <path d="M246 250 q22 6 18 40 q-2 16 -14 18 q10 -18 2 -34 q-4 -12 -6 -24" fill={p.hair} />
            {/* headphones */}
            <path d="M192 250 q28 -40 56 0" fill="none" stroke="#2b2f3a" strokeWidth="6" strokeLinecap="round" />
            <rect x="186" y="244" width="12" height="20" rx="5" fill="#3a82ff" opacity="0.85" />
            <rect x="242" y="244" width="12" height="20" rx="5" fill="#3a82ff" opacity="0.85" />
          </g>
          {/* upper arms hugging the sides toward the keyboard (subtle typing motion) */}
          <path d="M182 360 q-10 -52 22 -70 l6 16 q-22 16 -14 54 Z" fill={p.hoodie} className="anim-type-a" />
          <path d="M258 360 q10 -52 -22 -70 l-6 16 q22 16 14 54 Z" fill={p.hoodie} className="anim-type-b" />
        </g>

        {/* ---------- floating dust motes ---------- */}
        {[ [150, 300], [200, 320], [330, 300], [110, 280] ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r="1.5"
            fill={p.lampOn ? "#ffe6a8" : "#ffffff"}
            opacity="0.5"
            className="anim-mote"
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        ))}

        {/* ---------- ambient color wash + vignette ---------- */}
        <rect
          x="0" y="0" width="480" height="480"
          fill={p.ambient}
          opacity={p.ambientOp}
          style={{ mixBlendMode: "soft-light" }}
        />
        <rect x="0" y="0" width="480" height="480" fill="url(#vign)" />
      </g>

      {/* rounded inner border */}
      <rect x="1" y="1" width="478" height="478" rx="26" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
    </svg>
  );
}
