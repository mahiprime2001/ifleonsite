"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Brain, GitBranch, Cloud, ShieldCheck, Database, Bot } from "lucide-react";

// Connected ecosystem scene — central animated hub with orbiting feature
// chips + status card. Built on Motion + GSAP.
type Props = { className?: string };

export const AboutScene = ({ className }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-7, 7]);
  const rotX = useTransform(sy, [-0.5, 0.5], [5, -5]);

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

  useEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      // Entrance stagger for chips
      gsap.from("[data-chip]", {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        stagger: 0.1,
      });
      gsap.from("[data-hub]", {
        scale: 0.7,
        opacity: 0,
        rotate: -30,
        duration: 1,
        ease: "expo.out",
      });

      // Hub pulse
      gsap.to("[data-hub-glow]", {
        scale: 1.18,
        opacity: 0.55,
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Connection draw loops
      gsap.fromTo(
        "[data-spoke]",
        { strokeDashoffset: 80 },
        {
          strokeDashoffset: 0,
          duration: 2.4,
          ease: "linear",
          repeat: -1,
          stagger: { each: 0.18, repeat: -1 },
        },
      );

      // Data packet travel along spokes
      gsap.utils.toArray<SVGCircleElement>("[data-packet]").forEach((el, i) => {
        const path = document.querySelector(
          `[data-spoke-id="${el.dataset.target}"]`,
        ) as SVGPathElement | null;
        if (!path) return;
        const length = path.getTotalLength();
        gsap.fromTo(
          el,
          { motionPath: undefined, opacity: 0 },
          {
            duration: 3 + i * 0.3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.4,
            opacity: 1,
            onUpdate: function () {
              const t = this.progress();
              const pt = path.getPointAtLength(t * length);
              gsap.set(el, { attr: { cx: pt.x, cy: pt.y } });
            },
          },
        );
      });

      // Floating chip bob
      gsap.to("[data-chip]", {
        y: "-=6",
        duration: 2.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });

      // Status dot pulse
      gsap.to("[data-pulse]", {
        opacity: 0.3,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.15 },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  // Chip positions on a hex layout around the hub
  const chips = [
    { angle: 0,                     Icon: Brain,      label: "AI",     c: "#C9B48A" },
    { angle: Math.PI / 3,           Icon: GitBranch,  label: "DevOps", c: "#2E7A55" },
    { angle: (2 * Math.PI) / 3,     Icon: Cloud,      label: "Cloud",  c: "#84B699" },
    { angle: Math.PI,               Icon: ShieldCheck,label: "Sec",    c: "#C9A24A" },
    { angle: (4 * Math.PI) / 3,     Icon: Database,   label: "Data",   c: "#B5714E" },
    { angle: (5 * Math.PI) / 3,     Icon: Bot,        label: "Auto",   c: "#45423C" },
  ];

  // Compute %-based positions on an ellipse. Rounded so the server and the browser print the same
  // numbers (their Math.sin/cos can differ in the last digit, which breaks hydration).
  const round = (n: number) => Math.round(n * 100) / 100;
  const pos = (a: number) => ({
    x: round(50 + Math.cos(a) * 38),
    y: round(50 + Math.sin(a) * 32),
  });

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
      <div className="absolute inset-[20%] rounded-full bg-brand-50 blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full h-full"
        style={{
          rotateY: reduce ? 0 : rotY,
          rotateX: reduce ? 0 : rotX,
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
      >
        {/* outer rotating rings */}
        <motion.div
          className="absolute inset-[4%] rounded-full border border-line border-dashed pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[12%] rounded-full border border-brand-600/15 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />

        {/* SPOKES (svg overlay) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {chips.map((chip, i) => {
            const p = pos(chip.angle);
            const id = `spoke-${i}`;
            return (
              <path
                key={id}
                data-spoke
                data-spoke-id={id}
                id={id}
                d={`M 50 50 L ${p.x} ${p.y}`}
                fill="none"
                stroke={chip.c}
                strokeWidth="0.4"
                strokeDasharray="3 3"
                opacity="0.55"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {/* data packets (one per spoke) */}
          {chips.map((chip, i) => (
            <circle
              key={`pkt-${i}`}
              data-packet
              data-target={`spoke-${i}`}
              cx="50"
              cy="50"
              r="0.7"
              fill={chip.c}
              opacity="0"
              style={{ filter: `drop-shadow(0 0 4px ${chip.c})` }}
            />
          ))}
        </svg>

        {/* === CENTRAL HUB === */}
        <div
          data-hub
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: "translate(-50%, -50%) translateZ(60px)" }}
        >
          {/* glow */}
          <div
            data-hub-glow
            className="absolute inset-[-30%] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(46,122,85,0.28) 0%, rgba(132,182,153,0.12) 40%, transparent 70%)",
              transformOrigin: "center",
            }}
          />
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 shadow-[0_20px_50px_-16px_rgba(23,88,59,0.55)] flex items-center justify-center border border-brand-800/40">
            <span className="font-serif text-paper font-semibold text-2xl md:text-3xl tracking-[-0.03em]">
              ifleon
            </span>
            {/* shine */}
            <div className="absolute inset-x-3 top-2 h-3 rounded-full bg-white/20 blur-md" />
          </div>
        </div>

        {/* === ORBITING CHIPS === */}
        {chips.map((chip, i) => {
          const p = pos(chip.angle);
          const Icon = chip.Icon;
          return (
            <div
              key={i}
              data-chip
              className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/90 border backdrop-blur-md shadow-xl"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%, -50%) translateZ(40px)",
                borderColor: `${chip.c}66`,
                boxShadow: `0 10px 25px -10px ${chip.c}cc`,
              }}
            >
              <span
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${chip.c}, ${chip.c}88)`,
                }}
              >
                <Icon className="h-3 w-3 text-white" />
              </span>
              <span className="text-[10px] font-bold text-ink">
                {chip.label}
              </span>
              <span
                data-pulse
                className="w-1.5 h-1.5 rounded-full ml-0.5"
                style={{ backgroundColor: chip.c }}
              />
            </div>
          );
        })}

        {/* === STATUS CARD (bottom-right) === */}
        <div
          data-chip
          className="absolute right-[2%] bottom-[3%] w-[34%] h-[22%] rounded-2xl bg-white/90 border border-line-strong backdrop-blur-md shadow-xl"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line">
            <ShieldCheck className="h-3 w-3 text-brand-700" />
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-ink">
              Status
            </span>
            <span data-pulse className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
          </div>
          <div className="p-3 space-y-1.5">
            {[
              { label: "Pipelines", v: "100%", c: "#2E7A55" },
              { label: "Uptime",    v: "99.9%", c: "#84B699" },
              { label: "Coverage",  v: "Pan-India", c: "#C9B48A" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] text-ink-3">{row.label}</span>
                <span className="text-[10px] font-bold" style={{ color: row.c }}>
                  {row.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
