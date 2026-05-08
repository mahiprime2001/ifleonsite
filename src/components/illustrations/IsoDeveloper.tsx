import { motion } from "framer-motion";

type Props = { className?: string };

// Clean professional isometric character — single focal workstation,
// minimal clutter, premium glow accents. Centered composition.
export const IsoDeveloper = ({ className }: Props) => (
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
      <linearGradient id="iso-platform" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="iso-platform-edge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="iso-screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="iso-skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f5d0a9" />
        <stop offset="1" stopColor="#d6a36a" />
      </linearGradient>
      <linearGradient id="iso-shirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#34d399" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
      <linearGradient id="iso-shirt-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#10b981" />
        <stop offset="1" stopColor="#065f46" />
      </linearGradient>
      <linearGradient id="iso-pants" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e3a8a" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="iso-desk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cbd5e1" />
        <stop offset="1" stopColor="#94a3b8" />
      </linearGradient>
      <radialGradient id="iso-aura" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#34d399" stopOpacity="0.5" />
        <stop offset="0.5" stopColor="#22d3ee" stopOpacity="0.2" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <filter id="iso-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    {/* Soft aura behind the whole composition */}
    <motion.circle
      cx="300" cy="310" r="240"
      fill="url(#iso-aura)"
      animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Isometric platform — clean rounded tile */}
    <g transform="translate(300 470)">
      <polygon
        points="0,-100 220,18 0,136 -220,18"
        fill="url(#iso-platform)"
        stroke="#1e293b"
      />
      {/* edge highlight */}
      <polyline points="-220,18 0,-100 220,18" fill="none" stroke="#334155" strokeWidth="1.2" />
      {/* expanding scan ring */}
      <motion.ellipse
        cx="0" cy="20" rx="60" ry="24" fill="none" stroke="#34d399" strokeWidth="1.5"
        animate={{ rx: [40, 200, 40], ry: [16, 80, 16], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      />
      {/* subtle grid lines */}
      <g opacity="0.18" stroke="#60a5fa" strokeWidth="0.8">
        <line x1="-150" y1="42" x2="60" y2="-58" />
        <line x1="-80" y1="80" x2="130" y2="-20" />
        <line x1="-10" y1="118" x2="200" y2="18" />
      </g>
    </g>

    {/* Holographic ring behind character */}
    <motion.g
      transform="translate(300 290)"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 290px" }}
    >
      <ellipse cx="0" cy="0" rx="160" ry="56" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.45" />
    </motion.g>
    <motion.g
      transform="translate(300 290)"
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 290px" }}
    >
      <ellipse cx="0" cy="0" rx="180" ry="64" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.35" strokeDasharray="3 6" />
    </motion.g>

    {/* Desk — single clean isometric slab */}
    <g transform="translate(300 380)">
      <polygon points="-150,28 0,-46 150,28 0,102" fill="url(#iso-desk)" stroke="#94a3b8" />
      <polygon points="-150,28 0,102 0,128 -150,54" fill="#64748b" />
      <polygon points="150,28 0,102 0,128 150,54" fill="#475569" />
    </g>

    {/* Floating glowing display — large hologram */}
    <motion.g
      transform="translate(300 230)"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* halo */}
      <ellipse cx="0" cy="20" rx="120" ry="50" fill="#22d3ee" opacity="0.18" filter="url(#iso-blur)" />

      {/* outer frame (isometric) */}
      <polygon points="-110,0 0,-58 110,0 0,58" fill="rgba(15,23,42,0.92)" stroke="#22d3ee" strokeWidth="1.5" />

      {/* screen content (rotated to face viewer flat for readability) */}
      <g transform="translate(0 0)">
        {/* code lines */}
        <g transform="translate(-72 -28) skewY(26.5) skewX(-26.5)">
          {[
            { y: 0, w: 26, c: "#fbbf24" },
            { y: 8, w: 64, c: "#22d3ee" },
            { y: 16, w: 50, c: "#34d399" },
            { y: 24, w: 80, c: "#a78bfa" },
            { y: 32, w: 42, c: "#22d3ee" },
            { y: 40, w: 60, c: "#fbbf24" },
            { y: 48, w: 30, c: "#34d399" },
          ].map((l, i) => (
            <motion.rect
              key={i}
              x="0" y={l.y} width={l.w} height="3" rx="1.5" fill={l.c}
              animate={{ width: [l.w, l.w * 0.7, l.w] }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          {/* blinking cursor */}
          <motion.rect
            x="62" y="48" width="10" height="3" rx="1" fill="#fff"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </g>

        {/* corner markers */}
        {[
          { x: -98, y: -8, dx: 8, dy: 0 },
          { x: 98, y: -8, dx: -8, dy: 0 },
          { x: -98, y: 8, dx: 8, dy: 0 },
          { x: 98, y: 8, dx: -8, dy: 0 },
        ].map((m, i) => (
          <motion.line
            key={i}
            x1={m.x} y1={m.y} x2={m.x + m.dx} y2={m.y + m.dy}
            stroke="#34d399" strokeWidth="2" strokeLinecap="round"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </g>
    </motion.g>

    {/* Main character — clean professional figure */}
    <g transform="translate(285 290)">
      {/* chair back */}
      <polygon points="-2,40 30,28 30,90 -2,108" fill="#1e293b" />
      <polygon points="30,28 60,42 60,104 30,90" fill="#0f172a" />

      {/* torso (front) */}
      <polygon points="-12,72 30,52 30,108 -12,128" fill="url(#iso-shirt)" />
      <polygon points="30,52 56,68 56,124 30,108" fill="url(#iso-shirt-side)" />

      {/* arms forward to keyboard */}
      <motion.polygon
        points="-12,84 -32,98 -22,128 -2,114"
        fill="url(#iso-shirt)"
        animate={{ x: [0, -1, 0, 1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
      />
      <motion.polygon
        points="30,72 56,86 66,116 40,102"
        fill="url(#iso-shirt-side)"
        animate={{ x: [0, 1, 0, -1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
      />

      {/* neck */}
      <polygon points="6,46 22,38 26,52 10,60" fill="url(#iso-skin)" />

      {/* head */}
      <ellipse cx="18" cy="30" rx="20" ry="22" fill="url(#iso-skin)" />
      {/* hair (clean side-part) */}
      <path
        d="M 0 28 Q 0 6 18 6 Q 38 6 38 28 Q 32 18 18 18 Q 6 18 0 28 Z"
        fill="#1f2937"
      />
      {/* glasses */}
      <g stroke="#0f172a" strokeWidth="1.4" fill="none">
        <circle cx="11" cy="32" r="4.2" fill="rgba(34,211,238,0.18)" />
        <circle cx="25" cy="32" r="4.2" fill="rgba(34,211,238,0.18)" />
        <line x1="15" y1="32" x2="21" y2="32" />
      </g>
      {/* shine on glasses */}
      <motion.line
        x1="9" y1="30" x2="11.5" y2="31" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.7"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
      {/* subtle cheek shadow */}
      <ellipse cx="32" cy="34" rx="3" ry="2.5" fill="#a87858" opacity="0.5" />

      {/* lap / pants visible in front */}
      <polygon points="-14,124 30,108 30,134 -14,150" fill="url(#iso-pants)" />
    </g>

    {/* Keyboard — minimal */}
    <g transform="translate(255 384)">
      <polygon points="0,0 90,-18 110,-8 20,12" fill="#475569" stroke="#334155" />
      <polygon points="0,0 20,12 20,16 0,4" fill="#1e293b" />
      <polygon points="110,-8 20,12 20,16 110,-4" fill="#334155" />
      {/* key glow */}
      <motion.ellipse
        cx="55" cy="-3" rx="42" ry="6" fill="#34d399" opacity="0.3"
        animate={{ opacity: [0.1, 0.45, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </g>

    {/* Coffee cup */}
    <motion.g
      transform="translate(410 350)"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <ellipse cx="0" cy="0" rx="11" ry="5.5" fill="#0b1220" />
      <ellipse cx="0" cy="-1" rx="9" ry="3.8" fill="#7c2d12" />
      <path d="M -11 0 L -9 16 Q 0 22 9 16 L 11 0 Z" fill="#475569" />
      <path d="M 11 5 Q 20 3 20 12 Q 20 18 13 16" fill="none" stroke="#475569" strokeWidth="2" />
      {/* steam */}
      <motion.path
        d="M -2 -8 Q -6 -18 0 -26 Q 6 -34 -2 -42"
        fill="none" stroke="#cbd5e1" strokeWidth="1.4" opacity="0.6"
        animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.g>

    {/* Floating code/symbol tags — fewer, premium positioning */}
    {[
      { x: 110, y: 170, t: "{ }", c: "#34d399", s: 18 },
      { x: 480, y: 150, t: "</>", c: "#60a5fa", s: 16 },
      { x: 100, y: 360, t: "AI", c: "#a78bfa", s: 17 },
      { x: 490, y: 370, t: "λ", c: "#22d3ee", s: 22 },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
      >
        <text
          x={p.x} y={p.y}
          fontSize={p.s}
          fontWeight="700"
          fill={p.c}
          fontFamily="ui-monospace, monospace"
          opacity="0.9"
        >
          {p.t}
        </text>
      </motion.g>
    ))}

    {/* Connecting data line from monitor to character (typing flow) */}
    <motion.path
      d="M 300 280 Q 305 295 305 310"
      stroke="#22d3ee"
      strokeWidth="1.5"
      strokeDasharray="3 5"
      fill="none"
      opacity="0.55"
      animate={{ strokeDashoffset: [0, -16] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
  </motion.svg>
);
