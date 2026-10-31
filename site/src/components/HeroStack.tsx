"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Top to bottom. Only the top layer is green, so the eye lands there first. */
const LAYERS = [
  { n: "01", title: "AI & data", note: "models in production", tone: "accent" as const, art: "chart" as const },
  { n: "02", title: "Delivery", note: "every commit shipped", tone: "paper" as const, art: "pipeline" as const },
  { n: "03", title: "Cloud", note: "right-sized infrastructure", tone: "paper" as const, art: "grid" as const },
  { n: "04", title: "Security", note: "compliant by default", tone: "paper" as const, art: "shield" as const },
];

/*
 * "The IFLEON stack": four isometric plates, one per practice. They assemble on load, spread apart as
 * the page scrolls, and a signal ripples up through them. On a mouse-driven screen the stack tilts
 * towards the pointer and a hovered plate lifts out. Pure CSS 3D transforms, so phones handle it
 * smoothly; with reduced motion the stack is simply shown, still.
 */
export function HeroStack({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // Distance between plates: assembles from 0, then opens up while the hero scrolls away.
  const base = useMotionValue(reduce ? 78 : 0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 30%", "end start"] });
  const gap = useTransform([base, scrollYProgress], ([b, p]: number[]) => b + Math.max(0, p) * 60);

  // Pointer tilt (fine pointers only).
  const tiltX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateX = useTransform(tiltY, (v) => 56 + v * 8);
  const rotateZ = useTransform(tiltX, (v) => -36 + v * 10);
  const hovered = useMotionValue(-1);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(base, 78, { duration: 1.6, delay: 0.35, ease: EASE });
    return () => controls.stop();
  }, [base, reduce]);

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      tiltX.set(Math.max(-1, Math.min(1, ((e.clientX - box.left) / box.width - 0.5) * 2)));
      tiltY.set(Math.max(-1, Math.min(1, ((e.clientY - box.top) / box.height - 0.5) * 2)));
    };
    const onLeave = () => {
      tiltX.set(0);
      tiltY.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, tiltX, tiltY]);

  return (
    <div
      ref={ref}
      className={`relative aspect-square w-full ${className}`}
      style={{ perspective: "1800px" }}
      role="img"
      aria-label="The IFLEON stack: AI and data, delivery, cloud and security, built and run by one team"
    >
      {/* Centring wrapper (plain transform), then the rotated 3D stage (framer transform). */}
      <div className="absolute left-1/2 top-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative aspect-[1.32]"
          style={{ rotateX, rotateZ, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {/* Soft floor shadow */}
          <div
            aria-hidden
            className="absolute inset-[-8%] rounded-[2.5rem] bg-brand-900/15 blur-2xl"
            style={{ transform: "translateZ(-30px)" }}
          />
          {[...LAYERS].reverse().map((layer) => (
            <Plate key={layer.n} layer={layer} index={LAYERS.indexOf(layer)} gap={gap} hovered={hovered} reduce={!!reduce} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function Plate({
  layer,
  index,
  gap,
  hovered,
  reduce,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  gap: MotionValue<number>;
  hovered: MotionValue<number>;
  reduce: boolean;
}) {
  const level = LAYERS.length - 1 - index; // bottom plate = 0
  const rawZ = useTransform([gap, hovered], ([g, h]: number[]) => level * g + (h === index ? 28 : 0));
  const z = useSpring(rawZ, { stiffness: 200, damping: 24 });
  const accent = layer.tone === "accent";

  return (
    <motion.div
      className={`absolute inset-0 overflow-hidden rounded-[1.4rem] border p-[7%] ${
        accent ? "border-brand-800 bg-brand-700 text-paper" : "border-line-strong bg-white text-ink"
      }`}
      style={{
        z,
        transformStyle: "preserve-3d",
        boxShadow: accent ? "0 30px 60px -30px rgba(15,58,40,0.55)" : "0 24px 50px -32px rgba(60,48,30,0.45)",
      }}
      onPointerEnter={() => hovered.set(index)}
      onPointerLeave={() => hovered.set(-1)}
    >
      <div className="absolute bottom-[8%] left-[7%] right-[7%] flex items-end justify-between">
        <div>
          <p className={`font-mono text-[0.55rem] uppercase tracking-[0.2em] sm:text-[0.62rem] ${accent ? "text-brand-200" : "text-ink-3"}`}>
            {layer.n} · {layer.note}
          </p>
          <p className={`mt-1 font-serif text-lg leading-none sm:text-2xl ${accent ? "text-paper" : "text-ink"}`}>{layer.title}</p>
        </div>
        <span className={`h-2 w-2 rounded-full ${accent ? "bg-brand-200" : "bg-brand-600"}`} />
      </div>

      <div className="absolute right-[7%] top-[9%] h-[46%] w-[58%]">
        <Art kind={layer.art} />
      </div>

      {/* Signal ripple, passing upward from the bottom plate to the top */}
      {!reduce && (
        <motion.span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 -ml-8 -mt-8 h-16 w-16 rounded-full border-2 ${
            accent ? "border-brand-200" : "border-brand-500"
          }`}
          initial={{ scale: 0.2, opacity: 0 }}
          animate={{ scale: [0.2, 2.2], opacity: [0, 0.7, 0] }}
          transition={{ duration: 1.6, delay: 1.8 + level * 0.35, repeat: Infinity, repeatDelay: 1.6, ease: "easeOut" }}
        />
      )}
    </motion.div>
  );
}

/* Tiny product sketches drawn with divs: a chart, a pipeline, a server grid, a lock. */
function Art({ kind }: { kind: (typeof LAYERS)[number]["art"] }) {
  if (kind === "chart") {
    return (
      <div className="flex h-full items-end gap-[6%]">
        {[38, 62, 48, 80, 66, 92].map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 origin-bottom rounded-t-md bg-brand-300/80"
            style={{ height: `${h}%` }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.9, delay: 1.2 + i * 0.07, ease: EASE }}
          />
        ))}
      </div>
    );
  }
  if (kind === "pipeline") {
    return (
      <div className="flex h-full items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-50 ring-2 ring-brand-600 sm:h-6 sm:w-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            </span>
            {i < 4 && <span className="h-[2px] flex-1 bg-brand-200" />}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "grid") {
    return (
      <div className="grid h-full grid-cols-6 gap-[5%]">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className={`rounded-[4px] ${[1, 4, 6, 9, 11].includes(i) ? "bg-brand-500" : "bg-paper-3"}`} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full items-center gap-[8%]">
      <span className="grid aspect-square h-full place-items-center rounded-xl bg-brand-50">
        <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </span>
      <div className="flex flex-1 flex-col gap-[14%]">
        <span className="h-2 w-[90%] rounded-full bg-paper-3" />
        <span className="h-2 w-[70%] rounded-full bg-paper-3" />
        <span className="h-2 w-[80%] rounded-full bg-brand-200" />
      </div>
    </div>
  );
}
