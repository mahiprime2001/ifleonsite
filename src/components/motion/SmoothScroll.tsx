import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ============================================================
   Smooth-scroll spine. A single Lenis instance drives the page
   and is bridged to GSAP's ticker + ScrollTrigger so every
   scroll-scrubbed/pinned effect stays in sync. Honors
   prefers-reduced-motion (falls back to native scroll) and can
   be paused on routes that want native scrolling (app/console).
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // native scroll for reduced-motion users

    const instance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = instance;
    setLenis(instance);

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      instance.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/**
 * Pause/resume smooth scroll for the current route. App/console routes want
 * native scrolling; marketing routes get Lenis. Also resets scroll to top on
 * route change (works whether Lenis is active or not).
 */
export function useRouteScroll(pathname: string, smoothEnabled: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) {
      window.scrollTo(0, 0);
      return;
    }
    if (smoothEnabled) {
      lenis.start();
      lenis.scrollTo(0, { immediate: true });
    } else {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    }
    // Recalculate pinned/scrubbed triggers after layout settles.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [lenis, pathname, smoothEnabled]);
}
