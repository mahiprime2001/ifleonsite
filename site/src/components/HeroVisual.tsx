"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Centre of the drawing (viewBox 0 0 400 400) and where the four practice nodes sit. */
const C = { x: 200, y: 200 };
const NODES = [
  { label: "AI", sub: "models in production", x: 70, y: 92 },
  { label: "DevOps", sub: "every commit shipped", x: 330, y: 92 },
  { label: "Cloud", sub: "right-sized infra", x: 330, y: 308 },
  { label: "Security", sub: "compliant by default", x: 70, y: 308 },
];

/* Illustrative ops events (not live data). */
const LOG = [
  { tag: "build", text: "all tests passed" },
  { tag: "deploy", text: "api released to production" },
  { tag: "monitor", text: "uptime check ok" },
  { tag: "model", text: "retrained and validated" },
  { tag: "backup", text: "nightly snapshot verified" },
];

/*
 * The hero's brand visual: the IFLEON rings at the centre, wired to the four practices. Lines draw
 * in, pulses travel along them and the orbit turns slowly. One SVG that scales to any width, so it
 * behaves the same on phones; only transform, opacity and path drawing are animated.
 */
export function HeroVisual({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => setLogIndex((i) => (i + 1) % LOG.length), 2600);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 400" className="h-auto w-full overflow-visible" role="img" aria-label="AI, DevOps, Cloud and Security connected through IFLEON">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2E7A55" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#2E7A55" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={C.x} cy={C.y} r="190" fill="url(#hero-glow)" />

        {/* Slow orbit */}
        <motion.g
          style={{ originX: 0.5, originY: 0.5 }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle cx={C.x} cy={C.y} r="150" fill="none" stroke="#D4CCBE" strokeWidth="1" strokeDasharray="2 7" />
          <circle cx={C.x + 150} cy={C.y} r="3.5" fill="#2E7A55" />
        </motion.g>
        <circle cx={C.x} cy={C.y} r="104" fill="none" stroke="#E5DFD4" strokeWidth="1" />

        {/* Connections drawing in, with pulses travelling to the centre */}
        {NODES.map((node, i) => (
          <g key={node.label}>
            <motion.line
              x1={node.x}
              y1={node.y}
              x2={C.x}
              y2={C.y}
              stroke="#84B699"
              strokeWidth="1.4"
              strokeDasharray="4 5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.5 + i * 0.15, ease: EASE }}
            />
            {!reduce && (
              <motion.circle
                r="3.2"
                fill="#17583B"
                cx={node.x}
                cy={node.y}
                initial={{ opacity: 0 }}
                animate={{ cx: [node.x, C.x], cy: [node.y, C.y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.4, delay: 1.6 + i * 0.6, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              />
            )}
          </g>
        ))}

        {/* The IFLEON rings */}
        <motion.g
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <rect x="146" y="146" width="108" height="108" rx="30" fill="#17583B" />
          <motion.g
            style={{ originX: 0.5, originY: 0.5 }}
            animate={reduce ? undefined : { rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="186" cy="200" r="24" fill="none" stroke="#FAF8F4" strokeWidth="5" />
            <circle cx="214" cy="200" r="24" fill="none" stroke="#B3D3BF" strokeWidth="5" />
          </motion.g>
        </motion.g>

        {/* Practice nodes */}
        {NODES.map((node, i) => {
          const left = node.x < C.x;
          const x = left ? node.x - 66 : node.x - 62;
          return (
            <motion.g
              key={node.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: EASE }}
            >
              <motion.g
                animate={reduce ? undefined : { y: [0, i % 2 ? 5 : -5, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
              >
                <rect x={x} y={node.y - 24} width="128" height="48" rx="14" fill="#FFFFFF" stroke="#E5DFD4" />
                <circle cx={x + 20} cy={node.y} r="9" fill="#EEF5F0" />
                <circle cx={x + 20} cy={node.y} r="3.5" fill="#1F6A47" />
                <text x={x + 36} y={node.y - 2} fontSize="13" fontWeight="600" fill="#1C1B19" fontFamily="var(--font-sans)">
                  {node.label}
                </text>
                <text x={x + 36} y={node.y + 12} fontSize="8.5" fill="#6F6B62" fontFamily="var(--font-sans)">
                  {node.sub}
                </text>
              </motion.g>
            </motion.g>
          );
        })}
      </svg>

      {/* Live-style log card */}
      {/* Positioned by a plain wrapper: framer owns the inner transform for the slide-in. */}
      <div className="absolute -bottom-4 left-1/2 w-[86%] max-w-[22rem] -translate-x-1/2 sm:-bottom-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        className="surface px-4 py-3"
      >
        <div className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-3">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            Ops log
          </span>
          <span>example</span>
        </div>
        <div className="relative mt-2 h-5 overflow-hidden font-mono text-[0.78rem] text-ink">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.p
              key={logIndex}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="absolute inset-x-0 truncate"
            >
              <span className="text-brand-700">{LOG[logIndex].tag}</span>
              <span className="text-ink-4"> › </span>
              {LOG[logIndex].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
