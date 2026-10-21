import { motion, useScroll, useSpring } from "framer-motion";

/** Thin emerald bar at the very top that fills as the page scrolls. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left bg-emerald-400"
      style={{ scaleX }}
    />
  );
};
