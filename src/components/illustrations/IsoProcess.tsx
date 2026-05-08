import { motion } from "framer-motion";

type Props = { className?: string; step?: 1 | 2 | 3 | 4 | 5 };

// Compact isometric scene per process step (used in HowWeWork)
export const IsoProcess = ({ className, step = 1 }: Props) => {
  const palette = ["#34d399", "#22d3ee", "#a78bfa", "#f472b6", "#fbbf24"];
  const accent = palette[step - 1];

  return (
    <motion.svg
      viewBox="0 0 220 180"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <defs>
        <linearGradient id={`p-bg-${step}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1220" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id={`p-glow-${step}`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor={accent} stopOpacity="0.4" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="220" height="180" rx="14" fill={`url(#p-bg-${step})`} />
      <motion.circle
        cx="110" cy="100" r="80" fill={`url(#p-glow-${step})`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* base tile */}
      <g transform="translate(110 130)">
        <polygon points="0,-20 70,12 0,44 -70,12" fill="#0b1220" stroke="#1e293b" />
      </g>

      {/* Step-specific objects */}
      {step === 1 && (
        // Discovery — speech bubble + figure
        <g transform="translate(110 70)">
          <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <path d="M -50 0 L 50 0 L 50 30 L 20 30 L 8 42 L 12 30 L -50 30 Z"
              fill="rgba(52,211,153,0.15)" stroke={accent} />
            <circle cx="-25" cy="15" r="3" fill={accent} />
            <circle cx="-10" cy="15" r="3" fill={accent} />
            <circle cx="5" cy="15" r="3" fill={accent} />
          </motion.g>
        </g>
      )}

      {step === 2 && (
        // Planning — document with checkmarks
        <g transform="translate(110 80)">
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <polygon points="-40,-20 30,-20 30,30 -40,30" fill="#1e293b" stroke={accent} />
            <polygon points="30,-20 50,-10 50,40 30,30" fill="#0f172a" stroke={accent} />
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(0 ${-10 + i * 12})`}>
                <line x1="-32" y1="0" x2="22" y2="0" stroke="#475569" strokeWidth="1" />
                <motion.path
                  d="M -34 0 l 3 3 l 6 -6"
                  stroke={accent} strokeWidth="2" fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: i * 0.3 }}
                />
              </g>
            ))}
          </motion.g>
        </g>
      )}

      {step === 3 && (
        // Implementation — code blocks
        <g transform="translate(110 80)">
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <polygon points="-50,-20 30,-20 30,28 -50,28" fill="#0b1220" stroke={accent} />
            <polygon points="30,-20 55,-8 55,40 30,28" fill="#1e293b" stroke={accent} />
            {[0, 1, 2, 3].map((i) => (
              <motion.rect
                key={i}
                x={-44 + (i % 2 ? 8 : 0)}
                y={-12 + i * 9}
                width={50 - (i % 2 ? 14 : 0)}
                height="3"
                rx="1"
                fill={accent}
                opacity="0.85"
                animate={{ width: [50 - (i % 2 ? 14 : 0), 30 - (i % 2 ? 8 : 0), 50 - (i % 2 ? 14 : 0)] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.g>
        </g>
      )}

      {step === 4 && (
        // Testing/Deploy — rocket launching
        <g transform="translate(110 90)">
          <motion.g animate={{ y: [4, -8, 4] }} transition={{ duration: 2.4, repeat: Infinity }}>
            <path d="M 0 -30 Q 14 -10 14 10 L 0 16 L -14 10 Q -14 -10 0 -30 Z"
              fill={accent} stroke="#0f172a" />
            <circle cx="0" cy="-6" r="4" fill="#0f172a" />
            <path d="M -14 4 L -22 14 L -10 12 Z" fill="#7c3aed" />
            <path d="M 14 4 L 22 14 L 10 12 Z" fill="#7c3aed" />
            <motion.path
              d="M -6 18 L 0 38 L 6 18 Z"
              fill="#fbbf24"
              animate={{ scaleY: [1, 1.4, 1] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          </motion.g>
        </g>
      )}

      {step === 5 && (
        // Support — gear + ring
        <g transform="translate(110 80)">
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "0px 0px" }}>
            <g>
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <rect key={a} x="-4" y="-30" width="8" height="14" fill={accent} transform={`rotate(${a})`} />
              ))}
              <circle cx="0" cy="0" r="22" fill="#1e293b" stroke={accent} strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill={accent} />
            </g>
          </motion.g>
          <motion.circle
            cx="0" cy="0" r="40" fill="none" stroke={accent} strokeDasharray="4 6" opacity="0.5"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 80px" }}
          />
        </g>
      )}

      {/* Step number badge */}
      <g transform="translate(186 18)">
        <circle r="14" fill={accent} />
        <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a">
          {step}
        </text>
      </g>
    </motion.svg>
  );
};
