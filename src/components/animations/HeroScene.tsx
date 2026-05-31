import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Brain, GitBranch, Cloud, Activity, Zap, ShieldCheck } from "lucide-react";

// Premium animated UI scene built with Framer Motion + GSAP.
// - GSAP timelines drive sequenced entrance + looped chart/code animations
// - Motion springs drive pointer-tracked 3D tilt + parallax depth
// - No character illustrations; pure UI elements
type Props = { className?: string };

export const HeroScene = ({ className }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // Pointer-tracked tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 90, damping: 18, mass: 0.4 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const rotX = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current || reduce) return;
    const r = rootRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  // GSAP master timeline
  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      // Entrance: stagger cards in
      gsap.from("[data-card]", {
        y: 40,
        opacity: 0,
        scale: 0.92,
        rotateX: -16,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.12,
      });

      // Looping bar chart heights
      gsap.to("[data-bar]", {
        scaleY: () => 0.5 + Math.random() * 0.6,
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.12, from: "random" },
        transformOrigin: "bottom",
      });

      // Loop: trending line draw + erase
      gsap.fromTo(
        "[data-line]",
        { strokeDashoffset: 200 },
        {
          strokeDashoffset: 0,
          duration: 2.8,
          ease: "power2.inOut",
          repeat: -1,
          yoyo: true,
        },
      );

      // Loop: code line widths
      gsap.to("[data-code]", {
        scaleX: () => 0.5 + Math.random() * 0.5,
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.18, from: "start" },
        transformOrigin: "left",
      });

      // Loop: ring metric stroke-dashoffset
      gsap.fromTo(
        "[data-ring]",
        { strokeDashoffset: 60 },
        {
          strokeDashoffset: 24,
          duration: 3.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );

      // Connection lines drawing
      gsap.fromTo(
        "[data-conn]",
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "linear",
          repeat: -1,
        },
      );

      // Floating chips bob
      gsap.to("[data-chip]", {
        y: "-=8",
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });

      // Pulse status dots
      gsap.to("[data-dot]", {
        opacity: 0.3,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.15, from: "start" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full aspect-square ${className ?? ""}`}
      onPointerMove={onMove}
      onPointerLeave={reset}
      aria-hidden
    >
      {/* mesh aura */}
      <div className="absolute inset-0 mesh-bg blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute inset-[15%] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-[30%] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full h-full"
        style={{
          rotateY: reduce ? 0 : rotY,
          rotateX: reduce ? 0 : rotX,
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
      >
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-[6%] rounded-full border border-white/10 border-dashed pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[2%] rounded-full border border-indigo-400/20 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />

        {/* === MAIN CARD: dashboard with bar chart === */}
        <div
          data-card
          className="absolute left-[18%] top-[20%] w-[64%] h-[36%] rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-[0_30px_60px_-20px_rgba(34,211,238,0.5)] overflow-hidden"
          style={{ transform: "translateZ(40px)" }}
        >
          {/* card chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-400" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-200">
                Live Metrics
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span data-dot className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span data-dot className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span data-dot className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
          </div>

          {/* bars */}
          <div className="relative h-[calc(100%-44px)] flex items-end gap-1.5 px-4 pb-4 pt-3">
            {[
              "#34d399",
              "#22d3ee",
              "#60a5fa",
              "#a78bfa",
              "#f472b6",
              "#fbbf24",
              "#34d399",
              "#22d3ee",
              "#a78bfa",
              "#60a5fa",
            ].map((c, i) => (
              <div
                key={i}
                data-bar
                className="flex-1 rounded-t-md"
                style={{
                  height: `${30 + (i % 5) * 15}%`,
                  background: `linear-gradient(180deg, ${c} 0%, ${c}66 100%)`,
                  boxShadow: `0 0 12px ${c}55`,
                }}
              />
            ))}

            {/* trending line overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                data-line
                d="M 0 70 L 22 50 L 44 60 L 66 30 L 88 45 L 110 25 L 132 35 L 154 18 L 176 30 L 200 12"
                fill="none"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ strokeDasharray: 200 }}
              />
            </svg>
          </div>
        </div>

        {/* === LEFT FLOATING CARD: code editor === */}
        <div
          data-card
          className="absolute left-[2%] top-[42%] w-[44%] h-[34%] rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-[0_30px_60px_-20px_rgba(167,139,250,0.5)] overflow-hidden"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="ml-auto text-[10px] font-mono text-slate-400">
              app.ts
            </span>
          </div>
          <div className="p-3 space-y-1.5 font-mono text-[10px]">
            {[
              { c: "#fbbf24", w: "30%" },
              { c: "#22d3ee", w: "65%" },
              { c: "#34d399", w: "50%" },
              { c: "#a78bfa", w: "75%" },
              { c: "#22d3ee", w: "40%" },
              { c: "#34d399", w: "60%" },
              { c: "#fbbf24", w: "35%" },
            ].map((l, i) => (
              <div
                key={i}
                data-code
                className="h-1.5 rounded-full"
                style={{
                  width: l.w,
                  background: `linear-gradient(90deg, ${l.c}, ${l.c}55)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* === RIGHT FLOATING CARD: ring metric === */}
        <div
          data-card
          className="absolute right-[2%] top-[42%] w-[40%] h-[34%] rounded-2xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-[0_30px_60px_-20px_rgba(52,211,153,0.5)] overflow-hidden"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-200">
              Uptime
            </span>
          </div>
          <div className="relative h-[calc(100%-32px)] flex items-center justify-center">
            <svg viewBox="0 0 80 80" className="w-3/5 h-3/5 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="8"
              />
              <circle
                data-ring
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 188,
                  strokeDashoffset: 24,
                }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#34d399" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-black bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-[9px] tracking-[0.2em] text-slate-400 uppercase">
                Reliability
              </div>
            </div>
          </div>
        </div>

        {/* === BOTTOM PILL CARDS === */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[80%] flex gap-2"
          style={{ transform: "translate(-50%, 0) translateZ(70px)" }}
        >
          {[
            { Icon: Brain, label: "AI", c: "#a78bfa" },
            { Icon: GitBranch, label: "DevOps", c: "#34d399" },
            { Icon: Cloud, label: "Cloud", c: "#22d3ee" },
            { Icon: Zap, label: "Edge", c: "#fbbf24" },
          ].map(({ Icon, label, c }, i) => (
            <div
              key={i}
              data-card
              data-chip
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/85 border border-white/15 backdrop-blur-md shadow-lg"
              style={{ boxShadow: `0 10px 25px -10px ${c}88` }}
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${c}, ${c}88)`,
                }}
              >
                <Icon className="h-3 w-3 text-white" />
              </span>
              <span className="text-[10px] font-bold text-slate-200">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* === CONNECTION LINES (svg overlay) === */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[
            { d: "M 30 38 Q 30 50 24 60", c: "#a78bfa" },
            { d: "M 70 38 Q 70 50 76 60", c: "#34d399" },
            { d: "M 50 56 L 50 80", c: "#22d3ee" },
          ].map((l, i) => (
            <path
              key={i}
              data-conn
              d={l.d}
              fill="none"
              stroke={l.c}
              strokeWidth="0.4"
              strokeDasharray="3 3"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};
