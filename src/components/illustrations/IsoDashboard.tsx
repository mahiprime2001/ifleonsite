import { motion } from "framer-motion";

type Props = { className?: string };

// Premium isometric "command center" dashboard — floating glass panels
// with live metrics, charts, code, and orbiting data nodes. No human figures.
export const IsoDashboard = ({ className }: Props) => (
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
      <linearGradient id="dash-platform" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="dash-panel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(15,23,42,0.95)" />
        <stop offset="1" stopColor="rgba(2,6,23,0.95)" />
      </linearGradient>
      <linearGradient id="dash-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="dash-indigo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
      <radialGradient id="dash-aura" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.4" />
        <stop offset="0.5" stopColor="#3B82F6" stopOpacity="0.18" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
      <filter id="dash-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>

    {/* Background aura */}
    <motion.circle
      cx="300" cy="300" r="260"
      fill="url(#dash-aura)"
      animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Floor platform — isometric tile */}
    <g transform="translate(300 480)">
      <polygon
        points="0,-100 230,18 0,136 -230,18"
        fill="url(#dash-platform)"
        stroke="#1e293b"
      />
      {/* edge glow */}
      <polyline points="-230,18 0,-100 230,18" fill="none" stroke="#334155" strokeWidth="1.2" />
      {/* expanding scan ring */}
      <motion.ellipse
        cx="0" cy="20" rx="60" ry="24" fill="none" stroke="#22D3EE" strokeWidth="1.5"
        animate={{ rx: [40, 200, 40], ry: [16, 80, 16], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
      />
      {/* grid lines */}
      <g opacity="0.18" stroke="#60a5fa" strokeWidth="0.8">
        <line x1="-160" y1="42" x2="60" y2="-58" />
        <line x1="-90" y1="80" x2="130" y2="-20" />
        <line x1="-20" y1="118" x2="200" y2="18" />
      </g>
    </g>

    {/* Holographic rings around the central panel */}
    <motion.g
      transform="translate(300 290)"
      animate={{ rotate: 360 }}
      transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 290px" }}
    >
      <ellipse cx="0" cy="0" rx="180" ry="64" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.4" />
    </motion.g>
    <motion.g
      transform="translate(300 290)"
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 290px" }}
    >
      <ellipse cx="0" cy="0" rx="200" ry="72" fill="none" stroke="#7C3AED" strokeWidth="0.8" opacity="0.32" strokeDasharray="3 6" />
    </motion.g>

    {/* MAIN center panel — floating dashboard */}
    <motion.g
      transform="translate(300 240)"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Halo glow behind */}
      <ellipse cx="0" cy="20" rx="140" ry="55" fill="#22d3ee" opacity="0.18" filter="url(#dash-blur)" />

      {/* Top face */}
      <polygon points="-110,0 0,-58 110,0 0,58" fill="url(#dash-panel)" stroke="#22d3ee" strokeWidth="1.4" />

      {/* dashboard content — flattened to face camera */}
      <g transform="translate(-72 -30) skewY(26.5) skewX(-26.5)">
        {/* header */}
        <rect x="0" y="0" width="80" height="3" rx="1.5" fill="#22d3ee" opacity="0.9" />
        <rect x="0" y="6" width="50" height="2" rx="1" fill="#94a3b8" opacity="0.7" />

        {/* metric cards row */}
        {[
          { x: 0, c: "#2563EB", h: 16 },
          { x: 28, c: "#60a5fa", h: 14 },
          { x: 56, c: "#22d3ee", h: 18 },
        ].map((m, i) => (
          <g key={i} transform={`translate(${m.x} 14)`}>
            <rect width="22" height="20" rx="2" fill="rgba(255,255,255,0.04)" stroke={m.c} strokeWidth="0.5" />
            <motion.rect
              x="2" y={20 - m.h} width="3" height={m.h} rx="1" fill={m.c}
              animate={{ height: [m.h, m.h - 4, m.h] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 }}
            />
            <motion.rect
              x="7" y={20 - m.h + 3} width="3" height={m.h - 3} rx="1" fill={m.c} opacity="0.6"
              animate={{ height: [m.h - 3, m.h - 7, m.h - 3] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
            />
            <motion.rect
              x="12" y={20 - m.h + 6} width="3" height={m.h - 6} rx="1" fill={m.c} opacity="0.4"
              animate={{ height: [m.h - 6, m.h - 4, m.h - 6] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5 }}
            />
          </g>
        ))}

        {/* trending line chart */}
        <g transform="translate(0 42)">
          <motion.path
            d="M 0 8 L 12 4 L 24 6 L 36 2 L 48 5 L 60 1 L 72 3"
            fill="none" stroke="#3B82F6" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.5, 0.85, 1] }}
          />
          {[0, 12, 24, 36, 48, 60, 72].map((x, i) => (
            <motion.circle
              key={i} cx={x} cy={[8, 4, 6, 2, 5, 1, 3][i]} r="1.5" fill="#3B82F6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </g>
      </g>

      {/* corner markers */}
      {[
        { x: -98, y: -8, dx: 8 },
        { x: 98, y: -8, dx: -8 },
        { x: -98, y: 8, dx: 8 },
        { x: 98, y: 8, dx: -8 },
      ].map((m, i) => (
        <motion.line
          key={i}
          x1={m.x} y1={m.y} x2={m.x + m.dx} y2={m.y}
          stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </motion.g>

    {/* LEFT panel — code editor card */}
    <motion.g
      transform="translate(110 280)"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
    >
      <ellipse cx="55" cy="50" rx="70" ry="22" fill="#3B82F6" opacity="0.18" filter="url(#dash-blur)" />
      {/* iso card */}
      <polygon points="0,0 80,-40 130,-15 50,25" fill="url(#dash-panel)" stroke="#3B82F6" />
      <polygon points="0,0 50,25 50,75 0,50" fill="rgba(2,6,23,0.95)" stroke="#3B82F6" opacity="0.9" />
      <polygon points="130,-15 50,25 50,75 130,35" fill="rgba(15,23,42,0.95)" stroke="#3B82F6" opacity="0.85" />
      {/* code lines on top face */}
      <g transform="translate(8 5) skewY(26.5) skewX(-26.5)">
        {[
          { y: 0, w: 18, c: "#fbbf24" },
          { y: 6, w: 50, c: "#22d3ee" },
          { y: 12, w: 38, c: "#3B82F6" },
          { y: 18, w: 60, c: "#60a5fa" },
          { y: 24, w: 28, c: "#22d3ee" },
        ].map((l, i) => (
          <motion.rect
            key={i}
            x="0" y={l.y} width={l.w} height="2.5" rx="1"
            fill={l.c}
            animate={{ width: [l.w, l.w * 0.7, l.w] }}
            transition={{ duration: 2.5 + i * 0.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
        <motion.rect
          x="30" y="24" width="8" height="2.5" rx="1" fill="#fff"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </g>
    </motion.g>

    {/* RIGHT panel — donut/ring metric */}
    <motion.g
      transform="translate(440 270)"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
    >
      <ellipse cx="40" cy="55" rx="60" ry="22" fill="#22D3EE" opacity="0.18" filter="url(#dash-blur)" />
      {/* iso card */}
      <polygon points="0,0 80,-40 130,-15 50,25" fill="url(#dash-panel)" stroke="#22D3EE" />
      <polygon points="0,0 50,25 50,80 0,55" fill="rgba(2,6,23,0.95)" stroke="#22D3EE" opacity="0.9" />
      <polygon points="130,-15 50,25 50,80 130,40" fill="rgba(15,23,42,0.95)" stroke="#22D3EE" opacity="0.85" />
      {/* donut chart */}
      <g transform="translate(36 -2) skewY(26.5) skewX(-26.5)">
        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="20" cy="20" r="16" fill="none"
          stroke="url(#dash-indigo)" strokeWidth="6"
          strokeDasharray="100" strokeDashoffset="30"
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          animate={{ strokeDashoffset: [30, 22, 30] }}
          transition={{ duration: 3.4, repeat: Infinity }}
        />
        <text
          x="20" y="23" textAnchor="middle" fontSize="9" fontWeight="700"
          fill="#fff"
        >
          99%
        </text>
      </g>
    </motion.g>

    {/* Bottom mini stats — 3 floating chip-like tiles */}
    <g>
      {[
        { x: 200, y: 410, label: "AI", c: "#3B82F6" },
        { x: 300, y: 432, label: "DEV", c: "#2DD4BF" },
        { x: 400, y: 410, label: "CLOUD", c: "#22d3ee" },
      ].map((t, i) => (
        <motion.g
          key={i}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        >
          <rect
            x={t.x - 22} y={t.y - 10} width="44" height="20" rx="4"
            fill="rgba(15,23,42,0.95)" stroke={t.c} strokeWidth="1"
          />
          <motion.circle
            cx={t.x - 12} cy={t.y} r="2.5" fill={t.c}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
          />
          <text
            x={t.x + 4} y={t.y + 4} textAnchor="middle" fontSize="9" fontWeight="700"
            fill={t.c} letterSpacing="1.5"
          >
            {t.label}
          </text>
        </motion.g>
      ))}
    </g>

    {/* Connection lines — main panel to side panels */}
    <motion.path
      d="M 220 270 Q 175 275 145 290"
      stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3 4" fill="none" opacity="0.55"
      animate={{ strokeDashoffset: [0, -14] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <motion.path
      d="M 380 270 Q 425 275 470 285"
      stroke="#22D3EE" strokeWidth="1.2" strokeDasharray="3 4" fill="none" opacity="0.55"
      animate={{ strokeDashoffset: [0, -14] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.3 }}
    />

    {/* Floating data nodes — orbiting */}
    {[0, 1, 2, 3].map((i) => {
      const angle = (i / 4) * Math.PI * 2;
      const rx = 220, ry = 80;
      return (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 28 + i * 3, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 290px" }}
        >
          <motion.circle
            cx={300 + Math.cos(angle) * rx}
            cy={290 + Math.sin(angle) * ry}
            r="5"
            fill={["#3B82F6", "#22d3ee", "#7C3AED", "#2DD4BF"][i]}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        </motion.g>
      );
    })}

    {/* Floating code/symbol tags */}
    {[
      { x: 110, y: 150, t: "{ }", c: "#3B82F6" },
      { x: 480, y: 130, t: "</>", c: "#60a5fa" },
      { x: 100, y: 410, t: "λ", c: "#7C3AED" },
      { x: 490, y: 410, t: "AI", c: "#22d3ee" },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
      >
        <text
          x={p.x} y={p.y}
          fontSize="18"
          fontWeight="700"
          fill={p.c}
          fontFamily="ui-monospace, monospace"
          opacity="0.9"
        >
          {p.t}
        </text>
      </motion.g>
    ))}
  </motion.svg>
);
