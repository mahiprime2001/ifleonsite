import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children?: ReactNode;
  offset?: number;
  axis?: "y" | "x";
  className?: string;
  style?: CSSProperties;
};

export const Parallax = ({ children, offset = 80, axis = "y", className, style }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const value = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={axis === "y" ? { y: value, ...style } : { x: value, ...style }}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxLayers = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <motion.div ref={ref} className={className} style={{ "--p": scrollYProgress } as CSSProperties}>
      {children}
    </motion.div>
  );
};
