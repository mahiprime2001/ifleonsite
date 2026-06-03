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
    { angle: 0,                     Icon: Brain,      label: "AI",     c: "#7c3aed" },
    { angle: Math.PI / 3,           Icon: GitBranch,  label: "DevOps", c: "#2dd4bf" },
    { angle: (2 * Math.PI) / 3,     Icon: Cloud,      label: "Cloud",  c: "#22d3ee" },
    { angle: Math.PI,               Icon: ShieldCheck,label: "Sec",    c: "#3b82f6" },
    { angle: (4 * Math.PI) / 3,     Icon: Database,   label: "Data",   c: "#0d9488" },
    { angle: (5 * Math.PI) / 3,     Icon: Bot,        label: "Auto",   c: "#60a5fa" },
  ];

  // Compute %-based positions on an ellipse
  const pos = (a: number) => ({
    x: 50 + Math.cos(a) * 38,
    y: 50 + Math.sin(a) * 32,
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
      <div className="absolute inset-[20%] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

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
          className="absolute inset-[4%] rounded-full border border-white/10 border-dashed pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[12%] rounded-full border border-blue-400/15 pointer-events-none"
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
                "radial-gradient(circle, rgba(37,99,235,0.6) 0%, rgba(34,211,238,0.3) 40%, transparent 70%)",
              transformOrigin: "center",
            }}
          />
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-400 to-cyan-400 shadow-[0_20px_60px_-10px_rgba(34,211,238,0.6)] flex items-center justify-center border border-white/30">
            <span className="text-white font-black text-xl md:text-2xl tracking-tight" style={{ fontFamily: "Fraunces, Georgia, serif" }}>
              IFLEON
            </span>
            {/* shine */}
            <div className="absolute inset-x-2 top-2 h-3 rounded-full bg-white/30 blur-md" />
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
              className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border backdrop-blur-md shadow-xl"
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
              <span className="text-[10px] font-bold text-slate-200">
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

      </motion.div>
    </div>
  );
};
