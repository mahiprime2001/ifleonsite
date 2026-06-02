import { motion } from "framer-motion";

type Props = { className?: string };

// Isometric AI brain with neural network nodes — original SVG
export const IsoAI = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 600"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <defs>
      <linearGradient id="ai-brain" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="ai-pad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <radialGradient id="ai-aura" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stopColor="#60a5fa" stopOpacity="0.6" />
        <stop offset="0.6" stopColor="#2563eb" stopOpacity="0.15" />
        <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Pulsing aura */}
    <motion.circle
      cx="300" cy="280" r="220" fill="url(#ai-aura)"
      animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4.5, repeat: Infinity }}
    />

    {/* Floor */}
    <g transform="translate(300 470)">
      <polygon points="0,-80 200,30 0,130 -200,30" fill="#0b1220" stroke="#1e293b" />
      <g opacity="0.16" stroke="#60a5fa">
        <line x1="-140" y1="50" x2="60" y2="-55" />
        <line x1="-70" y1="90" x2="130" y2="-15" />
        <line x1="0" y1="120" x2="180" y2="20" />
      </g>
    </g>

    {/* Holographic platform */}
    <g transform="translate(300 380)">
      <polygon points="-90,0 0,-45 90,0 0,45" fill="url(#ai-pad)" stroke="#3b82f6" opacity="0.85" />
      <polygon points="-90,0 0,45 0,55 -90,10" fill="#0f172a" />
      <polygon points="90,0 0,45 0,55 90,10" fill="#1e293b" />
      <motion.ellipse
        cx="0" cy="0" rx="90" ry="44" fill="none"
        stroke="#60a5fa" strokeWidth="1"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </g>

    {/* Floating brain shape — stylized 3D */}
    <motion.g
      transform="translate(300 250)"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Brain top */}
      <path
        d="M -60 -10 C -75 -50, -30 -85, 0 -70 C 30 -90, 80 -55, 60 -10 C 80 5, 75 35, 50 40 C 35 60, -35 60, -50 40 C -75 35, -78 5, -60 -10 Z"
        fill="url(#ai-brain)"
        stroke="#1d4ed8"
      />
      {/* Brain seams */}
      <g fill="none" stroke="#1d4ed8" strokeWidth="1.5" opacity="0.7">
        <path d="M 0 -70 C -10 -40, 5 -10, -5 25" />
        <path d="M -30 -55 C -40 -30, -25 0, -35 30" />
        <path d="M 30 -55 C 40 -30, 25 0, 35 30" />
      </g>
      {/* Synapse nodes */}
      {[
        { x: -40, y: -30 }, { x: 30, y: -40 }, { x: -10, y: 0 },
        { x: 25, y: 15 }, { x: -28, y: 25 }, { x: 0, y: -55 },
      ].map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r="3"
          fill="#fff"
          animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.6, 1] }}
          transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.g>

    {/* Orbiting nodes */}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const angle = (i / 6) * Math.PI * 2;
      const rx = 150;
      const ry = 60;
      return (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 24 + i * 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 280px" }}
        >
          <motion.circle
            cx={300 + Math.cos(angle) * rx} cy={280 + Math.sin(angle) * ry}
            r="6"
            fill={i % 2 ? "#2dd4bf" : "#22d3ee"}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        </motion.g>
      );
    })}

    {/* Outer rings */}
    <motion.ellipse
      cx="300" cy="280" rx="160" ry="65" fill="none"
      stroke="#60a5fa" strokeWidth="1" opacity="0.5"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 280px" }}
    />
    <motion.ellipse
      cx="300" cy="280" rx="180" ry="75" fill="none"
      stroke="#22d3ee" strokeWidth="1" opacity="0.4"
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 280px" }}
    />

    {/* Floating data tags */}
    {[
      { x: 80, y: 130, t: "ML" },
      { x: 470, y: 110, t: "NLP" },
      { x: 100, y: 380, t: "DATA" },
      { x: 460, y: 380, t: "GPU" },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 0.4 }}
      >
        <rect x={p.x - 22} y={p.y - 14} width="44" height="22" rx="4"
          fill="rgba(15,23,42,0.85)" stroke="#3b82f6" />
        <text x={p.x} y={p.y + 2} textAnchor="middle" fontSize="11" fontWeight="700" fill="#bfdbfe">
          {p.t}
        </text>
      </motion.g>
    ))}
  </motion.svg>
);
