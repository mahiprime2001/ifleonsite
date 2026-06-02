import { motion } from "framer-motion";

type Props = { className?: string };

// 3D-rendered-looking collaboration scene — two human characters interacting
// with a central holographic dashboard, server rack, and ambient detail.
// Used in the About section to show team/work context.
export const IsoCollab3D = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 600"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <defs>
      {/* Skin tone A */}
      <radialGradient id="skinA" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#fde2c2" />
        <stop offset="0.5" stopColor="#f0c896" />
        <stop offset="1" stopColor="#b88557" />
      </radialGradient>
      {/* Skin tone B (darker) */}
      <radialGradient id="skinB" cx="0.35" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#e8b894" />
        <stop offset="0.5" stopColor="#c89169" />
        <stop offset="1" stopColor="#7a4a2c" />
      </radialGradient>

      {/* Hair */}
      <linearGradient id="hairA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3f2f1f" />
        <stop offset="1" stopColor="#1a0f08" />
      </linearGradient>
      <linearGradient id="hairB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#92400e" />
        <stop offset="1" stopColor="#451a03" />
      </linearGradient>

      {/* Shirts */}
      <radialGradient id="shirtA" cx="0.4" cy="0.3" r="0.95">
        <stop offset="0" stopColor="#93c5fd" />
        <stop offset="0.5" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1e3a8a" />
      </radialGradient>
      <radialGradient id="shirtB" cx="0.4" cy="0.3" r="0.95">
        <stop offset="0" stopColor="#c4b5fd" />
        <stop offset="0.5" stopColor="#8b5cf6" />
        <stop offset="1" stopColor="#4c1d95" />
      </radialGradient>

      {/* Pants */}
      <linearGradient id="pantsDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>

      {/* Server */}
      <linearGradient id="serverGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>

      {/* Dashboard glass */}
      <linearGradient id="glass3d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(34,211,238,0.5)" />
        <stop offset="1" stopColor="rgba(59,130,246,0.4)" />
      </linearGradient>

      <radialGradient id="auraC" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.45" />
        <stop offset="0.6" stopColor="#3b82f6" stopOpacity="0.18" />
        <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ground-shadowC" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000" stopOpacity="0.55" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>

      <filter id="soft-blur-c" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    {/* AURA */}
    <motion.circle
      cx="300" cy="310" r="240" fill="url(#auraC)"
      animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* FLOOR */}
    <g transform="translate(300 490)">
      <ellipse cx="0" cy="20" rx="240" ry="80" fill="#0b1220" stroke="#1e293b" />
      <g opacity="0.18" stroke="#60a5fa" strokeWidth="0.8" fill="none">
        <ellipse cx="0" cy="20" rx="240" ry="80" />
        <ellipse cx="0" cy="20" rx="170" ry="58" />
        <ellipse cx="0" cy="20" rx="100" ry="36" />
      </g>
      <motion.ellipse
        cx="0" cy="20" rx="60" ry="20" fill="none" stroke="#22d3ee" strokeWidth="1.5"
        animate={{ rx: [40, 220, 40], ry: [16, 80, 16], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
      />
    </g>

    {/* SERVER RACK — back left */}
    <motion.g
      transform="translate(72 220)"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="0" y="0" width="74" height="170" rx="6" fill="url(#serverGrad)" stroke="#475569" />
      <rect x="3" y="3" width="12" height="164" rx="3" fill="#475569" opacity="0.4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="8" y={10 + i * 38} width="58" height="26" rx="3" fill="#0b1220" stroke="#1e293b" />
          <motion.circle
            cx="16" cy={23 + i * 38} r="2.5" fill="#2dd4bf"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
          />
          <motion.rect
            x="24" y={20 + i * 38} width={32 - i * 4} height="6" rx="1.5"
            fill={i % 2 ? "#22d3ee" : "#60a5fa"} opacity="0.7"
            animate={{ width: [28 - i * 3, 42 - i * 5, 28 - i * 3] }}
            transition={{ duration: 2.6 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
          />
        </g>
      ))}
      <ellipse cx="37" cy="85" rx="56" ry="16" fill="#22d3ee" opacity="0.18" filter="url(#soft-blur-c)" />
    </motion.g>

    {/* SERVER RACK — back right (smaller) */}
    <motion.g
      transform="translate(454 250)"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    >
      <rect x="0" y="0" width="74" height="140" rx="6" fill="url(#serverGrad)" stroke="#475569" />
      <rect x="3" y="3" width="12" height="134" rx="3" fill="#475569" opacity="0.4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="8" y={10 + i * 42} width="58" height="30" rx="3" fill="#0b1220" stroke="#1e293b" />
          <motion.circle
            cx="16" cy={25 + i * 42} r="2.5" fill="#60a5fa"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }}
          />
          <motion.rect
            x="24" y={22 + i * 42} width={28 - i * 3} height="6" rx="1.5"
            fill={i % 2 ? "#60a5fa" : "#22d3ee"} opacity="0.7"
            animate={{ width: [24 - i * 2, 38 - i * 4, 24 - i * 2] }}
            transition={{ duration: 2.6 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
          />
        </g>
      ))}
    </motion.g>

    {/* CENTRAL HOLOGRAPHIC DASHBOARD */}
    <motion.g
      transform="translate(300 240)"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* halo glow */}
      <ellipse cx="0" cy="40" rx="130" ry="38" fill="#22d3ee" opacity="0.25" filter="url(#soft-blur-c)" />

      {/* glass panel base */}
      <rect x="-100" y="-50" width="200" height="120" rx="8" fill="rgba(15,23,42,0.85)" stroke="#22d3ee" strokeWidth="1.5" />
      {/* shine */}
      <rect x="-96" y="-46" width="192" height="20" rx="4" fill="url(#glass3d)" opacity="0.45" />

      {/* dashboard mini bars */}
      {[
        { x: -72, h: 36, c: "#2dd4bf" },
        { x: -40, h: 26, c: "#60a5fa" },
        { x: -8, h: 44, c: "#3b82f6" },
        { x: 24, h: 30, c: "#22d3ee" },
        { x: 56, h: 38, c: "#fbbf24" },
      ].map((b, i) => (
        <motion.rect
          key={i}
          x={b.x} y={48 - b.h} width="20" height={b.h} rx="3"
          fill={b.c} opacity="0.85"
          animate={{ height: [b.h, b.h - 8, b.h] }}
          transition={{ duration: 2.6 + i * 0.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      {/* trending line */}
      <motion.path
        d="M -90 -10 L -60 -20 L -30 -8 L 0 -25 L 30 -12 L 60 -28 L 90 -18"
        stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.5, 0.85, 1] }}
      />

      {/* corner brackets */}
      {[
        { x: -100, y: -50, dx: 6, dy: 0 },
        { x: 100, y: -50, dx: -6, dy: 0 },
        { x: -100, y: 70, dx: 6, dy: 0 },
        { x: 100, y: 70, dx: -6, dy: 0 },
      ].map((m, i) => (
        <motion.line
          key={i}
          x1={m.x} y1={m.y} x2={m.x + m.dx} y2={m.y}
          stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.g>

    {/* DESK / table */}
    <g transform="translate(300 410)">
      <rect x="-180" y="-12" width="360" height="22" rx="6" fill="#475569" stroke="#334155" />
      <rect x="-180" y="-12" width="360" height="4" rx="2" fill="#94a3b8" opacity="0.7" />
      <rect x="-180" y="10" width="360" height="14" rx="3" fill="#334155" />
    </g>

    {/* GROUND SHADOWS */}
    <ellipse cx="200" cy="495" rx="60" ry="12" fill="url(#ground-shadowC)" />
    <ellipse cx="400" cy="495" rx="60" ry="12" fill="url(#ground-shadowC)" />

    {/* === CHARACTER A — left, gesturing toward dashboard === */}
    <g transform="translate(170 280)">
      {/* TORSO */}
      <path
        d="M -16 50 Q -26 38 -20 22 Q -16 4 0 0 L 32 0 Q 48 4 52 22 Q 58 38 48 50 L 48 110 Q 46 125 26 128 L 4 128 Q -16 125 -16 110 Z"
        fill="url(#shirtA)" stroke="#1e3a8a" strokeWidth="1.4"
      />
      <path d="M -8 32 Q -12 18 0 12 L 18 10 Q 14 28 4 36 Z" fill="#93c5fd" opacity="0.55" />
      <path d="M 8 0 Q 18 -4 26 0 L 22 12 Q 16 16 12 12 Z" fill="#1e3a8a" />
      <ellipse cx="16" cy="6" rx="7" ry="3" fill="#fde2c2" opacity="0.8" />

      {/* RIGHT ARM (pointing toward dashboard) */}
      <motion.g
        animate={{ rotate: [0, -3, 0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: "48px 28px" }}
      >
        <path
          d="M 48 22 Q 76 26 102 14 Q 116 8 122 14 Q 128 22 122 30 Q 100 44 70 50 Q 56 50 48 38 Z"
          fill="url(#shirtA)" stroke="#1e3a8a"
        />
        {/* hand */}
        <ellipse cx="118" cy="20" rx="9" ry="7" fill="url(#skinA)" stroke="#a87858" strokeWidth="0.8" />
      </motion.g>

      {/* LEFT ARM (resting at side) */}
      <path
        d="M -16 26 Q -32 36 -38 56 Q -40 80 -32 100 Q -22 100 -22 90 Q -22 70 -14 56 Q -10 46 -16 32 Z"
        fill="url(#shirtA)" stroke="#1e3a8a"
      />

      {/* NECK */}
      <path d="M 4 -2 Q 4 -10 12 -12 L 22 -12 Q 32 -10 32 -2 L 28 8 Q 18 12 8 8 Z" fill="url(#skinA)" stroke="#a87858" strokeWidth="0.8" />

      {/* HEAD */}
      <ellipse cx="18" cy="-32" rx="26" ry="30" fill="url(#skinA)" stroke="#a87858" strokeWidth="1.2" />
      <ellipse cx="9" cy="-42" rx="9" ry="13" fill="#fde2c2" opacity="0.55" />
      <ellipse cx="32" cy="-22" rx="4.5" ry="3.2" fill="#f9a8a8" opacity="0.55" />
      <ellipse cx="4" cy="-22" rx="3.5" ry="2.8" fill="#f9a8a8" opacity="0.45" />

      {/* HAIR (medium length) */}
      <path
        d="M -8 -34 Q -14 -58 12 -64 Q 36 -68 44 -54 Q 50 -42 48 -28 Q 42 -36 28 -38 Q 12 -38 -2 -32 Q -8 -32 -8 -34 Z"
        fill="url(#hairA)" stroke="#1a0f08"
      />
      <path d="M 6 -56 Q 18 -62 30 -58 Q 24 -52 14 -52 Q 8 -52 6 -56 Z" fill="#5d4530" opacity="0.7" />

      {/* eyes — closed cheerful */}
      <path d="M 5 -28 Q 9 -32 13 -28" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 23 -28 Q 27 -32 31 -28" fill="none" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />

      {/* SMILE */}
      <path d="M 13 -16 Q 19 -12 25 -16" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* === CHARACTER B — right, looking at dashboard === */}
    <g transform="translate(380 280)">
      {/* TORSO */}
      <path
        d="M -16 50 Q -26 38 -20 22 Q -16 4 0 0 L 32 0 Q 48 4 52 22 Q 58 38 48 50 L 48 110 Q 46 125 26 128 L 4 128 Q -16 125 -16 110 Z"
        fill="url(#shirtB)" stroke="#4c1d95" strokeWidth="1.4"
      />
      <path d="M -8 32 Q -12 18 0 12 L 18 10 Q 14 28 4 36 Z" fill="#c4b5fd" opacity="0.55" />
      <path d="M 8 0 Q 18 -4 26 0 L 22 12 Q 16 16 12 12 Z" fill="#4c1d95" />
      <ellipse cx="16" cy="6" rx="7" ry="3" fill="#e8b894" opacity="0.8" />

      {/* LEFT ARM (gesturing toward dashboard) */}
      <motion.g
        animate={{ rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        style={{ transformOrigin: "-16px 28px" }}
      >
        <path
          d="M -16 22 Q -44 26 -70 14 Q -84 8 -90 14 Q -96 22 -90 30 Q -68 44 -38 50 Q -24 50 -16 38 Z"
          fill="url(#shirtB)" stroke="#4c1d95"
        />
        <ellipse cx="-86" cy="20" rx="9" ry="7" fill="url(#skinB)" stroke="#7a4a2c" strokeWidth="0.8" />
      </motion.g>

      {/* RIGHT ARM (holding tablet) */}
      <path
        d="M 48 26 Q 64 34 70 54 Q 72 78 64 98 Q 54 98 54 88 Q 54 68 46 54 Q 42 44 48 32 Z"
        fill="url(#shirtB)" stroke="#4c1d95"
      />
      <ellipse cx="64" cy="98" rx="8" ry="6" fill="url(#skinB)" stroke="#7a4a2c" strokeWidth="0.8" />
      {/* tablet */}
      <rect x="56" y="100" width="22" height="16" rx="2" fill="#0f172a" stroke="#22d3ee" />
      <rect x="58" y="102" width="18" height="12" rx="1" fill="#22d3ee" opacity="0.7" />

      {/* NECK */}
      <path d="M 4 -2 Q 4 -10 12 -12 L 22 -12 Q 32 -10 32 -2 L 28 8 Q 18 12 8 8 Z" fill="url(#skinB)" stroke="#7a4a2c" strokeWidth="0.8" />

      {/* HEAD */}
      <ellipse cx="18" cy="-32" rx="26" ry="30" fill="url(#skinB)" stroke="#7a4a2c" strokeWidth="1.2" />
      <ellipse cx="9" cy="-42" rx="9" ry="13" fill="#fde2c2" opacity="0.4" />
      <ellipse cx="32" cy="-22" rx="4.5" ry="3.2" fill="#dc6b6b" opacity="0.45" />
      <ellipse cx="4" cy="-22" rx="3.5" ry="2.8" fill="#dc6b6b" opacity="0.35" />

      {/* HAIR (curly bun) */}
      <path
        d="M -10 -32 Q -16 -60 14 -66 Q 42 -68 50 -52 Q 52 -36 46 -28 Q 40 -36 28 -38 Q 12 -38 -2 -32 Q -10 -30 -10 -32 Z"
        fill="url(#hairB)" stroke="#451a03"
      />
      <ellipse cx="42" cy="-58" rx="10" ry="9" fill="url(#hairB)" />
      <path d="M 10 -58 Q 24 -64 36 -58 Q 30 -54 22 -54 Q 14 -54 10 -58 Z" fill="#7c2d12" opacity="0.55" />

      {/* eyes — open looking */}
      <ellipse cx="10" cy="-28" rx="2" ry="2.5" fill="#0f172a" />
      <ellipse cx="28" cy="-28" rx="2" ry="2.5" fill="#0f172a" />
      {/* eye shine */}
      <circle cx="11" cy="-29" r="0.8" fill="#fff" />
      <circle cx="29" cy="-29" r="0.8" fill="#fff" />

      {/* SMILE */}
      <path d="M 13 -16 Q 19 -13 25 -16" fill="none" stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* CONNECTION LINES — characters to dashboard */}
    <motion.path
      d="M 280 280 Q 270 260 260 240"
      stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3 4" fill="none" opacity="0.55"
      animate={{ strokeDashoffset: [0, -14] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M 320 280 Q 330 260 340 240"
      stroke="#60a5fa" strokeWidth="1.2" strokeDasharray="3 4" fill="none" opacity="0.55"
      animate={{ strokeDashoffset: [0, -14] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.4 }}
    />

    {/* HOLOGRAPHIC RING */}
    <motion.g
      transform="translate(300 300)"
      animate={{ rotate: 360 }}
      transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 300px" }}
    >
      <ellipse cx="0" cy="0" rx="220" ry="70" fill="none" stroke="#60a5fa" strokeWidth="0.8" opacity="0.32" strokeDasharray="3 6" />
    </motion.g>

    {/* FLOATING TAGS */}
    {[
      { x: 80, y: 130, t: "{ }", c: "#2dd4bf" },
      { x: 490, y: 130, t: "</>", c: "#60a5fa" },
      { x: 100, y: 470, t: "AI", c: "#3b82f6" },
      { x: 490, y: 470, t: "λ", c: "#22d3ee" },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
      >
        <text
          x={p.x} y={p.y} fontSize="20" fontWeight="800"
          fill={p.c} fontFamily="ui-monospace, monospace" opacity="0.9"
        >
          {p.t}
        </text>
      </motion.g>
    ))}
  </motion.svg>
);
