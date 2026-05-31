import { useEffect, useRef } from "react";
import { useAtmosphere } from "./atmosphere/AtmosphereProvider";
import type { Season } from "./atmosphere/atmosphere-core";

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  drift: number; // base horizontal velocity
  sway: number; // sway amplitude
  swaySpeed: number;
  phase: number;
  angle: number;
  spin: number;
  opacity: number;
};

type SeasonConfig = {
  /** falling = down (snow/petals/leaves); rising = up (summer motes) */
  direction: 1 | -1;
  colors: string[];
  blend: GlobalCompositeOperation;
  shape: "circle" | "petal" | "leaf";
  speed: [number, number];
  size: [number, number];
  baseOpacity: [number, number];
};

const CONFIG: Record<Season, SeasonConfig> = {
  winter: {
    direction: 1,
    colors: ["#ffffff", "#dbeafe", "#e0e7ff"],
    blend: "source-over",
    shape: "circle",
    speed: [0.3, 0.9],
    size: [1, 3],
    baseOpacity: [0.4, 0.9],
  },
  spring: {
    direction: 1,
    colors: ["#fbcfe8", "#f9a8d4", "#fda4af", "#fce7f3"],
    blend: "source-over",
    shape: "petal",
    speed: [0.4, 1.1],
    size: [3, 6],
    baseOpacity: [0.45, 0.85],
  },
  summer: {
    direction: -1,
    colors: ["#fde68a", "#fcd34d", "#fbbf24", "#fef3c7"],
    blend: "screen",
    shape: "circle",
    speed: [0.15, 0.5],
    size: [1, 2.6],
    baseOpacity: [0.3, 0.9],
  },
  autumn: {
    direction: 1,
    colors: ["#f59e0b", "#ea580c", "#d97706", "#b45309", "#fbbf24"],
    blend: "source-over",
    shape: "leaf",
    speed: [0.5, 1.3],
    size: [4, 8],
    baseOpacity: [0.5, 0.9],
  },
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function SeasonalEffect() {
  const { season } = useAtmosphere();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // honor reduced-motion: no particles

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = CONFIG[season];
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const COUNT = isMobile ? 26 : 60;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const makeParticle = (initial: boolean): Particle => {
      const down = cfg.direction === 1;
      return {
        x: rand(0, w),
        // when initial, spread across screen; otherwise spawn just off the edge
        y: initial ? rand(0, h) : down ? -10 : h + 10,
        r: rand(cfg.size[0], cfg.size[1]),
        vy: rand(cfg.speed[0], cfg.speed[1]) * cfg.direction,
        drift: rand(-0.3, 0.3),
        sway: rand(8, 28),
        swaySpeed: rand(0.3, 1.1),
        phase: rand(0, Math.PI * 2),
        angle: rand(0, Math.PI * 2),
        spin: rand(-0.02, 0.02),
        opacity: rand(cfg.baseOpacity[0], cfg.baseOpacity[1]),
        // color picked at draw time via index
      } as Particle;
    };

    const colorOf = (p: Particle) =>
      cfg.colors[Math.floor((p.phase / (Math.PI * 2)) * cfg.colors.length) % cfg.colors.length];

    const particles: Particle[] = Array.from({ length: COUNT }, () =>
      makeParticle(true),
    );

    const drawPetal = (p: Particle) => {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    const drawLeaf = (p: Particle) => {
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.quadraticCurveTo(p.r, 0, 0, p.r);
      ctx.quadraticCurveTo(-p.r, 0, 0, -p.r);
      ctx.fill();
    };

    let visible = document.visibilityState === "visible";
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    let frame = 0;
    let t = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = cfg.blend;

      for (const p of particles) {
        p.y += p.vy;
        p.x += p.drift + Math.sin(t * p.swaySpeed + p.phase) * 0.3;
        p.angle += p.spin;

        // recycle when off-screen
        if (cfg.direction === 1 && p.y > h + 12) Object.assign(p, makeParticle(false));
        else if (cfg.direction === -1 && p.y < -12) Object.assign(p, makeParticle(false));
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x + Math.sin(t * p.swaySpeed + p.phase) * (p.sway * 0.15), p.y);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = colorOf(p);
        if (cfg.shape === "circle") {
          if (cfg.blend === "screen") {
            ctx.shadowBlur = p.r * 3;
            ctx.shadowColor = colorOf(p);
          }
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.rotate(p.angle);
          if (cfg.shape === "petal") drawPetal(p);
          else drawLeaf(p);
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = "source-over";
    };
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 h-full w-full"
    />
  );
}
