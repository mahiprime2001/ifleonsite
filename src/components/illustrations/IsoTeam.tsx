import { motion } from "framer-motion";

type Props = { className?: string };

// Isometric collaborating team — 3 humans around a holographic table
export const IsoTeam = ({ className }: Props) => (
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
      <linearGradient id="team-skin1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f5d0a9" />
        <stop offset="1" stopColor="#d6a36a" />
      </linearGradient>
      <linearGradient id="team-skin2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e8b894" />
        <stop offset="1" stopColor="#a87858" />
      </linearGradient>
      <linearGradient id="team-skin3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fcd9b6" />
        <stop offset="1" stopColor="#d4a373" />
      </linearGradient>
      <linearGradient id="team-table" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e293b" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <radialGradient id="team-holo" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.7" />
        <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Floor */}
    <g transform="translate(300 480)">
      <polygon points="0,-80 230,30 0,140 -230,30" fill="#0b1220" stroke="#1e293b" />
      <g opacity="0.18" stroke="#22d3ee">
        <line x1="-150" y1="55" x2="60" y2="-50" />
        <line x1="-80" y1="95" x2="130" y2="-10" />
      </g>
    </g>

    {/* Table */}
    <g transform="translate(300 380)">
      <polygon points="-130,0 0,-65 130,0 0,65" fill="url(#team-table)" stroke="#1e293b" />
      <polygon points="-130,0 0,65 0,90 -130,25" fill="#0f172a" />
      <polygon points="130,0 0,65 0,90 130,25" fill="#1e293b" />
    </g>

    {/* Hologram on table */}
    <motion.g
      transform="translate(300 350)"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      <ellipse cx="0" cy="0" rx="60" ry="30" fill="url(#team-holo)" />
      {/* hologram bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x={-25 + i * 12}
          y={-30 - (i * 3)}
          width="6"
          height={10 + (i * 5)}
          rx="1"
          fill="#22d3ee"
          opacity="0.85"
          animate={{ height: [10 + i * 5, 25 + i * 5, 10 + i * 5] }}
          transition={{ duration: 1.6 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
      <motion.path
        d="M -28 -8 Q 0 -20 28 -10"
        fill="none" stroke="#a78bfa" strokeWidth="1.5"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.g>

    {/* Person 1 — left (woman, ponytail) */}
    <g transform="translate(180 290)">
      {/* body */}
      <polygon points="0,40 30,28 50,55 20,68" fill="#3b82f6" />
      <polygon points="30,28 50,55 50,90 30,75" fill="#1d4ed8" />
      <polygon points="0,40 20,68 20,100 0,72" fill="#1e3a8a" />
      {/* head */}
      <ellipse cx="22" cy="20" rx="14" ry="13" fill="url(#team-skin1)" />
      {/* hair / ponytail */}
      <path d="M 8 14 Q 10 4 22 4 Q 34 4 36 14 Q 36 22 30 22 Q 30 14 22 14 Q 14 14 14 22 Z" fill="#1e293b" />
      <path d="M 30 18 Q 42 22 42 32 Q 42 40 36 38 Q 32 32 30 24 Z" fill="#1e293b" />
      {/* arm gesturing toward hologram */}
      <motion.polygon
        points="40,50 70,40 88,55 50,68"
        fill="#3b82f6"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </g>

    {/* Person 2 — right (man, short hair) */}
    <g transform="translate(370 290)">
      <polygon points="0,40 30,28 50,55 20,68" fill="#10b981" />
      <polygon points="30,28 50,55 50,90 30,75" fill="#047857" />
      <polygon points="0,40 20,68 20,100 0,72" fill="#065f46" />
      <ellipse cx="22" cy="20" rx="14" ry="13" fill="url(#team-skin2)" />
      <path d="M 8 18 Q 8 6 22 6 Q 36 6 36 18 Q 30 12 22 12 Q 14 12 8 18 Z" fill="#1e293b" />
      {/* arm */}
      <motion.polygon
        points="-2,52 -28,40 -42,52 -10,68"
        fill="#10b981"
        animate={{ y: [0, -1, 0, 1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
      />
    </g>

    {/* Person 3 — back center (woman, glasses) */}
    <g transform="translate(280 230)">
      <polygon points="0,40 30,28 50,55 20,68" fill="#a78bfa" />
      <polygon points="30,28 50,55 50,90 30,75" fill="#7c3aed" />
      <polygon points="0,40 20,68 20,100 0,72" fill="#5b21b6" />
      <ellipse cx="22" cy="20" rx="14" ry="13" fill="url(#team-skin3)" />
      <path d="M 8 16 Q 8 4 22 4 Q 36 4 36 16 L 38 18 L 36 22 Q 36 14 22 14 Q 8 14 8 22 Z" fill="#1f2937" />
      {/* glasses */}
      <g stroke="#0f172a" strokeWidth="1" fill="none">
        <circle cx="17" cy="22" r="3" />
        <circle cx="27" cy="22" r="3" />
        <line x1="20" y1="22" x2="24" y2="22" />
      </g>
    </g>

    {/* Floating chat bubbles */}
    {[
      { x: 110, y: 180, t: "💡" },
      { x: 480, y: 170, t: "✨" },
      { x: 300, y: 130, t: "🤝" },
    ].map((p, i) => (
      <motion.g
        key={i}
        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4 + i * 0.4, repeat: Infinity, delay: i * 0.4 }}
      >
        <circle cx={p.x} cy={p.y} r="18" fill="rgba(15,23,42,0.9)" stroke="#22d3ee" />
        <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="18">
          {p.t}
        </text>
      </motion.g>
    ))}
  </motion.svg>
);
