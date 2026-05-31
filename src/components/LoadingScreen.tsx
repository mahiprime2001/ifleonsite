import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";

/**
 * Genshin-style loading screen.
 *
 * A clean full-screen overlay shown once on initial load: a gently bobbing
 * IFLEON logo inside a spinning gradient ring with an orbiting spark, plus
 * an animated "Loading…" label in the corner. Colors come from the --brand
 * theme vars, so it matches the active time-of-day atmosphere.
 *
 * Dismisses when fonts are ready (min ~1.1s so the animation is seen), with
 * a 4s safety timeout. Respects prefers-reduced-motion via CSS.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const minDisplay = new Promise((r) => setTimeout(r, 1100));
    const fontsReady =
      (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
        ?.ready ?? Promise.resolve();

    Promise.all([minDisplay, fontsReady]).then(() => {
      if (!cancelled) setVisible(false);
    });
    // safety net: never trap the user behind the loader
    const safety = setTimeout(() => setVisible(false), 4000);
    return () => {
      cancelled = true;
      clearTimeout(safety);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[#06060A]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* soft ambient glow behind the loader */}
          <div
            className="absolute h-[40vmax] w-[40vmax] rounded-full blur-[130px]"
            style={{ backgroundColor: "hsl(var(--brand) / 0.18)" }}
          />

          {/* centered mark + ring */}
          <motion.div
            className="relative grid place-items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* spinning gradient ring */}
            <div
              className="h-28 w-28 rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, hsl(var(--brand) / 0.15) 120deg, hsl(var(--brand)) 280deg, hsl(var(--brand-2)) 360deg)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
              }}
            />

            {/* orbiting spark */}
            <div className="absolute h-28 w-28 animate-spin-slow">
              <span
                className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                style={{
                  backgroundColor: "hsl(var(--brand-2))",
                  boxShadow: "0 0 12px 2px hsl(var(--brand-2) / 0.8)",
                }}
              />
            </div>

            {/* bobbing logo */}
            <div className="absolute grid place-items-center animate-float">
              <Logo size={48} className="drop-shadow-[0_0_18px_hsl(var(--brand)/0.6)]" />
            </div>
          </motion.div>

          {/* wordmark */}
          <motion.div
            className="absolute bottom-24 flex flex-col items-center gap-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <span className="font-display text-lg font-bold tracking-[0.35em] text-white/90">
              IFLEON
            </span>
          </motion.div>

          {/* corner "Loading…" — Genshin-style bottom-right */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/60">
            <span className="text-sm tracking-widest uppercase">Loading</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "hsl(var(--brand))" }}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
