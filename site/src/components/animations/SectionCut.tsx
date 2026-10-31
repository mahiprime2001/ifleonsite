"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "blade" | "diagonal" | "flip" | "iris";

type Props = {
  variant?: Variant;
  label?: string;
  accent?: "emerald" | "blue" | "purple" | "teal" | "orange";
  children?: ReactNode;
};

const accentMap = {
  emerald: { from: "#2E7A55", to: "#1F6A47", glow: "rgba(46,122,85,0.55)" },
  blue: { from: "#45423C", to: "#45423C", glow: "rgba(69,66,60,0.55)" },
  purple: { from: "#C9B48A", to: "#8A7448", glow: "rgba(201,180,138,0.55)" },
  teal: { from: "#84B699", to: "#2E7A55", glow: "rgba(132,182,153,0.55)" },
  orange: { from: "#C9A24A", to: "#A3613F", glow: "rgba(201,162,74,0.55)" },
};

export const SectionCut = ({
  variant = "blade",
  label,
  accent = "blue",
  children,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const palette = accentMap[accent];

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -70]);
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const slashX = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const irisSize = useTransform(scrollYProgress, [0, 1], ["0px", "1500px"]);
  const irisOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 0.6]);

  if (variant === "diagonal") {
    return (
      <div ref={ref} className="relative h-32 md:h-44 overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, transparent 49%, ${palette.from} 49%, ${palette.to} 51%, transparent 51%)`,
            opacity,
            x: slashX,
          }}
        />
        {label && (
          <div className="relative z-10 h-full flex items-center justify-center">
            <span className="text-xs md:text-sm tracking-[0.4em] uppercase text-ink-3 font-semibold">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "iris") {
    return (
      <div ref={ref} className="relative h-40 overflow-hidden bg-paper">
        <motion.div
          aria-hidden
          className="absolute inset-0 mesh-bg"
          style={{ opacity: irisOpacity }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: irisSize,
            height: irisSize,
            background: `radial-gradient(circle, ${palette.glow}, transparent 60%)`,
          }}
        />
        {label && (
          <div className="relative z-10 h-full flex items-center justify-center">
            <span className="text-sm tracking-[0.3em] uppercase text-ink-2 font-semibold">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "flip") {
    return (
      <div ref={ref} className="relative h-40 md:h-56 overflow-hidden perspective-1500">
        <motion.div
          className="absolute inset-0 preserve-3d"
          style={{ rotateX: reduce ? 0 : rotateX }}
        >
          <div
            className="absolute inset-0 backface-hidden flex items-center justify-center"
            style={{
              background: `linear-gradient(90deg, transparent, ${palette.glow}, transparent)`,
            }}
          >
            {label && (
              <span className="text-sm md:text-base tracking-[0.4em] uppercase text-ink-2 font-bold">
                {label}
              </span>
            )}
          </div>
          <div
            className="absolute inset-0 backface-hidden rotate-x-180 flex items-center justify-center"
            style={{
              background: `linear-gradient(270deg, transparent, ${palette.from}33, transparent)`,
            }}
          >
            {children ?? (
              <span className="text-sm md:text-base tracking-[0.4em] uppercase text-ink-3 font-semibold">
                {label} • next
              </span>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-24 md:h-32 overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 origin-center"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent, ${palette.from}, ${palette.to}, transparent)`,
          scaleX: reduce ? 1 : scaleX,
          opacity,
          boxShadow: `0 0 22px 1px ${palette.glow}`,
        }}
      />
      {label && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity }}
        >
          <span
            className="px-4 py-1 text-[10px] md:text-xs tracking-[0.5em] uppercase font-bold rounded-full"
            style={{
              color: palette.from,
              background: "rgba(2,6,23,0.6)",
              border: `1px solid ${palette.from}55`,
              backdropFilter: "blur(6px)",
            }}
          >
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
};
