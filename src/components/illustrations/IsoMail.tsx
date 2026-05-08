import { motion } from "framer-motion";

type Props = { className?: string };

// Isometric envelope with paper plane (newsletter / contact)
export const IsoMail = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 400"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7 }}
  >
    <defs>
      <linearGradient id="mail-front" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="mail-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d4ed8" />
        <stop offset="1" stopColor="#1e3a8a" />
      </linearGradient>
      <radialGradient id="mail-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#60a5fa" stopOpacity="0.45" />
        <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
      </radialGradient>
    </defs>

    <motion.circle
      cx="300" cy="200" r="200" fill="url(#mail-glow)"
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 5, repeat: Infinity }}
    />

    {/* envelope */}
    <motion.g
      transform="translate(300 220)"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity }}
    >
      <polygon points="-110,0 0,-50 110,0 0,50" fill="url(#mail-front)" stroke="#1d4ed8" />
      <polygon points="-110,0 0,50 0,80 -110,30" fill="url(#mail-side)" />
      <polygon points="110,0 0,50 0,80 110,30" fill="#1e3a8a" />
      {/* flap */}
      <polygon points="-110,0 0,-50 110,0 0,12" fill="#3b82f6" stroke="#1d4ed8" opacity="0.95" />
      {/* letter peeking */}
      <motion.g
        animate={{ y: [-8, -22, -8] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <polygon points="-60,-8 60,-8 60,18 -60,18" fill="#fff" stroke="#cbd5e1" />
        <line x1="-50" y1="0" x2="50" y2="0" stroke="#94a3b8" />
        <line x1="-50" y1="6" x2="30" y2="6" stroke="#cbd5e1" />
        <line x1="-50" y1="12" x2="40" y2="12" stroke="#cbd5e1" />
      </motion.g>
    </motion.g>

    {/* paper plane orbit */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: "300px 200px" }}
    >
      <g transform="translate(440 200)">
        <motion.g
          animate={{ y: [-2, 4, -2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <polygon points="-12,-6 18,0 -12,8 -6,1" fill="#fff" stroke="#94a3b8" />
          <polygon points="-12,-6 -6,1 -12,8" fill="#cbd5e1" />
        </motion.g>
      </g>
    </motion.g>

    {/* floating @ symbols */}
    {[
      { x: 110, y: 130, t: "@" },
      { x: 490, y: 150, t: "✉" },
      { x: 130, y: 320, t: "@" },
      { x: 470, y: 340, t: "✉" },
    ].map((p, i) => (
      <motion.text
        key={i}
        x={p.x} y={p.y}
        fontSize="22"
        fontWeight="800"
        fill={i % 2 ? "#34d399" : "#a78bfa"}
        animate={{ y: [p.y, p.y - 12, p.y], opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
      >
        {p.t}
      </motion.text>
    ))}
  </motion.svg>
);
