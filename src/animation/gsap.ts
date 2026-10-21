import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * The only place GSAP plugins are registered. Import gsap, ScrollTrigger and
 * useGSAP from here, never straight from the packages, so registration happens once.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Media queries for gsap.matchMedia(). Every animation needs a reduced-motion branch. */
export const MQ = {
  reduce: "(prefers-reduced-motion: reduce)",
  motionOk: "(prefers-reduced-motion: no-preference)",
  /** Pinned, scrubbed scroll story. Below this width sections play one short animation on enter. */
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
