import { motion } from "framer-motion";

type Variant = "ai" | "devops" | "cloud" | "security" | "consulting" | "data";

type Props = { variant: Variant; className?: string };

// Compact isometric icon used in service cards & feature tiles.
export const IsoIcon = ({ variant, className }: Props) => {
  const id = `iso-${variant}`;
  const palette: Record<Variant, { a: string; b: string }> = {
    ai: { a: "#a78bfa", b: "#7c3aed" },
    devops: { a: "#34d399", b: "#059669" },
    cloud: { a: "#60a5fa", b: "#2563eb" },
    security: { a: "#22d3ee", b: "#0891b2" },
    consulting: { a: "#fbbf24", b: "#d97706" },
    data: { a: "#f472b6", b: "#db2777" },
  };
  const { a, b } = palette[variant];

  return (
    <motion.svg
      viewBox="0 0 80 80"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      whileHover={{ scale: 1.08, rotate: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Iso cube base for every variant */}
      <g transform="translate(40 56)">
        <polygon points="0,-10 26,4 0,18 -26,4" fill="#0f172a" opacity="0.7" />
      </g>

      {variant === "ai" && (
        <g transform="translate(40 36)">
          <motion.g
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <path d="M -16 4 C -22 -10, -6 -22, 0 -14 C 8 -22, 22 -12, 16 4 C 22 8, 18 18, 10 18 L -10 18 C -18 18, -22 8, -16 4 Z"
              fill={`url(#${id}-grad)`} stroke={b} />
            <circle cx="-8" cy="-2" r="2" fill="#fff" />
            <circle cx="8" cy="0" r="2" fill="#fff" />
            <circle cx="0" cy="10" r="2" fill="#fff" />
          </motion.g>
        </g>
      )}

      {variant === "devops" && (
        <g transform="translate(40 36)">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "0 0" }}
          >
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <rect key={deg} x="-2.5" y="-18" width="5" height="8" fill={a} transform={`rotate(${deg})`} />
            ))}
            <circle r="12" fill={`url(#${id}-grad)`} stroke={b} strokeWidth="1.5" />
            <circle r="4" fill="#0f172a" />
          </motion.g>
        </g>
      )}

      {variant === "cloud" && (
        <g transform="translate(40 38)">
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>
            <path d="M -18 4 Q -26 4 -26 -4 Q -26 -14 -16 -14 Q -16 -22 -6 -22 Q 4 -22 8 -14 Q 20 -16 22 -6 Q 28 -6 28 2 Q 28 10 18 10 L -16 10 Q -18 10 -18 4 Z"
              fill={`url(#${id}-grad)`} stroke={b} />
          </motion.g>
        </g>
      )}

      {variant === "security" && (
        <g transform="translate(40 40)">
          <motion.path
            d="M 0 -22 L 16 -14 L 14 4 Q 14 14 0 22 Q -14 14 -14 4 L -16 -14 Z"
            fill={`url(#${id}-grad)`} stroke={b}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.path
            d="M -6 0 L -2 5 L 7 -6"
            stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
          />
        </g>
      )}

      {variant === "consulting" && (
        <g transform="translate(40 38)">
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity }}>
            <ellipse cx="0" cy="14" rx="14" ry="4" fill="#0f172a" opacity="0.5" />
            <circle cx="0" cy="-8" r="6" fill={`url(#${id}-grad)`} stroke={b} />
            <path d="M -10 14 Q 0 -2 10 14 Z" fill={`url(#${id}-grad)`} stroke={b} />
          </motion.g>
        </g>
      )}

      {variant === "data" && (
        <g transform="translate(40 36)">
          <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <ellipse cx="0" cy="-12" rx="16" ry="5" fill={a} stroke={b} />
            <path d="M -16 -12 L -16 8 Q -16 13 0 13 Q 16 13 16 8 L 16 -12" fill={`url(#${id}-grad)`} stroke={b} />
            <ellipse cx="0" cy="-2" rx="16" ry="5" fill="none" stroke={b} opacity="0.6" />
            <ellipse cx="0" cy="6" rx="16" ry="5" fill="none" stroke={b} opacity="0.6" />
          </motion.g>
        </g>
      )}
    </motion.svg>
  );
};
