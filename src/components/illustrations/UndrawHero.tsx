import { motion } from "framer-motion";

type Props = { className?: string };

// Flat unDraw / Storyset-style illustration for the Hero section.
//
// Brand color = electric blue (#2563EB / #3B82F6 family). No realistic
// human figures — just a stylized laptop with code, a plant, floating UI
// cards, and decorative geometry. Easy to swap with an actual download
// from undraw.co or storyset.com — see usage notes in Hero.tsx.
export const UndrawHero = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 500"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
  >
    {/* Soft ground curve — unDraw signature */}
    <path
      d="M 0 420 Q 300 380 600 420 L 600 500 L 0 500 Z"
      fill="#0f172a"
      opacity="0.6"
    />
    <path
      d="M 0 440 Q 300 410 600 440"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Decorative dotted arc */}
    <motion.path
      d="M 80 200 Q 300 80 520 200"
      fill="none"
      stroke="#3B82F6"
      strokeWidth="2"
      strokeDasharray="3 8"
      strokeLinecap="round"
      opacity="0.4"
      animate={{ strokeDashoffset: [0, -22] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />

    {/* Floating geometric decorations — left side */}
    <motion.g
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect x="60" y="100" width="40" height="40" rx="8" fill="none" stroke="#2563EB" strokeWidth="2.5" />
      <rect x="68" y="108" width="24" height="24" rx="4" fill="#2563EB" opacity="0.85" />
    </motion.g>

    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "100px 320px" }}
    >
      <circle cx="100" cy="320" r="14" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
      <circle cx="100" cy="320" r="6" fill="#22D3EE" />
    </motion.g>

    {/* Floating geometric decorations — right side */}
    <motion.g
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    >
      <polygon points="510,90 540,108 540,144 510,162 480,144 480,108" fill="none" stroke="#3B82F6" strokeWidth="2.5" />
      <polygon points="510,108 525,116 525,134 510,142 495,134 495,116" fill="#3B82F6" opacity="0.6" />
    </motion.g>

    <motion.g
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    >
      <rect x="500" y="300" width="36" height="36" rx="18" fill="#2563EB" opacity="0.85" />
      <rect x="510" y="310" width="16" height="16" rx="8" fill="#0f172a" />
    </motion.g>

    {/* Plant pot — left of laptop (unDraw signature) */}
    <g transform="translate(115 270)">
      {/* leaves */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 90px" }}
      >
        <path d="M 30 90 Q 0 60 6 30 Q 22 18 36 32 Q 40 60 30 90 Z" fill="#0D9488" />
        <path d="M 30 90 Q 50 70 64 50 Q 50 38 38 48 Q 32 70 30 90 Z" fill="#2DD4BF" />
        <path d="M 30 90 Q 18 48 30 14 Q 42 24 38 50 Q 38 70 30 90 Z" fill="#5eead4" opacity="0.9" />
        {/* leaf veins */}
        <path d="M 30 90 Q 24 60 22 30" stroke="#0f766e" strokeWidth="1.5" fill="none" />
        <path d="M 30 90 Q 38 60 44 36" stroke="#0f766e" strokeWidth="1.5" fill="none" />
      </motion.g>
      {/* pot */}
      <path d="M 6 90 L 54 90 L 50 130 L 10 130 Z" fill="#1e293b" />
      <rect x="6" y="86" width="48" height="8" rx="2" fill="#334155" />
      <rect x="14" y="100" width="32" height="2" rx="1" fill="#2DD4BF" opacity="0.5" />
    </g>

    {/* MAIN: Laptop */}
    <g transform="translate(180 200)">
      {/* base/keyboard */}
      <path d="M -10 200 L 250 200 L 270 220 L -30 220 Z" fill="#1e293b" />
      <path d="M 10 196 L 230 196 L 232 200 L 8 200 Z" fill="#0f172a" />

      {/* screen body */}
      <rect x="0" y="0" width="240" height="200" rx="10" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

      {/* notch / camera */}
      <rect x="115" y="6" width="10" height="3" rx="1.5" fill="#475569" />

      {/* screen content area */}
      <rect x="12" y="16" width="216" height="172" rx="6" fill="#0b1220" />

      {/* Browser-like top bar */}
      <rect x="12" y="16" width="216" height="22" rx="6" fill="#1e293b" />
      <circle cx="24" cy="27" r="3" fill="#ef4444" />
      <circle cx="34" cy="27" r="3" fill="#fbbf24" />
      <circle cx="44" cy="27" r="3" fill="#2DD4BF" />
      <rect x="60" y="22" width="120" height="10" rx="3" fill="#0b1220" />
      <rect x="65" y="25" width="50" height="4" rx="1" fill="#475569" />

      {/* Code area */}
      <g>
        {[
          { y: 50, w: 30, c: "#fbbf24" },
          { y: 60, w: 110, c: "#3B82F6" },
          { y: 70, w: 80, c: "#22d3ee" },
          { y: 80, w: 140, c: "#fff", o: 0.7 },
          { y: 90, w: 60, c: "#3B82F6" },
          { y: 100, w: 100, c: "#22d3ee" },
          { y: 110, w: 75, c: "#fbbf24" },
          { y: 120, w: 130, c: "#3B82F6" },
          { y: 130, w: 50, c: "#22d3ee" },
          { y: 140, w: 95, c: "#fff", o: 0.7 },
          { y: 150, w: 70, c: "#3B82F6" },
          { y: 160, w: 110, c: "#fbbf24" },
        ].map((l, i) => (
          <motion.rect
            key={i}
            x="24"
            y={l.y}
            width={l.w}
            height="3"
            rx="1.5"
            fill={l.c}
            opacity={l.o ?? 0.85}
            animate={{ width: [l.w, l.w * 0.7, l.w] }}
            transition={{ duration: 2.6 + (i % 3) * 0.3, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
        {/* blinking cursor */}
        <motion.rect
          x="120" y="160" width="6" height="3" rx="1" fill="#fff"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </g>
    </g>

    {/* Floating UI card — top right (chart) */}
    <motion.g
      transform="translate(420 130)"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <rect width="120" height="80" rx="8" fill="#fff" stroke="#2563EB" strokeWidth="2" />
      <rect width="120" height="20" rx="8" fill="#2563EB" />
      <text x="10" y="14" fontSize="9" fontWeight="700" fill="#fff" letterSpacing="1">
        ANALYTICS
      </text>
      {/* mini bars */}
      {[
        { x: 14, h: 22 },
        { x: 32, h: 36 },
        { x: 50, h: 28 },
        { x: 68, h: 44 },
        { x: 86, h: 30 },
      ].map((b, i) => (
        <motion.rect
          key={i}
          x={b.x}
          y={70 - b.h}
          width="10"
          height={b.h}
          rx="2"
          fill="#3B82F6"
          opacity="0.85"
          animate={{ height: [b.h, b.h - 8, b.h] }}
          transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.g>

    {/* Floating UI card — middle right (notification) */}
    <motion.g
      transform="translate(440 250)"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
    >
      <rect width="100" height="50" rx="8" fill="#fff" stroke="#2563EB" strokeWidth="2" />
      <circle cx="16" cy="25" r="8" fill="#2DD4BF" />
      <path d="M 13 25 L 15 27 L 19 23" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="14" width="60" height="4" rx="2" fill="#1e293b" />
      <rect x="30" y="22" width="44" height="3" rx="1.5" fill="#475569" opacity="0.7" />
      <rect x="30" y="29" width="50" height="3" rx="1.5" fill="#475569" opacity="0.5" />
      <rect x="30" y="36" width="38" height="3" rx="1.5" fill="#475569" opacity="0.5" />
    </motion.g>

    {/* Floating "+1" indicators */}
    <motion.g
      animate={{ y: [0, -20, -40], opacity: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
    >
      <circle cx="540" cy="200" r="10" fill="#2563EB" />
      <text x="540" y="204" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">+1</text>
    </motion.g>
    <motion.g
      animate={{ y: [0, -20, -40], opacity: [0, 1, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 1.5 }}
    >
      <circle cx="80" cy="240" r="10" fill="#2563EB" />
      <text x="80" y="244" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">+1</text>
    </motion.g>

  </motion.svg>
);
