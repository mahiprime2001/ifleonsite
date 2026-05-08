import { motion } from "framer-motion";

type Props = { className?: string };

// Premium isometric "connected ecosystem" — central IFLEON hub with
// satellite nodes (clients/locations), flowing data, and orbital tech rings.
// No human figures — represents pan-India reach and connected services.
export const IsoEcosystem = ({ className }: Props) => {
  // Six satellite nodes positioned on an ellipse around the hub
  const sats = [
    { angle: 0,            color: "#22d3ee", label: "AI",    icon: "ai" as const },
    { angle: Math.PI / 3,  color: "#34d399", label: "DEV",   icon: "dev" as const },
    { angle: 2 * Math.PI / 3, color: "#a78bfa", label: "CLOUD", icon: "cloud" as const },
    { angle: Math.PI,         color: "#f472b6", label: "DATA",  icon: "data" as const },
    { angle: 4 * Math.PI / 3, color: "#fbbf24", label: "SEC",  icon: "sec" as const },
    { angle: 5 * Math.PI / 3, color: "#60a5fa", label: "OPS",  icon: "ops" as const },
  ];

  const cx = 300;
  const cy = 300;
  const rx = 200;
  const ry = 80;

  const sat = (a: number) => ({
    x: cx + Math.cos(a) * rx,
    y: cy + Math.sin(a) * ry,
  });

  return (
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
        <linearGradient id="eco-platform" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="eco-hub" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="0.5" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="eco-hub-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
        <radialGradient id="eco-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#34d399" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#22d3ee" stopOpacity="0.18" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <filter id="eco-blur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Background aura */}
      <motion.circle
        cx={cx} cy={cy} r="260"
        fill="url(#eco-glow)"
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* World grid platform — broader, suggests pan-region reach */}
      <g transform={`translate(${cx} ${cy + 180})`}>
        <ellipse cx="0" cy="0" rx="240" ry="92" fill="url(#eco-platform)" stroke="#1e293b" />
        {/* longitude/latitude lines */}
        <g opacity="0.22" stroke="#22d3ee" strokeWidth="0.8" fill="none">
          <ellipse cx="0" cy="0" rx="240" ry="92" />
          <ellipse cx="0" cy="0" rx="180" ry="68" />
          <ellipse cx="0" cy="0" rx="120" ry="44" />
          <ellipse cx="0" cy="0" rx="60" ry="20" />
          <line x1="-240" y1="0" x2="240" y2="0" />
          <line x1="0" y1="-92" x2="0" y2="92" />
        </g>
        {/* expanding scan ring */}
        <motion.ellipse
          cx="0" cy="0" rx="60" ry="20" fill="none" stroke="#34d399" strokeWidth="1.5"
          animate={{ rx: [40, 220, 40], ry: [16, 88, 16], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut" }}
        />
      </g>

      {/* Connection lines — hub to each satellite (curved, animated dash) */}
      {sats.map((s, i) => {
        const p = sat(s.angle);
        const midX = (cx + p.x) / 2;
        const midY = (cy + p.y) / 2 - 18;
        return (
          <motion.path
            key={`line-${i}`}
            d={`M ${cx} ${cy} Q ${midX} ${midY} ${p.x} ${p.y}`}
            stroke={s.color}
            strokeWidth="1.4"
            strokeDasharray="4 5"
            fill="none"
            opacity="0.55"
            animate={{ strokeDashoffset: [0, -18] }}
            transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: "linear" }}
          />
        );
      })}

      {/* Data packets traveling along the connection paths */}
      {sats.map((s, i) => {
        const p = sat(s.angle);
        return (
          <motion.circle
            key={`pkt-${i}`}
            r="4"
            fill={s.color}
            animate={{
              cx: [cx, p.x, cx],
              cy: [cy, p.y, cy],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {/* Outer holographic rings */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <ellipse
          cx={cx} cy={cy} rx="230" ry="92"
          fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.35"
        />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <ellipse
          cx={cx} cy={cy} rx="250" ry="100"
          fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.3"
          strokeDasharray="3 6"
        />
      </motion.g>

      {/* Satellite nodes */}
      {sats.map((s, i) => {
        const p = sat(s.angle);
        return (
          <motion.g
            key={`sat-${i}`}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.25 }}
          >
            {/* halo */}
            <circle cx={p.x} cy={p.y} r="22" fill={s.color} opacity="0.18" filter="url(#eco-blur)" />
            {/* iso cube node */}
            <g transform={`translate(${p.x} ${p.y})`}>
              {/* top */}
              <polygon
                points="-16,0 0,-9 16,0 0,9"
                fill={s.color}
                opacity="0.95"
              />
              {/* left side */}
              <polygon
                points="-16,0 0,9 0,24 -16,15"
                fill={s.color}
                opacity="0.6"
              />
              {/* right side */}
              <polygon
                points="16,0 0,9 0,24 16,15"
                fill={s.color}
                opacity="0.4"
              />
              {/* tiny pulsing top */}
              <motion.circle
                cy="-9" r="2"
                fill="#fff"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
              />
              {/* label */}
              <text
                y="42" textAnchor="middle"
                fontSize="9" fontWeight="700"
                fill={s.color} letterSpacing="1.5"
              >
                {s.label}
              </text>
            </g>
          </motion.g>
        );
      })}

      {/* CENTRAL HUB — IFLEON */}
      <motion.g
        transform={`translate(${cx} ${cy})`}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* halo */}
        <circle r="60" fill="#22d3ee" opacity="0.25" filter="url(#eco-blur)" />

        {/* base platform */}
        <polygon points="-50,30 0,5 50,30 0,55" fill="#0f172a" stroke="#22d3ee" />
        <polygon points="-50,30 0,55 0,68 -50,42" fill="#0b1220" />
        <polygon points="50,30 0,55 0,68 50,42" fill="#1e293b" />

        {/* hub cube — top */}
        <polygon points="-44,0 0,-22 44,0 0,22" fill="url(#eco-hub)" stroke="#22d3ee" strokeWidth="1.4" />
        {/* hub left side */}
        <polygon points="-44,0 0,22 0,42 -44,20" fill="url(#eco-hub-side)" />
        {/* hub right side */}
        <polygon points="44,0 0,22 0,42 44,20" fill="#1e3a8a" />

        {/* hub top emblem (IFLEON dot pattern) */}
        <g transform="translate(0 0)">
          {[
            { x: -12, y: -2 },
            { x: 0, y: -8 },
            { x: 12, y: -2 },
            { x: -6, y: 6 },
            { x: 6, y: 6 },
          ].map((d, i) => (
            <motion.circle
              key={i}
              cx={d.x} cy={d.y} r="2.2" fill="#fff"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </g>

        {/* small upward beam */}
        <motion.path
          d="M 0 -22 L 0 -50"
          stroke="#34d399" strokeWidth="2" strokeLinecap="round"
          animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* Floating tags above the scene */}
      {[
        { x: 110, y: 130, t: "{ }", c: "#34d399" },
        { x: 480, y: 130, t: "</>", c: "#60a5fa" },
        { x: 100, y: 460, t: "λ", c: "#a78bfa" },
        { x: 490, y: 460, t: "@", c: "#fbbf24" },
      ].map((p, i) => (
        <motion.g
          key={`tag-${i}`}
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        >
          <text
            x={p.x} y={p.y}
            fontSize="18"
            fontWeight="700"
            fill={p.c}
            fontFamily="ui-monospace, monospace"
            opacity="0.85"
          >
            {p.t}
          </text>
        </motion.g>
      ))}
    </motion.svg>
  );
};
