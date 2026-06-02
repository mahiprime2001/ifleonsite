import { motion } from "framer-motion";

type Props = { className?: string };

// Isometric security shield with lock — original SVG
export const IsoSecurity = ({ className }: Props) => (
  <motion.svg
    viewBox="0 0 600 600"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8 }}
  >
    <defs>
      <linearGradient id="sec-shield" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2dd4bf" />
        <stop offset="1" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="sec-lock" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fbbf24" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
      <radialGradient id="sec-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.4" />
        <stop offset="1" stopColor="#2dd4bf" stopOpacity="0" />
      </radialGradient>
    </defs>

    <motion.circle
      cx="300" cy="280" r="220" fill="url(#sec-glow)"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 5, repeat: Infinity }}
    />

    {/* floor */}
    <g transform="translate(300 470)">
      <polygon points="0,-80 200,30 0,130 -200,30" fill="#0b1220" stroke="#1e293b" />
      <g opacity="0.18" stroke="#2dd4bf">
        <line x1="-130" y1="55" x2="60" y2="-50" />
        <line x1="-60" y1="90" x2="130" y2="-15" />
      </g>
    </g>

    {/* pedestal */}
    <g transform="translate(300 380)">
      <polygon points="-80,0 0,-40 80,0 0,40" fill="#0f172a" stroke="#1e293b" />
      <polygon points="-80,0 0,40 0,52 -80,12" fill="#1e293b" />
      <polygon points="80,0 0,40 0,52 80,12" fill="#0f172a" />
    </g>

    {/* Shield (3D extruded) */}
    <motion.g
      transform="translate(300 270)"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* shield back layer (depth) */}
      <path
        d="M 6 -94 L 100 -50 L 90 30 Q 80 80 6 110 Q -68 80 -78 30 L -88 -50 Z"
        fill="#134e4a"
        opacity="0.9"
      />
      {/* shield front */}
      <path
        d="M 0 -100 L 95 -55 L 85 25 Q 75 75 0 105 Q -75 75 -85 25 L -95 -55 Z"
        fill="url(#sec-shield)"
        stroke="#0d9488"
        strokeWidth="2"
      />
      {/* checkmark */}
      <motion.path
        d="M -28 0 L -8 22 L 32 -22"
        stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.85, 1] }}
      />
      {/* highlights */}
      <path d="M -85 -55 L -50 -30 L -40 60 Q -35 75 -10 90" fill="none" stroke="#99f6e4" strokeWidth="1" opacity="0.6" />
    </motion.g>

    {/* small floating lock */}
    <motion.g
      transform="translate(420 200)"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
    >
      <rect x="-14" y="-4" width="28" height="22" rx="3" fill="url(#sec-lock)" stroke="#92400e" />
      <path d="M -8 -4 L -8 -14 Q -8 -22 0 -22 Q 8 -22 8 -14 L 8 -4" fill="none" stroke="#fbbf24" strokeWidth="3" />
      <circle cx="0" cy="6" r="3" fill="#92400e" />
    </motion.g>
    <motion.g
      transform="translate(180 220)"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, delay: 0.6 }}
    >
      <rect x="-12" y="-3" width="24" height="20" rx="3" fill="#1e293b" stroke="#2dd4bf" />
      <path d="M -7 -3 L -7 -12 Q -7 -19 0 -19 Q 7 -19 7 -12 L 7 -3" fill="none" stroke="#2dd4bf" strokeWidth="2.5" />
    </motion.g>

    {/* Orbiting key icons */}
    {[0, 1, 2].map((i) => {
      const angle = (i / 3) * Math.PI * 2;
      const rx = 170, ry = 70;
      return (
        <motion.g
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 25 + i * 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "300px 280px" }}
        >
          <g transform={`translate(${300 + Math.cos(angle) * rx} ${280 + Math.sin(angle) * ry})`}>
            <circle r="9" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1.5" />
            <circle r="3" fill="#2dd4bf" />
          </g>
        </motion.g>
      );
    })}

    {/* Scan lines */}
    <motion.line
      x1="120" y1="280" x2="480" y2="280"
      stroke="#2dd4bf" strokeWidth="1" opacity="0.6"
      animate={{ y1: [180, 380, 180], y2: [180, 380, 180] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </motion.svg>
);
