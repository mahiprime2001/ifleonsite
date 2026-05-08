import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

type Props = {
  src: string;
  className?: string;
  glow?: "emerald" | "blue" | "purple" | "cyan";
  showRing?: boolean;
};

const glowMap = {
  emerald: { from: "#34d399", to: "#22d3ee" },
  blue:    { from: "#60a5fa", to: "#a78bfa" },
  purple:  { from: "#a78bfa", to: "#f472b6" },
  cyan:    { from: "#22d3ee", to: "#60a5fa" },
};

// Dark-theme wrapper around a Lottie animation. Adds an ambient glow,
// optional rotating holographic ring, and floating monospace tags so it
// blends with the rest of the site's premium aesthetic.
export const LottieScene = ({
  src,
  className,
  glow = "cyan",
  showRing = true,
}: Props) => {
  const c = glowMap[glow];

  return (
    <div className={`relative ${className ?? ""}`} aria-hidden>
      {/* mesh aura behind */}
      <div
        className="absolute inset-0 blur-2xl opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${c.from}55 0%, transparent 50%), radial-gradient(circle at 70% 70%, ${c.to}55 0%, transparent 50%)`,
        }}
      />

      {/* outer rotating dashed ring */}
      {showRing && (
        <motion.div
          className="absolute inset-[10%] rounded-full border border-white/10 pointer-events-none"
          style={{
            borderStyle: "dashed",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />
      )}
      {showRing && (
        <motion.div
          className="absolute inset-[4%] rounded-full border-2 pointer-events-none"
          style={{
            borderColor: `${c.from}33`,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* the Lottie itself */}
      <div className="relative w-full h-full flex items-center justify-center">
        <DotLottieReact
          src={src}
          loop
          autoplay
          className="w-full h-full max-w-full max-h-full drop-shadow-[0_20px_50px_rgba(34,211,238,0.25)]"
        />
      </div>

      {/* floating ambient tags */}
      {[
        { x: "8%", y: "12%", t: "{ }", c: "#34d399" },
        { x: "85%", y: "10%", t: "</>", c: "#60a5fa" },
        { x: "6%", y: "82%", t: "λ", c: "#a78bfa" },
        { x: "86%", y: "84%", t: "AI", c: "#22d3ee" },
      ].map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute font-mono font-extrabold text-base md:text-lg pointer-events-none select-none"
          style={{
            left: p.x,
            top: p.y,
            color: p.c,
            opacity: 0.85,
            textShadow: `0 0 20px ${p.c}66`,
          }}
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        >
          {p.t}
        </motion.span>
      ))}
    </div>
  );
};
