import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  style?: CSSProperties;
};

export const MagnetCard = ({
  children,
  className,
  intensity = 14,
  glare = true,
  style,
}: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);

  const glareX = useTransform(sx, [-0.5, 0.5], [20, 80]);
  const glareY = useTransform(sy, [-0.5, 0.5], [20, 80]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18), transparent 55%)`,
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current || reduce) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x);
    my.set(y);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={reset}
      className={className}
      style={{
        rotateY: reduce ? 0 : rotateY,
        rotateX: reduce ? 0 : rotateX,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <div style={{ transform: "translateZ(0px)", position: "relative" }}>
        {children}
        {glare && !reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            // Hover-only: invisible at rest (no static center circle); the
            // highlight follows the cursor and fades in while pointing.
            initial={{ opacity: 0 }}
            animate={{ opacity: hovering ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            style={{
              background: glareBg,
              mixBlendMode: "overlay",
            }}
          />
        )}
      </div>
    </motion.div>
  );
};
