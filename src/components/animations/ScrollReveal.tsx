import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "fade" | "rotateX" | "rotateY";

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  style?: CSSProperties;
};

const buildVariants = (direction: Direction, distance: number): Variants => {
  switch (direction) {
    case "up":
      return { hidden: { opacity: 0, y: distance }, show: { opacity: 1, y: 0 } };
    case "down":
      return { hidden: { opacity: 0, y: -distance }, show: { opacity: 1, y: 0 } };
    case "left":
      return { hidden: { opacity: 0, x: distance }, show: { opacity: 1, x: 0 } };
    case "right":
      return { hidden: { opacity: 0, x: -distance }, show: { opacity: 1, x: 0 } };
    case "scale":
      return { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } };
    case "rotateX":
      return { hidden: { opacity: 0, rotateX: -65 }, show: { opacity: 1, rotateX: 0 } };
    case "rotateY":
      return { hidden: { opacity: 0, rotateY: -55 }, show: { opacity: 1, rotateY: 0 } };
    default:
      return { hidden: { opacity: 0 }, show: { opacity: 1 } };
  }
};

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 36,
  className,
  once = true,
  style,
}: Props) => {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      variants={buildVariants(direction, distance)}
      transition={{ duration, delay, ease: [0.2, 0.7, 0.2, 1] }}
      className={className}
      style={{ transformStyle: "preserve-3d", perspective: 1000, ...style }}
    >
      {children}
    </motion.div>
  );
};

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
};

export const StaggerContainer = ({ children, className, stagger = 0.1, delay = 0 }: StaggerProps) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    variants={{
      hidden: {},
      show: {
        transition: { staggerChildren: stagger, delayChildren: delay },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className,
  direction = "up",
  distance = 28,
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
}) => (
  <motion.div
    className={className}
    variants={{
      ...buildVariants(direction, distance),
      show: {
        ...(buildVariants(direction, distance).show as object),
        transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] },
      },
    }}
  >
    {children}
  </motion.div>
);
