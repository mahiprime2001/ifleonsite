import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Smooth scrolling driven by GSAP's ticker so Lenis and ScrollTrigger share one
 * frame loop. Returns a cleanup function. Does nothing when the visitor prefers
 * reduced motion (they keep native scrolling).
 */
export function startSmoothScroll(): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
