import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Variant = "blade" | "diagonal" | "flip" | "iris";

type Props = {
  variant?: Variant;
  label?: string;
  accent?: "indigo" | "blue" | "purple" | "violet" | "orange";
  children?: ReactNode;
};

// One brand treatment for every accent: brand blue -> teal.
const BRAND_ACCENT = {
  from: "#2563EB",
  to: "#0D9488",
  glow: "rgba(37,99,235,0.35)",
};

const accentMap = {
  indigo: BRAND_ACCENT,
  blue: BRAND_ACCENT,
  purple: BRAND_ACCENT,
  violet: BRAND_ACCENT,
  orange: BRAND_ACCENT,
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
            <span className="eyebrow text-xs md:text-sm">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "iris") {
    return (
      <div ref={ref} className="relative h-40 overflow-hidden bg-transparent">
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
            <span className="eyebrow text-sm">
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
              <span className="eyebrow text-sm md:text-base">
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
              <span className="eyebrow text-sm md:text-base">
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
          <span className="eyebrow px-4 py-1 text-[10px] md:text-xs rounded-full bg-card border border-brand-soft shadow-card">
            {label}
          </span>
        </motion.div>
      )}
    </div>
  );
};
