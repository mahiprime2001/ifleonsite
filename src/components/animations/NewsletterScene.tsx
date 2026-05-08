import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { Mail, Send, Bell, Inbox } from "lucide-react";

type Props = { className?: string };

// Animated newsletter scene built with Framer Motion + GSAP.
// Features: pulsing envelope card, paper plane flying along a curved path,
// signal ripples, floating @ and ✉ tags, and pointer-tracked 3D tilt.
export const NewsletterScene = ({ className }: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // Pointer-tracked tilt
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
      // Entrance — envelope + side cards
      gsap.from("[data-stage]", {
        scale: 0.7,
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "expo.out",
      });
      gsap.from("[data-side]", {
        scale: 0.6,
        opacity: 0,
        x: (i) => (i % 2 === 0 ? -40 : 40),
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.12,
        delay: 0.2,
      });

      // Envelope flap subtle nudge — looks like it just received a letter
      gsap.to("[data-envelope]", {
        y: -6,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to("[data-envelope-glow]", {
        scale: 1.18,
        opacity: 0.55,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Letter peeks out periodically
      gsap.to("[data-letter]", {
        y: -16,
        duration: 1.5,
        ease: "expo.out",
        repeat: -1,
        yoyo: true,
        repeatDelay: 1.2,
      });

      // Paper plane flies along a curved path repeatedly
      const planePath = document.querySelector(
        "[data-plane-path]",
      ) as SVGPathElement | null;
      const plane = document.querySelector(
        "[data-plane]",
      ) as SVGGElement | null;
      if (planePath && plane) {
        const length = planePath.getTotalLength();
        const tlObj = { t: 0 };
        gsap.to(tlObj, {
          t: 1,
          duration: 5,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 0.4,
          onUpdate: () => {
            const t = tlObj.t;
            const p = planePath.getPointAtLength(t * length);
            // tangent for rotation
            const ahead = planePath.getPointAtLength(
              Math.min(length, t * length + 1),
            );
            const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
            const opacity = t < 0.05 ? t / 0.05 : t > 0.95 ? (1 - t) / 0.05 : 1;
            gsap.set(plane, {
              attr: { transform: `translate(${p.x} ${p.y}) rotate(${angle})` },
              opacity,
            });
          },
        });
      }

      // Signal ripples — three concentric expanding rings
      gsap.utils.toArray<HTMLElement>("[data-ripple]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { scale: 0.4, opacity: 0.7 },
          {
            scale: 2.6,
            opacity: 0,
            duration: 3,
            ease: "sine.out",
            repeat: -1,
            delay: i * 1,
          },
        );
      });

      // Bell icon swing on rare interval (delight, not constant)
      gsap.to("[data-bell]", {
        rotate: 14,
        duration: 0.16,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 5,
        repeatDelay: 0,
        // every 4s, do a 6-tick wobble
      });
      gsap.to("[data-bell]", {
        rotate: 0,
        duration: 0.5,
        delay: 1.2,
        repeat: -1,
        repeatDelay: 5,
        onRepeat: () => {
          gsap.fromTo(
            "[data-bell]",
            { rotate: -14 },
            {
              rotate: 14,
              duration: 0.16,
              ease: "sine.inOut",
              yoyo: true,
              repeat: 5,
            },
          );
        },
      });

      // Floating tags
      gsap.to("[data-tag]", {
        y: "-=10",
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.3, from: "random" },
      });

      // Status pulses
      gsap.to("[data-pulse]", {
        opacity: 0.3,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.2 },
      });

      // Inbox count tick
      gsap.to("[data-count]", {
        duration: 1.6,
        repeat: -1,
        repeatDelay: 2.2,
        onRepeat: () => {
          const el = document.querySelector("[data-count]") as HTMLElement | null;
          if (!el) return;
          const cur = parseInt(el.textContent || "0", 10);
          gsap.fromTo(
            el,
            { y: 0, opacity: 1 },
            {
              y: -10,
              opacity: 0,
              duration: 0.3,
              ease: "power2.in",
              onComplete: () => {
                el.textContent = String(cur + 1);
                gsap.fromTo(
                  el,
                  { y: 10, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                );
              },
            },
          );
        },
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
      {/* mesh aura backdrop */}
      <div className="absolute inset-0 mesh-bg blur-2xl opacity-60 pointer-events-none" />
      <div className="absolute inset-[18%] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-[32%] rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full h-full"
        style={{
          rotateY: reduce ? 0 : rotY,
          rotateX: reduce ? 0 : rotX,
          transformStyle: "preserve-3d",
          perspective: 1200,
        }}
      >
        {/* Outer rotating rings */}
        <motion.div
          className="absolute inset-[5%] rounded-full border border-white/10 border-dashed pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-[12%] rounded-full border border-emerald-400/15 pointer-events-none"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />

        {/* Signal ripples around the envelope */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ripple
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-emerald-400/40"
              style={{ filter: "drop-shadow(0 0 10px rgba(52,211,153,0.4))" }}
            />
          ))}
        </div>

        {/* === Paper plane SVG layer === */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* invisible curve guiding the plane */}
          <path
            data-plane-path
            d="M -8 80 Q 25 30 50 50 Q 75 70 108 20"
            fill="none"
            stroke="none"
          />
          {/* dashed trail visible underneath */}
          <path
            d="M -8 80 Q 25 30 50 50 Q 75 70 108 20"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.4"
            strokeDasharray="1.5 2"
            opacity="0.35"
            vectorEffect="non-scaling-stroke"
          />
          <g data-plane>
            <polygon
              points="-3,-1.6 4,0 -3,1.6 -1.4,0"
              fill="#fff"
              stroke="#22d3ee"
              strokeWidth="0.3"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.8))" }}
            />
            <polygon points="-3,-1.6 -1.4,0 -3,1.6" fill="#cbd5e1" />
          </g>
        </svg>

        {/* === CENTRAL ENVELOPE STAGE === */}
        <div
          data-stage
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: "translate(-50%, -50%) translateZ(60px)" }}
        >
          {/* glow */}
          <div
            data-envelope-glow
            className="absolute inset-[-40%] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(52,211,153,0.55) 0%, rgba(34,211,238,0.3) 40%, transparent 70%)",
              transformOrigin: "center",
            }}
          />

          <div data-envelope className="relative">
            {/* envelope body */}
            <div className="relative w-44 h-28 md:w-52 md:h-32 rounded-2xl bg-gradient-to-br from-blue-500 via-emerald-500 to-cyan-400 shadow-[0_30px_60px_-15px_rgba(34,211,238,0.6)] overflow-visible border border-white/30">
              {/* shine */}
              <div className="absolute inset-x-2 top-2 h-3 rounded-full bg-white/30 blur-md" />

              {/* inner letter peeking */}
              <div
                data-letter
                className="absolute left-3 right-3 top-3 h-16 md:h-20 rounded-lg bg-white shadow-md flex flex-col gap-1.5 p-3 border border-white/40"
              >
                <div className="h-1.5 rounded-full bg-slate-300" style={{ width: "70%" }} />
                <div className="h-1 rounded-full bg-slate-200" style={{ width: "55%" }} />
                <div className="h-1 rounded-full bg-slate-200" style={{ width: "65%" }} />
                <div className="h-1 rounded-full bg-emerald-400" style={{ width: "30%" }} />
              </div>

              {/* envelope flap (back triangle silhouette) */}
              <div
                className="absolute -top-px left-0 right-0 h-1/2 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                }}
              />

              {/* @ icon center */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* === LEFT TOP CARD: bell + new updates === */}
        <div
          data-side
          className="absolute left-[2%] top-[6%] w-[36%] rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-xl p-3"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <span data-bell style={{ display: "inline-flex", transformOrigin: "50% 0%" }}>
                <Bell className="h-3.5 w-3.5 text-white" />
              </span>
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-200">
                New Updates
              </div>
              <div className="text-[9px] text-slate-400">Weekly digest</div>
            </div>
            <span data-pulse className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          {[
            { c: "#34d399", w: "85%" },
            { c: "#22d3ee", w: "65%" },
            { c: "#a78bfa", w: "75%" },
          ].map((row, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full mb-1.5 last:mb-0"
              style={{
                width: row.w,
                background: `linear-gradient(90deg, ${row.c}, ${row.c}55)`,
              }}
            />
          ))}
        </div>

        {/* === RIGHT BOTTOM CARD: inbox count === */}
        <div
          data-side
          className="absolute right-[2%] bottom-[6%] w-[36%] rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-xl p-3"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Inbox className="h-3.5 w-3.5 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-200">
                Subscribers
              </div>
              <div className="text-[9px] text-slate-400">Live count</div>
            </div>
            <span data-pulse className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span data-count className="text-2xl font-black bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              1284
            </span>
            <span className="text-xs font-semibold text-emerald-300">+1</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: "78%" }}
            />
          </div>
        </div>

        {/* === SIDE CHIP: send icon === */}
        <div
          data-side
          className="absolute right-[6%] top-[14%] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-emerald-400/40 backdrop-blur-md shadow-xl"
          style={{ transform: "translateZ(60px)", boxShadow: "0 10px 25px -10px rgba(52,211,153,0.7)" }}
        >
          <span className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400">
            <Send className="h-3 w-3 text-white" />
          </span>
          <span className="text-[10px] font-bold text-slate-200">Sent</span>
        </div>

        {/* === Floating tags === */}
        {[
          { x: "5%", y: "40%", t: "@", c: "#34d399" },
          { x: "92%", y: "44%", t: "✉", c: "#60a5fa" },
          { x: "88%", y: "78%", t: "@", c: "#a78bfa" },
          { x: "8%", y: "76%", t: "✉", c: "#22d3ee" },
        ].map((p, i) => (
          <span
            key={i}
            data-tag
            className="absolute font-mono font-extrabold text-xl pointer-events-none select-none"
            style={{
              left: p.x,
              top: p.y,
              color: p.c,
              opacity: 0.85,
              textShadow: `0 0 18px ${p.c}66`,
            }}
          >
            {p.t}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
