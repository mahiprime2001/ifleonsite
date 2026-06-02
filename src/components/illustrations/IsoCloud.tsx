import { motion } from "framer-motion";

type Props = { className?: string };

// Isometric cloud architecture — servers, cloud, network nodes
export const IsoCloud = ({ className }: Props) => (
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
      <linearGradient id="cloud-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="cloud-server" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#475569" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="cloud-server-side" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#334155" />
        <stop offset="1" stopColor="#0f172a" />
      </linearGradient>
      <radialGradient id="cloud-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#60a5fa" stopOpacity="0.45" />
        <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
      </radialGradient>
    </defs>

    <motion.circle
      cx="300" cy="300" r="240" fill="url(#cloud-glow)"
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 6, repeat: Infinity }}
    />

    {/* Base platform */}
    <g transform="translate(300 470)">
      <polygon points="0,-80 220,30 0,140 -220,30" fill="#0f172a" stroke="#1e293b" />
      <g opacity="0.2" stroke="#60a5fa">
        <line x1="-150" y1="55" x2="60" y2="-50" />
        <line x1="-80" y1="95" x2="130" y2="-10" />
        <line x1="-10" y1="125" x2="190" y2="20" />
      </g>
    </g>

    {/* Cloud icon (top center) — isometric pseudo-3D */}
    <motion.g
      transform="translate(300 200)"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <g transform="translate(-70 -10)">
        <ellipse cx="40" cy="50" rx="50" ry="20" fill="#1e293b" opacity="0.45" />
      </g>
      <path
        d="M -55 0 Q -75 0 -75 -20 Q -75 -40 -50 -40 Q -50 -65 -20 -65 Q 5 -65 15 -45 Q 50 -55 60 -25 Q 80 -25 80 -5 Q 80 15 55 15 L -50 15 Q -55 15 -55 0 Z"
        fill="url(#cloud-base)"
        stroke="#1d4ed8"
      />
      {/* upload arrow */}
      <motion.path
        d="M 0 -8 L 0 -42 M -10 -32 L 0 -42 L 10 -32"
        stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
        animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      />
    </motion.g>

    {/* Servers (3 stacked) — left */}
    {[0, 1, 2].map((i) => {
      const ty = 360 - i * 36;
      return (
        <g key={`l-${i}`} transform={`translate(180 ${ty})`}>
          <polygon points="0,0 80,40 80,70 0,30" fill="url(#cloud-server)" stroke="#1e293b" />
          <polygon points="0,0 -50,25 -50,55 0,30" fill="url(#cloud-server-side)" />
          <polygon points="0,0 80,40 30,65 -50,25" fill="#0f172a" />
          {/* leds */}
          {[0, 1, 2].map((j) => (
            <motion.circle
              key={j}
              cx={12 + j * 14} cy={28 + (j * 14) * 0.5} r="2.4"
              fill={["#2dd4bf", "#60a5fa", "#22d3ee"][j]}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2 + j * 0.3, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </g>
      );
    })}

    {/* Servers — right */}
    {[0, 1].map((i) => {
      const ty = 360 - i * 36;
      return (
        <g key={`r-${i}`} transform={`translate(360 ${ty})`}>
          <polygon points="0,0 80,40 80,70 0,30" fill="url(#cloud-server)" stroke="#1e293b" />
          <polygon points="0,0 -50,25 -50,55 0,30" fill="url(#cloud-server-side)" />
          <polygon points="0,0 80,40 30,65 -50,25" fill="#0f172a" />
          {[0, 1, 2].map((j) => (
            <motion.circle
              key={j}
              cx={12 + j * 14} cy={28 + (j * 14) * 0.5} r="2.4"
              fill={["#22d3ee", "#2dd4bf", "#3b82f6"][j]}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2 + j * 0.3, repeat: Infinity, delay: i * 0.25 }}
            />
          ))}
        </g>
      );
    })}

    {/* Connection beams from cloud → servers */}
    {[
      { x1: 300, y1: 215, x2: 220, y2: 350 },
      { x1: 300, y1: 215, x2: 400, y2: 350 },
      { x1: 300, y1: 215, x2: 230, y2: 290 },
    ].map((p, i) => (
      <motion.line
        key={i}
        x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
        stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="4 4"
        animate={{ strokeDashoffset: [0, -16] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
      />
    ))}

    {/* Data packets traveling */}
    {[0, 1, 2].map((i) => (
      <motion.circle
        key={`pkt-${i}`}
        r="4"
        fill={["#2dd4bf", "#60a5fa", "#22d3ee"][i]}
        animate={{
          cx: [300, 220, 300, 400, 300],
          cy: [215, 350, 215, 350, 215],
        }}
        transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
      />
    ))}
  </motion.svg>
);
