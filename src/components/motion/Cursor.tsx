import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/* Custom cursor — a lagging brand ring + dot that grows over interactive
   targets. Gated to fine pointers and non-reduced-motion; otherwise the
   native cursor is left untouched. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const xDot = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3" });

    const move = (e: PointerEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    const over = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest(
        "a,button,[data-cursor],input,textarea,select,summary,[role=button]",
      );
      gsap.to(ring, {
        scale: target ? 1.9 : 1,
        backgroundColor: target ? "hsl(var(--brand) / 0.12)" : "transparent",
        duration: 0.25,
        ease: "power3",
      });
      gsap.to(dot, { opacity: target ? 0 : 1, duration: 0.2 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] -ml-4 -mt-4 h-8 w-8 rounded-full border"
        style={{ willChange: "transform", borderColor: "hsl(var(--brand) / 0.6)" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] -ml-1 -mt-1 h-2 w-2 rounded-full"
        style={{ backgroundColor: "hsl(var(--brand))", willChange: "transform" }}
      />
    </>
  );
}
