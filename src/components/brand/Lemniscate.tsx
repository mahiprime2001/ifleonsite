import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================================================
   IFLEON signature mark — a lemniscate (∞), the "Infinite" in
   "Infinite Logical Elements of Network". Self-draws once via
   stroke pathLength. Reused as: hero centerpiece (withNodes +
   large), section divider (thin), and the form-submit loader
   (spin). Brand-token colored; reduced-motion safe.
   ============================================================ */

const PATH =
  "M30,50 C30,22 68,22 100,50 C132,78 170,78 170,50 C170,22 132,22 100,50 C68,78 30,78 30,50 Z";

type Props = {
  className?: string;
  /** stroke width in viewBox units */
  strokeWidth?: number;
  /** play the self-draw animation on mount */
  draw?: boolean;
  /** show the two pulsing focal nodes (hero use) */
  withNodes?: boolean;
  /** continuous spin (loader use) */
  spin?: boolean;
  title?: string;
};

export const Lemniscate = memo(function Lemniscate({
  className = "",
  strokeWidth = 3,
  draw = true,
  withNodes = false,
  spin = false,
  title,
}: Props) {
  const reduce = useReducedMotion();
  const animateDraw = draw && !reduce;

  return (
    <svg
      viewBox="0 0 200 100"
      fill="none"
      className={`${spin && !reduce ? "animate-spin-slow" : ""} ${className}`}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id="iflo-lemniscate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--brand))" />
          <stop offset="100%" stopColor="hsl(var(--brand-2))" />
        </linearGradient>
      </defs>

      {/* faint trace so the shape reads even before/without the draw */}
      <path
        d={PATH}
        stroke="hsl(var(--brand) / 0.12)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <motion.path
        d={PATH}
        stroke="url(#iflo-lemniscate)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={animateDraw ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {withNodes && (
        <>
          <motion.circle
            cx={30}
            cy={50}
            r={5}
            fill="hsl(var(--brand))"
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5], r: [4, 5.5, 4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx={170}
            cy={50}
            r={5}
            fill="hsl(var(--brand-2))"
            animate={reduce ? undefined : { opacity: [0.5, 1, 0.5], r: [4, 5.5, 4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </>
      )}
    </svg>
  );
});

export default Lemniscate;
